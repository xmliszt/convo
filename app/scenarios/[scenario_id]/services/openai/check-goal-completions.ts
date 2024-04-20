'use server';

import { createCompletion, OpenAIMessage } from '@/lib/ai/openai';

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
  const uncompletedGoals = options.goals.filter(
    (goal) => !options.completedGoalIds.includes(goal.id)
  );

  // Remove the first system prompt.
  const history = options.history.slice(1);
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
  const newListOfCompletedGoalIds = new Set<string>();
  for (const goal of options.completedGoalIds) {
    newListOfCompletedGoalIds.add(goal);
  }
  for (const goal of completedGoals) {
    if (goal.completed) {
      newListOfCompletedGoalIds.add(goal.id);
    }
  }
  return Array.from(newListOfCompletedGoalIds);
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
      You are a linguistic expert who is participating in a simulated conversation to evaluate goal completion status of the situational chat. You are designed to output only JSON. In the role-play scenario, the "model" -- the LLM will play a role, and the "user" will play another role. The "model" is there to help the "user" practice, by role-playing the counterparty in the given scenario. You will look at the history of conversation, and determine if the given goals have been achieved by the conversation. Your evaluation will be striclty based on the context of the scenario that the conversation is taking place in. 

      You will be provided with the following data:

      Scenario:
      {
          description: "The description of the scenario",
          name: "The name of the scenario",
          player_role: "The role of the user in the scenario"
      }

      Goals:
      [
        {
          "id": "goal_id",
          "short_description": "The description of the goal",
          "long_description": "The detailed description of the goal"
        }
      ]
      
      Conversation history:
      [
        {
          "role": "user" | "model",
          "message": "The message sent by the user or model"
        }
      ]

      A goal is considered completed if:
        The goal is mentioned or inferred in the conversation history provided
        AND
        The goal is achieved in the context of the conversation. 
        
      Examples:

      Goal: Purchase toilet paper
      Thoughts: To consider this goal achieved, the conversation history must show signs that the user has successfully purchased toilet paper. If user only asks the price of the toilet paper but does not mention about purchasing it, the goal is not considered achieved.

      Return your response in parsable JSON format, with your reasoning, and citing the source from the conversation history. You are designed to only speak in parsable JSON.
      
      Example response: 
      {
        "response": [{
          "id": <<the goal id that is considered completed>>,
          "reasoning": <<the reasoning for why the goal is considered completed>>,
          "source": <<the source from the conversation history that supports the reasoning>>,
          "completed": <<true if the goal is completed, false otherwise>>
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
