import { Metadata } from 'next';
import Link from 'next/link';
import Markdown from 'react-markdown';

import { ScenarioProvider } from '@/app/conversations/[conversation_id]/scenario-provider';
import { openGraph } from '@/app/shared-metadata';
import { LabelWithPaddedDigits } from '@/components/label-with-padded-digits';
import { ScrollArea } from '@/components/ui/scroll-area';

import { CopyLink } from './copy-link';
import { ScenarioBackgroundLoader } from './scenario-background-loader';
import { fetchEvaluation } from './services/fetch-evaluation';

export async function generateMetadata(props: {
  params: {
    evaluation_id: string;
  };
}): Promise<Metadata> {
  const { evaluation } = await fetchEvaluation(props.params.evaluation_id);

  return {
    title: 'Convo | Evaluation' + ` - ${evaluation.conversation.scenario.name}`,
    openGraph: {
      ...openGraph,
      url: `/evaluations/${evaluation.id}`,
      title:
        'Convo | Evaluation' + ` - ${evaluation.conversation.scenario.name}`,
    },
    alternates: {
      canonical: `/evaluations/${evaluation.id}`,
    },
  };
}

type PageProps = {
  params: {
    evaluation_id: string;
  };
};

export default async function Page(props: PageProps) {
  const { evaluation: scenarioEvaluation } = await fetchEvaluation(
    props.params.evaluation_id
  );
  const scenario = scenarioEvaluation.conversation.scenario;
  const conversation = scenarioEvaluation.conversation;
  const bonusScore = conversation.bonus_score;
  const evaluationScore = scenarioEvaluation.ai_score;
  const turnsUsed = conversation.conversation_dialogs
    .slice(1)
    .filter((dialog) => dialog.role === 'user').length;

  if (scenario.target_words === null)
    throw new Error(`Scenario ${scenario.id} has no target words`);

  return (
    <ScenarioProvider
      goals={scenario.goals.map((goal) => ({
        ...goal,
        completed: false,
      }))}
      llmRole={scenario.llm_role}
      scenario={scenario}
      targetWords={scenario.target_words}
      history={
        conversation.conversation_dialogs
          ?.filter<{
            conversation_id: string;
            role: 'user' | 'model';
            message: string;
            timestamp: string;
            created_by: string;
          }>(
            (
              dialog
            ): dialog is {
              conversation_id: string;
              role: 'user' | 'model';
              message: string;
              timestamp: string;
              created_by: string;
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
                  label='AI evaluation score:'
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
              {scenarioEvaluation.suggestions.length > 0 && (
                <div>
                  <h2 className='mt-8 text-2xl font-bold'>Suggestions</h2>
                  <div className='mt-4 flex flex-col gap-y-4'>
                    {scenarioEvaluation.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className='rounded-md border-card bg-card/60 p-4 text-card-foreground shadow-md'
                      >
                        <span className='mr-2 inline-flex size-6 items-center justify-center rounded-full bg-card/80 p-1 font-sans text-sm shadow-inner'>
                          {index + 1}
                        </span>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
            <div className='my-12 grid place-items-center'>
              <CopyLink />
            </div>
            <div className='text-center text-xs italic'>
              Results generated by{' '}
              <Link
                href='https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/'
                target='_blank'
                className='underline'
              >
                gpt-4o-mini
              </Link>{' '}
              might not be accurate. Please interepret with your own judgement.
            </div>
          </div>
        </ScrollArea>
      </div>
      <ScenarioBackgroundLoader scenario={scenario} />
    </ScenarioProvider>
  );
}
