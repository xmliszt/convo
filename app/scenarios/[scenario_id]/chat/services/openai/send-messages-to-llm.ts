'use server';

import { createCompletion, OpenAIMessage } from '@/lib/ai/openai';

import { Chat } from '../../../scenario-goal-provider';

/**
 * Send messages to the LLM, messages include history. This returns the new history.
 */
export async function sendMessagesToLlm(
  history: Chat[],
  newUserMessage: string
): Promise<Chat> {
  const cleanupHistory: OpenAIMessage[] = history
    // Filters out error messages
    .filter((message) => message.role !== 'error')
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'assistant',
      content: message.message,
    }));
  const content = await createCompletion({
    messages: [...cleanupHistory, { role: 'user', content: newUserMessage }],
    temperature: 0.5,
    maxTokens: 100,
  });
  // Return the new history
  return {
    role: 'model',
    message: content,
  };
}
