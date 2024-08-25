import './globals.css';

import { GithubLogo } from '@phosphor-icons/react/dist/ssr';
import { Analytics } from '@vercel/analytics/react';
import { Metadata, Viewport } from 'next';
import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { UserSigninPortal } from '@/components/user-signin-portal';

import { Header } from './header';
import { HomeLink } from './home-link';
import { openGraph } from './shared-metadata';
import { NextThemeProvider } from './theme-provider';
import { ThemeSwitchHolder } from './theme-switch-holder';
import { UserSigninPortalHolder } from './user-signin-portal-holder';

// Metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://convo.website'),
  title: 'Convo | Boundless Conversation Practice with AI',
  description:
    'Convo is an innovative edtech web app designed to enhance language learning through immersive, situational conversations. Choose from a variety of scenarios covering diverse topics and interact with an AI role-playing partner. Practice speaking freely, set conversation goals, and target specific vocabulary, all while receiving personalized feedback on your linguistic performance. Start your journey to fluent communication today with Convo.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Convo | Boundless Conversation Practice with AI',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
  applicationName: 'Convo | Boundless Conversation Practice with AI',
  keywords: [
    'convo',
    'english',
    'conversation',
    'ai',
    'practice',
    'learn',
    'situational',
  ],
  authors: [{ name: 'Li Yuxuan', url: 'https://liyuxuan.dev/' }],
  creator: 'Li Yuxuan',
  alternates: { canonical: '/' },
  category: 'education',
  openGraph,
  twitter: {
    card: 'summary_large_image',
    title: 'Convo | Boundless Conversation Practice with AI',
    description:
      'Convo is an innovative edtech web app designed to enhance language learning through immersive, situational conversations. Choose from a variety of scenarios covering diverse topics and interact with an AI role-playing partner. Practice speaking freely, set conversation goals, and target specific vocabulary, all while receiving personalized feedback on your linguistic performance. Start your journey to fluent communication today with Convo.',
    siteId: '1704579643',
    creator: '@xmliszt',
    creatorId: '1704579643',
    images: [
      {
        url: '/twitter-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Convo | Boundless Conversation Practice with AI',
      },
    ],
  },
  robots: {
    follow: true,
    nocache: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  userScalable: false,
};

const PlayfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  return (
    <html
      lang='en'
      className={PlayfairDisplay.className}
      suppressHydrationWarning
    >
      <body>
        <NextThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {isMaintenanceMode ? (
            <main className='relative flex items-center justify-center px-4'>
              <ThemeSwitchHolder />
              <HomeLink
                homeLink={{ href: '/scenarios', label: 'Start' }}
                fontSize='6vw'
                showWhenOnHomePage
                maintenanceMode
              />
            </main>
          ) : (
            <TooltipProvider delayDuration={100}>
              <Header />
              <UserSigninPortalHolder>
                <UserSigninPortal />
              </UserSigninPortalHolder>
              {children}
              <ThemeSwitchHolder />
              <Toaster duration={1000} />
            </TooltipProvider>
          )}
          <div
            className='mask:linear-gradient(to_top,black_0%,black_50%,transparent_100%) fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-background/40 px-2 pb-1 pt-2 text-[0.7rem] font-semibold text-secondary-foreground/70 backdrop-blur-[5px]'
            style={{
              WebkitBackdropFilter: 'blur(5px)',
              WebkitMask:
                'linear-gradient(to top,black 0%,black 50%,transparent 100%)',
            }}
          >
            {/* beta tag, github link */}
            <div className='flex items-center'>
              <span>Beta ⋅</span>
              <Link href='https://github.com/xmliszt/convo' target='_blank'>
                <span className='flex items-center gap-1'>
                  <GithubLogo /> open source
                </span>
              </Link>
            </div>
            {/* trademark */}
            <div>
              <span>Convo © 2024. All rights reserved.</span>
            </div>
          </div>
        </NextThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
