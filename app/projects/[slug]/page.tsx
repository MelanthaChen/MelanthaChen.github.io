import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { notFound } from "next/navigation";
import { projects, site } from "@/lib/data";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata { const project = projects.find((item) => item.slug === params.slug); return project ? { title: project.title, description: project.description } : {}; }

export default function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = projects.find((item) => item.slug === params.slug);
  if (!project) notFound();
  return <main className="case-study">
    <header className="case-nav page-width"><Link href="/" className="case-back"><ArrowLeft size={15} /> Back to portfolio</Link><span className="brand-mark"><span className="brand-mark__dot" /> YC / 26</span></header>
    <div className="page-width case-hero"><p className="eyebrow">{project.category} · {project.timeline}</p><h1>{project.title}</h1><p className="case-summary">{project.description}</p><div className="case-links"><a href={project.links.github} target="_blank" rel="noreferrer">View source <Github size={15} /></a>{project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}</div></div>
    <div className="page-width case-image"><Image src={project.image} alt={`${project.title} technical visualization`} fill priority sizes="(max-width: 900px) 100vw, 1200px" /></div>
    <div className="page-width case-content"><aside><p className="eyebrow">On this page</p><a href="#overview">Overview</a><a href="#architecture">Architecture</a><a href="#engineering">Engineering</a><a href="#reliability">Reliability</a></aside><article>
      <CaseSection id="overview" title="01 / Overview"><p>{project.overview}</p><div className="case-callout"><span>Scope</span><strong>{project.problem}</strong></div></CaseSection>
      <CaseSection id="architecture" title="02 / Technical architecture"><p>{project.solution}</p><div className="architecture-grid">{project.architecture.map((item, index) => <div key={item.label} className="architecture-node"><span>0{index + 1}</span><h3>{item.label}</h3><p>{item.detail}</p></div>)}</div></CaseSection>
      <CaseSection id="engineering" title="03 / Engineering challenges"><div className="challenge-list">{project.challenges.map((challenge, index) => <div key={challenge}><span>0{index + 1}</span><p>{challenge}</p></div>)}</div><div className="case-decision"><span>Design decision</span><p>{project.decisions}</p></div></CaseSection>
      <CaseSection id="reliability" title="04 / Testing and outcomes"><p>{project.testing}</p><div className="case-outcome"><span>Outcome</span><p>{project.outcomes}</p></div><div className="case-stack"><span>Stack</span>{project.stack.map((item) => <b key={item}>{item}</b>)}</div></CaseSection>
      <CaseSection id="learned" title="05 / Reflection"><p>{project.learned}</p></CaseSection>
    </article></div>
    <footer className="page-width case-footer"><Link href="/">← All work</Link><span>{site.name} · 2026</span></footer>
  </main>;
}

function CaseSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) { return <section id={id} className="case-section"><p className="eyebrow">{title}</p><div className="case-section__body">{children}</div></section>; }
