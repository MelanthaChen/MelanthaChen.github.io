"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowUp,
  ChevronDown,
  Command,
  Copy,
  Download,
  ExternalLink,
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
    <section id={id} data-section={id} className={cn("relative scroll-mt-24 py-24 sm:py-28 lg:min-h-screen lg:py-32", className)}>
      <motion.div
        className="container-premium"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-14 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h2 className="text-balance text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

export function PortfolioShell() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [expanded, setExpanded] = useState<string | null>("GEO Engine");
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 32 });

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

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.12, 0.28, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    onScroll();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      observer.disconnect();
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
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <motion.div className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent" style={{ scaleX: progress }} />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "border-b border-border/70 bg-background/82 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-2xl" : "bg-transparent"
        )}
      >
        <nav className="container-premium flex h-16 items-center justify-between" aria-label="Main navigation">
          <Link href="#top" className="group inline-flex items-center gap-2 text-sm font-semibold tracking-normal">
            <span className="size-2 rounded-full bg-accent transition group-hover:scale-125" />
            Yuxuan Chen
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(([label, id]) => (
              <Link
                key={id}
                href={`#${id}`}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground",
                  activeSection === id && "text-foreground"
                )}
              >
                {label}
                {activeSection === id && <motion.span layoutId="nav-indicator" className="absolute inset-x-3 -bottom-px h-px bg-accent" />}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCommandOpen(true)} aria-label="Open command palette">
              <Command className="size-4" />
            </Button>
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Link href={site.resume}>
                <Download className="mr-2 size-4" />
                Resume
              </Link>
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
  const { scrollYProgress } = useScroll();
  const visualY = useTransform(scrollYProgress, [0, 0.22], [0, -42]);

  return (
    <section data-section="top" className="relative min-h-screen overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(37,99,235,0.14),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fafafa_78%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_80%_15%,rgba(96,165,250,0.16),transparent_28%),linear-gradient(180deg,#09090b_0%,#0d0d11_78%,#09090b_100%)]" />
      <div className="subtle-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="container-premium relative grid min-h-[calc(100vh-5rem)] items-center gap-14 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent" />
            Software Engineer
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[0.94] tracking-normal sm:text-7xl lg:text-8xl xl:text-9xl">
            Yuxuan Chen
          </h1>
          <p className="mt-7 max-w-2xl text-balance text-xl leading-8 text-foreground/88 sm:text-3xl sm:leading-10">
            Building AI-powered platforms, developer tools, and intelligent systems.
          </p>
          <div className="mt-7 grid gap-2 text-base leading-7 text-muted-foreground">
            <span>MS in Software Engineering Systems</span>
            <span>Northeastern University</span>
          </div>
          <div className="mt-10 grid w-full max-w-[320px] grid-cols-1 items-center gap-3 sm:flex sm:max-w-none sm:flex-wrap">
            <Button asChild className="w-full sm:w-auto">
              <Link href="#projects">View Projects</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href={site.resume}>
                <Download className="mr-2 size-4" />
                Download Resume
              </Link>
            </Button>
            <IconLink href={site.github} label="GitHub" icon={<Github className="size-4" />} />
            <IconLink href={site.linkedin} label="LinkedIn" icon={<Linkedin className="size-4" />} />
            <IconLink href={`mailto:${site.email}`} label="Email" icon={<Mail className="size-4" />} />
          </div>
        </motion.div>
        <motion.div style={{ y: visualY }} className="relative mx-auto w-full max-w-[620px]">
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function IconLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto" aria-label={label}>
      <Link href={href}>
        <span className="mr-2">{icon}</span>
        {label}
      </Link>
    </Button>
  );
}

function HeroVisual() {
  const nodes = [
    { label: "Prompts", x: "12%", y: "19%" },
    { label: "Retrieval", x: "56%", y: "15%" },
    { label: "Evaluation", x: "58%", y: "66%" },
    { label: "Dashboard", x: "18%", y: "70%" }
  ];

  return (
    <motion.div
      className="relative aspect-[1.05] overflow-hidden rounded-[2rem] border border-border/80 bg-white/78 p-4 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.65)] backdrop-blur-2xl dark:bg-zinc-950/72"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(37,99,235,0.13),transparent_32%),radial-gradient(circle_at_74%_80%,rgba(37,99,235,0.1),transparent_28%)]" />
      <div className="absolute inset-4 rounded-[1.5rem] border border-border bg-[linear-gradient(135deg,rgba(250,250,250,0.95),rgba(255,255,255,0.82))] dark:bg-[linear-gradient(135deg,rgba(24,24,27,0.92),rgba(9,9,11,0.82))]" />
      <div className="absolute inset-10 rounded-2xl bg-[linear-gradient(hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 600" aria-hidden="true">
        <motion.path
          d="M126 134 C256 112 326 110 426 118 C494 124 512 187 476 238 C418 320 399 396 451 482"
          fill="none"
          stroke="rgba(37,99,235,0.32)"
          strokeWidth="2"
          strokeDasharray="8 10"
          animate={{ strokeDashoffset: [0, -72] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        <motion.path
          d="M132 458 C214 390 260 341 300 296 C347 244 402 216 478 184"
          fill="none"
          stroke="rgba(37,99,235,0.22)"
          strokeWidth="2"
          strokeDasharray="6 12"
          animate={{ strokeDashoffset: [0, -60] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </svg>
      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          className="absolute rounded-xl border border-border bg-background/92 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur"
          style={{ left: node.x, top: node.y }}
          animate={{ y: [0, index % 2 ? -8 : 8, 0] }}
          transition={{ repeat: Infinity, duration: 5 + index, ease: "easeInOut" }}
        >
          {node.label}
        </motion.div>
      ))}
      <div className="absolute left-[18%] top-[28%] w-[64%] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-yellow-400" />
          <span className="size-2 rounded-full bg-green-400" />
          <span className="ml-3 text-xs text-muted-foreground">ai-platform.tsx</span>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-24 rounded-full bg-foreground" />
              <div className="mt-3 h-2 w-36 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Live</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[82, 94, 71].map((value) => (
              <div key={value} className="rounded-lg border border-border bg-muted/50 p-3">
                <div className="text-xl font-semibold">{value}</div>
                <div className="mt-2 h-1.5 rounded-full bg-accent/25">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="h-24 rounded-xl border border-border bg-[linear-gradient(180deg,hsl(var(--muted)),transparent)] p-3">
            <div className="flex h-full items-end gap-2">
              {[38, 58, 46, 72, 64, 86, 76, 94].map((height, index) => (
                <motion.div
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t bg-accent/70"
                  style={{ height: `${height}%` }}
                  animate={{ height: [`${height - 10}%`, `${height}%`, `${height - 4}%`] }}
                  transition={{ repeat: Infinity, duration: 3.4, delay: index * 0.08, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="Engineering judgment, research curiosity, and product taste in one loop.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aboutCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={false}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04, duration: 0.45 }}
          >
            <Card className="group h-full overflow-hidden bg-white/78 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-premium dark:bg-zinc-950/70 dark:hover:shadow-premium-dark">
              <div className="mb-9 flex size-11 items-center justify-center rounded-lg border border-border bg-muted transition group-hover:border-accent/30 group-hover:bg-accent/10">
                <card.icon className="size-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <h3 className="mt-2 text-xl font-semibold">{card.value}</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.detail}</p>
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
    <Section id="projects" eyebrow="Featured Projects" title="Product showcases for AI systems, not thumbnail cards.">
      <div className="sticky top-16 z-20 -mx-5 mb-12 border-y border-border/70 bg-background/85 px-5 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8" role="tablist" aria-label="Project filters">
        <div className="container-premium flex flex-wrap gap-2 px-0">
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
      </div>
      <div className="space-y-20">
        {filteredProjects.map((project, index) => (
          <ProjectShowcase
            key={project.title}
            project={project}
            index={index}
            expanded={expanded === project.title}
            onExpand={() => setExpanded(expanded === project.title ? null : project.title)}
            onOpenArchitecture={() => setModalProject(project)}
          />
        ))}
      </div>
    </Section>
  );
}

function ProjectShowcase({
  project,
  index,
  expanded,
  onExpand,
  onOpenArchitecture
}: {
  project: Project;
  index: number;
  expanded: boolean;
  onExpand: () => void;
  onOpenArchitecture: () => void;
}) {
  const reversed = index % 2 === 1;

  return (
    <motion.article
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <Card className="overflow-hidden bg-white/86 shadow-[0_30px_110px_-70px_rgba(15,23,42,0.75)] backdrop-blur dark:bg-zinc-950/72">
        <div className={cn("grid min-h-[76vh] items-center gap-0 lg:grid-cols-2", reversed && "lg:[&>*:first-child]:order-2")}>
          <motion.div className="relative min-h-[420px] overflow-hidden bg-[#f7f7f8] p-4 sm:min-h-[560px] dark:bg-zinc-900" whileHover={{ scale: 1.01 }}>
            <Image src={project.image} alt={`${project.title} product screenshot`} fill className="object-cover transition duration-700 hover:scale-[1.035]" loading="lazy" />
            <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/70 bg-white/82 p-4 shadow-xl backdrop-blur dark:border-white/10 dark:bg-zinc-950/75">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">Architecture preview</span>
                <Badge>{project.category}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Client", "Services", "Data"].map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-background/78 p-3 text-center text-xs font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="p-7 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{project.category}</Badge>
              <span className="text-sm text-muted-foreground">{project.timeline}</span>
            </div>
            <h3 className="mt-6 text-balance text-4xl font-semibold leading-tight sm:text-5xl">{project.title}</h3>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{project.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="sm">
                <Link href={project.links.github}>
                  <Github className="mr-2 size-4" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link href={project.links.demo}>
                  <ExternalLink className="mr-2 size-4" />
                  Live Demo
                </Link>
              </Button>
              <Button variant="secondary" size="sm" onClick={onOpenArchitecture}>
                <Layers3 className="mr-2 size-4" />
                Architecture
              </Button>
              <Button variant="ghost" size="sm" onClick={onExpand} aria-expanded={expanded}>
                <ChevronDown className={cn("mr-2 size-4 transition", expanded && "rotate-180")} />
                Read Case Study
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border"
            >
              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:p-14">
                <div className="grid gap-5 sm:grid-cols-2">
                  <DetailBlock title="Problem" text={project.problem} />
                  <DetailBlock title="Solution" text={project.solution} />
                  <DetailBlock title="Lessons" text={project.learned} />
                  <DetailBlock title="Timeline" text={project.timeline} />
                </div>
                <div className="space-y-7">
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
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Gallery</h4>
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                      {project.screenshots.map((src) => (
                        <div key={src} className="relative h-32 w-52 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          <Image src={src} alt={`${project.title} gallery screenshot`} fill className="object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.article>
  );
}

function DetailBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/35 p-5">
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function Research() {
  return (
    <Section id="research" eyebrow="Research" title="A focused research thread around LLMs, AI search, and automation." className="bg-[#fafafa] dark:bg-zinc-950">
      <div className="relative mx-auto max-w-4xl space-y-7 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border sm:before:left-1/2">
        {research.map((item, index) => (
          <motion.div
            key={item.title}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={cn("relative sm:w-[calc(50%-2rem)]", index % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto")}
          >
            <Card className="glass-card relative ml-10 p-6 sm:ml-0">
              <span className={cn("absolute top-7 size-3 rounded-full border-2 border-background bg-accent", index % 2 === 0 ? "-right-[2.42rem] hidden sm:block" : "-left-[2.42rem] hidden sm:block", "-left-[31px] sm:hidden")} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <Badge>{item.date}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-accent">{item.area}</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Engineering practice shaped by research, systems, and shipping.">
      <div className="grid gap-6">
        {experience.map((item, index) => (
          <motion.div
            key={item.company}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="group overflow-hidden p-7 transition duration-300 hover:-translate-y-1 hover:shadow-premium dark:hover:shadow-premium-dark sm:p-8">
              <div className="grid gap-8 md:grid-cols-[14rem_1fr]">
                <div>
                  <div className="mb-5 flex size-14 items-center justify-center rounded-xl border border-border bg-muted text-sm font-semibold transition group-hover:border-accent/30 group-hover:bg-accent/10">
                    {item.logo}
                  </div>
                  <p className="text-lg font-semibold">{item.company}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.dates}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{item.role}</h3>
                  <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground">
                    {item.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tech.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="The toolkit is broad; the presentation stays simple.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.label}
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-premium dark:hover:shadow-premium-dark">
              <group.icon className="mb-5 size-5 text-accent" />
              <h3 className="text-xl font-semibold">{group.label}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Resume() {
  return (
    <Section id="resume" eyebrow="Resume" title="A clean snapshot of software, AI systems, and product execution." className="bg-[#fafafa] dark:bg-zinc-950">
      <Card className="grid overflow-hidden bg-white/86 shadow-[0_30px_110px_-70px_rgba(15,23,42,0.75)] dark:bg-zinc-950/72 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative min-h-[420px] bg-muted sm:min-h-[560px]">
          <Image src="/images/resume-preview.svg" alt="Resume preview" fill className="object-cover" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Badge className="w-fit">PDF Resume</Badge>
          <h3 className="mt-6 text-4xl font-semibold tracking-normal sm:text-5xl">Yuxuan Chen Resume</h3>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            A concise overview of engineering projects, research interests, technical depth, and product-minded execution.
          </p>
          <div className="mt-9">
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
    <Section id="contact" eyebrow="Contact" title="Let's build something meaningful.">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-white/88 p-8 text-center shadow-[0_40px_120px_-80px_rgba(15,23,42,0.75)] backdrop-blur dark:bg-zinc-950/78 sm:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_34%)]" />
        <div className="relative">
          <p className="mx-auto max-w-2xl text-xl leading-8 text-muted-foreground">
            Open to research collaborations, AI product work, internships, and engineering teams that care about craft.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
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
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-premium text-center text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between sm:text-left">
        <p>Designed &amp; Built by Yuxuan Chen.</p>
        <p className="mt-3 sm:mt-0">Software Engineer · AI Systems · Developer Tools</p>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 760);
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
  const items = [
    ...navItems.map(([label, id]) => ({ label, href: `#${id}` })),
    { label: "Download Resume", href: site.resume },
    { label: "GitHub", href: site.github },
    { label: "Email", href: `mailto:${site.email}` }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] bg-background/70 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close command palette" className="absolute inset-0 cursor-default" onClick={() => onOpenChange(false)} />
          <motion.div
            className="relative mx-auto mt-24 max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-premium dark:shadow-premium-dark"
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
            className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-premium dark:shadow-premium-dark"
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
              {["Client Experience", "API + Workers", "Data + Evaluation"].map((node, index) => (
                <div key={node} className="rounded-xl border border-border bg-muted/40 p-5 text-center">
                  <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-background text-sm font-semibold shadow-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold">{node}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {index === 0 && "Focused UX, authentication, reports, and experiment controls."}
                    {index === 1 && "Typed services, scheduled runs, model adapters, and observability."}
                    {index === 2 && "Versioned datasets, retrieval traces, scores, and exportable evidence."}
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
