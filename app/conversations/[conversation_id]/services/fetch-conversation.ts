import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

export async function fetchConversation({
  conversationId,
}: {
  conversationId: string;
}) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('conversations')
    .select(
      '*,scenario:scenarios!inner(*,llm_role:llm_roles!inner(*),goals(*),target_words!inner(*)),conversation_dialogs(*)'
    )
    .eq('id', conversationId)
    .single();
  if (response.error)
    throw new ConvoError(
      'Unable to fetch conversation',
      JSON.stringify(response.error)
    );

  return { conversation: response.data };
}