import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Helpers
function logDebug(message, meta = {}) {
  const ts = new Date().toISOString();
  console.log(`[ingest:${ts}] ${message}`, meta);
}

function maskKeyExists(key) {
  return !!key;
}
// Health check with env visibility (not printing secrets)
app.get('/health', (_req, res) => {
  return res.json({
    ok: true,
    env: {
      GEMINI_API_KEY: maskKeyExists(process.env.GEMINI_API_KEY),
      MISTRAL_API_KEY: maskKeyExists(process.env.MISTRAL_API_KEY),
      PYTHON_BIN: process.env.PYTHON_BIN || 'python3',
    },
  });
});
function readFileAsBase64(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString('base64');
}

// Deterministic markdown -> plan parser (heuristic)
function parseContactHoursFromTableRow(row) {
  // Expect pipe-separated columns, last column likely contact hours (integer)
  const cols = row.split('|').map((c) => c.trim()).filter(Boolean);
  if (cols.length < 3) return null;
  // Try last numeric col
  for (let i = cols.length - 1; i >= 0; i -= 1) {
    const m = cols[i].match(/^(\d{1,3})(?:\s*h(?:ours?)?)?$/i);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function splitTopics(text) {
  // Split by newlines, semicolons, bullets, commas; keep meaningful chunks
  return text
    .split(/\n|;|\u2022|\*|,/) // bullets and commas
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter((t) => t && t.length > 2 && /[A-Za-z]/.test(t));
}

function normalizeUnitName(raw, index) {
  const t = (raw || '').replace(/[#*`]/g, '').trim();
  if (!t) return `Unit ${index + 1}`;
  // Remove trailing contact hours digits
  const cleaned = t.replace(/\b\d+\b\s*$/g, '').trim();
  return cleaned || `Unit ${index + 1}`;
}

function makePlanFromUnits(course, units, slotMinutes = 60) {
  const plannedUnits = units.map((u, idx) => {
    const minutesBudget = (u.contactHours || 0) * 60;
    const topics = (u.topics && u.topics.length ? u.topics : ['Overview']).map((title) => ({ title, minutes: 0 }));
    if (minutesBudget <= 0) {
      return { name: u.name || `Unit ${idx + 1}`, contactHours: 0, topics: [], sessions: [] };
    }
    // Allocate evenly in multiples of slotMinutes
    const slotsTotal = Math.max(1, Math.round(minutesBudget / slotMinutes));
    const perTopicSlots = Math.max(1, Math.floor(slotsTotal / Math.max(1, topics.length)));
    let slotsAssigned = 0;
    topics.forEach((t, i) => {
      // Put at least 1 slot per topic, then distribute remainder
      const remaining = slotsTotal - slotsAssigned - (topics.length - i - 1);
      const slots = Math.max(1, Math.min(perTopicSlots, remaining));
      t.minutes = slots * slotMinutes;
      slotsAssigned += slots;
    });
    // Adjust last topic to fit exact budget if rounding drifted
    const minutesAssigned = topics.reduce((s, t) => s + t.minutes, 0);
    const drift = minutesBudget - minutesAssigned;
    if (topics.length && drift !== 0) {
      topics[topics.length - 1].minutes = Math.max(slotMinutes, topics[topics.length - 1].minutes + drift);
    }
    // Build sessions
    const sessions = [];
    let sessionIndex = 1;
    topics.forEach((t) => {
      let remaining = t.minutes;
      while (remaining > 0) {
        const take = Math.min(slotMinutes, remaining);
        sessions.push({ session: sessionIndex++, minutes: take, topicTitles: [t.title] });
        remaining -= take;
      }
    });
    return { name: u.name || `Unit ${idx + 1}`, contactHours: u.contactHours || Math.round(minutesBudget / 60), topics, sessions };
  });
  return { course: course || 'Course', slotMinutes, units: plannedUnits, notes: [] };
}

function parseMarkdownToPlan(markdown, slotMinutes = 60) {
  if (!markdown || typeof markdown !== 'string') return null;
  const lines = markdown.split(/\r?\n/);
  let course = '';
  // Course name from first H1
  for (const ln of lines) {
    const m = ln.match(/^#\s+(.*)$/);
    if (m) { course = m[1].trim(); break; }
  }
  // Try table rows for S.No | Contents | Contact Hours
  const tableRows = lines.filter((l) => /\|/.test(l) && /contact\s*hours/i.test(markdown));
  const units = [];
  for (const row of tableRows) {
    if (/---/.test(row)) continue; // header separator
    if (!/\|/.test(row)) continue;
    const hours = parseContactHoursFromTableRow(row);
    if (hours == null) continue;
    // Extract content column (roughly the 2nd column)
    const cols = row.split('|').map((c) => c.trim());
    if (cols.length < 3) continue;
    const rawContent = cols[2] || cols[1] || '';
    const name = normalizeUnitName(rawContent.split(':')[0] || rawContent.slice(0, 60), units.length);
    const topics = splitTopics(rawContent.replace(/^.*?:\s*/, ''));
    units.push({ name, contactHours: hours, topics });
  }

  // Fallback: detect sections beginning with Unit headings
  if (units.length === 0) {
    const blocks = markdown.split(/\n(?=#+\s|Unit\s+\d+\b)/i);
    blocks.forEach((b, i) => {
      const headerMatch = b.match(/^(?:#+\s+)?(Unit\s+\d+[^\n]*)/i);
      const name = normalizeUnitName(headerMatch ? headerMatch[1] : '', i);
      const hoursMatch = b.match(/contact\s*hours\s*[:|]?\s*(\d{1,3})/i);
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const body = b.replace(/^(?:#+\s+)?[^\n]*\n/, '');
      const topics = splitTopics(body).slice(0, 30);
      if (topics.length || hours) units.push({ name, contactHours: hours, topics });
    });
  }

  if (units.length === 0) return null;
  return makePlanFromUnits(course, units, slotMinutes);
}

// Enforce a consistent response shape for the plan
function normalizePlan(rawPlan, defaultCourse = 'Course', slotMinutes = 60) {
  const safe = (v, d) => (v === undefined || v === null ? d : v);
  const plan = typeof rawPlan === 'object' && rawPlan ? rawPlan : {};

  const course = String(safe(plan.course, defaultCourse)).trim() || defaultCourse;
  const minutesPerSlot = Number(safe(plan.slotMinutes, slotMinutes)) || slotMinutes;

  const unitsIn = Array.isArray(plan.units) ? plan.units : [];
  const units = unitsIn.map((u, idx) => {
    const name = String(safe(u?.name, `Unit ${idx + 1}`)).trim() || `Unit ${idx + 1}`;

    // topics: array of objects { title, minutes }
    const topicsIn = Array.isArray(u?.topics) ? u.topics : [];
    const topics = topicsIn.map((t, i) => {
      const title = String(safe(t?.title ?? t?.name ?? t, `Topic ${i + 1}`));
      const minutes = Number(safe(t?.minutes, 0)) || 0;
      return { title, minutes };
    });

    // sessions: array of { session, minutes, topicTitles[] }
    const sessionsIn = Array.isArray(u?.sessions) ? u.sessions : [];
    const sessions = sessionsIn.map((s, i) => ({
      session: Number(s?.session ?? i + 1) || i + 1,
      minutes: Number(s?.minutes ?? minutesPerSlot) || minutesPerSlot,
      topicTitles: Array.isArray(s?.topicTitles) ? s.topicTitles.map(String) : [],
    }));

    // contactHours: prefer provided, else derive from topics minutes
    let contactHours = Number(u?.contactHours);
    if (!Number.isFinite(contactHours) || contactHours <= 0) {
      const minutesTotal = topics.reduce((sum, t) => sum + (Number(t.minutes) || 0), 0);
      contactHours = Math.max(0, Math.round(minutesTotal / 60));
    }

    return { name, contactHours, topics, sessions };
  });

  const notes = Array.isArray(plan.notes) ? plan.notes.map(String) : [];
  return { course, slotMinutes: minutesPerSlot, units, notes };
}

// Portable Python executable and script paths
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';
// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// Load env from ingest-server/.env and starterkit/.env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(REPO_ROOT, 'packages/starterkit/.env') });
const OCR_SCRIPT = path.resolve(REPO_ROOT, 'ocr_ingest.py');
const GEMINI_SCRIPT = path.resolve(REPO_ROOT, 'gemini_plan.py');

// POST /ingest - upload a PDF and process with OCR + planning
app.post('/ingest', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(500).json({ error: 'Server misconfigured: GEMINI_API_KEY not set' });
    }
    const mistralKey = process.env.MISTRAL_API_KEY;
    if (!mistralKey) {
      return res.status(500).json({ error: 'Server misconfigured: MISTRAL_API_KEY not set' });
    }

    logDebug('Received file', { name: file.originalname, size: file.size, mimetype: file.mimetype, path: file.path });
    logDebug('Config', { python: PYTHON_BIN, ocrScript: OCR_SCRIPT, geminiScript: GEMINI_SCRIPT, geminiKey: !!geminiKey, mistralKey: !!mistralKey });

    // Step 1: Use OCR helper to get markdown from the raw PDF
    let markdown = '';
    try {
      const ocrOut = execFileSync(PYTHON_BIN, [
        OCR_SCRIPT,
        file.path,
      ], {
        env: { ...process.env, MISTRAL_API_KEY: mistralKey },
        maxBuffer: 1024 * 1024 * 50,
        encoding: 'utf8',
      });
      let parsed = null;
      try { parsed = JSON.parse(ocrOut); } catch {}
      if (parsed && parsed.pages && Array.isArray(parsed.pages)) {
        markdown = parsed.pages.map((p) => p.markdown || '').join('\n\n');
      } else {
        markdown = String(ocrOut || '');
      }
      logDebug('OCR completed', { markdownChars: markdown.length });
    } catch (e) {
      console.error('OCR step failed:', e?.message || e);
      return res.status(502).json({ error: 'OCR failed', detail: String(e?.message || e) });
    }

    // Step 2: Use Gemini 2.5 Pro to produce a strict 60-minute slot plan
    let plan = null;
    // Attempt Gemini up to 3 times with backoff; if still fails, return 502 (no local fallback)
    let lastErr = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const out = execFileSync(PYTHON_BIN, [
          GEMINI_SCRIPT,
        ], {
          env: { ...process.env, GEMINI_API_KEY: geminiKey },
          input: Buffer.from(markdown, 'utf8'),
          maxBuffer: 1024 * 1024 * 50,
          encoding: 'utf8',
        });
        try {
          plan = JSON.parse(out);
        } catch {
          plan = { raw: out };
        }
        logDebug('Gemini planning completed', { hasPlan: !!plan, keys: Object.keys(plan || {}) });
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        console.error(`Gemini planner failed (attempt ${attempt}/3):`, e?.message || e);
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }
    if (!plan) {
      return res.status(502).json({ error: 'Gemini planning failed', detail: String(lastErr?.message || lastErr) });
    }

    // Cleanup uploaded file
    fs.unlink(file.path, () => {});

    // Normalize and return consistent schema
    const normalized = normalizePlan(plan, 'Course', 60);
    return res.json({ markdown, plan: normalized });
  } catch (err) {
    console.error('Unhandled error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to process file', detail: String(err?.message || err) });
  }
});

const PORT = process.env.PORT || 5057;
app.listen(PORT, () => {
  console.log(`Ingest server listening on http://localhost:${PORT}`);
});


