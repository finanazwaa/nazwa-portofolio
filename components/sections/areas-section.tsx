import { AreasGrid } from "@/components/areas-grid";
import { areas, projects } from "@/lib/content";

export function AreasSection() {
  return (
    <section id="areas" aria-labelledby="areas-title" tabIndex={-1} className="page-section page-shell relative isolate pb-28 pt-14 md:pb-36 md:pt-20">
      <p className="kicker">no. 02</p>
      <h2 id="areas-title" className="display-title">areas <em>i work in</em></h2>
      <p className="content-copy mt-7 text-muted">I work across analytical questions, consumer understanding, and thoughtful digital communication.</p>

      <AreasGrid cards={areas.map((area) => ({
        ...area,
        projects: area.projects.flatMap((slug) => {
          const project = projects.find((item) => item.slug === slug);
          return project ? [{ slug, title: project.title }] : [];
        }),
      }))} />
    </section>
  );
}
