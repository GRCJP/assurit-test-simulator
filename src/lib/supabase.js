// Simple Supabase REST client - no auth functionality
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a minimal client with only database operations
const supabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        eq: (column2, value2) => ({
          eq: (column3, value3) => ({
            single: async () => {
              const url = `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}&${column2}=eq.${value2}&${column3}=eq.${value3}&select=${columns}`;
              const response = await fetch(url, {
                headers: {
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
              });
              if (!response.ok) {
                const error = { code: 'PGRST116' };
                if (response.status !== 406) throw error;
                return { data: null, error };
              }
              const data = await response.json();
              return data && data.length > 0 ? { data: data[0] } : { data: null, error: { code: 'PGRST116' } };
            }
          })
        })
      })
    }),
    upsert: async (data) => {
      const url = `${SUPABASE_URL}/rest/v1/${table}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { error: null };
    }
  })
};

export { supabase };
