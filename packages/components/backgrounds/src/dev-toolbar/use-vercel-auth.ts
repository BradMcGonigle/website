"use client";

import { useState, useEffect } from "react";

const VERCEL_TOOLBAR_KEY = "__vercel_toolbar";

/**
 * Hook to check if the current user is authenticated with Vercel.
 * Returns true when the Vercel toolbar is loaded and the user is authenticated.
 * This allows showing dev features in production only to team members.
 */
export function useVercelAuth(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check immediately in case toolbar is already loaded
    const checkAuth = () => {
      const toolbar = (window as Window & { [VERCEL_TOOLBAR_KEY]?: { isAuthenticated: boolean } })[
        VERCEL_TOOLBAR_KEY
      ];
      if (toolbar?.isAuthenticated) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    };

    // If already authenticated, no need to poll
    if (checkAuth()) {
      return;
    }

    // Poll for toolbar to load (it loads async)
    const interval = setInterval(() => {
      if (checkAuth()) {
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
