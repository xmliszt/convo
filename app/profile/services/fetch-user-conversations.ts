import 'server-only';

import { redirect } from 'next/navigation';

import { ConvoError } from '@/lib/convo-error';
import {
  createServerAnonClient,
  createServerServiceRoleClient,
} from '@/lib/supabase/server';

export async function fetchUserConversations() {
  const authSupabase = createServerAnonClient();
  const { data, error } = await authSupabase.auth.getUser();
  if (!data.user || error) {
    redirect('/signin');
  }
  const supabase = createServerServiceRoleClient();
  const fetchUserConversationsResponse = await supabase
    .from('conversations')
    .select(
      '*,scenario:scenarios!inner(*,llm_role:llm_roles!inner(*),goals(*),target_words!inner(*))'
    )
    .eq('created_by', data.user.id);
  if (fetchUserConversationsResponse.error)
    throw new ConvoError(
      'Failed to fetch user data',
      JSON.stringify({
        code: fetchUserConversationsResponse.error.code,
        details: fetchUserConversationsResponse.error.details,
        hint: fetchUserConversationsResponse.error.hint,
        message: fetchUserConversationsResponse.error.message,
      })
    );
  return {
    conversations: fetchUserConversationsResponse.data,
  };
}
