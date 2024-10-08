import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerAnonClient } from '@/lib/supabase/server';

type FetchConversationOptions = { conversationId: string };

export async function fetchConversation({
  conversationId,
}: FetchConversationOptions) {
  const supabase = createServerAnonClient();
  const response = await supabase
    .from('conversations')
    .select(
      '*,scenario:scenarios!inner(*,llm_role:llm_roles!inner(*),goals(*),target_words!inner(*)),conversation_dialogs(*),evaluation:evaluations(*)'
    )
    .eq('id', conversationId)
    .single();

  if (response.error) {
    throw new ConvoError(
      'Unable to fetch conversation with ID: ' + conversationId,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }

  return { conversation: response.data };
}
