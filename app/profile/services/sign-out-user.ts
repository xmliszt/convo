'use server';

import { redirect } from 'next/navigation';

import { createServerAnonClient } from '@/lib/supabase/server';

export async function signoutUser() {
  const supabase = createServerAnonClient();
  await supabase.auth.signOut();
  redirect('/scenarios');
}
