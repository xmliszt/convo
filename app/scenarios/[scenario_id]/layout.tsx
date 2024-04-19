import type { Metadata } from 'next';

import { ScenarioBackground } from '../scenario-background';
import { ScenarioBackgroundProvider } from '../scenario-background-provider';
import { fetchGoals } from './chat/services/fetch-goals';
import { fetchLlmRole } from './chat/services/fetch-llm-role';
import { fetchScenario } from './chat/services/fetch-scenario';
import { fetchTargetWords } from './chat/services/fetch-target-words';
import { getInitialHistory } from './chat/services/openai/get-initial-history';
import { ScenarioProvider } from './scenario-goal-provider';

export async function generateMetadata({
  params,
}: {
  params: { scenario_id: string };
}): Promise<Metadata> {
  const { scenario } = await fetchScenario({ scenarioId: params.scenario_id });
  return {
    title: `Convo | ${scenario.name}`,
    openGraph: {
      images: [scenario.image_url],
    },
  };
}

type LayoutProps = {
  params: {
    scenario_id: string;
  };
  children: React.ReactNode;
};

export default async function Layout(props: LayoutProps) {
  const { scenario } = await fetchScenario({
    scenarioId: props.params.scenario_id,
  });

  const [{ llmRole }, { goals }, { targetWords }] = await Promise.all([
    fetchLlmRole({ llmId: scenario.llm_id }),
    fetchGoals({ scenarioId: scenario.id }),
    fetchTargetWords({ scenarioId: scenario.id }),
  ]);

  const initialHistory = (
    await getInitialHistory({
      llmRole,
      scenario,
    })
  ).filter<{
    role: 'user' | 'model';
    message: string;
  }>((content): content is { role: 'user' | 'model'; message: string } => {
    return content.role === 'user' || content.role === 'model';
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
