import {
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  FlaskConical,
  GraduationCap,
  MapPin,
  Rocket,
  Sparkles,
  TerminalSquare
} from "lucide-react";

export const site = {
  name: "Yuxuan Chen",
  title: "Software Engineer",
  description: "Building LLM evaluation platforms, AI research systems, and data-driven software.",
  education: "MS in Software Engineering Systems, Northeastern University",
  location: "Malden, MA",
  email: "yuxuan.chen.1031@gmail.com",
  phone: "+1 (223) 269-8058",
  github: "https://github.com/MelanthaChen",
  linkedin: "https://www.linkedin.com/in/yuxuan-chen",
  resume: "/resume-yuxuan-chen.pdf"
};

export const navItems = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Research", "research"],
  ["Experience", "experience"],
  ["Resume", "resume"],
  ["Contact", "contact"]
] as const;

export const aboutCards = [
  {
    icon: GraduationCap,
    label: "Education",
    value: "Northeastern University",
    detail: "MS in Software Engineering Systems, expected Dec 2026"
  },
  {
    icon: BrainCircuit,
    label: "Current Role",
    value: "Research Assistant",
    detail: "Building LLM recommendation evaluation systems at Northeastern University"
  },
  {
    icon: FlaskConical,
    label: "Research",
    value: "LLM behavior",
    detail: "Repeated exposure, recommendation shifts, citation behavior, and GEO workflows"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Malden, MA",
    detail: "Graduate student and software engineer in the Boston area"
  },
  {
    icon: Sparkles,
    label: "Interests",
    value: "Applied AI systems",
    detail: "LLM evaluation, NLP pipelines, automation, and scalable data workflows"
  },
  {
    icon: Rocket,
    label: "Career Goal",
    value: "Build reliable AI infrastructure",
    detail: "Design measurable, reproducible platforms for model evaluation and analysis"
  }
];

export type Project = {
  title: string;
  category: "AI Platform" | "Developer Tool" | "Search";
  image: string;
  description: string;
  stack: string[];
  links: { github: string; demo: string };
  overview: string;
  problem: string;
  solution: string;
  challenges: string[];
  learned: string;
  timeline: string;
  screenshots: string[];
};

export const projects: Project[] = [
  {
    title: "LLM Recommendation Exposure Platform",
    category: "AI Platform",
    image: "/images/project-geo.svg",
    description:
      "A research platform for evaluating how repeated exposure changes recommendation behavior across large language models.",
    stack: ["Python", "FastAPI", "PostgreSQL", "OpenAI APIs", "Playwright"],
    links: { github: site.github, demo: "#" },
    overview:
      "The platform automates experiment execution, data collection, exposure simulations, ranking analysis, and evaluation workflows for LLM recommendation research.",
    problem:
      "LLM recommendations can shift after repeated exposure, but measuring those shifts requires controlled experiments, repeatable runs, and structured ranking analysis.",
    solution:
      "Backend services coordinate prompt execution, collect model outputs, analyze ranking and citation changes, and support automated GEO content workflows.",
    challenges: [
      "Automating repeated exposure simulations across model runs",
      "Tracking recommendation and citation behavior over time",
      "Keeping experiment execution reproducible and auditable"
    ],
    learned:
      "Strong AI research systems need reliable experiment orchestration as much as they need model access.",
    timeline: "Research Assistant, Northeastern University - May 2026 to Present",
    screenshots: ["/images/project-geo.svg", "/images/project-llm.svg"]
  },
  {
    title: "Unified LLM Evaluation Pipeline",
    category: "AI Platform",
    image: "/images/project-algo.svg",
    description:
      "A benchmarking pipeline for comparing 10+ LLMs across cloud GPU environments, APIs, and deployment configurations.",
    stack: ["Python", "Cloud GPUs", "vLLM", "AWS", "GCP"],
    links: { github: site.github, demo: "#" },
    overview:
      "The system measured latency, throughput, cost, and configuration-level performance across L4, T4, and A100 environments.",
    problem:
      "Model teams need reproducible evaluation across different model APIs and GPU settings instead of one-off benchmark scripts.",
    solution:
      "A unified experiment workflow with run tagging for model, config, GPU specification, and prompt set, enabling structured comparison and auditability.",
    challenges: [
      "Orchestrating concurrent multi-model inference workloads",
      "Identifying bottlenecks across cloud deployment configurations",
      "Reducing setup time for large-scale LLM testing"
    ],
    learned:
      "Reliable evaluation infrastructure turns model selection into an engineering process, not a guessing exercise.",
    timeline: "Software Engineer Intern, Software Velocity Corporation - Sep 2025 to Jan 2026",
    screenshots: ["/images/project-algo.svg", "/images/project-geo.svg"]
  },
  {
    title: "Large-Scale NLP Text Processing Pipeline",
    category: "Search",
    image: "/images/project-llm.svg",
    description:
      "NLP workflows for processing 300K+ documents and 100M+ data points for large-scale linguistic analysis.",
    stack: ["Python", "NLP", "SQL", "Visualization", "Data Workflows"],
    links: { github: site.github, demo: "#" },
    overview:
      "Built reusable pipelines for structured corpus generation, text analysis, querying, and visualization at Dickinson College.",
    problem:
      "Large text corpora need repeatable processing and analysis workflows before they can support model-driven research insights.",
    solution:
      "Designed Python-based NLP pipelines and reusable query components to extract patterns from high-dimensional text data.",
    challenges: [
      "Processing 300K+ documents into usable structured corpora",
      "Managing 100M+ data points for downstream analysis",
      "Creating reusable visualization components for iterative workflows"
    ],
    learned:
      "The quality of downstream NLP analysis depends on disciplined data workflow design.",
    timeline: "Research Assistant, Dickinson College - Sep 2023 to Jul 2024",
    screenshots: ["/images/project-llm.svg", "/images/project-algo.svg"]
  }
];

export const research = [
  {
    date: "May 2026 - Present",
    title: "Research Assistant, Northeastern University",
    area: "LLM recommendation behavior",
    text: "Designing a platform to evaluate how repeated exposure influences LLM recommendations, ranking shifts, and citation behavior."
  },
  {
    date: "2026",
    title: "Generative Engine Optimization",
    area: "AI search automation",
    text: "Developing automated content generation and publishing workflows using LLMs, Playwright, and web automation tools."
  },
  {
    date: "Sep 2023 - Jul 2024",
    title: "Research Assistant, Dickinson College",
    area: "Large-scale NLP",
    text: "Built NLP pipelines for 300K+ documents and 100M+ data points, supporting corpus generation, analysis, and visualization."
  }
];

export const experience = [
  {
    company: "Northeastern University",
    logo: "NU",
    role: "Research Assistant",
    dates: "May 2026 - Present",
    responsibilities: [
      "Designing and developing a platform to evaluate how repeated exposure influences LLM recommendation behavior.",
      "Building backend services with Python, FastAPI, PostgreSQL, and OpenAI APIs to automate experiment execution and evaluation.",
      "Implementing exposure simulations, ranking analysis, and automated GEO workflows with LLMs and Playwright."
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "OpenAI APIs", "Playwright"]
  },
  {
    company: "Software Velocity Corporation",
    logo: "SV",
    role: "Software Engineer Intern",
    dates: "Sep 2025 - Jan 2026",
    responsibilities: [
      "Designed and implemented a unified LLM evaluation pipeline for 10+ models across L4, T4, A100, and API-based environments.",
      "Built benchmarking workflows for latency, throughput, and cost analysis across deployment configurations.",
      "Developed experiment tracking and concurrent inference workflows, improving pipeline efficiency by 25-40%."
    ],
    tech: ["Python", "vLLM", "Cloud GPUs", "AWS", "GCP"]
  },
  {
    company: "Dickinson College",
    logo: "DC",
    role: "Research Assistant",
    dates: "Sep 2023 - Jul 2024",
    responsibilities: [
      "Built NLP pipelines for 300K+ documents and 100M+ data points using Python.",
      "Designed structured corpus generation workflows for downstream NLP analysis and modeling.",
      "Developed reusable querying and visualization components for iterative data workflows."
    ],
    tech: ["Python", "NLP", "Data Pipelines", "Visualization", "SQL"]
  },
  {
    company: "China Construction Bank",
    logo: "CCB",
    role: "Data Analytics Intern",
    dates: "May 2023 - Jul 2023",
    responsibilities: [
      "Automated daily transaction CSV cleaning with Python, reducing recurring analysis prep time by 75%.",
      "Analyzed 50,000+ transactions in SQL and built customer segmentation models and summary tables.",
      "Translated marketing questions into stakeholder-ready SQL insights and reporting."
    ],
    tech: ["Python", "SQL", "Data Cleaning", "Customer Segmentation", "Reporting"]
  }
];

export const skillGroups = [
  { label: "Languages", icon: Code2, skills: ["Python", "Java", "SQL"] },
  { label: "AI/ML", icon: Bot, skills: ["LLM Systems", "RAG", "NLP", "Prompt Engineering", "LLM Evaluation"] },
  { label: "Backend", icon: BriefcaseBusiness, skills: ["FastAPI", "OpenAI APIs", "Experiment Tracking", "Automation", "Benchmarking"] },
  { label: "Cloud", icon: Cloud, skills: ["AWS", "GCP", "Cloud GPUs", "vLLM", "Linux"] },
  { label: "Database", icon: Database, skills: ["PostgreSQL", "MySQL", "SQL Analysis", "Data Pipelines", "Corpus Generation"] },
  { label: "Developer Tools", icon: TerminalSquare, skills: ["Playwright", "Git", "Web Automation", "Visualization", "Reusable Workflows"] }
];
