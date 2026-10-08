"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type FocusEvent, type ReactNode, type RefObject } from "react";

// Must match the media query that switches on the deck layout in globals.css. Browsers that
// don't recognise `scripting`, and reduced-motion users, keep the plain list.
const DECK_QUERY = "(scripting: enabled) and (prefers-reduced-motion: no-preference)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Maps the wrapper's scroll progress to per-card transforms. One layout read per frame
// (the wrapper's rect), then transform/opacity writes only; scrolling itself is never touched.
function useDeckScroll(wrapperRef: RefObject<HTMLDivElement | null>, count: number) {
  const geometry = useRef({ enabled: false, distance: 1, stickyTop: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = wrapper?.firstElementChild as HTMLElement | null;
    if (!wrapper || !stage) return;
    const cards = Array.from(wrapper.querySelectorAll<HTMLElement>(".work-deck-card"));
    const restAngles = cards.map((card) => parseFloat(card.style.getPropertyValue("--deck-rest")) || 0);
    const query = window.matchMedia(DECK_QUERY);
    let frame = 0;
    let lastPosition = Number.NaN;

    const reset = () => cards.forEach((card) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.pointerEvents = "";
    });

    const render = () => {
      frame = 0;
      const { enabled, distance, stickyTop } = geometry.current;
      if (!enabled) return;
      // 0 → first card on top, count - 1 → last card on top.
      const position = clamp01((stickyTop - wrapper.getBoundingClientRect().top) / distance) * (count - 1);
      if (position === lastPosition) return;
      lastPosition = position;
      cards.forEach((card, index) => {
        const outgoing = clamp01(position - index); // 0 → resting on top, 1 → lifted away
        const settled = clamp01(position - index + 1); // 0 → buried in the pile, 1 → in focus
        const scale = (0.96 + 0.04 * settled) * (1 - 0.05 * outgoing);
        card.style.transform =
          `perspective(1600px) translateY(${-115 * outgoing}%) rotateX(${12 * outgoing}deg) ` +
          `rotate(${restAngles[index] * (1 - settled)}deg) scale(${scale})`;
        card.style.opacity = String(1 - clamp01((outgoing - 0.6) / 0.4));
        card.style.pointerEvents = outgoing > 0.5 ? "none" : "";
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const measure = () => {
      const enabled = query.matches;
      geometry.current = {
        enabled,
        distance: Math.max(1, wrapper.offsetHeight - stage.offsetHeight),
        stickyTop: parseFloat(getComputedStyle(stage).top) || 0,
      };
      lastPosition = Number.NaN;
      if (enabled) schedule();
      else reset();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    query.addEventListener("change", measure);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(stage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      query.removeEventListener("change", measure);
      resizeObserver.disconnect();
      reset();
    };
  }, [wrapperRef, count]);

  // Scroll position at which card `index` sits on top of the deck.
  return useCallback((index: number) => {
    const wrapper = wrapperRef.current;
    const { enabled, distance, stickyTop } = geometry.current;
    if (!wrapper || !enabled) return;
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: wrapperTop - stickyTop + (index / Math.max(1, count - 1)) * distance });
  }, [wrapperRef, count]);
}

export function WorkDeck({ count, children }: { count: number; children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollToCard = useDeckScroll(wrapperRef, count);

  // Keyboard users tabbing through the deck bring the focused card to the top.
  function bringFocusedCardForward(event: FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const card = target.closest(".work-deck-card");
    if (!card?.parentElement || !target.matches(":focus-visible")) return;
    scrollToCard(Array.prototype.indexOf.call(card.parentElement.children, card));
  }

  return (
    <div
      ref={wrapperRef}
      className="work-deck mt-12 md:mt-16"
      style={{ "--deck-count": count } as CSSProperties}
      onFocus={bringFocusedCardForward}
    >
      <div className="work-deck-stage">{children}</div>
    </div>
  );
}
