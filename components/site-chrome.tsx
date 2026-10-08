"use client";

import { useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { owner } from "@/lib/content";

let navigationStarted = false;

// Scrolls to a home-page section ("#about", "/#work", "#top"). Smoothness comes from the
// CSS scroll-behavior on <html>, so reduced-motion users get an instant jump.
// Next patches history.pushState, so the entry stays usable by the back button.
export function scrollToSection(hash: string) {
  const id = hash.slice(hash.indexOf("#") + 1);
  const target = id === "top" ? null : document.getElementById(id);
  if (target) {
    target.scrollIntoView();
    target.focus({ preventScroll: true });
  } else {
    window.scrollTo({ top: 0 });
  }
  const url = target ? `${window.location.pathname}#${id}` : window.location.pathname;
  if (url !== window.location.pathname + window.location.hash) window.history.pushState(null, "", url);
}

export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...anchorProps
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className" | "onClick"> & {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const link = event.currentTarget;
    if (
      event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || link.target || link.hasAttribute("download") ||
      href.startsWith("mailto:")
    ) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    if (url.pathname === pathname) {
      if (url.hash) scrollToSection(url.hash);
      return;
    }
    if (navigationStarted) return;
    navigationStarted = true;
    window.dispatchEvent(new CustomEvent("studio:navigate", { detail: { source: "navigation" } }));
    window.setTimeout(() => router.push(href), 300);
  }

  return (
    <a {...anchorProps} href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

export function TransitionWash() {
  const [active, setActive] = useState(false);
  const [source, setSource] = useState<"navigation" | "scene">("navigation");
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  useEffect(() => {
    const begin = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: "navigation" | "scene" }>).detail;
      setSource(detail?.source === "scene" ? "scene" : "navigation");
      setActive(true);
    };
    window.addEventListener("studio:navigate", begin);
    return () => window.removeEventListener("studio:navigate", begin);
  }, []);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    const frame = window.requestAnimationFrame(() => {
      navigationStarted = false;
      setActive(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);
  return <div className={`transition-wash transition-wash-${source}${active ? " is-active" : ""}`} aria-hidden="true" />;
}

const navigation = [
  { label: "Home", id: "top" },
  { label: "About", id: "about" },
  { label: "Areas", id: "areas" },
  { label: "Work", id: "work" },
  { label: "Contact", id: "contact" },
];

// Tracks which home-page section sits under the reading line below the header.
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("top");
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const readingLine = root.clientHeight * 0.35;
      let current = "top";
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
        current = navigation[navigation.length - 1].id;
      } else {
        for (const { id } of navigation.slice(1)) {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= readingLine) current = id;
        }
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled]);
  return active;
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProject = pathname.startsWith("/work/");
  const activeSection = useActiveSection(isHome);
  const headerRef = useRef<HTMLElement>(null);

  // Publishes the header height so sections can offset their scroll position
  // (the nav wraps to two lines on narrow screens).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty("--header-height", `${header.offsetHeight}px`));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-40">
      <div className="page-shell flex min-h-8 items-center justify-between gap-8 pb-4 pt-7 md:pt-9">
        <TransitionLink href="/#top" className="monogram" aria-label={`${owner.name} — home`}>
          {owner.monogram}
        </TransitionLink>
        <nav aria-label="main navigation" className="flex flex-wrap justify-end gap-x-5 gap-y-2 md:gap-x-8">
          {navigation.map((item) => {
            const current = isHome ? activeSection === item.id : isProject && item.id === "work";
            return (
              <TransitionLink
                key={item.id}
                href={`/#${item.id}`}
                aria-current={current ? (isHome ? "location" : "page") : undefined}
                className="nav-link text-[12px] tracking-[0.07em] md:text-[13px]"
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const isHome = usePathname() === "/";
  return (
    <footer className="page-shell mt-auto pb-7 pt-10 text-[12px] text-muted">
      <div className="squiggle-rule mb-6" aria-hidden="true" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 {owner.name}</span>
        {/* The contact section already lists these links on the home page. */}
        {!isHome && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={owner.emailLink} className="text-link">email · {owner.email}</a>
            <a href={owner.linkedinLink} className="text-link">linkedin · {owner.linkedin}</a>
            <a href={owner.githubLink} className="text-link">github · {owner.github}</a>
          </div>
        )}
      </div>
    </footer>
  );
}
