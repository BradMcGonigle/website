"use client";

import type { ReactNode } from "react";
import { useVercelAuth } from "./use-vercel-auth";

interface DevToolbarProps {
  children: ReactNode;
}

/**
 * Development toolbar container.
 * Mimics Arc Browser's developer mode bar.
 * Renders in development mode OR in production when authenticated with Vercel.
 * Responsive design that works on both mobile and desktop.
 */
export function DevToolbar({ children }: DevToolbarProps) {
  const isVercelAuthenticated = useVercelAuth();

  const isDev = process.env.NODE_ENV === "development";
  const shouldShow = isDev || isVercelAuthenticated;

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 36,
        background: "linear-gradient(90deg, #E8B86D 0%, #D4A855 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(0, 0, 0, 0.75)",
        zIndex: 9999,
        position: "relative",
        padding: "0 12px",
      }}
    >
      <span
        style={{
          opacity: 0.6,
          marginRight: 4,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Dev
      </span>
      <DevToolbarDivider />
      {children}
    </div>
  );
}

/**
 * Visual divider for separating toolbar sections.
 */
export function DevToolbarDivider() {
  return (
    <span
      style={{
        width: 1,
        height: 18,
        background: "rgba(0, 0, 0, 0.2)",
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  );
}
