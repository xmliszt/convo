'use client';

import { useEffect } from 'react';

import { useScenarioGoal } from './scenario-goal-provider';

type ScenarioGoalLoaderProps = {
  scenario: Scenario;
  goals: Goal[];
  targetWords: string[];
};

export function ScenarioGoalLoader(props: ScenarioGoalLoaderProps) {
  const { setScenario, setGoals, setTargetWords } = useScenarioGoal();

  useEffect(() => {
    setScenario(props.scenario);
    setGoals(props.goals.map((goal) => ({ ...goal, completed: false })));
    setTargetWords(
      props.targetWords.map((word) => ({ word, completed: false }))
    );
  }, [
    props.goals,
    props.scenario,
    props.targetWords,
    setGoals,
    setScenario,
    setTargetWords,
  ]);

  return null;
}
