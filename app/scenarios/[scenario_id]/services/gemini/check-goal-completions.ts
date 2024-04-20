'use server';

import {
  Content,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { getGeminiModel } from '@/lib/ai/gemini';

import { Chat } from '../../scenario-provider';

type CheckGoalCompletionsOptions = {
  goals: Goal[];
  completedGoalIds: string[];
  history: Chat[];
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

  // Remove the first two messages from history as it starts with system prompting.
  const history = options.history.slice(2);
  const systemPrompt = getSystemPrompt(
    options.scenario,
    history,
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

  const responseText = cleanupJSONString(result.response.text());
  const completedGoals = JSON.parse(responseText).response;
  if (!Array.isArray(completedGoals)) {
    throw new Error('Invalid response from the AI model');
  }
  if (!completedGoals.every((goal) => goal.id && typeof goal.id === 'string')) {
    throw new Error('Invalid response from the AI model');
  }
  if (!completedGoals.every((goal) => typeof goal.completed === 'boolean')) {
    throw new Error('Invalid response from the AI model');
  }
  return [
    ...options.completedGoalIds,
    ...completedGoals.filter((goal) => goal.completed).map((goal) => goal.id),
  ];
}

function getSystemPrompt(
  scenario: Scenario,
  history: Chat[],
  goals: Goal[]
): Content[] {
  return [
    {
      role: 'user',
      parts: [
        {
          text: `You are a linguistic expert who is participating in a simulated conversation to evaluate goal completion status of the situational chat. In the role-play scenario, the "model" -- the LLM will play a role, and the "user" will play another role. The "model" is there to help the "user" practice, by role-playing the counterparty in the given scenario. You will look at the history of conversation, and determine if the given goals have been achieved by the conversation. Your evaluation will be striclty based on the context of the scenario that the conversation is taking place in. You are also given a list of goals that the "user" should try to achieve in the conversation. Use your linguistic expertise and contextual understanding to evaluate whether the given conversation history has achieved the goals. You should pick the goals which are completed in the conversation and return them in an array. If no goals are met, return an empty array.`,
        },
        {
          text: `Here are the data structures you will be working with, in JSON format. You will be familiar with these data structures and extract the necessary information from them.

        For the scenario, the data structure is as follows:
        {
            description: "The description of the scenario",
            id: "The ID of the scenario",
            image_url: "The URL of the scenario image",
            llm_id: "The ID of the LLM model",
            name: "The name of the scenario",
            player_role: "The role of the user in the scenario"
        }
        
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
          text: 'OK! I will evaluate the conversation history and return goals that have been completed. Please give me the scenario and the goals first.',
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
          text: `Ok understood. Please give me more details about goal completion criteria.`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: `Sure! To consider a goal as completed, the conversation history should contain the following elements. Conersation history is the only source of truth. The goal is considered completed if:
          1. The goal is mentioned or inferred only in the conversation history provided.
          AND
          2. The goal is achieved in the conversation. For example, if the goal is to ask for a room key, the conversation history should show that the user asked for a room key, and the user has eventually received the room key from the counterparty with evidence in the conversation history.
          `,
        },
        {
          text: `Here are some correct examples: 

          Goal: Purchase toilet paper
          Reasoning: The user mentioned that they need to buy toilet paper and asked the counterparty where they can buy it. The counterparty provided the user with the location of the nearest store where they can buy toilet paper. The user eventually obtained the toilet paper as signs showing the user purchased the toilet paper from the cashier. The goal is considered completed.

          Goal: Ask for directions
          Reasoning: The user asked the counterparty for directions to the nearest bus stop. The counterparty provided the user with directions to the nearest bus stop. The user followed the directions and reached the bus stop. The goal is considered completed.
          `,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Thank you for the examples. I will now analyze the conversation history and the goals to determine the completed goals. Please send me the conversation history following this message:`,
        },
      ],
    },
    ...history.map((message) => ({
      role: message.role,
      parts: [
        {
          text: message.message,
        },
      ],
    })),
    // Last user message to indicate the end of the conversation history and prompt the model to evaluate the goals.
    {
      role: 'user',
      parts: [
        {
          text: `This marks the end of the conversation history. Please evaluate the conversation history against the goals. Return the goals in parsable JSON format, with your reasoning, and citing the source from the conversation. You only speak in parsable JSON. If the conversation history is empty, return an empty array. The goals are considered completed only if they are achieved from the conversation history provided.
          
          Example of parsable JSON: "{"response":[{"id":"xxx","reasoning":"xxx","source":"xxx"}]}"
          `,
        },
        {
          text: `
          Example response: 
          {
            "response": [{
              "id": "1233ff6d-0123-1234-1234-c8ae1234542",
              "reasoning": "The user asked for directions to the nearest bus stop. The counterparty provided the user with directions to the nearest bus stop. The user followed the directions and reached the bus stop. The goal is considered achieved.",
              "source": "User: Where is the nearest bus stop? Model: The nearest bus stop is 5 minutes away. User: Thank you for the directions. Model: You're welcome. User: I reached the bus stop."
              "completed": true
            }]
          }
          
          Your response:
          {
            "response": 
          }
          `,
        },
      ],
    },
  ];
}

function cleanupJSONString(jsonString: string): string {
  return jsonString
    .replace(/\`\`\`/g, '')
    .replace(/json/g, '')
    .trim();
}
