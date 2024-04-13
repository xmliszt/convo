import { Chat } from './chat';

export default function Home() {
  return (
    <main className='flex h-full w-full flex-col items-center gap-y-4'>
      <h1 className='mx-auto max-w-lg p-4 text-center'>Convo</h1>
      <Chat />
    </main>
  );
}
