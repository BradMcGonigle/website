import type { ComponentType } from "react";

export type BackgroundId =
  | "dot-grid"
  | "topographic"
  | "flow-field"
  | "constellation"
  | "wave-interference"
  | "aurora"
  | "voronoi"
  | "mario-kart";

export interface BackgroundConfig {
  id: BackgroundId;
  name: string;
  description: string;
  component: ComponentType;
}

export interface BackgroundContextValue {
  currentBackground: BackgroundId;
  backgrounds: BackgroundConfig[];
  isLoading: boolean;
  setBackground?: (id: BackgroundId) => void;
}
