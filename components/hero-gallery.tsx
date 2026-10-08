"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ProjectVisual } from "@/lib/content";

// Slides without an image yet show a cut-paper placeholder, each with a different layout.
const placeholderLayouts = [
  { dot: "right-[10%] top-[-10%] w-[38%]", strip: "left-[7%] top-[14%] h-[12%] w-[36%] -rotate-2" },
  { dot: "left-[8%] bottom-[-16%] w-[40%]", strip: "right-[9%] top-[16%] h-[12%] w-[30%] rotate-2" },
  { dot: "right-[20%] bottom-[8%] w-[26%]", strip: "left-[12%] top-[10%] h-[18%] w-[24%] rotate-6" },
];
const dotColors = ["blush", "butter", "sage"] as const;

// Horizontal scroll-snap track: swipeable and usable without JS; the buttons, counter and
// dots are a thin layer that reads the scroll position and scrolls to a slide.
export function HeroGallery({ visuals, number, title, swatch }: { visuals: ProjectVisual[]; number: string; title: string; swatch: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = visuals.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + count) % count;
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    track.scrollTo({ left: target * track.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }

  return (
    <div className="hero-gallery">
      <div className="relative">
        <span className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rotate-[1.5deg] rounded-[var(--radius-hand)] bg-[var(--powder)]" aria-hidden="true" />
        <div className="spread-hero-visual tape tape-blush aspect-[16/9]" style={{ "--swatch": `var(--${swatch})` } as CSSProperties}>
          <div
            ref={trackRef}
            className="hero-gallery-track"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${title} visuals`}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
            }}
          >
            {Array.from({ length: count }, (_, index) => {
              const visual = visuals[index];
              const layout = placeholderLayouts[index % placeholderLayouts.length];
              return (
                <div
                  key={index}
                  className="hero-gallery-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                >
                  {visual.src ? (
                    <Image src={visual.src} alt={visual.alt} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover" preload={index === 0} />
                  ) : (
                    <>
                      <span className={`visual-dot aspect-square ${layout.dot}`} style={{ background: `var(--${dotColors[index % dotColors.length]})` }} aria-hidden="true" />
                      <span className={`visual-strip ${layout.strip}`} aria-hidden="true" />
                      <span className="absolute bottom-4 left-6 font-display text-[clamp(88px,20vw,240px)] italic leading-[0.8] tracking-[-0.06em] text-ink/15 md:bottom-8 md:left-10" aria-hidden="true">{number}</span>
                      <span className="meta-label absolute right-6 top-6 text-ink/60">TODO(content): hero visual {index + 1}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                type="button"
                tabIndex={-1}
                className={`hero-gallery-dot${index === active ? " is-active" : ""}`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="meta-label text-muted" aria-live="polite">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button type="button" className="hero-gallery-btn [--sticker-rot:-2deg]" onClick={() => goTo(active - 1)} aria-label="previous visual">←</button>
            <button type="button" className="hero-gallery-btn [--sticker-rot:2deg]" onClick={() => goTo(active + 1)} aria-label="next visual">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
