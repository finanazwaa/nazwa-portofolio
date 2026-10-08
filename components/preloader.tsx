"use client";

import { useEffect, useState } from "react";
import { owner } from "@/lib/content";

const visitKey = "studio-seen";

export function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(visitKey)) return;
    window.sessionStorage.setItem(visitKey, "true");
    const showTimer = window.setTimeout(() => setVisible(true), 0);
    const hideTimer = window.setTimeout(() => setVisible(false), 760);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className="preloader" aria-hidden="true">
      <span className="display-title">{owner.name}</span>
    </div>
  );
}
