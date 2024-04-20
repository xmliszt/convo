import 'server-only';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

/**
 * Fetches all scenarios from the database.
 */
export async function fetchScenarios() {
  const supabase = createServerServiceRoleClient();
  const response = await supabase.from('scenarios').select('*');
  if (response.error) {
    throw new ConvoError(
      'Failed to fetch scenarios',
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  }
  return {
    scenarios: response.data,
  };
}
