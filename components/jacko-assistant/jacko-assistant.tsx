"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { experience, projects, site, skillGroups } from "@/lib/data";
import styles from "./jacko-assistant.module.css";

type AssistantMessage = { id: number; role: "assistant" | "user"; text: string; href?: string; hrefLabel?: string };

const questions = [
  "What are Mel's strongest projects?",
  "Tell me about GEO Engine.",
  "What did she build in Java?",
  "What experience does she have?",
  "What tech stack does she use?",
  "Show me a project to start with."
];

const geo = projects.find((project) => project.slug === "geo-engine")!;

function responseFor(question: string): Omit<AssistantMessage, "id" | "role"> {
  const normalized = question.toLowerCase();
  if (normalized.includes("strongest") || normalized.includes("project")) {
    return { text: `Start with ${projects.slice(0, 3).map((project) => project.title).join(", ")}. Together they show Mel's range across applied AI platforms, research automation, and developer tools.` };
  }
  if (normalized.includes("geo engine")) {
    return { text: `${geo.title} turns questions about generative-engine retrieval and citation into observable experiments, with audits, review workflows, and a traceable history.`, href: `/projects/${geo.slug}`, hrefLabel: "Read the GEO Engine case study" };
  }
  if (normalized.includes("java")) {
    return { text: "Java is part of Mel's language toolkit. Her recent portfolio work leans toward Python and TypeScript for NLP pipelines, evaluation infrastructure, and full-stack systems." };
  }
  if (normalized.includes("experience")) {
    return { text: `She is currently a ${experience[0].role} at ${experience[0].company}, with previous work spanning LLM evaluation, NLP pipelines, and data analytics.`, href: "#experience", hrefLabel: "See the experience timeline" };
  }
  if (normalized.includes("stack") || normalized.includes("tech")) {
    const skills = skillGroups.flatMap((group) => group.skills).slice(0, 10).join(", ");
    return { text: `Her core toolkit includes ${skills}, with a focus on dependable backend systems, evaluation workflows, and useful interfaces.` };
  }
  return { text: `I'd start with ${geo.title}. It is a good snapshot of how Mel connects research questions to a reviewable product system.`, href: `/projects/${geo.slug}`, hrefLabel: "Open a project" };
}

function JackoMascot({ onClick, open, reducedMotion }: { onClick: () => void; open: boolean; reducedMotion: boolean }) {
  return <button className={`${styles.mascotButton} ${open ? styles.mascotButtonOpen : ""} ${reducedMotion ? styles.reducedMotion : ""}`} onClick={onClick} aria-label={open ? "Close Ask Jacko" : "Open Ask Jacko"} aria-expanded={open}>
    <span className={styles.hint}>Need a quick project tour?</span>
    <span className={styles.mascot} aria-hidden="true">
      <span className={`${styles.ear} ${styles.leftEar}`}><span /></span>
      <span className={`${styles.ear} ${styles.rightEar}`}><span /></span>
      <span className={styles.head}>
        <span className={styles.facePatch} />
        <span className={`${styles.eye} ${styles.leftEye}`} />
        <span className={`${styles.eye} ${styles.rightEye}`} />
        <span className={styles.nose} />
        <span className={styles.muzzle} />
      </span>
      <span className={styles.chest} />
      <span className={styles.body}>
        <span className={`${styles.tabbyPatch} ${styles.patchOne}`} />
        <span className={`${styles.tabbyPatch} ${styles.patchTwo}`} />
      </span>
      <span className={styles.paw} />
      <span className={styles.tail} />
    </span>
    <span className={styles.mascotLabel}><MessageCircle size={13} /> Ask Jacko</span>
  </button>;
}

export function JackoAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { id: 0, role: "assistant", text: "Hi. I know where the good projects are." }
  ]);
  const [nextId, setNextId] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const ask = (question: string) => {
    const answer = responseFor(question);
    setMessages((current) => [...current, { id: nextId, role: "user", text: question }, { id: nextId + 1, role: "assistant", ...answer }]);
    setNextId((current) => current + 2);
  };

  return <div className={styles.root}>
    {open && <section className={styles.panel} role="dialog" aria-modal="false" aria-labelledby="jacko-panel-title">
      <div className={styles.panelHeader}>
        <div><span className={styles.kicker}>PORTFOLIO GUIDE / JACKO</span><h2 id="jacko-panel-title">Ask Jacko</h2></div>
        <button ref={closeButtonRef} className={styles.close} onClick={() => setOpen(false)} aria-label="Close portfolio assistant"><X size={16} /></button>
      </div>
      <div className={styles.messages} aria-live="polite">
        {messages.map((message) => <div className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.assistantMessage}`} key={message.id}>
          <span>{message.text}</span>
          {message.href && <Link href={message.href} onClick={() => setOpen(false)}>{message.hrefLabel} <ArrowUpRight size={13} /></Link>}
        </div>)}
      </div>
      <div className={styles.questions}>
        <span className={styles.prompt}>Ask me about Mel&apos;s work</span>
        {questions.map((question) => <button key={question} className={styles.chip} onClick={() => ask(question)}><Send size={12} />{question}</button>)}
      </div>
      <p className={styles.note}>A curated prototype — no live chatbot behind the curtain.</p>
    </section>}
    <JackoMascot onClick={() => setOpen((current) => !current)} open={open} reducedMotion={reducedMotion} />
    <Link className={styles.emailLink} href={`mailto:${site.email}`}>Say hello <ArrowUpRight size={12} /></Link>
  </div>;
}
