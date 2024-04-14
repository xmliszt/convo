'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type GoalWthCompletion = Goal & {
  completed: boolean;
};

type TargetWordsWithCompletion = {
  word: string;
  completed: boolean;
};

type ScenarioGoalProviderContextValue = {
  scenario: Scenario | undefined;
  goals: GoalWthCompletion[];
  targetWords: TargetWordsWithCompletion[];
  isGameOver: boolean;
  setScenario: Dispatch<SetStateAction<Scenario | undefined>>;
  setGoals: Dispatch<SetStateAction<GoalWthCompletion[]>>;
  setTargetWords: Dispatch<SetStateAction<TargetWordsWithCompletion[]>>;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
};

const ScenarioGoalProviderContext =
  createContext<ScenarioGoalProviderContextValue>({
    scenario: undefined,
    goals: [],
    targetWords: [],
    isGameOver: false,
    setScenario: () => {},
    setGoals: () => {},
    setTargetWords: () => {},
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
  return (
    <ScenarioGoalProviderContext.Provider
      value={{
        scenario,
        goals,
        targetWords,
        isGameOver,
        setScenario,
        setGoals,
        setTargetWords,
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
