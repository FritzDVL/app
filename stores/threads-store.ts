import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunityThreads, fetchThread } from "@/lib/supabase";
import { transformFeedToThread } from "@/lib/transformers/thread-transformers";
import { Thread } from "@/types/common";
import { evmAddress } from "@lens-protocol/client";
import { fetchFeed } from "@lens-protocol/client/actions";
import { create } from "zustand";

interface ThreadsState {
  threads: Record<string, Thread[]>; // communityAddress -> threads[]
  isLoading: boolean;
  error: string | null;
  fetchedCommunities: Set<string>;
  threadByAddress: Record<string, Thread>;

  fetchThreadsByCommunity: (communityAddress: string) => Promise<void>;
  fetchThreadByAddress: (threadAddress: string) => Promise<Thread | null>;
  addThread: (communityAddress: string, thread: Thread) => void;
  removeThread: (communityAddress: string, threadId: string) => void;
  updateThread: (communityAddress: string, thread: Thread) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useThreadsStore = create<ThreadsState>((set, get) => ({
  threads: {},
  isLoading: false,
  error: null,
  fetchedCommunities: new Set<string>(),
  threadByAddress: {},

  fetchThreadsByCommunity: async (communityAddress: string) => {
    const state = get();
    if (state.isLoading || state.fetchedCommunities.has(communityAddress)) {
      console.warn(`Threads for community ${communityAddress} already fetched or loading`);
      return;
    }
    try {
      set({ isLoading: true, error: null });
      console.log(`Fetching threads for community: ${communityAddress}`);
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
        const updatedFetched = new Set(state.fetchedCommunities);
        updatedFetched.add(communityAddress);
        return {
          threads: { ...state.threads, [communityAddress]: threadsData },
          fetchedCommunities: updatedFetched,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch threads" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchThreadByAddress: async (threadAddress: string) => {
    const state = get();
    if (state.threadByAddress[threadAddress]) {
      return state.threadByAddress[threadAddress];
    }
    try {
      const threadRecord = await fetchThread(threadAddress);
      if (!threadRecord) return null;
      const feedResult = await fetchFeed(client, {
        feed: evmAddress(threadAddress),
      });
      if (feedResult.isErr() || !feedResult.value) return null;
      const thread = await transformFeedToThread(feedResult.value, threadRecord);
      set(state => ({
        threadByAddress: {
          ...state.threadByAddress,
          [threadAddress]: thread,
        },
      }));
      return thread;
    } catch (error) {
      console.error("Failed to fetch thread by address", error);
      return null;
    }
  },

  addThread: (communityAddress, thread) =>
    set(state => ({
      threads: {
        ...state.threads,
        [communityAddress]: [thread, ...(state.threads[communityAddress] || [])],
      },
      threadByAddress: { ...state.threadByAddress, [thread.id]: thread },
    })),

  removeThread: (communityAddress, threadId) =>
    set(state => ({
      threads: {
        ...state.threads,
        [communityAddress]: (state.threads[communityAddress] || []).filter(t => t.id !== threadId),
      },
      threadByAddress: Object.fromEntries(Object.entries(state.threadByAddress).filter(([id]) => id !== threadId)),
    })),

  updateThread: (communityAddress, updatedThread) =>
    set(state => ({
      threads: {
        ...state.threads,
        [communityAddress]: (state.threads[communityAddress] || []).map(t =>
          t.id === updatedThread.id ? updatedThread : t,
        ),
      },
      threadByAddress: { ...state.threadByAddress, [updatedThread.id]: updatedThread },
    })),

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}));
