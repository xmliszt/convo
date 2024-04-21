'use server';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

export async function signInAnonymously(props: { captchaToken: string }) {
  const supabase = createServerServiceRoleClient();
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: props.captchaToken,
    },
  });
  if (error || !data.user) {
    throw new Error('Failed to sign in anonymously');
  }
  console.log('data', data);
  return {
    user: data.user,
  };
}
