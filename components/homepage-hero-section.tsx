import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="homepage-hero mb-16 text-center">
      <div className="homepage-powered mb-6 inline-flex items-center rounded-full border border-brand-300/60 bg-brand-100/80 px-4 py-2 text-sm font-medium text-brand-700 backdrop-blur-sm">
        <Sparkles className="mr-2 h-4 w-4 text-brand-500" />
        Powered by Lens Protocol
      </div>

      <div className="homepage-logo mb-8 flex justify-center">
        <Image
          src="/logo.png"
          alt="LensForum Logo"
          width={80}
          height={80}
          className="rounded-2xl border-4 border-brand-200 bg-brand-50 shadow-lg"
        />
      </div>

      <h1 className="homepage-title mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
        Lens
        <span className="homepage-title-gradient bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
          Forum
        </span>
      </h1>

      <p className="homepage-description mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-brand-700">
        Connect, create, and contribute to the future of decentralized communities
      </p>

      <div className="homepage-cta flex justify-center">
        <Link href="/communities">
          <Button
            variant="outline"
            className="homepage-cta-btn rounded-full border-brand-300 bg-brand-50/80 px-8 py-3 text-lg font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-100/80 hover:text-brand-900"
          >
            Explore Communities
          </Button>
        </Link>
      </div>
    </section>
  );
}
