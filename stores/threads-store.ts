import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunityThreads } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";
import { create } from "zustand";

interface ThreadsState {
  threads: Thread[];
  isLoading: boolean;
  error: string | null;
  fetchedCommunities: Set<string>;

  fetchThreadsByCommunity: (communityAddress: string) => Promise<void>;
  addThread: (thread: Thread) => void;
  removeThread: (threadId: string) => void;
  updateThread: (thread: Thread) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useThreadsStore = create<ThreadsState>((set, get) => ({
  threads: [],
  isLoading: false,
  error: null,
  fetchedCommunities: new Set<string>(),

  fetchThreadsByCommunity: async (communityAddress: string) => {
    const state = get();
    if (state.isLoading || state.fetchedCommunities.has(communityAddress)) {
      return;
    }
    try {
      set({ isLoading: true, error: null });
      const threadRecords = await fetchCommunityThreads(communityAddress);
      if (threadRecords.length === 0) {
        set(state => {
          const updatedFetched = new Set(state.fetchedCommunities);
          updatedFetched.add(communityAddress);
          return { fetchedCommunities: updatedFetched };
        });
        return;
      }
      const threadsData: Thread[] = [];
      for (const threadRecord of threadRecords) {
        try {
          const feedResult = await fetchFeed(client, {
            feed: evmAddress(threadRecord.lens_feed_address),
          });
          if (feedResult.isErr()) continue;
          const feed = feedResult.value;
          if (!feed) continue;
          const thread = await transformFeedToThread(feed, threadRecord);
          threadsData.push(thread);
        } catch {
          console.error(`Failed to fetch feed for address ${threadRecord.lens_feed_address}`);
          continue;
        }
      }
      threadsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      set(state => {
        const filtered = state.threads.filter(t => t.communityAddress !== communityAddress);
        const updatedFetched = new Set(state.fetchedCommunities);
        updatedFetched.add(communityAddress);
        return {
          threads: [...filtered, ...threadsData],
          fetchedCommunities: updatedFetched,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch threads" });
    } finally {
      set({ isLoading: false });
    }
  },

  addThread: (thread: Thread) =>
    set(state => ({
      threads: [thread, ...state.threads],
    })),

  removeThread: (threadId: string) =>
    set(state => ({
      threads: state.threads.filter(t => t.id !== threadId),
    })),

  updateThread: (updatedThread: Thread) =>
    set(state => ({
      threads: state.threads.map(t => (t.id === updatedThread.id ? updatedThread : t)),
    })),

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}));
