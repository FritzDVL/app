import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle, Users } from "lucide-react";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Community Header Skeleton */}
          <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                {/* Logo Skeleton */}
                <div className="flex h-[80px] w-[80px] items-center justify-center md:mr-6 md:h-[100px] md:w-[100px]">
                  <div className="h-[80px] w-[80px] animate-pulse rounded-full bg-slate-200 dark:bg-gray-700 md:h-[100px] md:w-[100px]" />
                </div>
                <div className="w-full min-w-0 flex-1">
                  <div className="flex w-full flex-col items-center md:flex-row md:items-start md:justify-between">
                    <div className="w-full min-w-0 flex-1 text-center md:text-left">
                      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-gray-700 md:h-10 md:w-64" />
                      <div className="mx-auto mb-4 h-4 max-w-2xl animate-pulse rounded bg-slate-100 dark:bg-gray-800 md:mx-0" />
                      <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground md:flex-row md:space-x-6 md:space-y-0">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4 animate-pulse text-slate-400" />
                          <div className="h-4 w-16 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4 animate-pulse text-slate-400" />
                          <div className="h-4 w-16 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex w-full shrink-0 flex-col gap-2 md:ml-6 md:mt-0 md:w-auto md:flex-row">
                      <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100 dark:bg-gray-800" />
                      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100 dark:bg-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-800 sm:px-8 sm:py-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-2xl font-bold text-foreground">
                    <Users className="mr-3 h-6 w-6 animate-pulse text-brand-500" />
                    <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
                  </h2>
                </div>
                <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="group">
                    <div className="group w-full min-w-0 cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800 sm:p-6">
                      <div className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="h-12 w-12 animate-pulse rounded-full border border-slate-200 bg-slate-200 dark:bg-gray-700" />
                        </div>
                        <div className="mb-2 h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
                        <div className="mb-4 h-4 w-full max-w-xs animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4 animate-pulse text-slate-400" />
                            <div className="h-4 w-10 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3 animate-pulse text-slate-400" />
                          <div className="h-3 w-10 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar Skeleton */}
        <div className="space-y-8">
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-0 dark:border-gray-700/50 dark:bg-gray-800">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
