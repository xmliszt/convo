import 'server-only';

import { createServerAnonClient } from '@/lib/supabase/server';

export async function fetchAuthUser() {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const authUser = data.user;
  const fetchUserResponse = await supabase
    .from('users')
    .select()
    .eq('id', authUser.id)
    .single();
  if (fetchUserResponse.error) {
    console.error(fetchUserResponse.error);
    throw new Error('Failed to fetch user');
  }
  return fetchUserResponse.data;
}
