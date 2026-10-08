"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ExperienceEntry } from "@/lib/content";

// Must match the media query that stacks the entries in globals.css. Without it (no JS, reduced
// motion, or no `scripting` support) the entries stay a plain list.
const ROTATE_QUERY = "(scripting: enabled) and (prefers-reduced-motion: no-preference)";
const ROTATE_MS = 2000;

function subscribe(onChange: () => void) {
  const query = window.matchMedia(ROTATE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const canRotate = () => window.matchMedia(ROTATE_QUERY).matches;

// Shows one entry at a time and fades to the next. Rotation starts when the list scrolls into
// view, pauses on hover and while off-screen. Every entry stays in the DOM, so screen readers
// get the full list.
export function ExperienceList({ entries }: { entries: ExperienceEntry[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const rotating = useSyncExternalStore(subscribe, canRotate, () => false);
  const [active, setActive] = useState<number | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!rotating || !list) return;
    const observer = new IntersectionObserver(([record]) => {
      setInView(record.isIntersecting);
      if (record.isIntersecting) setActive((current) => current ?? 0);
    }, { threshold: 0.5 });
    observer.observe(list);
    return () => observer.disconnect();
  }, [rotating]);

  useEffect(() => {
    if (!rotating || !inView || paused || entries.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        setPrevious(current);
        return ((current ?? 0) + 1) % entries.length;
      });
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [rotating, inView, paused, entries.length]);

  return (
    <ol
      ref={listRef}
      className="experience-list"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {entries.map((entry, index) => (
        <li
          key={`${entry.organization}-${entry.period}-${index}`}
          className="experience-item"
          data-active={index === active ? "" : undefined}
          data-leaving={index === previous && index !== active ? "" : undefined}
        >
          <p className="text-[14px]">{entry.role}</p>
          <p className="mt-1 text-[13px] text-muted">{entry.organization}</p>
          <p className="mt-1 text-[12px] tabular-nums text-muted">{entry.period}</p>
        </li>
      ))}
    </ol>
  );
}
