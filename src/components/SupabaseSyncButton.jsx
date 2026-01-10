import { signInWithSupabase } from '../lib/supabaseOAuth';

export function SupabaseSyncButton() {
  const handleClick = async () => {
    try {
      await signInWithSupabase();
    } catch (error) {
      console.error('Failed to sign in with Supabase:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    >
      Enable Cloud Sync
    </button>
  );
}
