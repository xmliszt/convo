'use server';

import { redirect } from 'next/navigation';

import { createServerAnonClient } from '@/lib/supabase/server';

import { Chat } from '../scenario-provider';

type SaveConversationDialogOptions = {
  conversationId: string;
  chat: Chat;
};

export async function saveConversationDialog(
  options: SaveConversationDialogOptions
) {
  const supabase = createServerAnonClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect('/signin');
  }
  const insertDialogsResponse = await supabase
    .from('conversation_dialogs')
    .insert({
      conversation_id: options.conversationId,
      role: options.chat.role,
      message: options.chat.message,
      timestamp: options.chat.createdAt,
      created_by: data.user.id,
    });
  if (insertDialogsResponse.error) throw insertDialogsResponse.error;
  return {
    conversationDialog: insertDialogsResponse.data,
  };
}
