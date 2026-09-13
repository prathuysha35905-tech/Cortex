"use client";

import React, { useEffect, useRef } from "react";

export default function AnimatedDotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<
    { baseX: number; baseY: number; phaseX: number; phaseY: number; speed: number; r: number; alpha: number }[]
  >([]);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const SPACING = 34;
    const JITTER = 11;

    const buildDots = () => {
      const { width, height } = sizeRef.current;
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;
      const dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            baseX: c * SPACING,
            baseY: r * SPACING,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speed: 0.16 + Math.random() * 0.3,
            r: 0.8 + Math.random() * 1,
            alpha: 0.65 + Math.random() * 0.35,
          });
        }
      }
      dotsRef.current = dots;
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const tick = () => {
      t += 1;
      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const x = d.baseX + Math.sin(t * 0.012 * d.speed + d.phaseX) * JITTER;
        const y = d.baseY + Math.cos(t * 0.015 * d.speed + d.phaseY) * JITTER;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0,${d.alpha})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}
