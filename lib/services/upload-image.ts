import { uploadImage as uploadToGrove } from "@/lib/external/grove/upload-image";

export async function uploadImage(file: File): Promise<string> {
  const result = await uploadToGrove(file);
  return result.gatewayUrl;
}
