import type { Metadata } from 'next';

import { Chat } from './chat';
import { fetchGoals } from './services/fetch-goals';
import { fetchLlmRole } from './services/fetch-llm-role';
import { fetchScenario } from './services/fetch-scenario';
import { fetchTargetWords } from './services/fetch-target-words';
import { getInitialHistory } from './services/get-initial-llm-message';

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
    <main className='relative flex h-full w-full flex-col items-center gap-y-4'>
      <Chat
        scenario={scenario}
        llmRole={llmRole}
        goals={goals}
        targetWords={targetWords.words}
        initialHistory={initialHistory}
      />
    </main>
  );
}
