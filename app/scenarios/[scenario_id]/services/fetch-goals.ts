import 'server-only';

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
  if (response.error) throw response.error;
  return {
    goals: response.data,
  };
}
