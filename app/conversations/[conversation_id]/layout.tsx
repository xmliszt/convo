import type { Metadata } from 'next';

import { fetchConversation } from './services/fetch-conversation';

export async function generateMetadata({
  params,
}: {
  params: { conversation_id: string };
}): Promise<Metadata> {
  const { conversation } = await fetchConversation({
    conversationId: params.conversation_id,
  });
  const scenario = conversation?.scenario;
  if (!scenario)
    return {
      title: 'Convo | Conversation',
    };
  return {
    title: `Convo | ${scenario.name}`,
    openGraph: {
      images: [scenario.image_url],
    },
  };
}

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
  return <>{props.children}</>;
}
