import { supabase } from './supabase.js';

export async function getUserData(userId, bankId, dataType) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('data')
    .eq('user_id', userId)
    .eq('question_bank_id', bankId)
    .eq('data_type', dataType)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.data ?? null;
}

export async function updateUserData(userId, bankId, dataType, payload) {
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      question_bank_id: bankId,
      data_type: dataType,
      data: payload,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}
