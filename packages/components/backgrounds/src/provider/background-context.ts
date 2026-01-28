"use client";

import { createContext } from "react";
import type { BackgroundContextValue } from "../types";

export const BackgroundContext = createContext<BackgroundContextValue | null>(null);
