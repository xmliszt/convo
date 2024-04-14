'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Chat } from './chat/chat';

export type Chat = {
  role: 'user' | 'model' | 'error';
  message: string;
};

export type GoalWthCompletion = Goal & {
  completed: boolean;
};

export type TargetWordsWithCompletion = {
  word: string;
  completed: boolean;
};

type ScenarioGoalProviderContextValue = {
  llmRole: LlmRole | undefined;
  scenario: Scenario | undefined;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  history: Chat[];
  isGameOver: boolean;
  setLlmRole: Dispatch<SetStateAction<LlmRole | undefined>>;
  setScenario: Dispatch<SetStateAction<Scenario | undefined>>;
  setGoals: Dispatch<SetStateAction<GoalWthCompletion[]>>;
  setTargetWords: Dispatch<SetStateAction<TargetWordsWithCompletion[]>>;
  setHistory: Dispatch<SetStateAction<Chat[]>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
};

const ScenarioGoalProviderContext =
  createContext<ScenarioGoalProviderContextValue>({
    llmRole: undefined,
    scenario: undefined,
    goals: [],
    history: [],
    targetWords: [],
    isGameOver: false,
    setLlmRole: () => {},
    setScenario: () => {},
    setGoals: () => {},
    setTargetWords: () => {},
    setHistory: () => {},
    setIsGameOver: () => {},
  });

export function ScenarioGoalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGameOver, setIsGameOver] = useState(false);
  const [llmRole, setLlmRole] = useState<LlmRole | undefined>(undefined);
  const [scenario, setScenario] = useState<Scenario | undefined>(undefined);
  const [goals, setGoals] = useState<GoalWthCompletion[]>([]);
  const [targetWords, setTargetWords] = useState<TargetWordsWithCompletion[]>(
    []
  );
  const [history, setHistory] = useState<Chat[]>([]);

  // Game over whena all goals and target words are completed.
  useEffect(() => {
    if (!scenario) return;
    if (
      goals.every((goal) => goal.completed) &&
      targetWords.every((word) => word.completed)
    ) {
      setIsGameOver(true);
    }
  }, [goals, scenario, targetWords]);

  return (
    <ScenarioGoalProviderContext.Provider
      value={{
        llmRole,
        scenario,
        goals,
        history,
        targetWords,
        isGameOver,
        setLlmRole,
        setScenario,
        setGoals,
        setTargetWords,
        setHistory,
        setIsGameOver,
      }}
    >
      {children}
    </ScenarioGoalProviderContext.Provider>
  );
}

export function useScenarioGoal() {
  return useContext(ScenarioGoalProviderContext);
}
