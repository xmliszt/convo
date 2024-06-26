'use server';

import { createServerAnonClient } from '@/lib/supabase/server';

export async function signInAnonymously(props: { captchaToken: string }) {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: props.captchaToken,
    },
  });
  if (error || !data.user) {
    throw new Error('Failed to sign in anonymously');
  }

  return {
    user: data.user,
  };
}
