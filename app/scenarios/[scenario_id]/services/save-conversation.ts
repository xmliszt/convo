'use server';

import { createServerServiceRoleClient } from '@/lib/supabase/server';

import { Chat } from '../scenario-provider';

type SaveConversationOptions = {
  scenarioId: string;
  conversation: Chat[];
  bonusScore: number;
};

export async function saveConversation(options: SaveConversationOptions) {
  const supabase = createServerServiceRoleClient();
  const insertNewConversationResponse = await supabase
    .from('conversations')
    .insert({
      scenario_id: options.scenarioId,
      bonus_score: options.bonusScore,
    })
    .select()
    .single();
  if (insertNewConversationResponse.error)
    throw insertNewConversationResponse.error;
  const conversationId = insertNewConversationResponse.data.id;
  const insertDialogsResponse = await supabase
    .from('conversation_dialogs')
    .insert(
      options.conversation.map((chat) => ({
        conversation_id: conversationId,
        role: chat.role,
        message: chat.message,
        timestamp: chat.createdAt,
      }))
    );
  if (insertDialogsResponse.error) throw insertDialogsResponse.error;
  return {
    conversation: insertNewConversationResponse.data,
  };
}
