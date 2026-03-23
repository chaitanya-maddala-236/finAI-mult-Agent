"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "@/lib/api";

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserResponse, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<UserResponse>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("finai_token", token);
          localStorage.setItem("finai_user", JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("finai_token");
          localStorage.removeItem("finai_user");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "finai-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ── Chat store ────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  advice?: {
    action_items?: string[];
    warnings?: string[];
    confidence_score?: number;
    detailed_advice?: string;
    next_review_date?: string;
  };
  agentOutputs?: Record<string, unknown>;
  isLoading?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  conversationId: string | null;
  isStreaming: boolean;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (updates: Partial<ChatMessage>) => void;
  setStreaming: (v: boolean) => void;
  setConversationId: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  conversationId: null,
  isStreaming: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (updates) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          ...updates,
        };
      }
      return { messages };
    }),

  setStreaming: (v) => set({ isStreaming: v }),
  setConversationId: (id) => set({ conversationId: id }),
  clearMessages: () => set({ messages: [], conversationId: null }),
}));
