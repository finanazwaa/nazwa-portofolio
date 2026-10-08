import type { CSSProperties } from "react";
import { owner } from "@/lib/content";

const sticker = (color: string, rot: string) => ({ "--sticker": `var(--${color})`, "--sticker-rot": rot } as CSSProperties);

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" tabIndex={-1} className="page-section page-shell relative isolate pb-28 pt-14 md:pb-36 md:pt-20">
      <p className="kicker">no. 04</p>
      <div className="paper-card contact-spread tape tape-powder isolate mt-4">
        {/* blobs are clipped to the card; the tape on the card edge is not */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
          <span className="blob right-[-6%] top-[-18%] aspect-square w-[clamp(200px,32vw,380px)] [--blob-color:var(--blush)]" />
          <span className="blob bottom-[-22%] right-[22%] aspect-square w-[clamp(120px,16vw,200px)] [--blob-color:var(--butter)]" />
        </div>
        <div className="relative">
          <h2 id="contact-title" className="display-title"><span className="marker marker-powder">contact</span></h2>
          <p className="hand-note mt-6 rotate-[-3deg] text-[clamp(34px,4.5vw,48px)] text-accent">say hello.</p>
          <a href={owner.emailLink} className="cta-sticker mt-10">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
          <div className="mt-14 flex flex-wrap gap-x-4 gap-y-4">
            <a href={owner.emailLink} className="link-sticker" style={sticker("butter", "-1.5deg")}>email · {owner.email}</a>
            <a href={owner.linkedinLink} className="link-sticker" style={sticker("powder", "1deg")}>linkedin · {owner.linkedin}</a>
            <a href={owner.githubLink} className="link-sticker" style={sticker("sage", "-0.8deg")}>github · {owner.github}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
