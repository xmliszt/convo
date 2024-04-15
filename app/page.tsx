import { HomeLink } from './home-link';

export default function Page() {
  return (
    <main className='flex items-center justify-center px-4'>
      <HomeLink
        homeLink={{ href: '/scenarios', label: 'Start' }}
        fontSize='10vw'
        showWhenOnHomePage
      />
    </main>
  );
}
