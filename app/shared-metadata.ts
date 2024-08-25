import type { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

export const openGraph: OpenGraph = {
  title: 'Convo | Boundless Conversation Practice with AI',
  description:
    'Convo is an innovative edtech web app designed to enhance language learning through immersive, situational conversations. Choose from a variety of scenarios covering diverse topics and interact with an AI role-playing partner. Practice speaking freely, set conversation goals, and target specific vocabulary, all while receiving personalized feedback on your linguistic performance. Start your journey to fluent communication today with Convo.',
  url: '/',
  siteName: 'Convo | Boundless Conversation Practice with AI',
  locale: 'en_US',
  type: 'website',
  images: [
    {
      url: '/og/title-dark.jpg',
      width: 756,
      height: 491,
      alt: 'Convo | Boundless Conversation Practice with AI',
    },
  ],
};
