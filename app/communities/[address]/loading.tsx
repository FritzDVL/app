import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content Skeleton */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="h-32 rounded-3xl bg-gray-100 dark:bg-gray-800" />
          <Card className="h-16 rounded-3xl bg-gray-100 dark:bg-gray-800" />
          <Card className="rounded-3xl bg-gray-100 dark:bg-gray-800">
            <CardHeader className="pb-4">
              <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
              ))}
            </CardContent>
          </Card>
        </div>
        {/* Sidebar Skeleton */}
        <div className="space-y-8">
          <Card className="h-40 rounded-3xl bg-gray-100 dark:bg-gray-800" />
          <Card className="h-32 rounded-3xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </main>
  );
}
