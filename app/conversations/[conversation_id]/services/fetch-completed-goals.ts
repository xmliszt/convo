'use server';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type FetchGoalsOptions = {
  conversationId: string;
};

/**
 * Fetches the completed goals associated with the conversation.
 */
export async function fetchCompletedGoalsAndTargetWords(
  options: FetchGoalsOptions
) {
  const supabase = createServerServiceRoleClient();
  const selectCompletedGoalsResponse = await supabase
    .from('conversation_completed_goals')
    .select('*,goal:goals!inner(*)')
    .eq('conversation_id', options.conversationId);
  if (selectCompletedGoalsResponse.error) {
    throw new ConvoError(
      `Failed to fetch completed goals for conversation: ${options.conversationId}`,
      JSON.stringify({
        code: selectCompletedGoalsResponse.error.code,
        details: selectCompletedGoalsResponse.error.details,
        hint: selectCompletedGoalsResponse.error.hint,
        message: selectCompletedGoalsResponse.error.message,
      })
    );
  }

  const selectCompletedTargetWordsResponse = await supabase
    .from('conversation_completed_target_words')
    .select()
    .eq('conversation_id', options.conversationId)
    .single();
  if (selectCompletedTargetWordsResponse.error) {
    throw new ConvoError(
      `Failed to fetch completed target words for conversation: ${options.conversationId}`,
      JSON.stringify({
        code: selectCompletedTargetWordsResponse.error.code,
        details: selectCompletedTargetWordsResponse.error.details,
        hint: selectCompletedTargetWordsResponse.error.hint,
        message: selectCompletedTargetWordsResponse.error.message,
      })
    );
  }

  return {
    conversationId: options.conversationId,
    completedGoals: selectCompletedGoalsResponse.data.map((data) => data.goal),
    completedTargetWords:
      selectCompletedTargetWordsResponse.data.completed_words ?? [],
  };
}
