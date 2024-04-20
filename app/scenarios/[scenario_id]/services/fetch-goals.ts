import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type FetchGoalsOptions = {
  scenarioId: string;
};

/**
 * Fetches all goals associated with a scenario from the database.
 */
export async function fetchGoals(options: FetchGoalsOptions) {
  const supabase = createServerServiceRoleClient();
  const response = await supabase
    .from('goals')
    .select('*')
    .eq('scenario_id', options.scenarioId);
  if (response.error) {
    throw new ConvoError(
      'Failed to fetch goals for scenario: ' + options.scenarioId,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
  return {
    goals: response.data,
  };
}
