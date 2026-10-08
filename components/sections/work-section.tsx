import Image from "next/image";
import type { CSSProperties } from "react";
import { TransitionLink } from "@/components/site-chrome";
import { WorkDeck } from "@/components/work-deck";
import { projects } from "@/lib/content";

// Tiny alternating tilt so the resting pile reads as physical cards; the top card sits straight.
const restAngle = (index: number) => (index === 0 ? 0 : index % 2 ? -2 : 1.5);

// Each card gets its own paper swatch and a slightly different cut-paper arrangement in the
// placeholder visual (used until the first heroVisual has an image; the card shows only that one), so the deck reads as a stack of zine pages rather than identical tiles.
const swatches = ["butter", "powder", "blush", "sage"] as const;
const dotColors = ["blush", "butter", "powder", "coral"] as const;
const projectSwatchOverrides: Record<string, (typeof swatches)[number]> = {
  byu: "blush",
  cosmetics: "powder",
  erp: "blush",
  retail: "butter",
};
const layouts = [
  { dot: "right-[8%] top-[12%] w-[34%]", strip: "left-[6%] top-[18%] h-[14%] w-[38%] -rotate-3" },
  { dot: "left-[10%] bottom-[-14%] w-[42%]", strip: "right-[8%] top-[14%] h-[12%] w-[30%] rotate-2" },
  { dot: "right-[18%] bottom-[10%] w-[26%]", strip: "left-[12%] top-[10%] h-[18%] w-[24%] rotate-6" },
  { dot: "left-[38%] top-[-12%] w-[36%]", strip: "right-[6%] bottom-[16%] h-[12%] w-[34%] -rotate-2" },
];

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" tabIndex={-1} className="page-section page-shell relative isolate pb-24 pt-16 md:pb-36 md:pt-24">
      <p className="kicker">no. 03 — portfolio</p>
      <h2 id="work-title" className="display-title">selected <em>works</em></h2>

      <WorkDeck count={projects.length}>
        <ul className="work-stack">
          {projects.map((project, index) => {
            const featured = index === 0;
            const swatch = projectSwatchOverrides[project.slug] ?? (featured ? "butter" : swatches[index % swatches.length]);
            const layout = layouts[index % layouts.length];
            return (
              <li
                key={project.slug}
                className="work-deck-card"
                style={{ "--deck-rest": `${restAngle(index)}deg`, "--deck-z": projects.length - index } as CSSProperties}
              >
                <TransitionLink
                  href={`/work/${project.slug}`}
                  className={`work-card p-6 md:p-8${featured ? " work-card-featured" : ""}`}
                  style={{ "--swatch": `var(--${swatch})` } as CSSProperties}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <p className="work-card-no">no. {project.number}</p>
                      <h3 className="work-card-title mt-2">{project.title}</h3>
                    </div>
                    <span className="work-card-muted shrink-0 pt-1 text-[12px]" aria-hidden="true">({project.number})</span>
                  </div>
                  <p className="mt-3"><span className="label-tape">{project.category}</span></p>
                  <p className="work-card-muted mt-4 max-w-[65ch] text-[15px] leading-relaxed md:text-[16px]">{project.summary}</p>

                  <div className="work-card-visual mt-6 aspect-[16/9] text-ink md:mt-8">
                    <div className="work-card-image absolute inset-0">
                      {project.heroVisuals[0]?.src ? (
                        <Image src={project.heroVisuals[0].src} alt={project.heroVisuals[0].alt} fill sizes="(min-width: 768px) 80vw, 100vw" className="object-cover" />
                      ) : (
                        <>
                          <span className={`visual-dot aspect-square ${layout.dot}`} style={{ background: `var(--${dotColors[index % dotColors.length]})` }} aria-hidden="true" />
                          <span className={`visual-strip ${layout.strip}`} aria-hidden="true" />
                          <span className="absolute bottom-4 left-5 font-display text-[clamp(72px,14vw,180px)] italic leading-[0.8] tracking-[-0.06em] text-ink/15 md:bottom-6 md:left-8">{project.number}</span>
                          <span className="meta-label absolute right-5 top-5 text-ink/60 md:right-6 md:top-6">TODO(content): project visual</span>
                        </>
                      )}
                    </div>
                  </div>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </WorkDeck>
    </section>
  );
}
