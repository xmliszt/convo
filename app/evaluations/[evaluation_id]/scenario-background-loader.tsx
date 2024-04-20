'use client';

import { useEffect } from 'react';

import { useScenarioBackground } from '@/app/scenarios/scenario-background-provider';

export function ScenarioBackgroundLoader({ scenario }: { scenario: Scenario }) {
  const { setShowBackgroundImage, setBackgroundImageUrl } =
    useScenarioBackground();

  useEffect(() => {
    if (scenario.image_url) {
      setShowBackgroundImage(true);
      setBackgroundImageUrl(scenario.image_url);
    } else {
      setShowBackgroundImage(false);
    }
  }, [scenario, setBackgroundImageUrl, setShowBackgroundImage]);

  return null;
}
