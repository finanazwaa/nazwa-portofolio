import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { HeroGallery } from "@/components/hero-gallery";
import { TransitionLink } from "@/components/site-chrome";
import { projects } from "@/lib/content";

const swatches = ["butter", "powder", "blush", "sage"] as const;
const linkStickers = ["butter", "sage"] as const;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  const project = projects[index];
  if (!project) notFound();

  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const swatch = swatches[index % swatches.length];

  return (
    <main className="page-shell flex-1 pb-28 pt-8">
      <TransitionLink href="/#work" className="studio-link text-[13px] text-muted">← all work</TransitionLink>

      {/* title block: number + title on the left, category label stuck on the right */}
      <header className="mt-12 grid gap-6 md:mt-16 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="kicker">no. {project.number} — selected works</p>
          <h1 className="display-title max-w-[14ch] text-[clamp(44px,7vw,88px)]">{project.title}</h1>
        </div>
        <p className="md:pb-3"><span className="label-tape [--label-color:var(--blush)]">{project.category}</span></p>
      </header>

      {/* hero spread: taped slideshow of visuals with the caption written beside it */}
      <figure className="spread-hero mt-12 grid gap-6 md:mt-16 md:grid-cols-[1fr_minmax(0,16rem)] md:items-end md:gap-10">
        <HeroGallery visuals={project.heroVisuals} number={project.number} title={project.title} swatch={swatch} />
        <figcaption className="md:pb-2">
          <p className="hand-note text-[22px]">{project.heroCaption}</p>
          {project.links.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-3">
              {project.links.map((link, linkIndex) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-sticker"
                    style={{ "--sticker": `var(--${linkStickers[linkIndex % linkStickers.length]})`, "--sticker-rot": linkIndex % 2 ? "1deg" : "-1.5deg" } as CSSProperties}
                  >
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </figcaption>
      </figure>

      {/* facts as an index card */}
      <dl className="paper-card tape tape-powder mt-16 grid grid-cols-2 gap-x-8 gap-y-7 p-7 sm:grid-cols-4 md:mt-20 md:p-9">
        {[
          ["role", project.role],
          ["tools", project.tools],
          ["year", project.year],
          ["team", project.team],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="meta-label text-muted">{label}</dt>
            <dd className="mt-2 text-[14px]">{value}</dd>
          </div>
        ))}
      </dl>

      {/* story: numbered chapters set slightly off-grid, like a magazine feature */}
      <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-[1fr_2.2fr] md:gap-16">
        <div>
          <p className="kicker sticky top-[calc(var(--header-height)+2rem)]">the project story ↓</p>
        </div>
        <div className="space-y-20 md:space-y-28">
          {project.chapters.map((chapter, chapterIndex) => (
            <section key={chapter.heading} className={chapterIndex % 2 ? "md:ml-[12%]" : ""}>
              <p className="chapter-no">{String(chapterIndex + 1).padStart(2, "0")}</p>
              <h2 className="chapter-title mt-2"><span className={`marker ${["marker-blush", "marker-powder", "marker-sage"][chapterIndex % 3]}`}>{chapter.heading}</span></h2>
              <p className="content-copy mt-5 text-muted">{chapter.body}</p>
            </section>
          ))}
        </div>
      </div>

      <nav aria-label="project navigation" className="mt-32 flex items-start justify-between gap-6">
        <TransitionLink href={`/work/${previous.slug}`} className="link-sticker max-w-[46%] [--sticker-rot:-1.5deg] [--sticker:var(--butter)]">
          <span className="meta-label block text-muted">previous</span>
          <span className="mt-1 block text-[14px]">← {previous.number} {previous.title}</span>
        </TransitionLink>
        <TransitionLink href={`/work/${next.slug}`} className="link-sticker max-w-[46%] text-right [--sticker-rot:1.5deg] [--sticker:var(--powder)]">
          <span className="meta-label block text-muted">next</span>
          <span className="mt-1 block text-[14px]">{next.number} {next.title} →</span>
        </TransitionLink>
      </nav>
    </main>
  );
}
