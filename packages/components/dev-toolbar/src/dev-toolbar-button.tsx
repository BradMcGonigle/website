"use client";

import type { ReactNode, CSSProperties } from "react";

interface DevToolbarButtonProps {
  /** Text label for the button */
  children?: ReactNode;
  /** Icon element to display */
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  title?: string;
}

const baseStyle: CSSProperties = {
  padding: "3px 6px",
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
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const activeStyle: CSSProperties = {
  ...baseStyle,
  fontWeight: 600,
  background: "rgba(0, 0, 0, 0.15)",
  color: "rgba(0, 0, 0, 0.9)",
};

const BUTTON_TEXT_CLASS = "dev-toolbar-btn-text";

/**
 * Button/link component for the dev toolbar.
 * Can be used as a button (onClick) or link (href).
 * Supports icons that remain visible on mobile while text is hidden.
 */
export function DevToolbarButton({
  children,
  icon,
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

  const content = (
    <>
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children && (
        <>
          <style>{`
            .${BUTTON_TEXT_CLASS} {
              display: none;
            }
            @media (min-width: 640px) {
              .${BUTTON_TEXT_CLASS} {
                display: inline;
              }
            }
          `}</style>
          <span className={BUTTON_TEXT_CLASS}>{children}</span>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={style}
        title={title}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
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
      {content}
    </button>
  );
}
