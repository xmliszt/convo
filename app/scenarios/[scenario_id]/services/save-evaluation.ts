'use server';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

type SaveEvaluationOptions = {
  conversationId: string;
  evaluation: string;
};

export async function saveEvaluation(options: SaveEvaluationOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('evaluations')
    .insert({
      conversation_id: options.conversationId,
      ai_evaluation: options.evaluation,
    })
    .select()
    .single();
  if (response.error) throw response.error;
  return {
    evaluation: response.data,
  };
}
