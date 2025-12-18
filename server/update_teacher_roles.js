// update_teacher_roles.js
// Ensures all instructor users have user_metadata.role = 'teacher'
// Requires SUPABASE_SERVICE_ROLE_KEY in env

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

function readMergedXml(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf-8');
}

function parseInstructorEmails(xml) {
  const emails = new Set();
  const emailRegex = /email="([^"]+)"/g;
  let m;
  while ((m = emailRegex.exec(xml)) !== null) {
    emails.add(m[1]);
  }
  return Array.from(emails);
}

async function listAllUsers(admin, maxPages = 50) {
  // Paginate through users; adjust per_page if needed
  const all = [];
  let page = 1;
  while (page <= maxPages) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    all.push(...(data?.users || []));
    if (!data || !data.users || data.users.length === 0) break;
    page += 1;
  }
  return all;
}

async function main() {
  const supabaseUrl = config.supabase.url;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const mergedXmlPath = path.resolve(__dirname, '..', 'merged.xml');
  const xml = readMergedXml(mergedXmlPath);
  const emails = parseInstructorEmails(xml);
  console.log(`Found ${emails.length} instructor emails.`);

  console.log('Listing users from Supabase...');
  const users = await listAllUsers(supabase);
  console.log(`Fetched ${users.length} users from Supabase.`);

  const emailToUser = new Map();
  for (const u of users) {
    if (u.email) emailToUser.set(u.email.toLowerCase(), u);
  }

  const results = [];
  for (const email of emails) {
    const u = emailToUser.get(email.toLowerCase());
    if (!u) {
      results.push({ email, status: 'not_found' });
      continue;
    }
    const role = (u.user_metadata && u.user_metadata.role) || null;
    if (role === 'teacher') {
      results.push({ email, status: 'ok' });
      continue;
    }
    const newMeta = { ...(u.user_metadata || {}), role: 'teacher' };
    const { error } = await supabase.auth.admin.updateUserById(u.id, { user_metadata: newMeta });
    if (error) {
      results.push({ email, status: 'error', error: error.message });
    } else {
      results.push({ email, status: 'updated' });
    }
  }

  const outDir = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = path.join(outDir, `teacher_role_fix_${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log('Role update results saved to:', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



