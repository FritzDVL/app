import { useState } from "react";
import { SimplePaymentGroupRule } from "@/components/communities/rules/types/payment-rule-config";
import { Community } from "@/lib/domain/communities/types";
import { toast } from "sonner";

export function useUpdateCommunityRules(community: Community) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRules = async (newRule: SimplePaymentGroupRule | null) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading("Updating community rule...");
    try {
      // Simulate an API call to update community rules
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Here you would typically call your API to update the community rules
      console.log("Updated community:", community.id, "with new rule:", newRule);
      toast.success("Community rule updated!", { id: toastId });
    } catch (err) {
      setError(err as Error);
      toast.error((err as Error).message || "An error occurred while updating the rule.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return { updateRules, loading, error };
}
