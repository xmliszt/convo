import { HomeLink } from './home-link';

export default function Page() {
  return (
    <main className='flex h-screen w-screen items-center justify-center px-4'>
      <HomeLink href='/scenarios' fontSize='10vw' showWhenOnHomePage />
    </main>
  );
}
