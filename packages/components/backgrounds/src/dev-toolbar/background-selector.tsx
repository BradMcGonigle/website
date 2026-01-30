"use client";

import type { ChangeEvent } from "react";
import { useBackground } from "../hooks/use-background";
import type { BackgroundId } from "../types";

/**
 * Background selector dropdown for use in the dev toolbar.
 * Compact dropdown that works well on both mobile and desktop.
 */
export function BackgroundSelector() {
  const { currentBackground, backgrounds, setBackground } = useBackground();

  if (!setBackground) {
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBackground(e.target.value as BackgroundId);
  };

  return (
    <select
      value={currentBackground}
      onChange={handleChange}
      style={{
        padding: "2px 4px",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 500,
        background: "rgba(0, 0, 0, 0.1)",
        color: "rgba(0, 0, 0, 0.8)",
        fontFamily: "inherit",
        outline: "none",
        minWidth: 80,
      }}
      title="Select background"
    >
      {backgrounds.map((bg) => (
        <option key={bg.id} value={bg.id}>
          {bg.name}
        </option>
      ))}
    </select>
  );
}
