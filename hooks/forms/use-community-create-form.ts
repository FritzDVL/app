import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityCreation } from "@/hooks/communities/use-community-create";
import { joinAndIncrementCommunityMember } from "@/lib/external/lens/primitives/groups";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
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
    if (!sessionClient.data || !walletClient.data) {
      toast.error("Not logged in", { description: "Please log in to create a community." });
      setLoading(false);
      return;
    }
    try {
      const community = await createCommunity(
        {
          name: formData.name,
          description: formData.description,
          adminAddress: formData.adminAddress as Address,
        },
        formData.image,
      );
      if (!community || typeof community !== "object" || !("id" in community) || !("address" in community)) {
        setError("Community creation failed.");
        setLoading(false);
        return;
      }
      const joined = await joinAndIncrementCommunityMember(
        community as { id: string; address: string },
        sessionClient.data,
        walletClient.data,
      );
      await queryClient.invalidateQueries({ queryKey: ["communities"] });
      if (joined) {
        router.push(`/communities/${(community as { address: string }).address}`);
      }
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
