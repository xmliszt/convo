'use client';

import { useEffect } from 'react';

import { Chat, useScenarioGoal } from './scenario-goal-provider';

type ScenarioGoalLoaderProps = {
  scenario: Scenario;
  goals: Goal[];
  targetWords: string[];
  initialHistory: Chat[];
};

export function ScenarioGoalLoader(props: ScenarioGoalLoaderProps) {
  const { setScenario, setGoals, setTargetWords, setHistory } =
    useScenarioGoal();

  useEffect(() => {
    setScenario(props.scenario);
    setGoals(props.goals.map((goal) => ({ ...goal, completed: false })));
    setTargetWords(
      props.targetWords.map((word) => ({ word, completed: false }))
    );
    setHistory(props.initialHistory);
  }, [
    props.goals,
    props.scenario,
    props.targetWords,
    props.initialHistory,
    setGoals,
    setScenario,
    setTargetWords,
    setHistory,
  ]);

  return null;
}
