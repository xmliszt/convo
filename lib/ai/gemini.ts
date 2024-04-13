import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';

const googleGenAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

/**
 * Get a generative model from Google's Generative AI API.
 */
export function getGeminiModel({ modelName }: { modelName: string }) {
  return googleGenAI.getGenerativeModel({ model: modelName });
}
