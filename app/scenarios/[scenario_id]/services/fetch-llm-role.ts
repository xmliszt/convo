import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type FetchLlmRoleOptions = {
  llmId: string;
};

/**
 * Fetches a single LLM role with the given ID from the database.
 */
export async function fetchLlmRole(options: FetchLlmRoleOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('llm_roles')
    .select('*')
    .eq('id', options.llmId)
    .single();
  if (response.error) {
    throw new ConvoError(
      'Failed to fetch LLM role: ' + options.llmId,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
  return {
    llmRole: response.data,
  };
}
