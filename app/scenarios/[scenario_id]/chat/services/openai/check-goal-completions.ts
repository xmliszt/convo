'use server';

import { createCompletion, OpenAIMessage } from '@/lib/ai/openai';

import { Chat } from '../../../scenario-goal-provider';

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
  const uncompletedGoals = options.goals.filter(
    (goal) => !options.completedGoalIds.includes(goal.id)
  );

  // Remove the first two messages from history as it starts with system prompting.
  const history = options.history.slice(2);
  const initialPrompts = getInitialPrompts(
    options.scenario,
    history,
    uncompletedGoals
  );
  const content = await createCompletion({
    messages: initialPrompts,
    temperature: 0,
    returnAsJson: true,
  });

  const responseText = cleanupJSONString(content);
  console.log('Goals checking response: ', responseText);
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

function getInitialPrompts(
  scenario: Scenario,
  history: Chat[],
  goals: Goal[]
): OpenAIMessage[] {
  return [
    {
      role: 'system',
      content: `
      You are a linguistic expert who is participating in a simulated conversation to evaluate goal completion status of the situational chat. You are designed to output only JSON. In the role-play scenario, the "model" -- the LLM will play a role, and the "user" will play another role. The "model" is there to help the "user" practice, by role-playing the counterparty in the given scenario. You will look at the history of conversation, and determine if the given goals have been achieved by the conversation. Your evaluation will be striclty based on the context of the scenario that the conversation is taking place in. You are also given a list of goals that the "user" should try to achieve in the conversation. Use your linguistic expertise and contextual understanding to evaluate whether the given conversation history has achieved the goals. You should pick the goals which are completed in the conversation and return them.

      Here are the data structures you will be working with, in JSON format. You will be familiar with these data structures and extract the necessary information from them.

      For the scenario, the data structure is as follows:
      {
          description: "The description of the scenario",
          id: "The ID of the scenario",
          image_url: "The URL of the scenario image",
          llm_id: "The ID of the LLM model",
          name: "The name of the scenario",
          player_role: "The role of the user in the scenario"
      }

      For the goals, the data structure is as follows:
      [
        {
          "id": "goal_id",
          "short_description": "The description of the goal",
          "long_description": "The detailed description of the goal"
        }
      ]
      
      For the conversation history, the data structure is as follows:
      [
        {
          "role": "user" | "assistant",
          "message": "The message sent by the user or assistant"
        }
      ]

      To consider a goal as completed, the conversation history should contain the following elements. Conersation history is the only source of truth. The goal is considered completed if:
        1. The goal is mentioned or inferred only in the conversation history provided.
        AND
        2. The goal is achieved in the conversation. For example, if the goal is to ask for a room key, the conversation history should show that the user asked for a room key, and the user has eventually received the room key from the counterparty with evidence in the conversation history.

      Here are some correct examples: 

      Goal: Purchase toilet paper
      Reasoning: The user mentioned that they need to buy toilet paper and asked the counterparty where they can buy it. The counterparty provided the user with the location of the nearest store where they can buy toilet paper. The user eventually obtained the toilet paper as signs showing the user purchased the toilet paper from the cashier. The goal is considered completed.

      Goal: Ask for directions
      Reasoning: The user asked the counterparty for directions to the nearest bus stop. The counterparty provided the user with directions to the nearest bus stop. The user followed the directions and reached the bus stop. The goal is considered completed.

      You will later be provided with the scenario, goals, and conversation history. Please evaluate the conversation history against the goals. Return the goals in parsable JSON format, with your reasoning, and citing the source from the conversation. You are designed to only speak in parsable JSON. The goals are considered completed only if they are achieved from the conversation history provided.
          
      Example of parsable JSON: "{"response":[{"id":"xxx","reasoning":"xxx","source":"xxx"}]}

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
        "response": <<your response here>>
      }`,
    },
    {
      role: 'user',
      content: `
      Here is the scenario data:
      ${JSON.stringify(scenario)}

      Here are the goals:
      ${JSON.stringify(goals)}

      Here is the conversation history:
      ${JSON.stringify(history)}
      `,
    },
  ];
}

function cleanupJSONString(jsonString: string): string {
  return jsonString
    .replace(/\`\`\`/g, '')
    .replace(/json/g, '')
    .trim();
}
