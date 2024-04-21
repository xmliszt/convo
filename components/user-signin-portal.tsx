import Link from 'next/link';

import { createServerAnonClient } from '@/lib/supabase/server';

export async function UserSigninPortal() {
  const supabase = createServerAnonClient();
  const { data } = await supabase.auth.getUser();
  const session = await supabase.auth.getSession();
  console.log(session.data);
  if (data.user) {
    const fetchUserResponse = await supabase
      .from('users')
      .select()
      .eq('id', data.user.id)
      .single();
    if (!fetchUserResponse.error) {
      return <div>Hello, {fetchUserResponse.data.name}!</div>;
    } else {
      return <div>Hello!</div>;
    }
  }
  // Not signed in case.
  return (
    <Link
      href='/signin'
      className='p-4 transition-[transform_text-weight] hover:scale-110 hover:font-bold'
    >
      Sign in
    </Link>
  );
}
