"use client";

import { useSyncExternalStore, useState, useCallback, type ReactNode } from "react";
import { backgrounds } from "../backgrounds";
import { BackgroundContext } from "./background-context";
import { useBackgroundSelection } from "../hooks/use-background-selection";
import type { BackgroundId } from "../types";

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

  const { currentBackground: selectedBackground, isLoading } = useBackgroundSelection();
  const [overrideBackground, setOverrideBackground] = useState<BackgroundId | null>(null);

  const setBackground = useCallback((id: BackgroundId) => {
    setOverrideBackground(id);
  }, []);

  const currentBackground = overrideBackground ?? selectedBackground;

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
      value={{ currentBackground, backgrounds, isLoading, setBackground }}
    >
      {children}
      {BackgroundComponent && <BackgroundComponent />}
    </BackgroundContext.Provider>
  );
}
