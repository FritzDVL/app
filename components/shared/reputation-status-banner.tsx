import { LensReputationScore } from "@/hooks/common/use-lensreputation-score";
import { CheckCircle, ShieldAlert } from "lucide-react";

interface ReputationStatusBannerProps {
  reputation: LensReputationScore;
  canPerformAction: boolean;
  actionType: "threads" | "communities";
  requiredScore: number;
}

export function ReputationStatusBanner({
  reputation,
  canPerformAction,
  actionType,
  requiredScore,
}: ReputationStatusBannerProps) {
  // User has NFT and score
  if (reputation.score !== undefined) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-3">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <span className="font-medium">LensReputation Score: {reputation.score}</span>
          {canPerformAction ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Eligible to create {actionType}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-orange-600">
              <ShieldAlert className="h-4 w-4" />
              Need {requiredScore}+ score to create {actionType}
            </span>
          )}
        </div>
      </div>
    );
  }

  // User doesn't have NFT
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
      <div className="text-sm text-orange-700">
        <span className="flex items-center gap-1 font-medium">
          <ShieldAlert className="h-4 w-4" />
          LensReputation NFT required
        </span>
        <p className="mt-1">You need to mint the LensReputation NFT to create {actionType}.</p>
      </div>
    </div>
  );
}
