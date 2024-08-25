import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { fetchUser } from '@/app/profile/services/fetch-user';
import { ScenarioBackground } from '@/app/scenarios/scenario-background';
import { ScenarioBackgroundProvider } from '@/app/scenarios/scenario-background-provider';
import { openGraph } from '@/app/shared-metadata';

import { BonusScorePane } from './bonus-score-pane';
import { Chat } from './chat';
import { GoalPane } from './goal-pane';
import { ScenarioPane } from './scenario-pane';
import { Chat as ChatType, ScenarioProvider } from './scenario-provider';
import { fetchConversation } from './services/fetch-conversation';
import { getInitialHistory } from './services/openai/get-initial-history';
import { saveConversationDialog } from './services/save-conversation-dialog';
import { TargetWordsPane } from './target-words-pane';
import { TurnsLeftPane } from './turns-left-pane';
import { getInitialLlmPrompt } from './utils/get-initial-llm-prompt';

export async function generateMetadata(props: {
  params: { conversation_id: string };
}): Promise<Metadata> {
  const { conversation } = await fetchConversation({
    conversationId: props.params.conversation_id,
  });

  return {
    title: `Convo | ${conversation.scenario.name}`,
    openGraph: {
      ...openGraph,
      url: `/conversations/${props.params.conversation_id}`,
      title: `Convo | ${conversation.scenario.name}`,
    },
    alternates: {
      canonical: `/conversations/${props.params.conversation_id}`,
    },
  };
}

type PageProps = {
  params: {
    conversation_id: string;
  };
};

export default async function Page(props: PageProps) {
  const { user } = await fetchUser();
  const { conversation } = await fetchConversation({
    conversationId: props.params.conversation_id,
  });
  if (!conversation) return redirect('/scenarios');

  const scenario = conversation.scenario;
  const llmRole = scenario.llm_role;
  const targetWords = scenario.target_words;
  const goals = scenario.goals;

  if (targetWords === null)
    throw new Error(`Scenraio ${conversation.scenario.id} has no target words`);

  const hasConversationDialogHistory =
    conversation.conversation_dialogs.length > 0;

  const history: ChatType[] = [];
  if (!hasConversationDialogHistory) {
    const initialHistory = await getInitialHistory({
      llmRole,
      scenario,
    });

    const firstModelMessage = initialHistory.at(-1);
    if (firstModelMessage) {
      saveConversationDialog({
        conversationId: conversation.id,
        chat: firstModelMessage,
      });
    }

    history.push(...initialHistory);
  } else {
    const initialLlmPrompt = getInitialLlmPrompt({
      llmRole,
      scenario,
    });
    history.push({
      role: 'user',
      message: initialLlmPrompt,
      createdAt: new Date().toISOString(),
    });
    conversation.conversation_dialogs.forEach((dialog) => {
      if (dialog.message) {
        history.push({
          role: dialog.role,
          message: dialog.message,
          createdAt: dialog.timestamp,
        });
      } else {
        history.push({
          role: 'error',
          message: 'Sorry, we could not find the message.',
          createdAt: dialog.timestamp,
        });
      }
    });
  }

  return (
    <ScenarioBackgroundProvider>
      <ScenarioProvider
        goals={goals.map((goal) => ({ ...goal, completed: false }))}
        llmRole={llmRole}
        scenario={scenario}
        targetWords={targetWords}
        history={history}
      >
        <main className='relative'>
          <div className='invisible absolute left-[calc(50vw-36rem)] top-0 z-20 max-w-[20rem] lg:visible'>
            <div className='h-screen w-full overflow-y-auto px-10 scrollbar-hide'>
              <div className='flex flex-col gap-y-4 pb-32 pt-20'>
                <GoalPane conversationId={props.params.conversation_id} />
                <TargetWordsPane
                  conversationId={props.params.conversation_id}
                />
              </div>
            </div>
          </div>
          <Chat
            conversationId={props.params.conversation_id}
            evaluation={conversation.evaluation}
            user={user}
          />
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

        <ScenarioBackground />
      </ScenarioProvider>
    </ScenarioBackgroundProvider>
  );
}
