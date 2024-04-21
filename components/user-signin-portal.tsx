import { User } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { fetchAuthUser } from './fetch-auth-user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export async function UserSigninPortal() {
  const user = await fetchAuthUser();

  if (user) {
    return (
      <Link href={`/profile`} className='cursor-pointer'>
        {user.photo_url ? (
          <Avatar className='flex size-11 items-center justify-center overflow-hidden rounded-full border bg-[linear-gradient(320deg,#f1f1f1,#ffffff)] shadow-lg transition-transform hover:scale-110 dark:bg-[linear-gradient(320deg,#000000,#5a5752)] sm:size-12'>
            <AvatarImage
              src={user.photo_url}
              alt={user.name ?? 'User avatar'}
            />
            <AvatarFallback>
              <User size={20} />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className='flex size-11 items-center justify-center overflow-hidden rounded-full border bg-[linear-gradient(320deg,#f1f1f1,#ffffff)] shadow-lg transition-transform hover:scale-110 dark:bg-[linear-gradient(320deg,#000000,#5a5752)] sm:size-12'>
            <User size={20} />
          </div>
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
