import { createClient } from '@supabase/supabase-js';

function sanitizeEnv(value) {
  const v = String(value ?? '').trim();
  return v.replace(/^['"]|['"]$/g, '');
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = sanitizeEnv(rawUrl);
const supabaseAnonKey = sanitizeEnv(rawKey);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  }
);

export async function checkSupabaseConnectivity() {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}
