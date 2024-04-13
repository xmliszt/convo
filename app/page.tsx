import { HomeLink } from './home-link';

export default function Page() {
  return (
    <main className='flex h-screen w-screen items-center justify-center px-4'>
      <HomeLink href='/chat/123' fontSize='10vw' showWhenOnHomePage />
    </main>
  );
}
