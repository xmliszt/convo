'use server';

import { redirect } from 'next/navigation';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

export async function signInGoogle({
  redirectOrigin,
}: {
  redirectOrigin: string;
}) {
  const supabase = createServerServiceRoleClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${redirectOrigin}/api/auth/callback`,
    },
  });
  if (error) {
    throw new Error('Failed to sign in with Google');
  }
  console.log(data.url);
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
