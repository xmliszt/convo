import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

export async function fetchEvaluation(evaluationId: string) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('evaluations')
    .select(
      '*,conversation:conversations!inner(*,conversation_dialogs(*),scenario:scenarios!inner(*,llm_role:llm_roles!inner(*),target_words!inner(*),goals(*)))'
    )
    .eq('id', evaluationId)
    .single();
  if (response.error)
    throw new ConvoError(
      'Failed to fetch evaluation',
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  return {
    evaluation: response.data,
  };
}
