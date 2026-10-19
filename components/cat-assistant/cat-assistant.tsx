"use client";

import Link from "next/link";
import { ArrowUpRight, Cat, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { experience, projects, site, skillGroups } from "@/lib/data";
import styles from "./cat-assistant.module.css";

type Message = { id: number; role: "assistant" | "user"; text: string; href?: string; hrefLabel?: string };

const suggestedQuestions = [
  "What are Yuxuan's strongest projects?",
  "What tech stack does she use?",
  "Tell me about GEO Engine.",
  "What did she build in Java?",
  "What experience does she have?"
];

const geo = projects.find((project) => project.slug === "geo-engine")!;

function answerFor(question: string): Omit<Message, "id" | "role"> {
  const normalized = question.toLowerCase();
  if (normalized.includes("strongest") || normalized.includes("projects")) {
    return { text: `A good starting point is ${projects.slice(0, 3).map((project) => project.title).join(", ")}. Together they show her range across applied AI platforms, research automation, and developer tools.` };
  }
  if (normalized.includes("stack") || normalized.includes("tech")) {
    const skills = skillGroups.flatMap((group) => group.skills).slice(0, 12).join(", ");
    return { text: `Her core toolkit includes ${skills}, with a focus on dependable backend systems, evaluation workflows, and useful interfaces.` };
  }
  if (normalized.includes("geo engine")) {
    return { text: `${geo.title} is ${geo.overview} It combines ${geo.stack.slice(0, 4).join(", ")}, and human review into one research workflow.`, href: `/projects/${geo.slug}`, hrefLabel: "Read the GEO Engine case study" };
  }
  if (normalized.includes("java")) {
    return { text: "Java appears in her language toolkit. Her portfolio work leans more heavily toward Python and TypeScript, especially for NLP pipelines, evaluation infrastructure, and full-stack product systems." };
  }
  if (normalized.includes("experience") || normalized.includes("built")) {
    return { text: `She has experience as a ${experience[0].role} at ${experience[0].company}, plus work at ${experience.slice(1).map((item) => item.company).join(", ")}. Her through-line is making complex systems measurable and easier to use.` };
  }
  return { text: `I can point you toward ${geo.title}, her experience, or the tools she reaches for. Try one of the questions below.` };
}

export function CatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: "Hi — I can give you a quick tour of Yuxuan's work." }
  ]);
  const [nextId, setNextId] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    const response = answerFor(question);
    setMessages((current) => [
      ...current,
      { id: nextId, role: "user", text: question },
      { id: nextId + 1, role: "assistant", ...response }
    ]);
    setNextId((current) => current + 2);
  };

  return <div className={styles.root}>
    {open && <section className={styles.panel} role="dialog" aria-modal="false" aria-labelledby="cat-assistant-title">
      <div className={styles.panelHeader}>
        <div><span className={styles.kicker}>PORTFOLIO GUIDE</span><h2 id="cat-assistant-title">Ask Jacko</h2></div>
        <button ref={closeButtonRef} className={styles.close} onClick={() => setOpen(false)} aria-label="Close portfolio assistant"><X size={16} /></button>
      </div>
      <div className={styles.messages} aria-live="polite">
        {messages.map((message) => <div className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.assistantMessage}`} key={message.id}>
          <span>{message.text}</span>
          {message.href && <Link href={message.href} onClick={() => setOpen(false)}>{message.hrefLabel} <ArrowUpRight size={13} /></Link>}
        </div>)}
      </div>
      <div className={styles.questions}>
        <span className={styles.prompt}>Choose a question</span>
        {suggestedQuestions.map((question) => <button key={question} className={styles.chip} onClick={() => ask(question)}><Send size={12} />{question}</button>)}
      </div>
      <p className={styles.note}>A small prototype using curated portfolio details.</p>
    </section>}
    <button className={`${styles.mascotButton} ${open ? styles.mascotButtonOpen : ""}`} onClick={() => setOpen((current) => !current)} aria-label={open ? "Close Ask Jacko" : "Open Ask Jacko"} aria-expanded={open}>
      <span className={styles.mascotGlow} />
      <span className={styles.cat} aria-hidden="true"><span className={`${styles.ear} ${styles.leftEar}`} /><span className={`${styles.ear} ${styles.rightEar}`} /><span className={styles.face}><span className={styles.eyeLeft} /><span className={styles.eyeRight} /><span className={styles.nose} /></span><span className={styles.tail} /></span>
      <span className={styles.launcherLabel}><MessageCircle size={13} />Ask Jacko</span>
      <Cat className={styles.launcherIcon} size={15} aria-hidden="true" />
    </button>
    <Link className={styles.emailLink} href={`mailto:${site.email}`} aria-label="Email Yuxuan Chen"><MessageCircle size={13} /> Say hello</Link>
  </div>;
}
