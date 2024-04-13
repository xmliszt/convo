import 'server-only';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

type FetchTargetWordsOptions = {
  scenarioId: string;
};

/**
 * Fetches all target words associated with a scenario from the database.
 */
export async function fetchTargetWords(options: FetchTargetWordsOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('target_words')
    .select('*')
    .eq('scenario_id', options.scenarioId)
    .single();
  if (response.error) throw response.error;
  return {
    targetWords: response.data,
  };
}
