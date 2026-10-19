"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download, Github, Mail, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { experience, projects, site, skillGroups } from "@/lib/data";
import { cn } from "@/lib/utils";

const nav = [["Work", "projects"], ["About", "about"], ["Experience", "experience"]] as const;

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
    <main id="top"><Hero reduceMotion={reduceMotion} /><Work /><About /><Experience /><Contact /></main>
    <footer className="page-width footer"><span>© {new Date().getFullYear()} Yuxuan Chen</span><span>Software engineer · applied AI · systems with intent</span><Link href="#top" className="footer-top">Back to top <ArrowUpRight size={14} /></Link></footer>
  </div>;
}

function Hero({ reduceMotion }: { reduceMotion: boolean | null }) {
  const { scrollYProgress } = useScroll();
  const visualY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  return <section className="hero page-width" aria-labelledby="hero-title">
    <div className="hero__copy">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Software engineer <span>·</span> Boston, MA</motion.p>
      <motion.h1 id="hero-title" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>Building systems.<br /><em>Beyond</em> the interface.</motion.h1>
      <motion.p className="hero__lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>I design and ship full-stack products where dependable engineering meets applied AI — from experiment infrastructure to interfaces people want to use.</motion.p>
      <motion.div className="hero__actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}><Link href="#projects" className="button button--primary">Selected work <ArrowDownRight size={16} /></Link><Link href={site.resume} className="button button--quiet">Resume <Download size={15} /></Link></motion.div>
      <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}><span>M.S. Software Engineering Systems</span><span>Northeastern University · 2026</span></motion.div>
    </div>
    <motion.div className="hero__visual-wrap" style={{ y: reduceMotion ? 0 : visualY }}><HeroVisual reduceMotion={reduceMotion} /></motion.div>
    <div className="hero__scroll"><span>Scroll to explore</span><ArrowDownRight size={15} /></div>
  </section>;
}

function HeroVisual({ reduceMotion }: { reduceMotion: boolean | null }) {
  return <div className={cn("hero-visual", reduceMotion && "hero-visual--static")} aria-label="Abstract visualization of an AI system" role="img"><div className="hero-visual__glow" /><div className="hero-visual__orb" /><div className="hero-visual__orbit hero-visual__orbit--one" /><div className="hero-visual__orbit hero-visual__orbit--two" /><div className="hero-visual__core"><Sparkles size={19} /><span>signal / 01</span></div><svg className="hero-visual__lines" viewBox="0 0 600 600" fill="none" aria-hidden="true"><path d="M75 150C190 64 324 88 437 177C505 230 511 354 426 435C339 518 188 532 88 431" /><path d="M108 440C175 306 272 228 448 136" /><circle cx="75" cy="150" r="4" /><circle cx="437" cy="177" r="4" /><circle cx="88" cy="431" r="4" /></svg><div className="hero-visual__label hero-visual__label--a">01 / observe</div><div className="hero-visual__label hero-visual__label--b">02 / evaluate</div><div className="hero-visual__label hero-visual__label--c">03 / learn</div></div>;
}

function SectionIntro({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return <div className="section-intro"><p className="eyebrow">{kicker}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Work() {
  return <section id="projects" className="section page-width" aria-labelledby="work-title"><SectionIntro kicker="01 / Selected work" title="Systems that make complex things feel legible." copy="A small set of projects spanning generative search, LLM evaluation, and large-scale language data." /><div className="project-list">{projects.map((project, index) => <ProjectRow key={project.title} project={project} index={index} />)}</div></section>;
}

function ProjectRow({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return <motion.article className={cn("project-row", index % 2 === 1 && "project-row--reverse")} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}><Link href={`/projects/${project.slug}`} className="project-visual" aria-label={`View ${project.title} case study`}><Image src={project.image} alt={`${project.title} abstract project visual`} fill sizes="(max-width: 900px) 100vw, 58vw" /><span className="project-visual__index">0{index + 1}</span><span className="project-visual__view">View case study <ArrowUpRight size={15} /></span></Link><div className="project-copy"><div className="project-copy__top"><span>{project.category}</span><span>{project.timeline.split(" - ")[0]}</span></div><h3>{project.title}</h3><p>{project.description}</p><div className="tech-line">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-links"><Link href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={15} /></Link><a href={project.links.github} target="_blank" rel="noreferrer">Source <Github size={14} /></a></div></div></motion.article>;
}

function About() {
  return <section id="about" className="section section--dark" aria-labelledby="about-title"><div className="page-width about-grid"><SectionIntro kicker="02 / About" title="Curious about the layer between idea and implementation." /><div className="about-body"><p className="about-lede">I am Yuxuan — a software engineer who likes the hard middle: turning ambiguous research questions into reliable systems, then giving those systems a clear, human surface.</p><p>I work across backend architecture, data workflows, and interaction design. My current focus is applied AI: evaluation infrastructure, retrieval, browser automation, and the details that make an LLM product trustworthy.</p><div className="about-facts"><span>Currently</span><strong>Research Assistant<br />Northeastern University</strong><span>Based in</span><strong>Greater Boston area</strong></div></div></div><div className="page-width skill-band"><p className="eyebrow">Tools I reach for</p><div className="skill-marquee">{skillGroups.flatMap((group) => group.skills).slice(0, 18).map((skill, index) => <span key={`${skill}-${index}`}>{skill}</span>)}</div></div></section>;
}

function Experience() {
  return <section id="experience" className="section page-width" aria-labelledby="experience-title"><SectionIntro kicker="03 / Experience" title="A practice shaped by research, shipping, and iteration." /><div className="experience-list">{experience.map((item, index) => <motion.article key={`${item.company}-${item.dates}`} className="experience-row" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><div className="experience-dates">{item.dates}</div><div><p className="experience-company">{item.company}</p><h3>{item.role}</h3><ul>{item.responsibilities.slice(0, 2).map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul></div><div className="experience-index">0{index + 1}</div></motion.article>)}</div></section>;
}

function Contact() {
  return <section id="contact" className="contact-section page-width" aria-labelledby="contact-title"><div className="contact-card"><p className="eyebrow">04 / Contact</p><h2 id="contact-title">Have a good problem?<br /><em>Let&apos;s talk.</em></h2><p>Open to software engineering, applied AI, and research-oriented teams building with care.</p><div className="contact-links"><a className="button button--primary" href={`mailto:${site.email}`}>Start a conversation <Mail size={15} /></a><a className="social-link" href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a className="social-link" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div></div></section>;
