import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityCreation } from "@/hooks/communities/use-community-create";
import { incrementCommunityMembersCount } from "@/lib/external/supabase/communities";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export function useCommunityCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    emoji: "",
    image: undefined as File | undefined,
    adminAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { createCommunity, isCreating } = useCommunityCreation();
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  useEffect(() => {
    if (account?.address) {
      setFormData(prev => ({ ...prev, adminAddress: account.address }));
    }
  }, [account?.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "image") return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createCommunity(
        {
          name: formData.name,
          description: formData.description,
          adminAddress: formData.adminAddress as Address,
        },
        formData.image,
        async community => {
          if (!sessionClient.data || !walletClient.data) {
            toast.error("Not logged in", { description: "Please log in to create a community." });
            return;
          }
          if (community && community.id) {
            const joinResult = await joinGroup(sessionClient.data!, {
              group: evmAddress(community.address),
            })
              .andThen(handleOperationWith(walletClient.data!))
              .andThen(sessionClient.data.waitForTransaction);
            if (joinResult.isOk()) {
              await incrementCommunityMembersCount(community.id);
            } else {
              console.error("Error joining community:", joinResult.error);
              toast.error("Action Failed", {
                description: "Unable to update your membership status. Please try again.",
              });
            }
            await queryClient.invalidateQueries({ queryKey: ["communities"] });
            router.push(`/communities/${community.address}`);
          }
        },
      );
    } catch (err: any) {
      setError(err.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleImageChange,
    handleSubmit,
    isCreating,
  };
}
