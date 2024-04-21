import 'server-only';

import { ConvoError } from '@/lib/convo-error';
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
  if (response.error) {
    throw new ConvoError(
      'Failed to fetch target words for scenario: ' + options.scenarioId,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
  return {
    targetWords: response.data,
  };
}
