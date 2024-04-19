import 'server-only';

import OpenAI from 'openai';

export const OPENAI_GPT_MODEL_NAME = 'gpt-3.5-turbo';

const openai = new OpenAI();

export type OpenAIMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

type CreateCompletionOptions = {
  messages: OpenAIMessage[];
  temperature: number;
  returnAsJson?: boolean;
  maxTokens?: number;
};

export async function createCompletion(options: CreateCompletionOptions) {
  const completion = await openai.chat.completions.create({
    messages: options.messages,
    model: OPENAI_GPT_MODEL_NAME,
    temperature: options.temperature,
    response_format: {
      type: options.returnAsJson ? 'json_object' : 'text',
    },
    max_tokens: options.maxTokens ?? 2000,
  });
  const content = completion.choices.at(0)?.message.content;
  if (!content) {
    throw new Error('Failed to create completion: no content');
  }
  return content;
}
