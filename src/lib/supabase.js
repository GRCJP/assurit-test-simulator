import { createClient } from '@supabase/supabase-js';

// Create Supabase client with auth completely disabled
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

// Remove auth methods to prevent any auth calls
delete supabaseClient.auth;

export const supabase = supabaseClient;
