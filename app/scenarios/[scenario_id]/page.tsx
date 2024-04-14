import type { Metadata } from 'next';

import { ScenarioBackground } from '../scenario-background';
import { ScenarioBackgroundProvider } from '../scenario-background-provider';
import { Chat } from './chat';
import { GoalPane } from './goal-pane';
import { ScenarioGoalLoader } from './scenario-goal-loader';
import { ScenarioGoalProvider } from './scenario-goal-provider';
import { ScenarioPane } from './scenario-pane';
import { fetchGoals } from './services/fetch-goals';
import { fetchLlmRole } from './services/fetch-llm-role';
import { fetchScenario } from './services/fetch-scenario';
import { fetchTargetWords } from './services/fetch-target-words';
import { getInitialHistory } from './services/get-initial-llm-message';
import { TargetWordsPane } from './target-words-pane';

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

type PageProps = {
  params: {
    scenario_id: string;
  };
};

export default async function Page(props: PageProps) {
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
  )
    .map((content) => ({
      role: content.role,
      message: content.parts[0].text,
    }))
    .filter<{
      role: 'user' | 'model';
      message: string;
    }>((content): content is { role: 'user' | 'model'; message: string } => {
      return content.role === 'user' || content.role === 'model';
    });

  return (
    <ScenarioBackgroundProvider>
      <ScenarioGoalProvider>
        {/* Load scenario, goal, targetWords into the provider context */}
        <ScenarioGoalLoader
          scenario={scenario}
          goals={goals}
          targetWords={targetWords.words}
          initialHistory={initialHistory}
        />
        <main className='relative flex h-full w-full flex-col items-center gap-y-4'>
          <div className='absolute left-[calc(50vw-34rem)] top-[80px] z-20 hidden max-w-[16rem] flex-col items-center gap-y-4 pb-[60px] lg:flex'>
            <GoalPane />
            <TargetWordsPane />
          </div>
          <Chat llmRole={llmRole} />
          <div className='absolute left-[calc(50vw+18rem)] top-[80px] z-20 hidden max-w-[14rem] flex-col items-center gap-y-4 pb-[60px] lg:flex'>
            <ScenarioPane />
          </div>
          <ScenarioBackground />
        </main>
      </ScenarioGoalProvider>
    </ScenarioBackgroundProvider>
  );
}
