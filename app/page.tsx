import { HomeScene } from "@/components/home-scene";
import { AboutSection } from "@/components/sections/about-section";
import { AreasSection } from "@/components/sections/areas-section";
import { ContactSection } from "@/components/sections/contact-section";
import { WorkSection } from "@/components/sections/work-section";
import { owner } from "@/lib/content";

export default function Home() {
  const [firstName, ...restOfName] = owner.name.split(" ");
  return (
    <main className="flex-1">
      <section aria-label="introduction" className="page-shell relative isolate flex items-center py-16 md:py-24">
        <span className="blob hero-blob-1" aria-hidden="true" />
        <span className="blob hero-blob-2" aria-hidden="true" />
        <div className="grid w-full items-center gap-16 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
          <div className="flex min-h-[440px] flex-col justify-center md:min-h-[560px]">
            <p className="label-tape mb-8 self-start">computer science · data · digital experience</p>
            <h1 className="display-title max-w-[9ch]">
              <span>Fina</span>
              <em>nazwa</em>
              <span> Ayesha</span>
            </h1>
            <p className="mt-7 max-w-[39ch] text-[16px] leading-[1.7] text-muted md:text-[17px]">{owner.subtitle}</p>
            <p className="hand-note mt-auto max-w-[24ch] rotate-[-2deg] pt-14">
              hover or choose an object... <span aria-hidden="true" className="inline-block rotate-90 md:-rotate-[25deg]">→</span>
            </p>
          </div>
          <HomeScene />
        </div>
      </section>
      <AboutSection />
      <AreasSection />
      <WorkSection />
      <ContactSection />
    </main>
  );
}
