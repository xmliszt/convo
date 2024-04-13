import 'server-only';

import { Content } from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

import { getInitialLlmPrompt } from '../utils/get-initial-llm-prompt';

type GetInitialHistoryOptions = {
  llmRole: LlmRole;
  scenario: Scenario;
};

export async function getInitialHistory(
  options: GetInitialHistoryOptions
): Promise<Content[]> {
  const userPrompt = getInitialLlmPrompt({
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
            text: userPrompt,
          },
        ],
      },
    ],
  });
  const message = result.response.text();
  return [
    {
      role: 'user',
      parts: [{ text: userPrompt }],
    },
    {
      role: 'model',
      parts: [{ text: message }],
    },
  ];
}
