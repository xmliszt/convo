import 'server-only';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

/**
 * Fetches all scenarios from the database.
 */
export async function fetchScenarios() {
  const supabase = createServerServiceRoleClient();
  const response = await supabase.from('scenarios').select('*');
  if (response.error) throw response.error;
  return {
    scenarios: response.data,
  };
}
