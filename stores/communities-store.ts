import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchAllCommunities } from "@/lib/supabase";
import { transformGroupToCommunity } from "@/lib/transformers/community-transformers";
import { Community } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchGroup } from "@lens-protocol/client/actions";
import { create } from "zustand";

interface CommunitiesState {
  // State
  communities: Community[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  // Actions
  fetchCommunities: () => Promise<void>;
  getCommunityById: (id: string) => Promise<Community | null>;
  setCommunities: (communities: Community[]) => void;
  addCommunity: (community: Community) => void;
  removeCommunity: (id: string) => void;
  updateCommunity: (community: Community) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCommunitiesStore = create<CommunitiesState>((set, get) => ({
  // State
  communities: [],
  isLoading: false,
  error: null,
  hasFetched: false,

  // Actions
  fetchCommunities: async () => {
    const state = get();

    // Prevent duplicate fetches
    if (state.isLoading || state.hasFetched) {
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Get community records from database
      const dbCommunities = await fetchAllCommunities();
      console.log(`Found ${dbCommunities.length} communities in database`);

      if (dbCommunities.length === 0) {
        set({ communities: [], hasFetched: true });
        return;
      }

      // Fetch full group data from Lens Protocol for each community
      const communitiesData: Community[] = [];

      for (const dbCommunity of dbCommunities) {
        try {
          const groupResult = await fetchGroup(client, {
            group: evmAddress(dbCommunity.lens_group_address),
          });

          if (groupResult.isErr()) {
            console.warn(`Failed to fetch group ${dbCommunity.lens_group_address}:`, groupResult.error.message);
            continue;
          }

          const group = groupResult.value;
          if (!group) {
            console.warn(`Group ${dbCommunity.lens_group_address} returned null`);
            continue;
          }

          communitiesData.push(transformGroupToCommunity(group));
        } catch (groupError) {
          console.warn(`Error fetching group ${dbCommunity.lens_group_address}:`, groupError);
          continue;
        }
      }

      set({ communities: communitiesData, hasFetched: true });
      console.log(`Successfully loaded ${communitiesData.length} communities from Lens Protocol`);
    } catch (error) {
      console.error("Error fetching communities:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch communities",
        communities: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setCommunities: communities => set({ communities }),

  getCommunityById: async id => {
    const state = get();

    // If we haven't fetched communities yet, fetch them first
    if (!state.hasFetched && !state.isLoading) {
      const actions = get();
      await actions.fetchCommunities();

      // Get updated state after fetch
      const updatedState = get();
      const community = updatedState.communities.find(c => c.id === id);
      return community || null;
    }

    // If currently loading, wait for it to complete
    if (state.isLoading) {
      console.log(`getCommunityById: Currently loading, waiting...`);
      return new Promise(resolve => {
        const checkLoading = () => {
          const currentState = get();
          if (!currentState.isLoading) {
            const community = currentState.communities.find(c => c.id === id);
            console.log(`getCommunityById: After wait, found community for ${id}:`, community ? "YES" : "NO");
            resolve(community || null);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Return from cache
    const community = state.communities.find(c => c.id === id);
    console.log(`getCommunityById: From cache, found community for ${id}:`, community ? "YES" : "NO");
    return community || null;
  },

  addCommunity: community =>
    set(state => ({
      communities: [community, ...state.communities],
    })),

  removeCommunity: id =>
    set(state => ({
      communities: state.communities.filter(c => c.id !== id),
    })),

  updateCommunity: updatedCommunity =>
    set(state => ({
      communities: state.communities.map(c => (c.id === updatedCommunity.id ? updatedCommunity : c)),
    })),

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}));
