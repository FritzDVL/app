"use client";

import { ProtectedRoute } from "@/components/pages/protected-route";
import { RewardsHistory } from "@/components/rewards/rewards-history";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenDistributions } from "@/hooks/rewards/use-token-distributions";
import { AlertCircle, Coins, ExternalLink, Gift, History, TrendingUp } from "lucide-react";

const LENS_DOCS_URL = "https://lens.xyz/docs/protocol/user-rewards#how-it-works";

export default function UserRewardsPage() {
  const {
    distributions,
    loading: rewardsLoading,
    error: rewardsError,
    totalRewards,
    monthlyRewards,
    isRewardsAvailable,
  } = useTokenDistributions();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Rewards Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your Lens Protocol rewards and transaction history
          </p>
        </div>

        <div className="space-y-6">
          {/* Rewards Overview */}
          <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <Gift className="h-6 w-6 text-brand-500" />
                Rewards Overview
                {rewardsLoading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rewardsError ? (
                <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200">Error loading rewards</p>
                    <p className="text-sm text-red-600 dark:text-red-300">{rewardsError}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-brand-50 to-brand-100 p-4 dark:border-gray-600 dark:from-brand-900/30 dark:to-brand-800/30">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-brand-500 p-2">
                        <Coins className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Rewards</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {rewardsLoading ? (
                            <span className="inline-block h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                          ) : (
                            `${totalRewards.toFixed(2)} $GHO`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-green-50 to-emerald-100 p-4 dark:border-gray-600 dark:from-green-900/30 dark:to-emerald-800/30">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-500 p-2">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {rewardsLoading ? (
                            <span className="inline-block h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                          ) : (
                            `${monthlyRewards.toFixed(2)} $GHO`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rewards History */}
          <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <History className="h-6 w-6 text-brand-500" />
                Rewards History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RewardsHistory
                distributions={distributions}
                loading={rewardsLoading}
                isRewardsAvailable={isRewardsAvailable}
              />
            </CardContent>
          </Card>

          {/* Documentation Link */}
          <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                <ExternalLink className="h-6 w-6 text-brand-500" />
                Learn More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Want to understand how Lens Protocol rewards work? Check out the official documentation for detailed
                information about reward distribution mechanisms and eligibility criteria.
              </p>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={LENS_DOCS_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Lens Documentation
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
