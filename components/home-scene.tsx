"use client";

import { useState } from "react";
import Image from "next/image";
import { HomeExperience } from "@/components/home-experience";
import { TransitionLink } from "@/components/site-chrome";
import { deskBackground, sceneDoors } from "@/lib/content";

// The scene sits in a taped-down "print" with a tilted colour block behind it. The print itself
// stays square to the page so pointer picking on the 3D canvas stays exact.
export function HomeScene() {
  const [sceneReady, setSceneReady] = useState(false);
  return (
    <figure className="scene-collage w-full">
      <span className="blob hero-blob-3" aria-hidden="true" />
      <div className="photo-print">
        <div className={`scene-frame relative aspect-[1.45/1] overflow-hidden bg-paper${sceneReady ? " is-enhanced" : ""}`}>
          {/* Drawn desk + sky. Stays visible behind the transparent 3D canvas. */}
          <Image src={deskBackground} alt="" fill priority sizes="(max-width: 767px) 100vw, 58vw" className="object-cover" />
          {/* Flat still life with the same drawings in the same spots: shown until the 3D scene has
              loaded them, and instead of it without WebGL or with reduced motion. */}
          <div
            role="img"
            aria-label="a desk under a blue sky with a laptop, a stack of books, a vase and an envelope"
            className="still-life-image absolute inset-0"
          >
            {sceneDoors.map((door, index) => (
              // Plain <img>: the 3D scene loads these same files, so the browser cache is shared.
              // eslint-disable-next-line @next/next/no-img-element
              <img key={door.number} src={door.asset.src} alt="" className={`desk-still desk-still-${index + 1}`} />
            ))}
          </div>
          {!sceneReady && (
            <nav aria-label="scene sections" className="scene-fallback-links absolute inset-0">
              {sceneDoors.map((door, index) => (
                <TransitionLink
                  key={door.number}
                  href={door.href}
                  className={`scene-chip scene-chip-${index + 1}`}
                >
                  {door.number} — {door.chipLabel}
                </TransitionLink>
              ))}
            </nav>
          )}
          <HomeExperience onReady={() => setSceneReady(true)} />
        </div>
      </div>
      <span className="tape tape-a" aria-hidden="true" />
      <span className="tape tape-b" aria-hidden="true" />
      <figcaption className="hand-note mt-5 text-center text-[20px] text-muted">click an object, or use the menu above.</figcaption>
    </figure>
  );
}
