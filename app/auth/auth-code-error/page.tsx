import { Metadata } from 'next';

import { openGraph } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: 'Convo | Auth Error',
  openGraph: {
    ...openGraph,
    url: '/auth/auth-code-error',
    title: 'Convo | Error',
  },
  alternates: {
    canonical: '/auth/auth-code-error',
  },
};

export default function Page() {
  return (
    <main>
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center'>
        <h1 className='text-4xl'>Authentication failed</h1>
        <h3 className='text-2xl'>Failed to exchange code.</h3>
      </div>
    </main>
  );
}
