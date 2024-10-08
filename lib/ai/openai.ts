import OpenAI from 'openai';

export const openai = new OpenAI();

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
    model: 'gpt-4o-mini',
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
