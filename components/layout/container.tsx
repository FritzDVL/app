import { BreadcrumbNavigation } from "@/components/layout/breadcrumb-navigation";
import { DiscourseHeader } from "@/components/layout/discourse-header";
import { Footer } from "@/components/layout/footer";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-slate-100 dark:bg-gray-900">
      <DiscourseHeader />
      <BreadcrumbNavigation />
      {/* Add top padding to account for fixed header and breadcrumbs */}
      <div className="pt-[60px]">{children}</div>
      <Footer />
    </div>
  );
}
