'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { Chat } from './chat';

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
  scenario: Scenario | undefined;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  history: Chat[];
  isGameOver: boolean;
  setScenario: Dispatch<SetStateAction<Scenario | undefined>>;
  setGoals: Dispatch<SetStateAction<GoalWthCompletion[]>>;
  setTargetWords: Dispatch<SetStateAction<TargetWordsWithCompletion[]>>;
  setHistory: Dispatch<SetStateAction<Chat[]>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
};

const ScenarioGoalProviderContext =
  createContext<ScenarioGoalProviderContextValue>({
    scenario: undefined,
    goals: [],
    history: [],
    targetWords: [],
    isGameOver: false,
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
  const [scenario, setScenario] = useState<Scenario | undefined>(undefined);
  const [goals, setGoals] = useState<GoalWthCompletion[]>([]);
  const [targetWords, setTargetWords] = useState<TargetWordsWithCompletion[]>(
    []
  );
  const [history, setHistory] = useState<Chat[]>([]);

  return (
    <ScenarioGoalProviderContext.Provider
      value={{
        scenario,
        goals,
        history,
        targetWords,
        isGameOver,
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
