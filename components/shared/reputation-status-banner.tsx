import { LensReputationLogo } from "../assets/lensreputation-logo";
import { CheckCircle, ShieldAlert } from "lucide-react";

interface ReputationStatusBannerProps {
  reputation: number | undefined;
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
  if (reputation !== undefined) {
    const bgClass = canPerformAction
      ? "border-green-300 bg-gradient-to-r from-green-100 to-emerald-100"
      : "border-red-300 bg-gradient-to-r from-red-100 to-rose-100";

    return (
      <div className={`flex items-center justify-between rounded-lg border p-3 shadow-sm ${bgClass}`}>
        <div className="flex items-center gap-3">
          <LensReputationLogo size={24} />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">LensReputation Score:</span>
            <span className="font-bold text-neutral-900">{reputation}</span>
          </div>
        </div>

        {canPerformAction ? (
          <div className="flex items-center gap-1.5 text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>✓ You can create {actionType}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-sm text-red-600">
            <ShieldAlert className="h-4 w-4" />
            <span>
              Need {requiredScore}+ score to create {actionType}
            </span>
          </div>
        )}
      </div>
    );
  }

  // User doesn't have NFT
  return (
    <div className="flex items-center justify-between rounded-lg border border-orange-300 bg-gradient-to-r from-orange-100 to-amber-100 p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <LensReputationLogo size={24} />
        <div>
          <span className="text-sm font-medium text-orange-800">LensReputation NFT Required</span>
          <p className="text-xs text-orange-700">You must mint the NFT to create {actionType}</p>
        </div>
      </div>

      <button className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-orange-700">
        Get NFT
      </button>
    </div>
  );
}
