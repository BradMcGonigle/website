"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
}

const STAR_COUNT = 120;
const CONNECTION_DISTANCE = 150;
const MAX_CONNECTIONS = 4;
const STAR_SPEED = 0.3;
const SHOOTING_STAR_CHANCE = 0.002;

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const timeRef = useRef(0);

  const getComputedColor = useCallback(() => {
    if (typeof window === "undefined") return { h: 215, s: 16, l: 47 };
    const style = getComputedStyle(document.documentElement);
    const hsl = style.getPropertyValue("--muted-foreground").trim();
    if (!hsl) return { h: 215, s: 16, l: 47 };
    const parts = hsl.split(" ").map((v) => parseFloat(v));
    return { h: parts[0] ?? 215, s: parts[1] ?? 16, l: parts[2] ?? 47 };
  }, []);

  const isDarkMode = useCallback(() => {
    if (typeof window === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  }, []);

  const getOpacityMultiplier = useCallback(() => {
    return isDarkMode() ? 1 : 0.5;
  }, [isDarkMode]);

  const createStar = useCallback((width: number, height: number): Star => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.5 + 0.5) * STAR_SPEED;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 1.5 + 0.5,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    };
  }, []);

  const createShootingStar = useCallback((width: number): ShootingStar => {
    const startX = Math.random() * width * 0.8;
    const startY = Math.random() * 100;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = 8 + Math.random() * 6;
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 60 + Math.random() * 40,
      life: 0,
      maxLife: 40 + Math.random() * 20,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Reinitialize stars on resize
      starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height));
    };

    const draw = () => {
      const color = getComputedColor();
      const time = timeRef.current;
      const opacityMult = getOpacityMultiplier();

      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      const fadeStartY = height * 0.5;
      const fadeEndY = height * 0.8;

      // Update star positions
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        star.twinklePhase += star.twinkleSpeed;

        // Wrap around edges
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }

      // Draw connections between nearby stars
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (!star) continue;

        let connections = 0;

        // Vertical fade for connections
        let starFade = 1;
        if (star.y > fadeStartY) {
          starFade = Math.max(0, 1 - (star.y - fadeStartY) / (fadeEndY - fadeStartY));
        }
        if (starFade <= 0) continue;

        for (let j = i + 1; j < stars.length && connections < MAX_CONNECTIONS; j++) {
          const other = stars[j];
          if (!other) continue;

          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.3 * starFade;

            // Vertical fade for the other star too
            let otherFade = 1;
            if (other.y > fadeStartY) {
              otherFade = Math.max(0, 1 - (other.y - fadeStartY) / (fadeEndY - fadeStartY));
            }

            const finalOpacity = opacity * otherFade * opacityMult;
            if (finalOpacity > 0.01) {
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${finalOpacity})`;
              ctx.stroke();
              connections++;
            }
          }
        }
      }

      // Draw stars
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
        let opacity = twinkle * 0.6 + 0.2;

        // Vertical fade
        if (star.y > fadeStartY) {
          const fadeFactor = Math.max(0, 1 - (star.y - fadeStartY) / (fadeEndY - fadeStartY));
          opacity *= fadeFactor;
        }

        const starOpacity = opacity * opacityMult;
        if (starOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${starOpacity})`;
          ctx.fill();
        }
      }

      // Maybe spawn a shooting star
      if (Math.random() < SHOOTING_STAR_CHANCE) {
        shootingStarsRef.current.push(createShootingStar(width));
      }

      // Update and draw shooting stars
      const shootingStars = shootingStarsRef.current;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss) continue;

        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        const lifeRatio = ss.life / ss.maxLife;
        let opacity = 1;
        if (lifeRatio < 0.1) {
          opacity = lifeRatio / 0.1;
        } else if (lifeRatio > 0.6) {
          opacity = (1 - lifeRatio) / 0.4;
        }

        if (ss.life >= ss.maxLife || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length,
          ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length
        );
        gradient.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${opacity * 0.8 * opacityMult})`);
        gradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - (ss.vx / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length,
          ss.y - (ss.vy / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)) * ss.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l + 20}%, ${opacity * opacityMult})`;
        ctx.fill();
      }

      timeRef.current = time + 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [getComputedColor, createStar, createShootingStar, getOpacityMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-background="constellation"
    />
  );
}
