import { supabase } from '../lib/supabase.js';

export function signInWithSupabase() {
  // Use the same redirect URI as Auth0
  const redirectUri = `${window.location.origin}/assurit-test-simulator`;
  
  console.log('Initiating Supabase OAuth with Auth0 provider...');
  
  const { error } = supabase.auth.signInWithOAuth({
    provider: 'auth0',
    options: {
      redirectTo: redirectUri,
    },
  });
  
  if (error) {
    console.error('Supabase OAuth error:', error);
    throw error;
  }
}

export function signOutOfSupabase() {
  return supabase.auth.signOut();
}
