import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type FetchScenarioOptions = {
  scenarioId: string;
};

/**
 * Fetches all scenarios from the database.
 */
export async function fetchScenario(options: FetchScenarioOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', options.scenarioId)
    .single();
  if (response.error) {
    throw new ConvoError(
      'Failed to fetch scenario: ' + options.scenarioId,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
  return {
    scenario: response.data,
  };
}
