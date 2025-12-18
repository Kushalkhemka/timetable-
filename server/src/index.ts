import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
// Use CommonJS require for config to avoid TS default import issues
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('@supabase/supabase-js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const upload = multer({ dest: uploadsDir });

type TimetableRow = {
  'Class ID': string;
  'Course': string;
  'Part': string;
  'Students': string;
  'Day': string;
  'Period': string;
  'Room': string;
  'Instructor': string;
  'Instructor Name': string;
};

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

// ============================
// Exams API (mirrors server/server.js)
// ============================
app.get('/api/exams', async (_req: express.Request, res: express.Response) => {
  try {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ exams: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list exams' });
  }
});

app.post('/api/exams', async (req: express.Request, res: express.Response) => {
  try {
    const { name, term, department, start_date, end_date } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const { data, error } = await supabase
      .from('exams')
      .insert({ name, term, department, start_date, end_date })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ exam: data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

app.delete('/api/exams/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params as { id: string };
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

app.get('/api/exams/:id/sessions', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params as { id: string };
    const { data, error } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('exam_id', id)
      .order('exam_date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/exams/:id/sessions', async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params as { id: string };
    const payload = req.body as any;
    const sessions = Array.isArray(payload) ? payload : [payload];
    const cleaned = sessions.map((s: any) => ({
      exam_id: id,
      exam_date: s.exam_date,
      start_time: s.start_time,
      end_time: s.end_time,
      course_code: s.course_code,
      course_name: s.course_name,
      section: s.section,
      room: s.room,
      invigilator_id: s.invigilator_id,
      invigilator_name: s.invigilator_name,
      notes: s.notes,
    }));
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert(cleaned)
      .select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create sessions' });
  }
});

app.delete('/api/exam-sessions/:sessionId', async (req: express.Request, res: express.Response) => {
  try {
    const { sessionId } = req.params as { sessionId: string };
    const { error } = await supabase
      .from('exam_sessions')
      .delete()
      .eq('id', sessionId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

app.post('/api/generate', upload.single('xml'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Missing xml file' });
    }

    const xmlPath = req.file.path;
    const projectRoot = path.resolve(process.cwd(), '..');
    const pythonScript = path.join(projectRoot, 'scheduler_flexible_teachers.py');

    const py = spawn('python3', [pythonScript, xmlPath, '--generations', '300', '--population', '120', '--save_html'], {
      cwd: projectRoot
    });

    let stdout = '';
    let stderr = '';
    py.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    py.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });

    py.on('close', async (code: number) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Scheduler failed', details: stderr });
      }

      // Find the most recent generated CSV file
      const files = await fs.promises.readdir(projectRoot);
      const csvFiles = files.filter((f: string) => f.startsWith('DTU_flexible_teacher_timetable_') && f.endsWith('.csv'));
      if (csvFiles.length === 0) {
        return res.status(500).json({ error: 'CSV not found after scheduler run' });
      }
      csvFiles.sort((a: string, b: string) => fs.statSync(path.join(projectRoot, b)).mtimeMs - fs.statSync(path.join(projectRoot, a)).mtimeMs);
      const latestCsv = path.join(projectRoot, csvFiles[0]);

      const records: TimetableRow[] = await new Promise((resolve, reject) => {
        const out: TimetableRow[] = [];
        fs.createReadStream(latestCsv)
          .pipe(parse({ columns: true, skip_empty_lines: true }))
          .on('data', (row: unknown) => out.push(row as TimetableRow))
          .on('end', () => resolve(out))
          .on('error', (err: unknown) => reject(err));
      });

      // Group by Students (section)
      const bySection: Record<string, TimetableRow[]> = {};
      for (const r of records) {
        if (!bySection[r['Students']]) bySection[r['Students']] = [];
        bySection[r['Students']].push(r);
      }

      // Structure days -> periods
      const response = Object.fromEntries(
        Object.entries(bySection).map(([section, rows]) => {
          const grid: Record<string, Record<string, TimetableRow | null>> = {};
          const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
          const periods = Array.from({ length: 10 }).map((_, i) => `P${i+1}`);
          for (const d of days) {
            grid[d] = {} as Record<string, TimetableRow | null>;
            for (const p of periods) grid[d][p] = null;
          }
          for (const r of rows) {
            grid[r['Day']] = grid[r['Day']] || {} as Record<string, TimetableRow | null>;
            grid[r['Day']][r['Period']] = r;
          }
          return [section, { grid }];
        })
      );

      // Cleanup temp xml
      fs.promises.unlink(xmlPath).catch(() => {});

      res.json({ sections: response, raw: records, log: stdout });
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
});

const port = process.env.PORT || 5055;
app.listen(port, () => {
  console.log(`Timetable backend listening on :${port}`);
});


