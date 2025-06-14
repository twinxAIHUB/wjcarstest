import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const createSupabaseClient = () => {
  return createClientComponentClient<Database>();
};

export const getServerClient = async () => {
  const supabase = createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return { supabase, session };
}; 