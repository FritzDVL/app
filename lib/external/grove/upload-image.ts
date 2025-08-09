import { storageClient } from "@/lib/external/grove/client";
import { chains } from "@lens-chain/sdk/viem";
import { immutable } from "@lens-chain/storage-client";

export type GroveResponse = {
  uri: string;
  gatewayUrl: string;
  storageKey: string;
};

export const uploadImage = async (file: File): Promise<GroveResponse> => {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Only images are allowed.");
  }

  const acl = immutable(chains.mainnet.id);
  const response = await storageClient.uploadFile(file, { acl });

  if (!response) {
    throw new Error("Failed to upload image to Grove");
  }

  return response as GroveResponse;
};
