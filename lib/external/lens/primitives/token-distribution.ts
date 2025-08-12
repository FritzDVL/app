import { adaptLensTokenDistribution } from "@/lib/adapters/token-distribution-adapter";
import { TokenDistribution } from "@/lib/domain/rewards/token-distribution";
import { fetchTokenDistributions } from "@lens-protocol/client/actions";
import { PageSize, SessionClient } from "@lens-protocol/react";

interface FetchParams {
  pageSize: PageSize;
  cursor?: string;
}

export interface TokenDistributionFetchResult {
  distributions: TokenDistribution[];
  error: string | null;
}

// Fetch all token distributions from Lens Protocol
export async function fetchAllTokenDistributions(sessionClient: SessionClient): Promise<TokenDistributionFetchResult> {
  try {
    const allItems: TokenDistribution[] = [];
    let cursor: string | null = null;

    // Fetch all pages using a do-while pattern for cleaner logic
    do {
      const params: FetchParams = {
        pageSize: PageSize.Ten,
        ...(cursor && { cursor }),
      };

      const result = await fetchTokenDistributions(sessionClient, params);

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      const { items, pageInfo } = result.value;

      // Transform and add items efficiently
      const transformedItems = items.map(adaptLensTokenDistribution);
      allItems.push(...transformedItems);

      // Update cursor for next iteration
      cursor = pageInfo.next;
    } while (cursor);

    return {
      distributions: allItems,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch token distributions";
    return {
      distributions: [],
      error: errorMessage,
    };
  }
}
