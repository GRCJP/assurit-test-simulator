import { createClient } from '@supabase/supabase-js';

// Debug environment variables
console.log('🔧 Environment Variables Debug:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');

// Use environment variables with anonymous key for browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Config - Using environment variables');
console.log('URL:', supabaseUrl);
console.log('Key type: Anonymous/Public (browser-safe)');
console.log('Key loaded:', supabaseAnonKey ? 'Yes' : 'No');

// Fallback to hardcoded values if env vars not loaded
const finalUrl = supabaseUrl || 'https://szyjviaolnaoywopfrqp.supabase.co';
const finalKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5anZpYW9sbmFveW93cGZycXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjQ4Njg1MSwiZXhwIjoyMDUyMDYyODUxfQ.VT1beAkfN48VBF_esRhUrKgIetJ0DTGW-748Tv9pPcU';

console.log('🔧 Final Config:');
console.log('URL:', finalUrl);
console.log('Using fallback:', !supabaseUrl || !supabaseAnonKey);

export const supabase = createClient(finalUrl, finalKey);

// Helper function to get user-specific table reference
export const getUserDataRef = (userId, bankId = 'bankCCP') => {
  return supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('question_bank_id', bankId)
    .single();
};

// Helper function to update user data
export const updateUserData = async (userId, bankId, dataType, data) => {
  try {
    const { data: existingData, error: fetchError } = await getUserDataRef(userId, bankId);
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const updatePayload = {
      user_id: userId,
      question_bank_id: bankId,
      [dataType]: data,
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('user_progress')
      .upsert(updatePayload, {
        onConflict: 'user_id,question_bank_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log(`✅ ${dataType} synced to PostgreSQL successfully`);
    return { success: true, data: result, saved: 'postgres' };
    
  } catch (error) {
    console.error(`❌ PostgreSQL sync failed for ${dataType}:`, error);
    throw error;
  }
};

// Helper function to get user data
export const getUserData = async (userId, bankId = 'bankCCP', dataType = null) => {
  try {
    const { data, error } = await getUserDataRef(userId, bankId);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`No existing data found for ${userId} in ${bankId}`);
        return null;
      }
      throw error;
    }

    if (dataType && data) {
      return data[dataType];
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ Failed to get user data:`, error);
    return null;
  }
};
