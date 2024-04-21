import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ScenarioBackground } from '../../scenarios/scenario-background';
import { ScenarioBackgroundProvider } from '../../scenarios/scenario-background-provider';
import { ScenarioProvider } from './scenario-provider';
import { fetchConversation } from './services/fetch-conversation';
import { fetchGoals } from './services/fetch-goals';
import { fetchLlmRole } from './services/fetch-llm-role';
import { fetchTargetWords } from './services/fetch-target-words';
import { getInitialHistory } from './services/openai/get-initial-history';

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
  params: {
    conversation_id: string;
  };
  children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
  const { conversation } = await fetchConversation({
    conversationId: props.params.conversation_id,
  });
  if (!conversation) {
    return redirect('/scenarios');
  }
  const scenario = conversation.scenario;
  const [{ llmRole }, { goals }, { targetWords }] = await Promise.all([
    fetchLlmRole({ llmId: scenario.llm_id }),
    fetchGoals({ scenarioId: scenario.id }),
    fetchTargetWords({ scenarioId: scenario.id }),
  ]);

  const initialHistory = await getInitialHistory({
    llmRole,
    scenario,
  });

  return (
    <ScenarioBackgroundProvider>
      <ScenarioProvider
        goals={goals.map((goal) => ({ ...goal, completed: false }))}
        llmRole={llmRole}
        scenario={scenario}
        targetWords={targetWords.words.map((word) => ({
          word,
          completed: false,
        }))}
        history={initialHistory}
      >
        <main className='relative'>
          {props.children}
          <ScenarioBackground />
        </main>
      </ScenarioProvider>
    </ScenarioBackgroundProvider>
  );
}
