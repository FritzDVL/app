import { ThreadCreateForm } from "@/components/thread/thread-create-form";
import { StatusBanner } from "@/components/shared/status-banner";
import { getCommunity } from "@/lib/services/community/get-community";
import { TARGET_GROUP_ADDRESS } from "@/lib/shared/constants";
import { Address } from "@/types/common";

export default async function CreateThreadPage() {
  const communityAddress = TARGET_GROUP_ADDRESS as Address;
  const communityResult = await getCommunity(communityAddress);
  const community = communityResult.success ? communityResult.community : null;

  if (!community) {
    return (
      <div className="flex min-h-screen items-start justify-center">
        <div className="w-full max-w-md px-4 pt-12">
          <StatusBanner
            type="info"
            title="Community not found"
            message="The target community does not exist or could not be loaded."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-3xl">
        <ThreadCreateForm community={community} />
      </div>
    </div>
  );
}
