import { BonusScorePane } from '@/app/scenarios/[scenario_id]/bonus-score-pane';
import { Chat } from '@/app/scenarios/[scenario_id]/chat';
import { GoalPane } from '@/app/scenarios/[scenario_id]/goal-pane';
import { ScenarioPane } from '@/app/scenarios/[scenario_id]/scenario-pane';
import { ScenarioProvider } from '@/app/scenarios/[scenario_id]/scenario-provider';
import { TargetWordsPane } from '@/app/scenarios/[scenario_id]/target-words-pane';
import { TurnsLeftPane } from '@/app/scenarios/[scenario_id]/turns-left-pane';

import { fetchConversation } from './services/fetch-conversation';

type PageProps = {
  params: {
    conversation_id: string;
  };
};

export default async function Page(props: PageProps) {
  const { conversation } = await fetchConversation({
    conversationId: props.params.conversation_id,
  });

  const scenario = conversation.scenario;

  return (
    <ScenarioProvider
      llmRole={scenario.llm_role}
      scenario={scenario}
      goals={scenario.goals.map((goal) => ({ ...goal, completed: false }))}
      targetWords={
        scenario.target_words?.words.map((word) => ({
          word,
          completed: false,
        })) ?? []
      }
      history={
        conversation.conversation_dialogs
          ?.filter<{
            conversation_id: string;
            role: 'user' | 'model';
            message: string;
            timestamp: string;
          }>(
            (
              dialog
            ): dialog is {
              conversation_id: string;
              role: 'user' | 'model';
              message: string;
              timestamp: string;
            } => dialog.role !== 'error' && dialog.message !== null
          )
          .map((dialog) => ({
            role: dialog.role,
            message: dialog.message,
            createdAt: new Date(dialog.timestamp).toISOString(),
          })) ?? []
      }
    >
      <main className='relative'>
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
      </main>
    </ScenarioProvider>
  );
}
