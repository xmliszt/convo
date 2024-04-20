'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Chat } from './chat';

export type Chat = {
  role: 'user' | 'model' | 'error';
  message: string;
  /**
   * ISO 8601 string
   */
  createdAt: string;
};

export type GoalWthCompletion = Goal & {
  completed: boolean;
};

export type TargetWordsWithCompletion = {
  word: string;
  completed: boolean;
};

type ScenarioProviderContextValue = {
  llmRole: LlmRole | undefined;
  scenario: Scenario | undefined;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  history: Chat[];
  isGameOver: boolean;
  setGoals: Dispatch<SetStateAction<GoalWthCompletion[]>>;
  setTargetWords: Dispatch<SetStateAction<TargetWordsWithCompletion[]>>;
  setHistory: Dispatch<SetStateAction<Chat[]>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
};

const ScenarioProviderContext = createContext<ScenarioProviderContextValue>({
  llmRole: undefined,
  scenario: undefined,
  goals: [],
  history: [],
  targetWords: [],
  isGameOver: false,
  setGoals: () => {},
  setTargetWords: () => {},
  setHistory: () => {},
  setIsGameOver: () => {},
});

type ScenarioProviderProps = {
  llmRole: LlmRole;
  scenario: Scenario;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  history: Chat[];
  children: React.ReactNode;
};

export function ScenarioProvider(props: ScenarioProviderProps) {
  const [isGameOver, setIsGameOver] = useState(false);
  const [goals, setGoals] = useState<GoalWthCompletion[]>(props.goals);
  const [targetWords, setTargetWords] = useState<TargetWordsWithCompletion[]>(
    props.targetWords
  );
  const [history, setHistory] = useState<Chat[]>(props.history);

  // Game over whena all goals and target words are completed.
  useEffect(() => {
    if (
      goals.every((goal) => goal.completed) &&
      targetWords.every((word) => word.completed)
    ) {
      setIsGameOver(true);
    }
  }, [goals, targetWords]);

  return (
    <ScenarioProviderContext.Provider
      value={{
        llmRole: props.llmRole,
        scenario: props.scenario,
        goals,
        history,
        targetWords,
        isGameOver,
        setGoals,
        setTargetWords,
        setHistory,
        setIsGameOver,
      }}
    >
      {props.children}
    </ScenarioProviderContext.Provider>
  );
}

export function useScenario() {
  return useContext(ScenarioProviderContext);
}
