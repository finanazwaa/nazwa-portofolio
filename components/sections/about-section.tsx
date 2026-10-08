import type { CSSProperties } from "react";
import Image from "next/image";
import { ExperienceList } from "@/components/experience-list";
import { about } from "@/lib/content";

// Index cards taped onto the page, each at its own slight angle.
const card = (tilt: string, extra = "") => ({
  className: `paper-card index-card tape ${extra}`.trim(),
  style: { "--card-tilt": tilt } as CSSProperties,
});

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" tabIndex={-1} className="page-section page-shell relative isolate pb-28 pt-14 md:pb-36 md:pt-20">
      <p className="kicker">no. 01</p>
      <h2 id="about-title" className="display-title"><span className="marker marker-blush">about</span></h2>

      <div className="mt-12 grid gap-14 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-16">
        <div className="space-y-5">
          {about.paragraphs.map((paragraph) => <p key={paragraph} className="content-copy">{paragraph}</p>)}
        </div>
        <blockquote className="pull-quote justify-self-center md:justify-self-start">{about.quote}</blockquote>
      </div>

      <dl className="mt-24 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-32 lg:grid-cols-3 lg:gap-x-10">
        <div {...card("-1.2deg", "tape-blush")}>
          <dt className="meta-label text-muted">education</dt>
          <dd className="mt-3 text-[14px]">{about.education}</dd>
        </div>
        <div {...card("0.9deg", "tape-powder")}>
          <dt className="meta-label text-muted">experience</dt>
          <dd className="mt-3">
            <ExperienceList entries={about.experience} />
          </dd>
        </div>
        <div {...card("-0.6deg", "w-fit justify-self-start sm:col-span-2 lg:col-span-1")}>
          <dt className="meta-label text-muted">tools</dt>
          <dd className="mt-4">
            <ul className="grid grid-cols-4 gap-2">
              {about.tools.map((tool) => (
                <li key={tool.slug} className="tool-tile">
                  <Image src={`/logos/${tool.slug}.svg`} alt={tool.name} width={24} height={24} unoptimized className="tool-logo-mono" />
                  <Image src={`/logos/color/${tool.slug}.svg`} alt="" width={24} height={24} unoptimized className="tool-logo-color" />
                  <span className="tool-label" aria-hidden="true">{tool.name}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </section>
  );
}
