import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users } from "lucide-react";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-100/90 to-white px-4 py-4 dark:border-gray-700/50 dark:from-gray-800/50 dark:to-gray-800 sm:px-8 sm:py-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center text-2xl font-bold text-foreground">
                    <Users className="mr-3 h-6 w-6 text-brand-500" />
                    All Communities
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                  Discover and join communities to share ideas, collaborate, and connect with others who share your
                  interests.
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <LoadingSpinner text="Loading communities..." />
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="h-52 rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
}
