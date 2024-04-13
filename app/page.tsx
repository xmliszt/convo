import { Chat } from './chat';

export default function Home() {
  return (
    <main className='flex h-full w-full flex-col items-center gap-y-4'>
      <h1 className='mx-auto max-w-lg p-4 text-center'>Convo</h1>
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
