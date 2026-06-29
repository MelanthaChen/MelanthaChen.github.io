"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUp,
  ChevronDown,
  Command,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Github,
  Layers3,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { aboutCards, experience, navItems, projects, research, site, skillGroups, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

const categories = ["All", "AI Platform", "Developer Tool", "Search"] as const;

function Section({
  id,
  eyebrow,
  title,
  children,
  className
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-20 sm:py-24", className)}>
      <motion.div
        className="container-premium"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        variants={fadeUp}
      >
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-medium text-accent">{eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

export function PortfolioShell() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [expanded, setExpanded] = useState<string | null>("GEO Engine");
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setModalProject(null);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => activeCategory === "All" || project.category === activeCategory),
    [activeCategory]
  );

  const copyEmail = async () => {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent" style={{ scaleX: progress }} />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border/70 bg-background/78 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <nav className="container-premium flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link href="#top" className="text-sm font-semibold tracking-normal">
            Yuxuan Chen
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(([label, id]) => (
              <Link
                key={id}
                href={`#${id}`}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
              <Command className="mr-2 size-4" />
              <span className="hidden sm:inline">K</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode">
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </nav>
      </header>

      <main id="top">
        <Hero />
        <About />
        <Projects
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filteredProjects={filteredProjects}
          expanded={expanded}
          setExpanded={setExpanded}
          setModalProject={setModalProject}
        />
        <Research />
        <Experience />
        <Skills />
        <Resume />
        <Contact copied={copied} copyEmail={copyEmail} />
      </main>

      <Footer />
      <BackToTop />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <ArchitectureModal project={modalProject} onClose={() => setModalProject(null)} />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-24">
      <div className="subtle-grid pointer-events-none absolute inset-0" />
      <div className="container-premium relative grid min-h-[calc(100svh-6rem)] items-center gap-12 py-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.08 }}>
          <motion.p variants={fadeUp} className="mb-5 text-sm font-medium text-accent">
            Software Engineer
          </motion.p>
          <motion.h1 variants={fadeUp} className="max-w-4xl text-6xl font-semibold tracking-normal sm:text-7xl lg:text-8xl">
            Yuxuan Chen
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl">
            Building AI-powered platforms and intelligent developer tools.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            MS in Software Engineering Systems at Northeastern University, focused on LLM systems, AI search, and product-quality engineering.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="#projects">View Projects</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={site.resume}>
                <FileText className="mr-2 size-4" />
                Resume
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative mx-auto aspect-[0.92] w-full max-w-[470px]"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <Image
            src="/images/profile-abstract.svg"
            alt="Minimal abstract portrait illustration for Yuxuan Chen"
            fill
            priority
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="A systems-minded engineer with a product designer's level of care.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {aboutCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className="h-full p-5 transition hover:-translate-y-1 hover:shadow-premium dark:hover:shadow-premium-dark">
              <card.icon className="mb-5 size-5 text-accent" />
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <h3 className="mt-2 text-base font-semibold">{card.value}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.detail}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Projects({
  activeCategory,
  setActiveCategory,
  filteredProjects,
  expanded,
  setExpanded,
  setModalProject
}: {
  activeCategory: (typeof categories)[number];
  setActiveCategory: (category: (typeof categories)[number]) => void;
  filteredProjects: Project[];
  expanded: string | null;
  setExpanded: (title: string | null) => void;
  setModalProject: (project: Project) => void;
}) {
  return (
    <Section id="projects" eyebrow="Featured Projects" title="AI products with measurable architecture underneath.">
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Project filters">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid gap-5">
        {filteredProjects.map((project) => (
          <Card key={project.title} className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-[260px] bg-muted">
                <Image src={project.image} alt={`${project.title} interface preview`} fill className="object-cover" loading="lazy" />
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{project.category}</Badge>
                  <span className="text-sm text-muted-foreground">Estimated read: 4 min</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{project.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href={project.links.github}>
                      <Github className="mr-2 size-4" />
                      GitHub
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={project.links.demo}>
                      <ExternalLink className="mr-2 size-4" />
                      Demo
                    </Link>
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setModalProject(project)}>
                    <Layers3 className="mr-2 size-4" />
                    Architecture
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(expanded === project.title ? null : project.title)}
                    aria-expanded={expanded === project.title}
                  >
                    <ChevronDown className={cn("mr-2 size-4 transition", expanded === project.title && "rotate-180")} />
                    Details
                  </Button>
                </div>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {expanded === project.title && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr]">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <DetailBlock title="Overview" text={project.overview} />
                      <DetailBlock title="Problem" text={project.problem} />
                      <DetailBlock title="Solution" text={project.solution} />
                      <DetailBlock title="What I learned" text={project.learned} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Challenges</h4>
                      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                        {project.challenges.map((challenge) => (
                          <li key={challenge} className="flex gap-3">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                        {project.screenshots.map((src) => (
                          <div key={src} className="relative h-28 w-44 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            <Image src={src} alt={`${project.title} screenshot`} fill className="object-cover" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function DetailBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Research() {
  return (
    <Section id="research" eyebrow="Research" title="Research threads around LLMs, AI search, and automation.">
      <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
        {research.map((item) => (
          <Card key={item.title} className="relative ml-10 p-5">
            <span className="absolute -left-[31px] top-6 size-3 rounded-full border-2 border-background bg-accent" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <Badge>{item.date}</Badge>
            </div>
            <p className="mt-2 text-sm font-medium text-accent">{item.area}</p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Practical engineering, research, and product execution.">
      <div className="grid gap-5">
        {experience.map((item) => (
          <Card key={item.company} className="p-6 sm:p-7">
            <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
              <div>
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg border border-border bg-muted text-sm font-semibold">
                  {item.logo}
                </div>
                <p className="font-semibold">{item.company}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.dates}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{item.role}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {item.responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tech.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="A focused toolkit for modern AI product engineering.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <Card key={group.label} className="p-5">
            <group.icon className="mb-4 size-5 text-accent" />
            <h3 className="font-semibold">{group.label}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Resume() {
  return (
    <Section id="resume" eyebrow="Resume" title="A compact snapshot of projects, systems, and applied AI work.">
      <Card className="grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[340px] bg-muted">
          <Image src="/images/resume-preview.svg" alt="Resume preview" fill className="object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <Badge className="w-fit">PDF</Badge>
          <h3 className="mt-5 text-2xl font-semibold">Yuxuan Chen Resume</h3>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            A dedicated resume card with a preview-ready asset and download path. Replace the PDF in public when the final resume is available.
          </p>
          <div className="mt-7">
            <Button asChild>
              <Link href={site.resume}>
                <Download className="mr-2 size-4" />
                Download PDF
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}

function Contact({ copied, copyEmail }: { copied: boolean; copyEmail: () => void }) {
  return (
    <Section id="contact" eyebrow="Contact" title="Let's build useful, well-crafted software.">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-lg leading-8 text-muted-foreground">
          Interested in AI platforms, developer tooling, or engineering roles where product quality matters.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={`mailto:${site.email}`}>
              <Mail className="mr-2 size-4" />
              Email
            </Link>
          </Button>
          <Button variant="secondary" onClick={copyEmail}>
            <Copy className="mr-2 size-4" />
            {copied ? "Copied" : "Copy Email"}
          </Button>
          <Button asChild variant="secondary">
            <Link href={site.github}>
              <Github className="mr-2 size-4" />
              GitHub
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={site.linkedin}>
              <Linkedin className="mr-2 size-4" />
              LinkedIn
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-premium flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Designed and built by Yuxuan Chen.</p>
        <p>RSS-ready structure. Blog coming soon.</p>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 680);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="fixed bottom-5 right-5 z-40">
          <Button asChild size="icon" aria-label="Back to top">
            <Link href="#top">
              <ArrowUp className="size-4" />
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const items = [...navItems.map(([label, id]) => ({ label, href: `#${id}` })), { label: "GitHub", href: site.github }];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] bg-background/70 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close command palette" className="absolute inset-0 cursor-default" onClick={() => onOpenChange(false)} />
          <motion.div
            className="relative mx-auto mt-24 max-w-xl overflow-hidden rounded-lg border border-border bg-card shadow-premium dark:shadow-premium-dark"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Navigate portfolio</span>
              <Button className="ml-auto" variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close">
                <X className="size-4" />
              </Button>
            </div>
            <div className="p-2">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-sm transition hover:bg-muted"
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                  <ExternalLink className="size-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ArchitectureModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[90] bg-background/75 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close architecture modal" className="absolute inset-0 cursor-default" onClick={onClose} />
          <motion.div
            className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-lg border border-border bg-card shadow-premium dark:shadow-premium-dark"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <p className="text-sm text-muted-foreground">Architecture</p>
                <h3 className="text-lg font-semibold">{project.title}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-3">
              {["Client App", "API + Workers", "Data + Eval"].map((node, index) => (
                <div key={node} className="rounded-lg border border-border bg-muted/40 p-5 text-center">
                  <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-background text-sm font-semibold shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold">{node}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {index === 0 && "Focused UX, auth, reports, and experiment controls."}
                    {index === 1 && "Typed services, scheduled runs, model adapters, and observability."}
                    {index === 2 && "Versioned datasets, retrieval traces, scores, and exports."}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
