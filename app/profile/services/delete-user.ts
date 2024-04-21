'use server';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

type DeleteUserProps = {
  userId: string;
};

export async function deleteUser(props: DeleteUserProps) {
  const supabase = createServerServiceRoleClient();
  await supabase.auth.admin.deleteUser(props.userId);
  await supabase.from('users').delete().eq('id', props.userId);
}
