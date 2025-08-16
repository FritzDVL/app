import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCommunityAction } from "@/app/actions/create-community";
import { joinAndIncrementCommunityMember } from "@/lib/external/lens/primitives/groups";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { useSessionClient } from "@lens-protocol/react";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export interface CreateCommunityFormData {
  name: string;
  description: string;
  adminAddress: Address;
  logo?: File | null;
  tags?: string;
}

export function useCommunityCreateForm() {
  const [formData, setFormData] = useState<CreateCommunityFormData>({
    name: "",
    description: "",
    adminAddress: "0x0",
    logo: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  const router = useRouter();

  useEffect(() => {
    if (account?.address) {
      setFormData(prev => ({ ...prev, adminAddress: account.address }));
    }
  }, [account?.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "imageFile") return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData({ ...formData, logo: file });
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
      // Create FormData for Server Action
      const actionFormData = new FormData();
      actionFormData.append("name", formData.name);
      actionFormData.append("description", formData.description);
      actionFormData.append("adminAddress", formData.adminAddress);
      if (formData.logo) {
        actionFormData.append("image", formData.logo);
      }

      // Show loading toast
      const loadingToastId = toast.loading("Creating Community", {
        description: "Setting up your community on Lens Protocol...",
      });

      // Call Server Action
      const result = await createCommunityAction(actionFormData);

      if (!result.success) {
        toast.error("Creation Failed", {
          id: loadingToastId,
          description: result.error || "Failed to create community.",
        });
        throw new Error(result.error || "Failed to create community.");
      }

      toast.success("Community Created!", {
        id: loadingToastId,
        description: `${formData.name} has been successfully created on Lens Protocol.`,
      });

      const joined = await joinAndIncrementCommunityMember(result.community, sessionClient.data, walletClient.data);

      if (joined) {
        // Server Action ya invalidó la caché, solo navegamos
        router.push(`/communities/${result.community.address}`);
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
  };
}
