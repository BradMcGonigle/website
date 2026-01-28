"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Custom hook for detecting when an element enters the viewport.
 * Uses native Intersection Observer API.
 */
function useInView(options?: { threshold?: number; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "-50px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin]);

  return { ref, isInView };
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  id?: string;
}

export function AnimatedText({
  children,
  className = "",
  delay = 0,
  as: Component = "p",
  id,
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure CSS transition works on mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Component
      id={id}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay * 1000}ms` }}
    >
      {children}
    </Component>
  );
}

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={className}>
      {isInView ? children : null}
    </div>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedListItem({
  children,
  className = "",
  index = 0,
}: AnimatedListItemProps) {
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className = "" }: AnimatedCardProps) {
  return (
    <div
      className={`transition-transform duration-200 ease-out hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}
