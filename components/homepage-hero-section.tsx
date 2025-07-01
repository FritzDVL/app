import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="my-6 mb-12 text-center">
      <div className="mb-6 inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
        <Sparkles className="mr-2 h-4 w-4 text-brand-500" />
        Powered by Lens Protocol
      </div>

      <div className="mb-8 flex justify-center">
        <Image
          src="/logo.png"
          alt="LensForum Logo"
          width={80}
          height={80}
          className="rounded-2xl border border-border bg-white shadow-md"
        />
      </div>

      <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl">
        Lens
        <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">Forum</span>
      </h1>

      <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
        Connect, create, and contribute to the future of decentralized communities
      </p>

      <div className="flex justify-center">
        <Link href="/communities">
          <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-medium">
            Explore Communities
          </Button>
        </Link>
      </div>
    </section>
  );
}
