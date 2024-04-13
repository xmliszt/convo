import { ThemeSwitch } from '@/components/theme-switch';

import { Chat } from './chat';

export default function Home() {
  return (
    <main className='relative flex h-full w-full flex-col items-center gap-y-4 px-4'>
      <h1 className='mx-auto max-w-lg p-4 text-center text-primary'>Convo</h1>
      {process.env.VERCEL_ENV === 'production' ? (
        <div className='p-4 text-center'>
          <p>🚧 This is a work in progress. Be right back!</p>
        </div>
      ) : (
        <Chat />
      )}
      <div className='absolute right-4 top-4 z-10'>
        <ThemeSwitch />
      </div>
    </main>
  );
}
