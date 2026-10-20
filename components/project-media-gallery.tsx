"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProjectMedia } from "@/lib/data";

export function ProjectMediaGallery({ title, media }: { title: string; media: ProjectMedia[] }) {
  const [selected, setSelected] = useState<ProjectMedia | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return <>
    <div className="project-media-gallery" aria-label={`${title} visual evidence`}>
      {media.map((item) => <figure key={item.src} className="project-media-card">
        <button type="button" className="project-media-button" onClick={() => setSelected(item)} aria-label={`Expand ${item.caption}`}>
          <Image src={item.src} alt="" width={1600} height={900} sizes="(max-width: 900px) 100vw, 900px" />
          <span className="project-media-expand">Expand</span>
        </button>
        <figcaption><span className={`project-media-kind project-media-kind--${item.kind}`}>{item.kind === "screenshot" ? "Real screenshot" : "Explanatory diagram"}</span>{item.caption}</figcaption>
      </figure>)}
    </div>
    {selected && <div className="project-media-lightbox" role="dialog" aria-modal="true" aria-label={`${title} expanded visual`} onClick={() => setSelected(null)}>
      <div className="project-media-lightbox__inner" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="project-media-close" onClick={() => setSelected(null)} aria-label="Close expanded visual"><X size={20} /></button>
        <Image src={selected.src} alt={selected.caption} width={2000} height={1200} sizes="95vw" priority />
        <p>{selected.caption}</p>
      </div>
    </div>}
  </>;
}
