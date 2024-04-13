import 'server-only';

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
  if (response.error) throw response.error;
  return {
    llmRole: response.data,
  };
}
