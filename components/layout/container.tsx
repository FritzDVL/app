import { Navbar } from "@/components/layout/navbar";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/40">
      <Navbar />
      {children}
    </div>
  );
}
