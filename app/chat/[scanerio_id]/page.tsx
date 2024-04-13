import { ThemeSwitch } from '@/components/theme-switch';

import { Chat } from './chat';

type PageProps = {
  params: {
    scanerio_id: string;
  };
};

export default function Page(props: PageProps) {
  return (
    <main className='relative flex h-full w-full flex-col items-center gap-y-4'>
      {process.env.VERCEL_ENV === 'production' ? (
        <div className='p-4 text-center'>
          <p>🚧 This is a work in progress. Be right back!</p>
        </div>
      ) : (
        <Chat />
      )}
    </main>
  );
}
