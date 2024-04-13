import { Metadata, Viewport } from 'next';
import './globals.css';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Convo | English Conversation with AI',
  description: 'Practice English by talking in various real-life scenarios!',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Convo',
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
  applicationName: 'Convo',
  keywords: ['convo', 'english', 'conversation', 'ai', 'practice', 'learn'],
  authors: [{ name: 'Li Yuxuan', url: 'https://liyuxuan.dev/' }],
  creator: 'Li Yuxuan',
  alternates: {
    canonical: 'https://convo.website/',
  },
  category: 'education',
  openGraph: {
    title: 'Convo',
    description: 'Practice English by talking in various real-life scenarios!',
    url: 'https://convo.website/',
    siteName: 'Taboo AI',
    images: [
      {
        url: 'https://i.imgur.com/IIP6UzK.jpeg',
        width: 800,
        height: 600,
        alt: 'Convo | English Conversation with AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convo | English Conversation with AI',
    description: 'Practice English by talking in various real-life scenarios!',
    siteId: '1704579643',
    creator: '@xmliszt',
    creatorId: '1704579643',
    images: ['https://i.imgur.com/IIP6UzK.jpeg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
