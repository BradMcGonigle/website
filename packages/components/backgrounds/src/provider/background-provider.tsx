"use client";

import { Suspense, useSyncExternalStore, type ReactNode } from "react";
import { backgrounds } from "../backgrounds";
import { BackgroundContext } from "./background-context";
import { useBackgroundSelection } from "../hooks/use-background-selection";

// No-op subscribe function for useSyncExternalStore (client detection only)
function subscribe() {
  return function unsubscribe() {
    // intentionally empty
  };
}

interface BackgroundProviderProps {
  children: ReactNode;
}

export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const { currentBackground, isLoading } = useBackgroundSelection();

  // Server render: no background, just children
  if (!mounted) {
    return (
      <BackgroundContext.Provider
        value={{ currentBackground: "dot-grid", backgrounds, isLoading: true }}
      >
        {children}
      </BackgroundContext.Provider>
    );
  }

  const config = backgrounds.find((b) => b.id === currentBackground);
  const BackgroundComponent = config?.component;

  return (
    <BackgroundContext.Provider
      value={{ currentBackground, backgrounds, isLoading }}
    >
      {children}
      {BackgroundComponent && (
        <Suspense fallback={null}>
          <BackgroundComponent />
        </Suspense>
      )}
    </BackgroundContext.Provider>
  );
}
