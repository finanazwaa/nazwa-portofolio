"use client";

import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/site-chrome";

type AreaCard = {
  number: string;
  title: string;
  description: string;
  keywords: readonly string[];
  projects: { slug: string; title: string }[];
};

export function AreasGrid({ cards }: { cards: AreaCard[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(() => cards.map(() => false));

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    if (!("IntersectionObserver" in globalThis)) {
      const fallbackTimer = window.setTimeout(() => {
        setRevealed((current) => current.map(() => true));
      }, 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observedCards = Array.from(grid.querySelectorAll<HTMLElement>(".areas-card"));
    const scheduled = new Set<number>();
    const timers: number[] = [];
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Number((a.target as HTMLElement).dataset.index) - Number((b.target as HTMLElement).dataset.index));

      visibleEntries.forEach((entry, batchIndex) => {
        const card = entry.target as HTMLElement;
        const index = Number(card.dataset.index);
        if (scheduled.has(index)) return;

        scheduled.add(index);
        observer.unobserve(card);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mobile = window.matchMedia("(max-width: 639px)").matches;
        const delay = reduceMotion ? 0 : batchIndex * (mobile ? 85 : 130);
        timers.push(window.setTimeout(() => {
          setRevealed((current) => current.map((value, cardIndex) => cardIndex === index ? true : value));
        }, delay));
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });

    observedCards.forEach((card) => observer.observe(card));

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [cards.length]);

  return (
    <div ref={gridRef} className="areas-grid mt-20 grid gap-14 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16 md:mt-28">
      {cards.map((card, index) => {
        const isRevealed = revealed[index] ?? false;

        return (
          <article
            key={card.number}
            className={`areas-card tape${isRevealed ? " is-revealed" : ""}`}
            data-index={index}
          >
            <div className="areas-card-inner">
              <div className="areas-card-face areas-card-front" aria-hidden={isRevealed} inert={isRevealed}>
                <p className="areas-card-number">no. {card.number}</p>
                <h3 className="mt-3 font-display text-[26px] leading-tight">{card.title}</h3>
              </div>
              <div className="areas-card-face areas-card-back" aria-hidden={!isRevealed} inert={!isRevealed}>
                <p className="areas-card-number">no. {card.number}</p>
                <h3 className="mt-3 font-display text-[26px] leading-tight">{card.title}</h3>
                <p className="note-muted mt-3 max-w-[45ch] text-[14px] leading-relaxed">{card.description}</p>
                <ul className="areas-keywords note-muted mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[12px]" aria-label={`${card.title} keywords`}>
                  {card.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
                </ul>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
                  {card.projects.map((project) => (
                    <TransitionLink key={project.slug} href={`/work/${project.slug}`} className="text-link note-muted">
                      → {project.title}
                    </TransitionLink>
                  ))}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}