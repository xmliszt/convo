import 'server-only';

import { createCompletion, OpenAIMessage } from '@/lib/ai/openai';

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
  const systemPrompt: OpenAIMessage = {
    role: 'system',
    content: systemPromptString,
  };
  const content = await createCompletion({
    messages: [systemPrompt],
    temperature: 0.5,
    maxTokens: 100,
  });
  return [
    {
      role: 'user',
      message: systemPromptString,
    },
    {
      role: 'model',
      message: content,
    },
  ];
}
