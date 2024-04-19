import { ScrollArea } from '@/components/ui/scroll-area';

import { Chat } from './chat';
import { GoalPane } from './goal-pane';
import { ScenarioPane } from './scenario-pane';
import { TargetWordsPane } from './target-words-pane';

export default function Page() {
  return (
    <>
      <div className='absolute left-[calc(50vw-34rem)] top-[80px] z-20 hidden max-w-[16rem] lg:flex'>
        <ScrollArea>
          <div className='flex flex-col gap-y-4 pb-[60px]'>
            <GoalPane />
            <TargetWordsPane />
          </div>
        </ScrollArea>
      </div>
      <Chat />
      <div className='absolute left-[calc(50vw+18rem)] top-[80px] z-20 hidden max-w-[14rem] flex-col items-center gap-y-4 pb-[60px] lg:flex'>
        <ScenarioPane />
      </div>
    </>
  );
}
