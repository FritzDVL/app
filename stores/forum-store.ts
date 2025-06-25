import { Community, Reply, Thread } from "@/types/common";
import { create } from "zustand";

interface ForumState {
  communities: Record<string, Community>;
  threads: Record<string, Thread>;
  replies: Record<string, Reply>;
  setCommunities: (communities: Community[]) => void;
  setThreads: (threads: Thread[]) => void;
  setReplies: (replies: Reply[]) => void;
  addCommunity: (community: Community) => void;
  addThread: (thread: Thread) => void;
  addReply: (reply: Reply) => void;
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
  setReplies: replies =>
    set({
      replies: Object.fromEntries(replies.map(r => [r.id, r])),
    }),
  addCommunity: community =>
    set(state => ({
      communities: { ...state.communities, [community.address]: community },
    })),
  addThread: thread =>
    set(state => ({
      threads: { ...state.threads, [thread.id]: thread },
    })),
  addReply: reply =>
    set(state => ({
      replies: { ...state.replies, [reply.id]: reply },
    })),
}));
