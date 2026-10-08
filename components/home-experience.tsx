"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";

const StudioScene = dynamic(
  () => import("@/components/studio-scene").then((module) => module.StudioScene),
  { ssr: false },
);

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HomeExperience({ onReady }: { onReady: () => void }) {
  const [enabled, setEnabled] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(1);
  const [onScreen, setOnScreen] = useState(true);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !hasWebGL()) return;
    const frame = window.requestAnimationFrame(() => {
      setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 0.8 : 1.2));
      setEnabled(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Stop rendering the scene while the hero is scrolled out of view.
  useEffect(() => {
    const element = container.current;
    if (!enabled || !element || !("IntersectionObserver" in globalThis)) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={container} className="absolute inset-0">
      <SceneErrorBoundary>
        <StudioScene pixelRatio={pixelRatio} active={onScreen} onReady={onReady} />
      </SceneErrorBoundary>
    </div>
  );
}
