import 'server-only';

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
  if (response.error) throw response.error;
  return {
    scenario: response.data,
  };
}
