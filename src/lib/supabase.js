import { createClient } from '@supabase/supabase-js';

// Use anonymous/public key for browser (not secret key)
const supabaseUrl = 'https://szyjviaolnaoywopfrqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5anZpYW9sbmFveW93cGZycXAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjQ4Njg1MSwiZXhwIjoyMDUyMDYyODUxfQ.sb_publishable_Xf-epctMBmqxCgCAjmnf7A_qF2ihuf4';

console.log('🔧 Supabase Config - Using anonymous key for browser');
console.log('URL:', supabaseUrl);
console.log('Key type: Anonymous/Public (browser-safe)');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
