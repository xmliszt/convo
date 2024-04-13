'use server';

import {
  Content,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

/**
 * Send messages to the LLM, messages include history. This returns the new history.
 */
export async function sendMessagesToLlm(
  history: Content[],
  newUserMessage: string
): Promise<Content> {
  const geminiModel = getGeminiModel({ modelName: 'gemini-pro' });

  const chat = geminiModel.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0,
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
      {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
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
    parts: [{ text }],
  };
}
