import { createBrowserAnonClient } from '@/lib/supabase/client';

export async function signInGoogle({
  redirectOrigin,
}: {
  redirectOrigin: string;
}) {
  const supabase = createBrowserAnonClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${redirectOrigin}/api/auth/callback`,
    },
  });
  if (error) {
    console.error(error);
    throw new Error('Failed to sign in with Google');
  }
}
