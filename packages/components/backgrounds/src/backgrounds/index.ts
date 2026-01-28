import { lazy } from "react";
import type { BackgroundConfig } from "../types";

export const backgrounds: BackgroundConfig[] = [
  {
    id: "dot-grid",
    name: "Dot Grid",
    description: "CSS-based pulsing dot grid pattern",
    component: lazy(() =>
      import("./dot-grid-background").then((m) => ({ default: m.DotGridBackground }))
    ),
  },
  {
    id: "topographic",
    name: "Topographic",
    description: "Canvas-based Perlin noise contour lines",
    component: lazy(() =>
      import("./topographic-background").then((m) => ({ default: m.TopographicBackground }))
    ),
  },
];
