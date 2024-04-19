import 'server-only';

import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

import { Chat } from '../../../scenario-goal-provider';
import { getInitialLlmPrompt } from '../../utils/get-initial-llm-prompt';

type GetInitialHistoryOptions = {
  llmRole: LlmRole;
  scenario: Scenario;
};

export async function getInitialHistory(
  options: GetInitialHistoryOptions
): Promise<Chat[]> {
  const systemPromptString = getInitialLlmPrompt({
    llmRole: options.llmRole,
    scenario: options.scenario,
  });
  const geminiModel = getGeminiModel({ modelName: 'gemini-pro' });
  const result = await geminiModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: systemPromptString,
          },
        ],
      },
    ],
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
    generationConfig: {
      temperature: 0,
    },
  });
  const message = result.response.text();
  return [
    {
      role: 'user',
      message: systemPromptString,
    },
    {
      role: 'model',
      message,
    },
  ];
}
