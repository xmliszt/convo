'use server';

import {
  Content,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

type CheckGoalCompletionsOptions = {
  goals: Goal[];
  completedGoalIds: string[];
  history: Content[];
  scenario: Scenario;
};

/**
 * Check if goals are completed based on the scenario and chat history. Returns the ids of the completed goals.
 */
export async function checkGoalCompletions(
  options: CheckGoalCompletionsOptions
): Promise<string[]> {
  const geminiModel = getGeminiModel({ modelName: 'gemini-pro' });
  const uncompletedGoals = options.goals.filter(
    (goal) => !options.completedGoalIds.includes(goal.id)
  );
  const systemPrompt = getSystemPrompt(
    options.scenario,
    options.history,
    uncompletedGoals
  );
  const result = await geminiModel.generateContent({
    contents: systemPrompt,
    generationConfig: {
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
    ],
  });

  const responseText = result.response.text();
  console.log('Completed goal ids: ', responseText);
  const completedGoalIds = JSON.parse(responseText);
  if (!Array.isArray(completedGoalIds)) {
    throw new Error('Invalid response from the AI model');
  }
  if (!completedGoalIds.every((id) => typeof id === 'string')) {
    throw new Error('Invalid response from the AI model');
  }
  return [...options.completedGoalIds, ...completedGoalIds];
}

function getSystemPrompt(
  scenario: Scenario,
  history: Content[],
  goals: Goal[]
): Content[] {
  return [
    {
      role: 'user',
      parts: [
        {
          text: `You only speak in JSON. You are a linguistic expert who is participating in a simulated conversation to evaluate the performance of the situational chat. In the role-play scenario, the "model" -- the LLM will play a role, and the "user" will play another role. The "user" is the one learning English and practicing conversation. The "model" is there to help the "user" practice, by role-playing the counterparty in the given scenario. Your evaluation should focus on the quality of the conversation from the "user". You will point out any common mistakes, sentence structres, word choices that the "user" makesk. You will give suggestions on how to correct them. Your evaluation will be based on the context of the scenario that the conversation is taking place in. You are also given a list of goals that the "user" should try to achieve in the conversation. Use your linguistic expertise and contextual understanding to evaluate whether the given conversation history has met the goals. Each goal has an ID. You should pick the goals which are met in the conversation and return their IDs in a 1D JSON array like so: ["goal_id_1", "goal_id_2"]. If no goals are met, return an empty array.`,
        },
        {
          text: `Here are the data structures you will be working with, in JSON format. You will be familiar with these data structures and extract the necessary information from them.
        
        For the conversation history, the data structure is as follows:
        [
          {
            "role": "user" | "model",
            "parts": [
              {
                "text": "The message content"
              }
            ]
          }
        ]

        For the goals, the data structure is as follows:
        [
          {
            "id": "goal_id",
            "short_description": "The description of the goal",
            "long_description": "The detailed description of the goal"
          }
        ]
        `,
        },
        {
          text: `Please evaluate the conversation history and return the IDs of the goals that are met in JSON array format as instructed above.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: 'OK! I will evaluate the conversation history and return the IDs of the goals that are met. Let me start by analyzing the conversation history and the goals.',
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `The scenario is: ${scenario.name}. The goals are: ${JSON.stringify(goals)}.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Ok understood. Please provide me with the conversation history and I will evaluate it against the goals.`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `The conversation history is as follows, from this message onwards, the content will be treated as the conversation history:`,
        },
      ],
    },
    // We omit the first message from history as this is the initial LLM prompt from user.
    ...history.slice(1),
    // Last user message to indicate the end of the conversation history and prompt the model to evaluate the goals.
    {
      role: 'user',
      parts: [
        {
          text: `This marks the end of the conversation history. Please evaluate the conversation history against the goals. Return the IDs of the goals that are met in JSON array format like so: ["goal_id_1", "goal_id_2"]. You only speak in JSON array.
          
          Example output: ["1233ff6d-0123-1234-1234-c8ae1234542"]

          Your output:
          `,
        },
      ],
    },
  ];
}
