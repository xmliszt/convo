import { cn } from '@/lib/utils';

import { HomeLink } from './home-link';

export function Header() {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-50 flex w-screen items-center bg-background/60',
        // gradient glass effect
        'shadow-inner backdrop-blur-[5px] [mask:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]'
      )}
    >
      <div className='px-4 py-2'>
        <HomeLink href='/' fontSize='24px' />
      </div>
    </div>
  );
}
