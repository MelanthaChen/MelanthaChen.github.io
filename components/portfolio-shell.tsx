"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Github, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { experience, projects, site, skillGroups } from "@/lib/data";
import { cn } from "@/lib/utils";

const nav = [["Work", "projects"], ["About", "about"], ["Experience", "experience"]] as const;
const geo = projects.find((project) => project.slug === "geo-engine")!;
const otherProjects = projects.filter((project) => project.slug !== "geo-engine");

export function PortfolioShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-theme");
    const next = stored ? stored === "dark" : true;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("portfolio-theme", next ? "dark" : "light");
  };

  return <div className="site-shell min-h-screen overflow-x-hidden">
    <motion.div className="reading-progress" style={{ scaleX: progress }} />
    <header className={cn("site-nav", scrolled && "site-nav--scrolled")}>
      <div className="page-width flex h-[76px] items-center justify-between">
        <Link href="#top" className="brand-mark" aria-label="Yuxuan Chen home"><span className="brand-mark__dot" /><span>YC / 26</span></Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">{nav.map(([label, id]) => <Link className="nav-link" key={id} href={`#${id}`}>{label}</Link>)}</nav>
        <div className="flex items-center gap-2">
          <button className="icon-button" onClick={toggleTheme} aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <Link href={site.resume} className="nav-resume hidden sm:inline-flex">Resume <ArrowUpRight size={14} /></Link>
          <button className="icon-button md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mobile-menu md:hidden">{nav.map(([label, id]) => <Link key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={15} /></Link>)}<Link href={site.resume} onClick={() => setMenuOpen(false)}>Resume<Download size={15} /></Link></motion.nav>}</AnimatePresence>
    </header>
    <main id="top"><Hero reduceMotion={reduceMotion} /><Work reduceMotion={reduceMotion} /><About /><Experience /><Contact /></main>
    <footer className="page-width footer"><span>© {new Date().getFullYear()} Yuxuan Chen</span><span>Software engineer · applied AI · systems with intent</span><Link href="#top" className="footer-top">Back to top <ArrowUpRight size={14} /></Link></footer>
  </div>;
}

function Hero({ reduceMotion }: { reduceMotion: boolean | null }) {
  const { scrollYProgress } = useScroll();
  const visualY = useTransform(scrollYProgress, [0, 0.2], [0, -90]);
  return <section className="hero page-width" aria-labelledby="hero-title">
    <div className="hero__copy">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Software engineer <span>·</span> Boston, MA</motion.p>
      <motion.h1 id="hero-title" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>I build the systems<br /><em>behind AI products.</em></motion.h1>
      <motion.p className="hero__lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>I&apos;m a software engineer focused on backend, full-stack development, and applied AI. I build reliable APIs, data pipelines, browser automation, and user-facing products from architecture to deployment.</motion.p>
      <motion.div className="hero__actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}><Link href="#projects" className="button button--primary">Selected work <ArrowDownRight size={16} /></Link><Link href={site.resume} className="button button--quiet">Resume <Download size={15} /></Link></motion.div>
      <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}><span>M.S. Software Engineering Systems · Northeastern</span><span>Expected Dec 2026 · Boston area</span></motion.div>
    </div>
    <motion.div className="hero__visual-wrap" style={{ y: reduceMotion ? 0 : visualY }}><HeroVisual reducedMotion={reduceMotion} /></motion.div>
    <div className="hero__scroll"><span>Scroll to explore</span><ArrowDownRight size={15} /></div>
  </section>;
}

function HeroVisual({ reducedMotion }: { reducedMotion: boolean | null }) {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || reducedMotion) return;
    const reset = () => {
      visual.style.setProperty("--parallax-x", "0px");
      visual.style.setProperty("--parallax-y", "0px");
    };
    const move = (event: PointerEvent) => {
      const bounds = visual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
      visual.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      visual.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
    };
    visual.addEventListener("pointermove", move, { passive: true });
    visual.addEventListener("pointerleave", reset);
    return () => {
      visual.removeEventListener("pointermove", move);
      visual.removeEventListener("pointerleave", reset);
    };
  }, [reducedMotion]);

  return <div ref={visualRef} className="hero-mark" aria-hidden="true">
    <div className="hero-mark__halo" />
    <div className="hero-mark__ring hero-mark__ring--outer" />
    <div className="hero-mark__ring hero-mark__ring--inner" />
    <div className="hero-mark__orb"><div className="hero-mark__orb-shape" /></div>
    <div className="hero-mark__axis hero-mark__axis--horizontal" />
    <div className="hero-mark__axis hero-mark__axis--vertical" />
    <span className="hero-mark__label hero-mark__label--top">01 / SYSTEMS STUDY</span>
    <span className="hero-mark__label hero-mark__label--bottom">BUILD / TEST / ITERATE</span>
  </div>;
}

function Work({ reduceMotion }: { reduceMotion: boolean | null }) {
  return <section id="projects" className="section work-section" aria-labelledby="work-title"><div className="page-width"><div className="work-heading"><div><p className="eyebrow">01 / Selected work</p><h2 id="work-title">Systems with<br /><em>evidence.</em></h2></div><p className="work-heading__note">Backend platforms, applied AI workflows, browser integrations, and products I built to make complex work observable and reviewable.</p></div><FlagshipProject project={geo} reduceMotion={reduceMotion} /><div className="project-atlas">{otherProjects.map((project, index) => <AtlasProject key={project.slug} project={project} index={index} />)}</div></div></section>;
}

function FlagshipProject({ project }: { project: (typeof projects)[number]; reduceMotion: boolean | null }) {
  return <motion.article className="flagship-project" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-90px" }} transition={{ duration: 0.8 }}><div className="flagship-project__visual"><Image src={project.image} alt={`${project.title} technical visualization`} fill sizes="(max-width: 900px) 100vw, 1200px" priority /><div className="project-stamp"><span>01</span><span>Flagship / live system</span></div><span className="project-media-kind project-media-kind--screenshot flagship-project__evidence-label">Real screenshot</span></div><div className="flagship-project__copy"><div><p className="eyebrow">{project.category} · {project.timeline.split(" · ")[0]}</p><h3>{project.title}</h3></div><div><p>{project.description}</p><div className="tech-line">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-links"><Link href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={15} /></Link><a href={project.links.github} target="_blank" rel="noreferrer">Source <Github size={14} /></a>{project.links.demo && <a href={project.links.demo} target="_blank" rel="noreferrer">Live system <ArrowUpRight size={14} /></a>}</div></div></div></motion.article>;
}

function AtlasProject({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const isDiagram = project.image.endsWith(".svg");
  return <motion.article className={cn("atlas-project", `atlas-project--${index + 2}`)} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.7, delay: index * 0.06 }}><Link href={`/projects/${project.slug}`} className={cn("atlas-project__visual", isDiagram && "atlas-project__visual--diagram")} aria-label={`View ${project.title} case study`}><Image src={project.image} alt={`${project.title} product visual`} fill sizes="(max-width: 760px) 100vw, 50vw" /><span className="project-stamp"><span>0{index + 2}</span><span>{project.category}</span></span><span className={cn("project-media-kind", isDiagram ? "project-media-kind--diagram" : "project-media-kind--screenshot", "atlas-project__evidence-label")}>{isDiagram ? "Explanatory diagram" : "Real screenshot"}</span><span className="atlas-arrow"><ArrowUpRight size={18} /></span></Link><div className="atlas-project__copy"><p className="eyebrow">{project.timeline}</p><h3>{project.title}</h3><p>{project.description}</p><div className="tech-line">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-links"><Link href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={15} /></Link><a href={project.links.github} target="_blank" rel="noreferrer">Source <Github size={14} /></a></div></div></motion.article>;
}

function About() {
  return <section id="about" className="section about-section" aria-labelledby="about-title"><div className="page-width"><div className="manifesto"><p className="eyebrow">02 / About</p><h2 id="about-title">The interesting part is the <em>middle.</em></h2><p className="manifesto__lede">I like the space between a research question and a product people can trust.</p><div className="manifesto__body"><p>I&apos;m Yuxuan, a software engineer working across backend architecture, data workflows, and product surfaces. I enjoy taking complex automation and AI workflows from a rough idea to something observable and testable.</p><p>My current work spans evaluation infrastructure, retrieval, browser automation, and full-stack systems—especially the boundaries where model output becomes a decision someone can review.</p></div></div><div className="about-rail"><div><span>Currently</span><strong>Research Assistant<br />Northeastern University</strong></div><div><span>Based in</span><strong>Greater Boston area</strong></div><div><span>Tools I reach for</span><div className="skill-marquee">{skillGroups.flatMap((group) => group.skills).slice(0, 18).map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div></div></div></div></section>;
}

function Experience() {
  return <section id="experience" className="section experience-section page-width" aria-labelledby="experience-title"><div className="experience-heading"><p className="eyebrow">03 / Experience</p><h2 id="experience-title">A practice shaped by <em>research,</em> shipping, and iteration.</h2><p>Different contexts, same instinct: make the invisible system legible enough to improve.</p></div><div className="experience-list">{experience.map((item, index) => <motion.article key={`${item.company}-${item.dates}`} className="experience-row" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><div className="experience-dates">{item.dates}</div><div><p className="experience-company">{item.company}</p><h3>{item.role}</h3><ul>{item.responsibilities.slice(0, 2).map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul></div><div className="experience-index">0{index + 1}</div></motion.article>)}</div></section>;
}

function Contact() {
  return <section id="contact" className="contact-section page-width" aria-labelledby="contact-title"><div className="contact-card"><p className="eyebrow">04 / Contact</p><h2 id="contact-title">Have a good problem?<br /><em>Let&apos;s talk.</em></h2><p>Open to software engineering, applied AI, and research-oriented teams building with care.</p><div className="contact-links"><a className="button button--primary" href={`mailto:${site.email}`}>Start a conversation <Mail size={15} /></a><a className="social-link" href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a className="social-link" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div></section>;
}
