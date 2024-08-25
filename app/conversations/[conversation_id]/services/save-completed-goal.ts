'use server';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type SaveCompletedGoalOptions = {
  conversationId: string;
  goalId: string;
};

export async function saveCompletedGoal(options: SaveCompletedGoalOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase.from('conversation_completed_goals').insert({
    conversation_id: options.conversationId,
    goal_id: options.goalId,
  });
  if (response.error) {
    throw new ConvoError(
      `Failed to save completed goal for conversation: ${options.conversationId}`,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
}
