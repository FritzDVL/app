import { Community, Reply, Thread } from "@/types/common";
import { create } from "zustand";

interface ForumState {
  communities: Record<string, Community>;
  threads: Record<string, Thread>;
  replies: Record<string, Reply[]>;
  setCommunities: (communities: Community[]) => void;
  setThreads: (threads: Thread[]) => void;
  setReplies: (replies: Reply[], threadId: string) => void;
  addCommunity: (community: Community) => void;
  addThread: (thread: Thread) => void;
  addReply: (reply: Reply, threadId: string) => void;
}

export const useForumStore = create<ForumState>(set => ({
  communities: {},
  threads: {},
  replies: {},
  setCommunities: communities =>
    set({
      communities: Object.fromEntries(communities.map(c => [c.address, c])),
    }),
  setThreads: threads =>
    set({
      threads: Object.fromEntries(threads.map(t => [t.id, t])),
    }),
  setReplies: (replies, threadId) =>
    set(state => ({
      replies: { ...state.replies, [threadId]: replies },
    })),
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
