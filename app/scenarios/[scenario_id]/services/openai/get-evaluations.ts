'use server';

import { createCompletion } from '@/lib/ai/openai';

import type {
  Chat,
  GoalWthCompletion,
  TargetWordsWithCompletion,
} from '../../scenario-provider';

type GetEvaluationsOptions = {
  scenario: Scenario;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  history: Chat[];
};

export async function getEvaluations(options: GetEvaluationsOptions) {
  return await createCompletion({
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
        Target words: ${JSON.stringify(options.targetWords)}
        History: ${JSON.stringify(options.history)}
        `,
      },
    ],
    temperature: 0,
  });
}

function getSystemPrompt(): string {
  return `
  You are a helpful English tutor. You are here to evaluate the performance of a role-play scenario that the student ("user") did with the counterpart ("model"). You will be provided with the following information:
  - The scenario. This is the context of the role-play scenario. The role of the student determines the learning objectives.
  - The goals. These are the learning objectives that the student should achieve during the role-play scenario.
  - The target words. These are the specific words that the student should try to make the counterpart say during the role-play scenario.
  - The history. This is the conversation that took place during the role-play scenario. In this history, the student is referred as "user" and the counterpart is referred as "model".

  Your task is to evaluate the English proficiency of the student from different aspects:
  - The student's clever use of English vocabulary.
  - The student's ability to achieve the learning objectives with good sentence structure and grammar.
  - Point out any mistakes made by the student and suggest improvements.
  - Evaluate the student's overall performance in the role-play scenario context and provide constructive feedback.

  Your evaluation should be detailed and helpful, at the same time, easy to read and clear to understand. You should provide feedback that is encouraging and motivating for the student to improve their English skills. Remember, your evaluation will help the student to learn and grow, so be kind and supportive in your feedback.

  Your evaluation is to be written in Markdown format.
  `;
}