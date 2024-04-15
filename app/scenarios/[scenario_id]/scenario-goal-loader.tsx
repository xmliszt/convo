'use client';

import { useEffect } from 'react';

import { Chat, useScenario } from './scenario-goal-provider';

type ScenarioLoaderProps = {
  llmRole: LlmRole;
  scenario: Scenario;
  goals: Goal[];
  targetWords: string[];
  initialHistory: Chat[];
};

export function ScenarioLoader(props: ScenarioLoaderProps) {
  const { setLlmRole, setScenario, setGoals, setTargetWords, setHistory } =
    useScenario();

  useEffect(() => {
    setLlmRole(props.llmRole);
    setScenario(props.scenario);
    setGoals(props.goals.map((goal) => ({ ...goal, completed: false })));
    setTargetWords(
      props.targetWords.map((word) => ({ word, completed: false }))
    );
    setHistory(props.initialHistory);
  }, [
    props.goals,
    props.llmRole,
    props.scenario,
    props.targetWords,
    props.initialHistory,
    setGoals,
    setLlmRole,
    setHistory,
    setScenario,
    setTargetWords,
  ]);

  return null;
}
