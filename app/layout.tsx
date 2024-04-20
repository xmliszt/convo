import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Metadata, Viewport } from 'next';
import { Playfair_Display } from 'next/font/google';

import { ThemeSwitch } from '@/components/theme-switch';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Header } from './header';
import { NextThemeProvider } from './theme-provider';

// Metadata for SEO
export const metadata: Metadata = {
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
  alternates: {
    canonical: 'https://convo.website/',
  },
  category: 'education',
  openGraph: {
    title: 'Convo | Boundless Conversation Practice with AI',
    description:
      'Convo is an innovative edtech web app designed to enhance language learning through immersive, situational conversations. Choose from a variety of scenarios covering diverse topics and interact with an AI role-playing partner. Practice speaking freely, set conversation goals, and target specific vocabulary, all while receiving personalized feedback on your linguistic performance. Start your journey to fluent communication today with Convo.',
    url: 'https://convo.website/',
    siteName: 'Convo | Boundless Conversation Practice with AI',
    images: [
      {
        url: '/og/title-light.jpg',
        width: 800,
        height: 600,
        alt: 'Convo | Boundless Conversation Practice with AI',
      },
      {
        url: '/og/title-dark.jpg',
        width: 800,
        height: 600,
        alt: 'Convo | Boundless Conversation Practice with AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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
        url: '/og/title-light.jpg',
        width: 800,
        height: 600,
        alt: 'Convo | Boundless Conversation Practice with AI',
      },
      {
        url: '/og/title-dark.jpg',
        width: 800,
        height: 600,
        alt: 'Convo | Boundless Conversation Practice with AI',
      },
    ],
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

const font = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={font.className}>
      <body>
        <NextThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <TooltipProvider delayDuration={100}>
            <Header />
            {children}
            <div className='fixed right-4 top-4 z-40'>
              <ThemeSwitch />
            </div>
            {/* trademark */}
            <div className='fixed bottom-1 right-2 z-50 text-[0.6rem] font-semibold text-secondary-foreground/70'>
              <span>Convo © 2024. All rights reserved.</span>
            </div>
            {/* beta tag */}
            <div className='fixed bottom-1 left-2 z-50 text-[0.6rem] font-semibold text-secondary-foreground/70'>
              <span>Beta</span>
            </div>
            <Toaster duration={1000} />
          </TooltipProvider>
        </NextThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
