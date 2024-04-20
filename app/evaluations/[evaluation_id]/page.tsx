import Markdown from 'react-markdown';

import { ScenarioProvider } from '@/app/scenarios/[scenario_id]/scenario-provider';
import { LabelWithPaddedDigits } from '@/components/label-with-padded-digits';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CopyLink } from './copy-link';
import { CopyLinkIcon } from './copy-link-icon';
import { ScenarioBackgroundLoader } from './scenario-background-loader';
import { getEvaluation } from './services/get-evaluation';

type PageProps = {
  params: {
    evaluation_id: string;
  };
};

export default async function Page(props: PageProps) {
  const { evaluation: scenarioEvaluation } = await getEvaluation(
    props.params.evaluation_id
  );
  const scenario = scenarioEvaluation.conversation.scenario;
  const conversation = scenarioEvaluation.conversation;
  const bonusScore = conversation.bonus_score;
  const evaluationScore = scenarioEvaluation.ai_score;
  const turnsUsed = conversation.conversation_dialogs
    .slice(1)
    .filter((dialog) => dialog.role === 'user').length;

  return (
    <ScenarioProvider
      goals={scenario.goals.map((goal) => ({
        ...goal,
        completed: false,
      }))}
      llmRole={scenario.llm_role}
      scenario={scenario}
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
      <div className='h-full w-full'>
        <ScrollArea className='h-screen w-full px-4'>
          <div className='mx-auto w-full max-w-lg py-20'>
            <article className='w-full'>
              <h1 className='relative my-4 text-center text-6xl font-bold'>
                {scenario.name}
                <div className='absolute right-0 top-0 flex size-12 -translate-y-4 translate-x-1 items-center justify-center'>
                  <CopyLinkIcon />
                </div>
              </h1>
              <p className='my-2 text-justify text-base font-normal [text-align-last:center]'>
                {scenario.description}
              </p>
              <div className='mx-auto my-4 flex w-full max-w-[300px] flex-col gap-y-4'>
                <LabelWithPaddedDigits
                  label='Turns used:'
                  value={turnsUsed}
                  padding={3}
                />
                <LabelWithPaddedDigits
                  label='Bonus earned:'
                  value={bonusScore}
                  padding={3}
                />
                <LabelWithPaddedDigits
                  label='AI Evaluation score:'
                  value={evaluationScore}
                  padding={3}
                />
                <LabelWithPaddedDigits
                  label='Total score:'
                  value={evaluationScore + bonusScore}
                  padding={3}
                  highlight
                />
              </div>
              <Markdown className='prose prose-neutral mt-10 rounded-md border border-card bg-card/60 p-8 pb-12 shadow-2xl dark:prose-invert'>
                {scenarioEvaluation.ai_evaluation}
              </Markdown>
            </article>
            <div className='my-12 grid place-items-center'>
              <CopyLink />
            </div>
          </div>
        </ScrollArea>
      </div>
      <ScenarioBackgroundLoader scenario={scenario} />
    </ScenarioProvider>
  );
}
