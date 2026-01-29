"use client";

import type { ReactNode } from "react";
import { useVercelAuth } from "./use-vercel-auth";

interface DevToolbarProps {
  children: ReactNode;
}

const TOOLBAR_ID = "dev-toolbar";

/**
 * Development toolbar container.
 * Mimics Arc Browser's developer mode bar.
 * Renders in development mode OR in production when authenticated with Vercel.
 * Hidden on mobile devices (< 768px).
 */
export function DevToolbar({ children }: DevToolbarProps) {
  const isVercelAuthenticated = useVercelAuth();

  const isDev = process.env.NODE_ENV === "development";
  const shouldShow = isDev || isVercelAuthenticated;

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <style>{`
        #${TOOLBAR_ID} {
          display: none;
        }
        @media (min-width: 768px) {
          #${TOOLBAR_ID} {
            display: flex;
          }
        }
      `}</style>
      <div
        id={TOOLBAR_ID}
        style={{
          width: "100%",
          height: 28,
          background: "linear-gradient(90deg, #FF9500 0%, #FFCC00 100%)",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(0, 0, 0, 0.8)",
          zIndex: 9999,
          position: "relative",
        }}
      >
        <span
          style={{
            opacity: 0.6,
            marginRight: 8,
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
    </>
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
        height: 14,
        background: "rgba(0, 0, 0, 0.2)",
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  );
}
