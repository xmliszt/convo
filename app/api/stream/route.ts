import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

import { getGeminiModel } from '@/lib/ai/gemini';

export const runtime = 'edge';

const geminiModel = getGeminiModel({ modelName: 'gemini-pro' });

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: NextRequest) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  const geminiStream = await geminiModel.generateContentStream(
    buildGoogleGenAIPrompt(messages)
  );

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
