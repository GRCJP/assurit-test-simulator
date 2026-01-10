import { createClient } from '@supabase/supabase-js';
import { jwtDecode } from 'jwt-decode';

// Custom JWT handling for Auth0 to Supabase
export const createSupabaseClientWithAuth0 = async () => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
  
  return supabase;
};

// Generate a custom Supabase JWT from Auth0 token
export const createSupabaseTokenFromAuth0 = async (auth0IdToken) => {
  try {
    // Decode the Auth0 token to get user info
    const decoded = jwtDecode(auth0IdToken);
    
    // Create a custom JWT payload for Supabase
    const supabasePayload = {
      aud: 'authenticated',
      exp: decoded.exp,
      sub: decoded.sub, // This will be our user identifier
      user_metadata: {
        full_name: decoded.name || decoded.email,
        email: decoded.email,
      },
      app_metadata: {
        provider: 'auth0',
      },
      role: 'authenticated',
    };
    
    // Note: In a real implementation, you'd sign this with Supabase JWT secret
    // For now, we'll use the approach of storing the Auth0 sub as the user_id
    return decoded.sub;
  } catch (error) {
    console.error('Error creating Supabase token from Auth0:', error);
    return null;
  }
};
