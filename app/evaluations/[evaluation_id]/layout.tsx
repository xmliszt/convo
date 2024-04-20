import { ScenarioBackground } from '@/app/scenarios/scenario-background';
import { ScenarioBackgroundProvider } from '@/app/scenarios/scenario-background-provider';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  return (
    <ScenarioBackgroundProvider>
      {props.children}
      <ScenarioBackground />
    </ScenarioBackgroundProvider>
  );
}
