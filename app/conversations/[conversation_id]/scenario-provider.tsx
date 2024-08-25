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
  role: 'user' | 'model' | 'error' | 'recording';
  message: string;
  /**
   * ISO 8601 string
   */
  createdAt: string;
};

type ScenarioProviderContextValue = {
  llmRole: LlmRole | undefined;
  scenario: Scenario | undefined;
  goals: Goal[];
  targetWords: {
    id: string;
    words: string[];
  };
  completedGoalIds: string[];
  completedWords: string[];
  history: Chat[];
  isGameOver: boolean;
  setGoals: Dispatch<SetStateAction<Goal[]>>;
  setTargetWords: Dispatch<
    SetStateAction<{
      id: string;
      words: string[];
    }>
  >;
  setHistory: Dispatch<SetStateAction<Chat[]>>;
  setCompletedGoalIds: Dispatch<SetStateAction<string[]>>;
  setCompletedWords: Dispatch<SetStateAction<string[]>>;
};

const ScenarioProviderContext = createContext<ScenarioProviderContextValue>({
  llmRole: undefined,
  scenario: undefined,
  goals: [],
  history: [],
  targetWords: {
    id: '',
    words: [],
  },
  isGameOver: false,
  completedGoalIds: [],
  completedWords: [],
  setGoals: () => {},
  setTargetWords: () => {},
  setHistory: () => {},
  setCompletedGoalIds: () => {},
  setCompletedWords: () => {},
});

type ScenarioProviderProps = {
  llmRole: LlmRole;
  scenario: Scenario;
  goals: Goal[];
  targetWords: {
    id: string;
    words: string[];
  };
  history: Chat[];
  children: React.ReactNode;
};

export function ScenarioProvider(props: ScenarioProviderProps) {
  const [goals, setGoals] = useState<Goal[]>(props.goals);
  const [targetWords, setTargetWords] = useState<{
    id: string;
    words: string[];
  }>(props.targetWords);
  const [history, setHistory] = useState<Chat[]>(props.history);
  const [completedGoalIds, setCompletedGoalIds] = useState<string[]>([]);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  return (
    <ScenarioProviderContext.Provider
      value={{
        llmRole: props.llmRole,
        scenario: props.scenario,
        goals,
        history,
        targetWords,
        isGameOver: completedGoalIds.length === goals.length,
        completedGoalIds,
        completedWords,
        setGoals,
        setTargetWords,
        setHistory,
        setCompletedGoalIds,
        setCompletedWords,
      }}
    >
      {props.children}
    </ScenarioProviderContext.Provider>
  );
}

export function useScenario() {
  return useContext(ScenarioProviderContext);
}
