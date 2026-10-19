import { Bot, BrainCircuit, BriefcaseBusiness, Cloud, Code2, Database, FlaskConical, GraduationCap, MapPin, Rocket, Sparkles, TerminalSquare } from "lucide-react";

export const site = {
  name: "Yuxuan Chen",
  title: "Full-Stack & Applied AI Engineer",
  description: "Yuxuan Chen builds dependable full-stack systems, applied AI infrastructure, and interfaces with intent.",
  education: "MS in Software Engineering Systems, Northeastern University",
  location: "Malden, MA",
  email: "yuxuan.chen.1031@gmail.com",
  github: "https://github.com/MelanthaChen",
  linkedin: "https://www.linkedin.com/in/yuxuan-chen-739160245/",
  resume: "/resume-yuxuan-chen.pdf"
};

export const navItems = [["About", "about"], ["Projects", "projects"], ["Experience", "experience"], ["Contact", "contact"]] as const;

export const aboutCards = [
  { icon: GraduationCap, label: "Education", value: "Northeastern University", detail: "MS in Software Engineering Systems, expected Dec 2026" },
  { icon: BrainCircuit, label: "Current role", value: "Research Assistant", detail: "LLM recommendation evaluation and applied AI systems" },
  { icon: FlaskConical, label: "Research", value: "LLM behavior", detail: "Recommendation shifts, citation behavior, and GEO workflows" },
  { icon: MapPin, label: "Location", value: "Malden, MA", detail: "Graduate student and software engineer in the Boston area" },
  { icon: Sparkles, label: "Interests", value: "Applied AI systems", detail: "Evaluation, NLP pipelines, automation, and data workflows" },
  { icon: Rocket, label: "Career goal", value: "Reliable AI infrastructure", detail: "Measurable, reproducible platforms for model evaluation" }
];

export type Project = {
  slug: string;
  title: string;
  category: "AI Platform" | "Research Automation" | "Developer Tool";
  image: string;
  description: string;
  stack: string[];
  links: { github: string; demo?: string };
  overview: string;
  problem: string;
  solution: string;
  architecture: { label: string; detail: string }[];
  challenges: string[];
  testing: string;
  decisions: string;
  outcomes: string;
  learned: string;
  timeline: string;
  screenshots: string[];
};

export const projects: Project[] = [
  {
    slug: "geo-engine",
    title: "GEO Engine",
    category: "AI Platform",
    image: "/images/project-geo-engine.svg",
    description: "A property-centric research platform for website audits, platform retrieval, content workflows, publishing review, and LLM citation testing.",
    stack: ["FastAPI", "React / TypeScript", "PostgreSQL", "Playwright", "OpenAI API"],
    links: { github: "https://github.com/MelanthaChen/geo-engine", demo: "https://geo-engine-phi.vercel.app" },
    overview: "GEO Engine turns a broad research question — what influences what generative engines retrieve, mention, or cite? — into an observable sequence of experiments.",
    problem: "Generative Engine Optimization research crosses website evidence, platform conversations, content preparation, browser work, and model evaluation. Those pieces need shared property context and a traceable history.",
    solution: "The system coordinates a React dashboard, FastAPI services, PostgreSQL persistence, OpenAI-backed generation, local Playwright retrievers, a publishing queue, human review, and citation tests.",
    architecture: [
      { label: "Frontend", detail: "Vercel-hosted React dashboard with property context, audit views, experiment controls, and history." },
      { label: "Cloud services", detail: "FastAPI routes, SQLAlchemy models, PostgreSQL state, audit services, queues, and evaluation logic." },
      { label: "Local agents", detail: "Retriever and publisher workers use Playwright for browser work that is not reliable inside a cloud service." }
    ],
    challenges: ["Keeping experiments reproducible across model runs", "Separating cloud state from browser-dependent work", "Making publishing a human-reviewed workflow instead of blind automation"],
    testing: "The repository includes backend tests, frontend checks, documented health checks, and explicit dry-run / human-review paths for browser workflows.",
    decisions: "Keep browser sessions local, make the property the organizing boundary, and persist history events so research results can be inspected rather than inferred.",
    outcomes: "A working research platform with website audit, AI FAQ discovery, platform retrieval, content generation, publishing queue, human review, citation tests, and history tracking.",
    learned: "Strong AI research systems need reliable orchestration, persistence, and review semantics as much as they need model access.",
    timeline: "Research Assistant, Northeastern University · May 2026 — Present",
    screenshots: ["/images/project-geo-engine.svg"]
  },
  {
    slug: "geo-research-outreach-agent",
    title: "GEO Research Outreach Agent",
    category: "Research Automation",
    image: "/images/project-outreach-agent.svg",
    description: "A bounded Python application for discovering, qualifying, enriching, and reviewing potential GEO research partners without pretending that review is outreach.",
    stack: ["Python", "SQLite", "State machines", "Website evidence", "CLI workflows"],
    links: { github: "https://github.com/MelanthaChen/geo-research-outreach-agent" },
    overview: "The agent is deliberately separate from the GEO platform. It turns public discovery sources and website evidence into explainable, reviewable research candidates.",
    problem: "Research-partner discovery is noisy: duplicate domains, missing evidence, uncertain qualification, and contact channels with different levels of confidence all need to remain distinguishable.",
    solution: "The pipeline validates and normalizes candidates, caches bounded website evidence, applies configured qualification rules, ranks opportunity and priority independently, stores provenance in SQLite, and preserves human review decisions.",
    architecture: [
      { label: "Discover", detail: "CSV / JSON, public YC directories, and chamber listings become candidate records with provenance." },
      { label: "Qualify", detail: "Normalized domains, cached pages, structured evidence, explainable rules, and explicit lifecycle transitions." },
      { label: "Review", detail: "Contact channels are ranked and exported for human review; the current Phase 5A transport never sends messages." }
    ],
    challenges: ["Making repeated imports idempotent", "Keeping eligibility, opportunity, priority, and confidence separate", "Recording missing or blocked evidence as uncertainty instead of a false negative"],
    testing: "The repository includes tests around normalization, state transitions, persistence, idempotency, review behavior, and bounded collection policies.",
    decisions: "Use SQLite as the internal source of truth, make lifecycle transitions explicit, and separate a qualified company from an approved contact or a sent message.",
    outcomes: "A reproducible local workflow for research-partner discovery, evidence collection, explainable qualification, contact enrichment, and human review. No real delivery is claimed.",
    learned: "Reliable automation is often about preserving uncertainty and provenance, not hiding them behind a confident score.",
    timeline: "Independent engineering project · 2026",
    screenshots: ["/images/project-outreach-agent.svg"]
  },
  {
    slug: "tailorstack",
    title: "TailorStack",
    category: "AI Platform",
    image: "/images/project-tailorstack.svg",
    description: "A resume operating system where structured resume data is the source of truth and generated artifacts remain reviewable, versioned, and reproducible.",
    stack: ["Node.js", "PostgreSQL", "Async queues", "TypeScript", "AI boundaries"],
    links: { github: "https://github.com/MelanthaChen/TailorStack" },
    overview: "TailorStack treats a resume as structured product data rather than a single document, connecting job intelligence, deterministic matching, reviewable optimization, and immutable artifacts.",
    problem: "Resume tailoring becomes fragile when AI edits the canonical document directly. Matching needs evidence, suggested changes need review, and every generated version needs a clear lineage.",
    solution: "A Node monorepo separates API services, web shell, typed config, PostgreSQL access, a repository-backed queue, object storage, AI provider boundaries, migrations, and end-to-end tests.",
    architecture: [
      { label: "Canonical data", detail: "Structured resume sections and entities are the source of truth; PDFs, HTML, and JSON are generated artifacts." },
      { label: "Matching", detail: "Normalized job model → deterministic matcher → evidence generator → gap analyzer → match report." },
      { label: "Versioning", detail: "Accepted patch sets create immutable versions, snapshots, diffs, and rendered artifacts without silent edits." }
    ],
    challenges: ["Keeping AI suggestions inside explicit service boundaries", "Making every match and gap evidence-backed", "Preserving immutable resume and application history"],
    testing: "The repository documents unit, integration, and end-to-end coverage spanning intake, parsing, matching, optimization, rendering, and application workspace flows.",
    decisions: "Let deterministic services own matching, readiness, validation, and artifact application; use AI to parse, normalize, explain, and propose wording.",
    outcomes: "A production-oriented monorepo architecture for resume intake, structured editing, job intelligence, reviewable optimization, rendering, and application tracking.",
    learned: "AI features become more trustworthy when the system makes the boundary between suggestion and committed state impossible to miss.",
    timeline: "Independent engineering project · 2026",
    screenshots: ["/images/project-tailorstack.svg"]
  },
  {
    slug: "algocoach",
    title: "AlgoCoach",
    category: "Developer Tool",
    image: "/images/project-algocoach.svg",
    description: "A Manifest V3 Chrome extension that adds a focused DSA coaching layer to supported LeetCode problem pages.",
    stack: ["React", "TypeScript", "Manifest V3", "Shadow DOM", "Vite"],
    links: { github: "https://github.com/MelanthaChen/algo-coach" },
    overview: "AlgoCoach enhances the existing LeetCode problem page without replacing it: a collapsible panel provides local topic context, visualizations, learning notes, and progress.",
    problem: "A learning tool must integrate into a living browser page without leaking styles, breaking navigation, or requiring a backend for basic learning state.",
    solution: "The content script detects supported problem routes, mounts a React panel inside a Shadow DOM host, injects isolated styles, and remounts as LeetCode changes its SPA history.",
    architecture: [
      { label: "Extension", detail: "Manifest V3 background and content scripts activate only on supported LeetCode problem URLs." },
      { label: "Isolation", detail: "The panel renders into Shadow DOM so Tailwind styles stay separate from the host page." },
      { label: "Learning", detail: "Local metadata and deterministic visualization steps power trees, BFS, DFS, binary search, notes, and progress." }
    ],
    challenges: ["Keeping the panel stable across SPA navigation", "Isolating styles from a complex host page", "Building useful visual feedback without a backend or AI dependency"],
    testing: "The project includes a Vite production build, ESLint, TypeScript, and route-scoped runtime behavior for supported problem pages.",
    decisions: "Keep the MVP local-first, use curated metadata rather than a remote API, and treat Shadow DOM isolation as a core architecture decision.",
    outcomes: "A focused browser-extension MVP with guided problem context, deterministic visualizations, local notes, and local progress tracking.",
    learned: "The best browser integrations respect the host product: add a useful layer, isolate it carefully, and disappear when the context is wrong.",
    timeline: "Independent engineering project · 2026",
    screenshots: ["/images/project-algocoach.svg"]
  }
];

export const experience = [
  { company: "Northeastern University", role: "Research Assistant", dates: "May 2026 — Present", responsibilities: ["Designing a platform to evaluate how repeated exposure influences LLM recommendation behavior.", "Building backend services with Python, FastAPI, PostgreSQL, and OpenAI APIs to automate experiment execution and evaluation."], tech: ["Python", "FastAPI", "PostgreSQL", "OpenAI APIs", "Playwright"] },
  { company: "Software Velocity Corporation", role: "Software Engineer Intern", dates: "Sep 2025 — Jan 2026", responsibilities: ["Designed a unified LLM evaluation pipeline for 10+ models across L4, T4, A100, and API-based environments.", "Built benchmarking workflows for latency, throughput, and cost analysis across deployment configurations."], tech: ["Python", "vLLM", "Cloud GPUs", "AWS", "GCP"] },
  { company: "Dickinson College", role: "Research Assistant", dates: "Sep 2023 — Jul 2024", responsibilities: ["Built NLP pipelines for 300K+ documents and 100M+ data points using Python.", "Designed structured corpus generation workflows for downstream NLP analysis and modeling."], tech: ["Python", "NLP", "Data Pipelines", "Visualization", "SQL"] },
  { company: "China Construction Bank", role: "Data Analytics Intern", dates: "May 2023 — Jul 2023", responsibilities: ["Automated daily transaction CSV cleaning with Python, reducing recurring analysis prep time by 75%.", "Analyzed 50,000+ transactions in SQL and built customer segmentation models and summary tables."], tech: ["Python", "SQL", "Data Cleaning", "Segmentation"] }
];

export const skillGroups = [
  { label: "Languages", icon: Code2, skills: ["Python", "TypeScript", "Java", "SQL"] },
  { label: "AI / ML", icon: Bot, skills: ["LLM Systems", "NLP", "Prompt Engineering", "LLM Evaluation"] },
  { label: "Backend", icon: BriefcaseBusiness, skills: ["FastAPI", "Node.js", "Experiment Tracking", "Automation"] },
  { label: "Cloud", icon: Cloud, skills: ["AWS", "GCP", "Cloud GPUs", "vLLM", "Linux"] },
  { label: "Data", icon: Database, skills: ["PostgreSQL", "SQLite", "Data Pipelines", "Corpus Generation"] },
  { label: "Developer Tools", icon: TerminalSquare, skills: ["Playwright", "Git", "Chrome Extensions", "Visualization"] }
];
