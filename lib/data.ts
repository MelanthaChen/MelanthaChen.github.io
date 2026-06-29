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
  description: "Building AI-powered platforms, developer tools, and intelligent systems.",
  education: "MS in Software Engineering Systems, Northeastern University",
  location: "Boston, MA",
  email: "yuxuan.chen@northeastern.edu",
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
    detail: "MS in Software Engineering Systems"
  },
  {
    icon: BrainCircuit,
    label: "Current Role",
    value: "Software engineer",
    detail: "LLM platforms, evaluation, retrieval, and developer workflows"
  },
  {
    icon: FlaskConical,
    label: "Research",
    value: "AI search",
    detail: "Generative Engine Optimization, answer quality, and automation"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Boston",
    detail: "Open to engineering roles across product and infrastructure"
  },
  {
    icon: Sparkles,
    label: "Interests",
    value: "Useful intelligence",
    detail: "Search, automation, applied ML, and quietly excellent tools"
  },
  {
    icon: Rocket,
    label: "Career Goal",
    value: "Build durable systems",
    detail: "Own complex systems from prototype to production quality"
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
    title: "GEO Engine",
    category: "Search",
    image: "/images/project-geo.svg",
    description:
      "A Generative Engine Optimization platform for measuring and improving AI search visibility.",
    stack: ["Next.js", "TypeScript", "LLM Eval", "PostgreSQL", "Vercel"],
    links: { github: site.github, demo: "#" },
    overview:
      "GEO Engine tracks how brands and technical content appear inside AI-generated answers, then recommends improvements with evidence.",
    problem:
      "Traditional SEO analytics miss how LLM-powered answer engines cite, compress, or omit source material.",
    solution:
      "A prompt suite, retrieval audit pipeline, and scoring layer that compares generated answers across engines and topic clusters.",
    challenges: [
      "Normalizing unstable model outputs into comparable measurements",
      "Designing reports that are useful without overstating certainty",
      "Keeping evaluation runs reproducible and cost-aware"
    ],
    learned:
      "The strongest AI analytics products combine probabilistic signals with careful product language.",
    timeline: "8 weeks from research prototype to product-quality dashboard",
    screenshots: ["/images/project-geo.svg", "/images/project-llm.svg"]
  },
  {
    title: "Algo Coach",
    category: "Developer Tool",
    image: "/images/project-algo.svg",
    description:
      "An adaptive interview preparation tool that explains algorithms through hints, traces, and feedback loops.",
    stack: ["React", "Node.js", "OpenAI", "Redis", "Tailwind"],
    links: { github: site.github, demo: "#" },
    overview:
      "Algo Coach turns coding practice into a guided session with strategic hints, runtime visualizations, and post-solution review.",
    problem:
      "Most practice tools reveal answers too quickly or give feedback that is too generic to change behavior.",
    solution:
      "A session engine that models the learner's current approach and chooses the smallest helpful next hint.",
    challenges: [
      "Balancing helpfulness with preserving productive struggle",
      "Rendering trace data clearly on small screens",
      "Preventing generated feedback from becoming vague"
    ],
    learned:
      "Good developer education software needs pacing, not just correctness checks.",
    timeline: "6 weeks for adaptive session engine, trace UI, and feedback loops",
    screenshots: ["/images/project-algo.svg", "/images/project-geo.svg"]
  },
  {
    title: "LLM Search Optimizer",
    category: "AI Platform",
    image: "/images/project-llm.svg",
    description:
      "A retrieval and prompt optimization workspace for evaluating answer quality across knowledge bases.",
    stack: ["Python", "FastAPI", "Next.js", "Vector DB", "LangChain"],
    links: { github: site.github, demo: "#" },
    overview:
      "The optimizer helps teams compare retrieval settings, prompt variants, and model responses in one repeatable workflow.",
    problem:
      "RAG teams often tune prompts and retrieval settings through scattered notebooks, logs, and subjective review.",
    solution:
      "A structured experiment layer with versioned datasets, side-by-side answers, and weighted quality dimensions.",
    challenges: [
      "Creating evaluation labels that non-ML teammates can trust",
      "Designing compact comparisons for dense answer sets",
      "Separating retrieval failure from generation failure"
    ],
    learned:
      "Evaluation UX is infrastructure; when it is elegant, teams make better model decisions faster.",
    timeline: "10 weeks for experiment model, comparison UI, and retrieval analytics",
    screenshots: ["/images/project-llm.svg", "/images/project-algo.svg"]
  }
];

export const research = [
  {
    date: "2026",
    title: "Research Assistant",
    area: "LLM systems",
    text: "Exploring evaluation methods for generated answers, citation behavior, and search-quality automation."
  },
  {
    date: "2025",
    title: "Generative Engine Optimization",
    area: "AI Search",
    text: "Studied how content structure, topical authority, and retrieval cues influence answer-engine visibility."
  },
  {
    date: "2025",
    title: "Automation Workflows",
    area: "Developer productivity",
    text: "Designed agentic workflows for repetitive research, validation, and documentation tasks."
  }
];

export const experience = [
  {
    company: "Northeastern University",
    logo: "NU",
    role: "Software Engineering Systems Graduate Student",
    dates: "2025 - Present",
    responsibilities: [
      "Built production-style full-stack systems with strong emphasis on reliability and architecture.",
      "Designed AI-assisted workflows for search, evaluation, and developer tooling.",
      "Collaborated across product, design, and engineering constraints."
    ],
    tech: ["TypeScript", "Python", "React", "Cloud", "LLMs"]
  },
  {
    company: "Independent Projects",
    logo: "YC",
    role: "Product-minded Software Engineer",
    dates: "2024 - Present",
    responsibilities: [
      "Shipped polished portfolio projects with reusable UI systems and clean data models.",
      "Translated ambiguous AI product ideas into testable prototypes.",
      "Focused on performance, accessibility, and thoughtful interaction design."
    ],
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Tailwind", "Vercel"]
  }
];

export const skillGroups = [
  { label: "Languages", icon: Code2, skills: ["TypeScript", "Python", "Java", "SQL", "C++"] },
  { label: "Frontend", icon: TerminalSquare, skills: ["Next.js", "React", "TailwindCSS", "Framer Motion", "shadcn/ui"] },
  { label: "Backend", icon: BriefcaseBusiness, skills: ["FastAPI", "Node.js", "REST APIs", "Auth", "Workers"] },
  { label: "Cloud", icon: Cloud, skills: ["Vercel", "AWS", "Docker", "CI/CD", "Serverless"] },
  { label: "AI", icon: Bot, skills: ["LLMs", "RAG", "Prompting", "Evaluation", "Automation"] },
  { label: "Database", icon: Database, skills: ["PostgreSQL", "Redis", "Vector DBs", "Prisma", "MongoDB"] },
  { label: "Developer Tools", icon: BriefcaseBusiness, skills: ["Git", "Figma", "Linear", "GitHub Actions", "Playwright"] }
];
