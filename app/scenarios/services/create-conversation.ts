'use server';

import { redirect } from 'next/navigation';

import { createServerAnonClient } from '@/lib/supabase/server';

export async function createConversation({
  scenarioId,
}: {
  scenarioId: string;
}) {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.getUser();
  console.error('data', data, 'error', error);
  if (!data.user || error) {
    return redirect('/signin');
  }
  const response = await supabase
    .from('conversations')
    .insert({
      scenario_id: scenarioId,
      created_by: data.user.id,
    })
    .select()
    .single();
  if (response.error) throw response.error;
  return { conversation: response.data };
}
