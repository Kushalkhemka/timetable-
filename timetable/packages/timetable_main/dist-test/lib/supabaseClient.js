import { createClient } from '@supabase/supabase-js';
// Support both Vite env and Node env
let viteEnv = {};
try {
    viteEnv = import.meta?.env ?? {};
}
catch {
    viteEnv = {};
}
const nodeEnv = (typeof process !== 'undefined' && process?.env) || {};
const envUrl = (viteEnv.VITE_SUPABASE_URL || nodeEnv.VITE_SUPABASE_URL || nodeEnv.SUPABASE_URL);
const envAnon = (viteEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.VITE_SUPABASE_ANON_KEY || nodeEnv.SUPABASE_ANON_KEY);
// Fallbacks so local dev works even if .env is not set
const fallbackUrl = 'https://ketlvbjlukqcolfkwyge.supabase.co';
const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtldGx2YmpsdWtxY29sZmt3eWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjEwMTksImV4cCI6MjA3MjkzNzAxOX0.Lro-UME31Wcn-Y6RegmadZqPPJk9MzlQuDYO8Uf0tyw';
export const supabase = createClient(envUrl ?? fallbackUrl, envAnon ?? fallbackAnon);
