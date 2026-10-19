import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="case-study flex min-h-screen items-center justify-center px-6 text-center"><div><p className="eyebrow">404 / Not found</p><h1 className="mt-5 font-sans text-6xl font-medium tracking-[-.07em]">This page drifted.</h1><p className="mx-auto mt-5 max-w-md text-muted-foreground">The page you are looking for does not exist or has moved.</p><Link href="/" className="button button--primary mt-8"><ArrowLeft size={15} /> Back to portfolio</Link></div></main>;
}
