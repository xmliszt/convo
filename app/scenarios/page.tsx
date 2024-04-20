import { lowerCase } from 'lodash';

import { ScrollArea } from '@/components/ui/scroll-area';

import { CategoryPane } from './category-pane';
import { MobileCategoryDrawer } from './mobile-category-drawer';
import { ScenarioBackground } from './scenario-background';
import { ScenarioBackgroundProvider } from './scenario-background-provider';
import { ScenarioGrid } from './scenario-grid';
import { fetchScenarios } from './services/fetch-scenarios';

// This route is opt out of caching.
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams?: {
    category: string;
  };
};

export default async function Page(props: PageProps) {
  const { scenarios } = await fetchScenarios();
  const categories = [...scenarios]
    .reduce<string[]>((acc, scenario) => {
      scenario.categories.forEach((category) => {
        if (!acc.includes(category)) {
          acc.push(category);
        }
      });
      return acc;
    }, [])
    .sort((a, b) => a.localeCompare(b));

  const filterCategory = props.searchParams?.category;
  let filteredScenarios: typeof scenarios = scenarios;
  if (filterCategory) {
    filteredScenarios = scenarios.filter((scenario) =>
      scenario.categories.includes(lowerCase(filterCategory))
    );
  }

  return (
    <ScenarioBackgroundProvider>
      <main>
        <ScrollArea className='h-full'>
          <div className='relative flex justify-center px-4 py-32'>
            <ScenarioGrid scenarios={filteredScenarios} />
            <div className='invisible fixed left-[calc(50vw+20rem)] top-32 lg:visible'>
              <CategoryPane
                categories={categories}
                selectedCategory={filterCategory}
              />
            </div>
          </div>
        </ScrollArea>
        {/* Mobile category drawer */}
        <MobileCategoryDrawer
          categories={categories}
          selectedCategory={filterCategory}
        />
        <ScenarioBackground />
      </main>
    </ScenarioBackgroundProvider>
  );
}
