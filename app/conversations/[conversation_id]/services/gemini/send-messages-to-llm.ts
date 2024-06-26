'use server';

import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

import { Chat } from '../../scenario-provider';

/**
 * Send messages to the LLM, messages include history. This returns the new history.
 */
export async function sendMessagesToLlm(
  history: Chat[],
  newUserMessage: string
): Promise<Chat> {
  const geminiModel = getGeminiModel({ modelName: 'gemini-pro' });

  const chat = geminiModel.startChat({
    history: history.map((message) => ({
      role: message.role,
      parts: [{ text: message.message }],
    })),
    generationConfig: {
      temperature: 0.2,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const result = await chat.sendMessage(newUserMessage);
  const response = result.response;
  const text = response.text();

  // Return the new history
  return {
    role: 'model',
    message: text,
    createdAt: new Date().toISOString(),
  };
}
