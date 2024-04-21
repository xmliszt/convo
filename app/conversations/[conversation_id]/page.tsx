import { BonusScorePane } from './bonus-score-pane';
import { Chat } from './chat';
import { GoalPane } from './goal-pane';
import { ScenarioPane } from './scenario-pane';
import { TargetWordsPane } from './target-words-pane';
import { TurnsLeftPane } from './turns-left-pane';

export default function Page() {
  return (
    <>
      <div className='invisible absolute left-[calc(50vw-36rem)] top-0 z-20 max-w-[20rem] lg:visible'>
        <div className='h-screen w-full overflow-y-auto px-10 scrollbar-hide'>
          <div className='flex flex-col gap-y-4 pb-32 pt-20'>
            <GoalPane />
            <TargetWordsPane />
          </div>
        </div>
      </div>
      <Chat />
      <div className='invisible absolute left-[calc(50vw+16rem)] top-0 z-20 max-w-[20rem] lg:visible'>
        <div className='h-screen w-full overflow-y-auto px-10 scrollbar-hide'>
          <div className='flex flex-col gap-y-4 pb-32 pt-20'>
            <ScenarioPane />
            <BonusScorePane />
            <TurnsLeftPane />
          </div>
        </div>
      </div>
    </>
  );
}
