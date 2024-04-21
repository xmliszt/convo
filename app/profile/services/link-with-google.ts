'use server';

import { createServerAnonClient } from '@/lib/supabase/server';

/**
 * {@deprecated} This function is deprecated. As it is not working as expected.
 */
export async function linkWithGoogle({
  redirectOrigin,
}: {
  redirectOrigin: string;
}) {
  const supabase = createServerAnonClient();
  const { error } = await supabase.auth.linkIdentity({
    provider: 'google',
    options: {
      redirectTo: `${redirectOrigin}/api/auth/callback`,
    },
  });
  if (error) {
    console.error(error);
    throw new Error('Failed to link account with Google');
  }
}
