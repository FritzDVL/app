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

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: any; files?: FileList } },
  ) => {
    const { name, value } = e.target;

    // Handle logo file input (real input or programmatic)
    if (name === "logo") {
      let file: File | null = null;
      if ("files" in e.target && e.target.files) {
        // Real input event: use the first file only
        file = e.target.files[0] || null;
      } else if (value instanceof File) {
        // Programmatic: value is a File
        file = value;
      } else if (value === null) {
        // Programmatic: clear
        file = null;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      return;
    }

    // Handle all other fields (text, textarea, etc.)
    setFormData(prev => ({ ...prev, [name]: value }));
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
        actionFormData.append("logo", formData.logo);
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

      if (!result.community) {
        toast.error("Creation Failed", {
          description: "Community data is missing after creation.",
        });
        return;
      }
      const joined = await joinAndIncrementCommunityMember(result.community, sessionClient.data, walletClient.data);

      if (joined) {
        // Server Action already invalidated the cache, just navigate
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
    handleSubmit,
  };
}
