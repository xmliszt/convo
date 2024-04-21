import { User } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { createServerAnonClient } from '@/lib/supabase/server';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export async function UserSigninPortal() {
  const supabase = createServerAnonClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const fetchUserResponse = await supabase
      .from('users')
      .select()
      .eq('id', data.user.id)
      .single();
    return (
      <Link href={`/profile`} className='cursor-pointer'>
        {fetchUserResponse?.data?.photo_url ? (
          <Avatar className='size-[46px] border border-foreground shadow-lg transition-transform hover:scale-110'>
            <AvatarImage
              src={fetchUserResponse.data.photo_url}
              alt={fetchUserResponse.data.name ?? 'User avatar'}
            />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        ) : (
          <User />
        )}
      </Link>
    );
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
