import { Chat } from './chat';
import { GoalPane } from './goal-pane';
import { ScenarioPane } from './scenario-pane';
import { TargetWordsPane } from './target-words-pane';

export default function Page() {
  return (
    <>
      <div className='invisible absolute left-[calc(50vw-36rem)] z-20 max-w-[20rem] lg:visible'>
        <div className='scrollbar-hide h-screen w-full overflow-y-auto px-10'>
          <div className='flex flex-col gap-y-4 pb-32 pt-20'>
            <GoalPane />
            <TargetWordsPane />
          </div>
        </div>
      </div>
      <Chat />
      <div className='invisible absolute left-[calc(50vw+18rem)] top-[80px] z-20 max-w-[14rem] flex-col items-center gap-y-4 pb-[60px] lg:visible'>
        <ScenarioPane />
      </div>
    </>
  );
}
