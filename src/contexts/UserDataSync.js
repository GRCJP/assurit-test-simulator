
import { supabase } from '../lib/supabase.js';

const TABLE = 'user_progress';

const isMissingRowError = (error) => {
  return error && (error.code === 'PGRST116' || String(error.details || '').includes('Results contain 0 rows'));
};

const ensureSessionUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.user || null;
};

const requireUserId = async (userId) => {
  if (userId) return userId;
  const user = await ensureSessionUser();
  if (!user?.id) throw new Error('No authenticated Supabase user.');
  return user.id;
};

const upsertRow = async ({ userId, questionBankId, payload }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        user_id: userId,
        question_bank_id: questionBankId,
        ...payload,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,question_bank_id',
        ignoreDuplicates: false,
      }
    )
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

const getRow = async ({ userId, questionBankId }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('question_bank_id', questionBankId)
    .single();

  if (error) {
    if (isMissingRowError(error)) return null;
    throw error;
  }

  return data;
};

const userDataSync = {
  async syncAllUserData(userId, questionBankId) {
    const finalUserId = await requireUserId(userId);
    const row = await getRow({ userId: finalUserId, questionBankId });
    return {
      success: true,
      userId: finalUserId,
      questionBankId,
      data: row || {},
      saved: 'postgres',
    };
  },

  async updateUserData(userId, questionBankId, dataType, data) {
    const finalUserId = await requireUserId(userId);
    const savedRow = await upsertRow({
      userId: finalUserId,
      questionBankId,
      payload: { [dataType]: data },
    });
    return { success: true, userId: finalUserId, questionBankId, data: savedRow, saved: 'postgres' };
  },

  async getUserData(userId, questionBankId, dataType) {
    const finalUserId = await requireUserId(userId);
    const row = await getRow({ userId: finalUserId, questionBankId });

    if (!row) return { success: true, userId: finalUserId, questionBankId, data: [] };

    if (!dataType) {
      return { success: true, userId: finalUserId, questionBankId, data: row };
    }

    return {
      success: true,
      userId: finalUserId,
      questionBankId,
      data: row[dataType] ?? [],
    };
  },

  checkHealth() {
    return !!supabase;
  },

  async testSyncStatus(userId, questionBankId) {
    const finalUserId = await requireUserId(userId);
    const row = await getRow({ userId: finalUserId, questionBankId });
    return {
      success: true,
      userId: finalUserId,
      questionBankId,
      hasRow: !!row,
      updated_at: row?.updated_at ?? null,
    };
  },

  async exportAllData(userId, questionBankId) {
    const finalUserId = await requireUserId(userId);
    const row = await getRow({ userId: finalUserId, questionBankId });
    return {
      success: true,
      userId: finalUserId,
      questionBankId,
      data: row || {},
    };
  },

  async importAllData(userId, questionBankId, payload) {
    const finalUserId = await requireUserId(userId);
    const savedRow = await upsertRow({
      userId: finalUserId,
      questionBankId,
      payload: payload || {},
    });
    return {
      success: true,
      userId: finalUserId,
      questionBankId,
      data: savedRow,
      saved: 'postgres',
    };
  },
};

export default userDataSync;
