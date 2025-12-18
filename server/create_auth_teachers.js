// create_auth_teachers.js
// Reads instructors from merged.xml and creates Supabase Auth users with password 1234
// Requires: SUPABASE_SERVICE_ROLE_KEY in env. Uses URL from config.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

function readMergedXml(absolutePath) {
  const xml = fs.readFileSync(absolutePath, 'utf-8');
  return xml;
}

function parseInstructors(xml) {
  const instructorRegex = /<instructor\s+([^\/>]+?)\s*\/>/g;
  const attrRegex = /(\w+)="([^"]*)"/g;
  const instructors = [];
  let match;
  while ((match = instructorRegex.exec(xml)) !== null) {
    const attrs = match[1];
    const instructor = {};
    let a;
    while ((a = attrRegex.exec(attrs)) !== null) {
      instructor[a[1]] = a[2];
    }
    if (instructor.email) {
      instructors.push({
        id: instructor.id || null,
        name: instructor.name || '',
        email: instructor.email,
        department: instructor.department || '',
        designation: instructor.designation || '',
        specialization: instructor.specialization || ''
      });
    }
  }
  return instructors;
}

async function ensureUsers({ supabase, instructors, defaultPassword }) {
  const results = [];
  for (const t of instructors) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: t.email,
        password: defaultPassword,
        email_confirm: true,
        user_metadata: {
          name: t.name,
          department: t.department,
          designation: t.designation,
          specialization: t.specialization,
          source: 'merged.xml'
        }
      });
      if (error) {
        // If user already exists, note it and continue
        const alreadyExists = /already|exists|duplicate/i.test(String(error.message));
        if (alreadyExists) {
          results.push({ ...t, status: 'exists', password: defaultPassword, user_id: null, error: null });
          continue;
        }
        results.push({ ...t, status: 'error', password: defaultPassword, user_id: null, error: error.message });
        continue;
      }
      results.push({ ...t, status: 'created', password: defaultPassword, user_id: data?.user?.id || null, error: null });
    } catch (e) {
      results.push({ ...t, status: 'error', password: defaultPassword, user_id: null, error: e.message });
    }
  }
  return results;
}

function writeOutputs(results, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(outDir, `teacher_credentials_${ts}.json`);
  const csvPath = path.join(outDir, `teacher_credentials_${ts}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  const header = ['name', 'email', 'department', 'designation', 'specialization', 'password', 'status', 'user_id', 'error'];
  const lines = [header.join(',')];
  for (const r of results) {
    const row = [
      r.name,
      r.email,
      r.department,
      r.designation,
      r.specialization,
      r.password,
      r.status,
      r.user_id || '',
      r.error ? String(r.error).replace(/\s+/g, ' ') : ''
    ];
    // Basic CSV escaping for commas and quotes
    lines.push(row.map((v) => {
      const s = v == null ? '' : String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    }).join(','));
  }
  fs.writeFileSync(csvPath, lines.join('\n'));
  return { jsonPath, csvPath };
}

async function main() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = config.supabase.url;
  if (!serviceRoleKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
  }
  if (!supabaseUrl) {
    console.error('Missing Supabase URL (config.supabase.url).');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const mergedXmlPath = path.resolve(__dirname, '..', 'merged.xml');
  const xml = readMergedXml(mergedXmlPath);
  const instructors = parseInstructors(xml);
  if (!instructors.length) {
    console.error('No instructors found in merged.xml');
    process.exit(1);
  }

  console.log(`Found ${instructors.length} instructors. Creating users...`);
  const results = await ensureUsers({ supabase, instructors, defaultPassword: '1234' });
  const { jsonPath, csvPath } = writeOutputs(results, path.resolve(__dirname, 'uploads'));
  console.log('Done. Outputs:');
  console.log('JSON:', jsonPath);
  console.log('CSV :', csvPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



