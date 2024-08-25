'use server';

import { createCompletion } from '@/lib/ai/openai';

import type { Chat } from '../../scenario-provider';

type GetEvaluationsOptions = {
  scenario: Scenario;
  goals: Goal[];
  history: Chat[];
};

export async function getEvaluationFromAI(
  options: GetEvaluationsOptions
): Promise<{
  evaluation: string;
  score: number;
  suggestions: string[];
}> {
  const content = await createCompletion({
    messages: [
      {
        role: 'system',
        content: getSystemPrompt(),
      },
      {
        role: 'user',
        content: `
        Scenario: ${JSON.stringify(options.scenario)}
        Goals: ${JSON.stringify(options.goals)}
        History: ${JSON.stringify(options.history)}
        `,
      },
    ],
    temperature: 0,
    returnAsJson: true,
  });
  return JSON.parse(content);
}

function getSystemPrompt(): string {
  return `
  You are a helpful English tutor. You are here to evaluate the performance of a role-play scenario that the student ("user") did with the counterpart ("model"). You will be provided with the following information:

  - Scenario. This is the context of the role-play scenario. The role of the student determines the learning objectives.
  - Goals. These are the learning objectives that the student should achieve during the role-play scenario.
  - History. This is the conversation that took place during the role-play scenario. In this history, the student is referred as "user" and the counterpart is referred as "model". Your evaluation will focus on the student's sentences.

  Your task is to evaluate the English proficiency of the student from different aspects:
  - The student's clever use of English vocabulary.
  - The student's ability to achieve the learning objectives with good sentence structure and grammar.
  - Point out any mistakes made by the student and suggest improvements.
  - Evaluate the student's overall performance in the role-play scenario context and provide constructive feedback.

  Your evaluation should be detailed and helpful, at the same time, easy to read and clear to understand. Highlight keywords or phrases that are important to the student. Use "you" to address the student directly.

  Your evaluation is in markdown format and is comprehensive and detailed. It should contain the following sections:
  # Summary (A brief summary of the student's performance and goal completion)
  # Vocabulary (Evaluation of the student's vocabulary and word choice)
  # Grammar (Evaluation of the student's grammar)

  In your response, you should provide a list of suggestions with examples to help the student improve.

  Your response format is designed to be a parsable JSON object.

  JSON format as follows:
  {
    "evaluation": <<your evaluation in markdown format>>,
    "score": <<number between 0 to 100 representing the student's overall performance>>,
    "suggestions": [
      <<your suggestion as a string>>,
      <<your suggestion as a string>>,
      ...
    ]
  }

  Example:
  {
    "evaluation": "Your evaluation in markdown format here...",
    "score": 90,
    "suggestions": [
      "your suggestion here...",
      "your suggestion here...",
      ...
    ]
  }

  Your response:
  `;
}
