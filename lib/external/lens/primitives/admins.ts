import { client } from "@/lib/external/lens/protocol-client";
import { Admin, PageSize, evmAddress } from "@lens-protocol/client";
import { fetchAdminsFor } from "@lens-protocol/client/actions";

export async function fetchAdminsFromGroup(address: string): Promise<Admin[]> {
  const result = await fetchAdminsFor(client, {
    address: evmAddress(address),
    pageSize: PageSize.Fifty,
  });
  if (result.isErr()) {
    throw new Error(result.error.message || "Failed to fetch admins");
  }
  return result.value.items as Admin[];
}
