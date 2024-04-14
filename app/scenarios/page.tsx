import { ScrollArea } from '@/components/ui/scroll-area';

import { ScenarioBackground } from './scenario-background';
import { ScenarioBackgroundProvider } from './scenario-background-provider';
import { ScenarioGrid } from './scenario-grid';
import { fetchScenarios } from './services/fetch-scenarios';

export default async function Page() {
  // Fetch scenarios form db.
  const { scenarios } = await fetchScenarios();

  return (
    <ScenarioBackgroundProvider>
      <main>
        <ScrollArea className='h-full'>
          <div className='flex justify-center px-4 py-32'>
            <ScenarioGrid scenarios={scenarios} />
          </div>
        </ScrollArea>
        <ScenarioBackground />
      </main>
    </ScenarioBackgroundProvider>
  );
}
