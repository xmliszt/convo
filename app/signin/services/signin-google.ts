import { createBrowserAnonClient } from '@/lib/supabase/client';

export async function signInGoogle() {
  const supabase = createBrowserAnonClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  if (error) {
    console.error(error);
    throw new Error('Failed to sign in with Google');
  }
}
