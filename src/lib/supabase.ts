import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('=== SUPABASE CLIENT INITIALIZATION ===');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase URL check:', supabaseUrl ? 'Found' : 'MISSING');
console.log('Supabase Key check:', supabaseAnonKey ? 'Found' : 'MISSING');
console.log('Supabase Key (first 20 chars):', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'N/A');
console.log('=== END SUPABASE INITIALIZATION ===');

if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  console.error('FATAL:', error);
  throw new Error(error);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
  }
});

export type JournalEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  text_entry: string;
  mood: string | null;
  tags: string[] | null;
  voice_note_text: string | null;
  reframe_message: string | null;
};
