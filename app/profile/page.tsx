import { groupBy } from 'lodash';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ScenarioBackground } from '../scenarios/scenario-background';
import { ScenarioBackgroundProvider } from '../scenarios/scenario-background-provider';
import { GoogleOAuthButton } from '../signin/google-oauth-button';
import { ConversationsCard } from './conversations-card';
import { DangerZone } from './danger-zone';
import { EvaluationsCard } from './evaluations-card';
import { fetchUserConversations } from './services/fetch-user-conversations';
import { Signout } from './signout';

export default async function Page() {
  const { user } = await fetchUserConversations();
  const conversations = user.conversations;
  const conversationsOrderedByLatestDate = [...conversations].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  // Group conversations by scenario
  const groupedConversations = groupBy(
    conversationsOrderedByLatestDate,
    (conversation) => conversation.scenario.id
  );
  const scenarioIds = Object.keys(groupedConversations);

  // Group evaluations by scenario
  const allEvaluations = conversationsOrderedByLatestDate
    .map((conversation) => conversation.evaluation)
    .filter<NonNullable<Evaluation>>((evaluation) => evaluation !== null);
  const groupedEvaluations = groupBy(
    allEvaluations,
    (evaluation) =>
      conversations.find(
        (conversation) => conversation.id === evaluation.conversation_id
      )?.scenario_id
  );

  const haveAnyEvaluations = allEvaluations.length > 0;
  const haveAnyCnoversations = conversationsOrderedByLatestDate.length > 0;

  return (
    <ScenarioBackgroundProvider>
      <main>
        <ScrollArea className='h-screen w-full'>
          <div className='mx-auto flex h-full w-full max-w-lg flex-col gap-y-8 px-4 py-20'>
            <h1 className='my-4 text-center text-6xl font-bold'>Profile</h1>
            {/* Anonymous user link identity*/}
            {user.is_anonymous && <GoogleOAuthButton />}

            {/* Conversations card */}
            {haveAnyCnoversations && (
              <ConversationsCard
                groupedConversations={groupedConversations}
                scenarioIds={scenarioIds}
              />
            )}

            {/* Evaluations card */}
            {haveAnyEvaluations && (
              <EvaluationsCard
                groupedConversations={groupedConversations}
                groupedEvaluations={groupedEvaluations}
                scenarioIds={scenarioIds}
              />
            )}

            {/* No conversation or evaluation */}
            {!haveAnyCnoversations && !haveAnyEvaluations && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-3xl font-bold'>
                    Your conversations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col justify-start gap-y-2'>
                    <p>
                      You have no conversations or evaluations yet. You can head
                      down to the scenarios page and choose one to start!
                    </p>
                    <Link href='/scenarios'>
                      <Button>Bring me there</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Danger zone */}
            <DangerZone userId={user.id} />

            {/* Logout */}
            <Signout isAnonymous={user.is_anonymous} />
          </div>
        </ScrollArea>
        <ScenarioBackground />
      </main>
    </ScenarioBackgroundProvider>
  );
}
