'use server';

import { createServerAnonClient } from '@/lib/supabase/server';

type UpdateConversationOptions = {
  conversationId: string;
  bonusScore: number;
};

export async function updateConversation(options: UpdateConversationOptions) {
  const supabase = createServerAnonClient();
  const response = await supabase
    .from('conversations')
    .update({
      bonus_score: options.bonusScore,
    })
    .eq('id', options.conversationId)
    .select()
    .single();
  if (response.error) throw response.error;
  return {
    conversation: response.data,
  };
}
