"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/data";

const sourceDimensions: Record<string, { width: number; height: number }> = {
  "/images/project-media/geo-engine-dashboard.jpg": { width: 1265, height: 712 },
  "/images/project-media/geo-engine-citation-tests.jpg": { width: 1912, height: 1080 },
  "/images/project-media/geo-engine-website-audit.jpg": { width: 1265, height: 1765 },
};

export function ProjectMediaGallery({ title, media }: { title: string; media: ProjectMedia[] }) {
  const [selected, setSelected] = useState<ProjectMedia | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openMedia = (item: ProjectMedia) => setSelected(item);

  useEffect(() => {
    if (!selected) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSelected(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, [selected]);

  const closeMedia = () => setSelected(null);

  return <>
    <div className="project-media-gallery" aria-label={`${title} visual evidence`}>
      {media.map((item) => <figure key={item.src} className={`project-media-card project-media-card--${item.kind}`}>
        <button type="button" className="project-media-button" onClick={() => openMedia(item)} aria-label={`Expand ${item.caption}`}>
          <Image src={item.src} alt="" width={item.width ?? sourceDimensions[item.src]?.width ?? 1400} height={item.height ?? sourceDimensions[item.src]?.height ?? 760} sizes="(max-width: 900px) 100vw, 900px" />
          <span className="project-media-expand">Expand</span>
        </button>
        <figcaption><span className={`project-media-kind project-media-kind--${item.kind}`}>{item.kind === "screenshot" ? "Real screenshot" : "Explanatory diagram"}</span>{item.caption}</figcaption>
      </figure>)}
    </div>
    {selected && <div className="project-media-lightbox" role="dialog" aria-modal="true" aria-label={`${title} expanded visual`} onPointerDown={(event) => event.target === event.currentTarget && closeMedia()}>
      <div ref={dialogRef} className="project-media-lightbox__inner" onPointerDown={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="project-media-close" onClick={closeMedia} aria-label="Close expanded visual"><X size={20} /></button>
        <Image src={selected.src} alt={selected.caption} width={selected.width ?? sourceDimensions[selected.src]?.width ?? 1400} height={selected.height ?? sourceDimensions[selected.src]?.height ?? 760} sizes="95vw" priority />
        <p>{selected.caption}</p>
      </div>
    </div>}
  </>;
}
