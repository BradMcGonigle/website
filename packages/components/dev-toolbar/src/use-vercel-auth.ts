"use client";

import { useState, useEffect } from "react";

const VERCEL_TOOLBAR_KEY = "__vercel_toolbar";
const AUTH_CACHE_KEY = "dev-toolbar-auth";

/**
 * Check if user is authenticated with Vercel (synchronous check).
 */
function checkVercelAuth(): boolean {
  if (typeof window === "undefined") return false;
  const toolbar = (window as Window & { [VERCEL_TOOLBAR_KEY]?: { isAuthenticated: boolean } })[
    VERCEL_TOOLBAR_KEY
  ];
  return toolbar?.isAuthenticated ?? false;
}

/**
 * Get cached auth state from sessionStorage.
 */
function getCachedAuth(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(AUTH_CACHE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Cache auth state in sessionStorage.
 */
function setCachedAuth(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      sessionStorage.setItem(AUTH_CACHE_KEY, "true");
    } else {
      sessionStorage.removeItem(AUTH_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook to check if the current user is authenticated with Vercel.
 * Returns true when the Vercel toolbar is loaded and the user is authenticated.
 * Caches auth state in sessionStorage to prevent flash during navigation.
 */
export function useVercelAuth(): boolean {
  // Initialize with cached value or synchronous check to prevent flash
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return getCachedAuth() || checkVercelAuth();
  });

  useEffect(() => {
    // Check immediately in case toolbar is already loaded
    if (checkVercelAuth()) {
      setIsAuthenticated(true);
      setCachedAuth(true);
      return;
    }

    // Poll for toolbar to load (it loads async)
    const interval = setInterval(() => {
      if (checkVercelAuth()) {
        setIsAuthenticated(true);
        setCachedAuth(true);
        clearInterval(interval);
      }
    }, 100);

    // Clean up after 5 seconds if toolbar never loads
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return isAuthenticated;
}
