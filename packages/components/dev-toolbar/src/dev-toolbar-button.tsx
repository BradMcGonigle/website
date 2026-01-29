"use client";

import type { ReactNode, CSSProperties } from "react";

interface DevToolbarButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  title?: string;
}

const baseStyle: CSSProperties = {
  padding: "3px 8px",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 500,
  background: "transparent",
  color: "rgba(0, 0, 0, 0.6)",
  transition: "all 0.1s ease",
  textDecoration: "none",
  fontFamily: "inherit",
};

const activeStyle: CSSProperties = {
  ...baseStyle,
  fontWeight: 600,
  background: "rgba(0, 0, 0, 0.15)",
  color: "rgba(0, 0, 0, 0.9)",
};

/**
 * Button/link component for the dev toolbar.
 * Can be used as a button (onClick) or link (href).
 */
export function DevToolbarButton({
  children,
  onClick,
  href,
  active = false,
  title,
}: DevToolbarButtonProps) {
  const style = active ? activeStyle : baseStyle;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) {
      e.currentTarget.style.background = "rgba(0, 0, 0, 0.08)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) {
      e.currentTarget.style.background = "transparent";
    }
  };

  if (href) {
    return (
      <a
        href={href}
        style={style}
        title={title}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
