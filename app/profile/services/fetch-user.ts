import 'server-only';

import { redirect } from 'next/navigation';

import { ConvoError } from '@/lib/convo-error';
import { createServerAnonClient } from '@/lib/supabase/server';

export async function fetchUser() {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.getUser();
  if (!data.user || error) redirect('/signin');
  const response = await supabase
    .from('users')
    .select()
    .eq('id', data.user.id)
    .single();
  if (response.error)
    throw new ConvoError(
      `Failed to fetch user ${data.user.id}`,
      JSON.stringify({
        code: response.error.code,
        details: response.error.details,
        hint: response.error.hint,
        message: response.error.message,
      })
    );
  return { user: response.data };
}
