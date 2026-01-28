import { DotGridBackground } from "./dot-grid-background";
import { TopographicBackground } from "./topographic-background";
import type { BackgroundConfig } from "../types";

export const backgrounds: BackgroundConfig[] = [
  {
    id: "dot-grid",
    name: "Dot Grid",
    description: "CSS-based pulsing dot grid pattern",
    component: DotGridBackground,
  },
  {
    id: "topographic",
    name: "Topographic",
    description: "Canvas-based Perlin noise contour lines",
    component: TopographicBackground,
  },
];
