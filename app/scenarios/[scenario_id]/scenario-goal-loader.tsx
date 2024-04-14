'use client';

import { useEffect } from 'react';

import { Chat, useScenarioGoal } from './scenario-goal-provider';

type ScenarioGoalLoaderProps = {
  llmRole: LlmRole;
  scenario: Scenario;
  goals: Goal[];
  targetWords: string[];
  initialHistory: Chat[];
};

export function ScenarioGoalLoader(props: ScenarioGoalLoaderProps) {
  const { setLlmRole, setScenario, setGoals, setTargetWords, setHistory } =
    useScenarioGoal();

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
