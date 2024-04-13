'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const ScenarioBackgroundContext = createContext<{
  backgroundImageUrl: string | undefined;
  setBackgroundImageUrl: Dispatch<SetStateAction<string | undefined>>;
  showBackgroundImage: boolean;
  setShowBackgroundImage: Dispatch<SetStateAction<boolean>>;
}>({
  backgroundImageUrl: undefined,
  setBackgroundImageUrl: () => {},
  showBackgroundImage: false,
  setShowBackgroundImage: () => {},
});

export function ScenarioBackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<
    string | undefined
  >(undefined);
  const [showBackgroundImage, setShowBackgroundImage] = useState(false);
  return (
    <ScenarioBackgroundContext.Provider
      value={{
        backgroundImageUrl,
        setBackgroundImageUrl,
        showBackgroundImage,
        setShowBackgroundImage,
      }}
    >
      {children}
    </ScenarioBackgroundContext.Provider>
  );
}

export function useScenarioBackground() {
  return useContext(ScenarioBackgroundContext);
}
