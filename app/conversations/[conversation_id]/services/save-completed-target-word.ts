'use server';

import { ConvoError } from '@/lib/convo-error';
import { createServerServiceRoleClient } from '@/lib/supabase/server';

type SaveCompletedTargetWordOptions = {
  conversationId: string;
  targetWordId: string;
  word: string;
};

export async function saveCompletedTargetWord(
  options: SaveCompletedTargetWordOptions
) {
  const supabase = createServerServiceRoleClient();

  const selectCompletedTargetWordsResponse = await supabase
    .from('conversation_completed_target_words')
    .select()
    .eq('conversation_id', options.conversationId)
    .maybeSingle();
  if (selectCompletedTargetWordsResponse.error) {
    throw new ConvoError(
      `Failed to fetch completed target words for conversation: ${options.conversationId}`,
      JSON.stringify({
        code: selectCompletedTargetWordsResponse.error.code,
        details: selectCompletedTargetWordsResponse.error.details,
        hint: selectCompletedTargetWordsResponse.error.hint,
        message: selectCompletedTargetWordsResponse.error.message,
      })
    );
  }

  if (selectCompletedTargetWordsResponse.data === null) {
    // No existing record, insert new record
    const insertResponse = await supabase
      .from('conversation_completed_target_words')
      .insert({
        conversation_id: options.conversationId,
        target_word_id: options.targetWordId,
        completed_words: [options.word],
      });
    if (insertResponse.error) {
      throw new ConvoError(
        `Failed to save completed target word for conversation: ${options.conversationId}`,
        JSON.stringify({
          code: insertResponse.error.code,
          details: insertResponse.error.details,
          hint: insertResponse.error.hint,
          message: insertResponse.error.message,
        })
      );
    }
  } else {
    // Existing record, update record
    const updateResponse = await supabase
      .from('conversation_completed_target_words')
      .update({
        completed_words: [
          ...(selectCompletedTargetWordsResponse.data.completed_words ?? []),
          options.word,
        ],
      })
      .eq('conversation_id', options.conversationId);
    if (updateResponse.error) {
      throw new ConvoError(
        `Failed to save completed target word for conversation: ${options.conversationId}`,
        JSON.stringify({
          code: updateResponse.error.code,
          details: updateResponse.error.details,
          hint: updateResponse.error.hint,
          message: updateResponse.error.message,
        })
      );
    }
  }
}
