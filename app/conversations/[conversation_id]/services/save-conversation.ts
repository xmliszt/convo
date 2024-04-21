'use server';

import { redirect } from 'next/navigation';

import { createServerAnonClient } from '@/lib/supabase/server';

import { Chat } from '../scenario-provider';

type SaveConversationOptions = {
  scenarioId: string;
  conversation: Chat[];
  bonusScore: number;
};

export async function saveConversation(options: SaveConversationOptions) {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect('/signin');
  }
  const insertNewConversationResponse = await supabase
    .from('conversations')
    .insert({
      scenario_id: options.scenarioId,
      bonus_score: options.bonusScore,
      created_by: data.user.id,
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
        created_by: data.user.id,
      }))
    );
  if (insertDialogsResponse.error) throw insertDialogsResponse.error;
  return {
    conversation: insertNewConversationResponse.data,
  };
}
