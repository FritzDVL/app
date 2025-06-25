import { Community, Reply, Thread } from "@/types/common";
import { create } from "zustand";

interface ForumState {
  communities: Record<string, Community>;
  threads: Record<string, Thread>;
  replies: Record<string, Reply[]>;
  communitiesLoaded: boolean;
  threadsLoaded: boolean;
  repliesLoaded: Record<string, boolean>;
  setCommunities: (communities: Community[]) => void;
  setThreads: (threads: Thread[]) => void;
  setReplies: (replies: Reply[], threadId: string) => void;
  addCommunity: (community: Community) => void;
  addThread: (thread: Thread) => void;
  addReply: (reply: Reply, threadId: string) => void;
  setCommunitiesLoaded: (loaded: boolean) => void;
  setThreadsLoaded: (loaded: boolean) => void;
  setRepliesLoaded: (threadId: string, loaded: boolean) => void;
}

export const useForumStore = create<ForumState>(set => ({
  communities: {},
  threads: {},
  replies: {},
  communitiesLoaded: false,
  threadsLoaded: false,
  repliesLoaded: {},
  setCommunities: communities =>
    set({
      communities: Object.fromEntries(communities.map(c => [c.address, c])),
      communitiesLoaded: true,
    }),
  setThreads: threads =>
    set({
      threads: Object.fromEntries(threads.map(t => [t.id, t])),
      threadsLoaded: true,
    }),
  setReplies: (replies, threadId) =>
    set(state => ({
      replies: { ...state.replies, [threadId]: replies },
      repliesLoaded: { ...state.repliesLoaded, [threadId]: true },
    })),
  setCommunitiesLoaded: loaded => set({ communitiesLoaded: loaded }),
  setThreadsLoaded: loaded => set({ threadsLoaded: loaded }),
  setRepliesLoaded: (threadId, loaded) =>
    set(state => ({ repliesLoaded: { ...state.repliesLoaded, [threadId]: loaded } })),
  addCommunity: community =>
    set(state => ({
      communities: { [community.address]: community, ...state.communities },
    })),
  addThread: thread =>
    set(state => ({
      threads: { [thread.id]: thread, ...state.threads },
    })),
  addReply: (reply, threadId) =>
    set(state => ({
      replies: {
        ...state.replies,
        [threadId]: [...(state.replies[threadId] || []), reply],
      },
    })),
}));
