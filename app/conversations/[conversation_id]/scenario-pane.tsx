'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useScenario } from './scenario-provider';

export function ScenarioPane() {
  const { scenario } = useScenario();
  if (!scenario) return null;

  return (
    <Card className='brightness-80 bg-card/20 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle>{scenario.name}</CardTitle>
      </CardHeader>
      <CardContent className='text-sm font-light text-foreground opacity-90'>
        {scenario.description}
      </CardContent>
    </Card>
  );
}
