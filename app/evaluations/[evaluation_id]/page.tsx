import Markdown from 'react-markdown';

import { ScenarioProvider } from '@/app/scenarios/[scenario_id]/scenario-provider';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  return (
    <ScenarioProvider
      goals={scenarioEvaluation.scenario.goals.map((goal) => ({
        ...goal,
        completed: false,
      }))}
      llmRole={scenarioEvaluation.scenario.llm_role}
      scenario={scenarioEvaluation.scenario}
      targetWords={
        scenarioEvaluation.scenario.target_words?.words.map((word) => ({
          word,
          completed: false,
        })) ?? []
      }
      history={
        scenarioEvaluation.scenario.conversations?.conversation_dialogs
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
        <ScrollArea className='h-screen w-full'>
          <div className='mx-auto w-full max-w-lg px-4 py-20'>
            <article>
              <h1 className='my-4 text-center text-2xl font-bold'>
                {scenarioEvaluation.scenario.name}
              </h1>
              <p className='my-2 text-justify text-base font-normal [text-align-last:center]'>
                {scenarioEvaluation.scenario.description}
              </p>
              <div></div>
              <Markdown className='prose prose-neutral dark:prose-invert'>
                {scenarioEvaluation.ai_evaluation}
              </Markdown>
            </article>
          </div>
        </ScrollArea>
      </div>
      <ScenarioBackgroundLoader scenario={scenarioEvaluation.scenario} />
    </ScenarioProvider>
  );
}
