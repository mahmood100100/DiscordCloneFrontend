import { Conversation } from '@/types/conversation';
import { DirectMessage } from '@/types/direct-message';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ConversationState = {
  conversations: [],
  activeConversationId: null,
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },

    createConversationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createConversationSuccess: (state, action: PayloadAction<Conversation>) => {
      state.loading = false;
      const existingConversation = state.conversations.find(
        (conversation) => conversation.id === action.payload.id
      );
      if (!existingConversation) {
        state.conversations.push(action.payload);
      }
      state.activeConversationId = action.payload.id;
    },
    createConversationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteConversationStart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteConversationSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.conversations = state.conversations.filter(
        (conversation) => conversation.id !== action.payload
      );
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null;
      }
    },
    deleteConversationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    addDirectMessageStart: (state, action: PayloadAction<{ conversationId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    addDirectMessageSuccess: (
      state,
      action: PayloadAction<{ conversationId: string; directMessage: DirectMessage }>
    ) => {
      state.loading = false;
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conversation) {
        const { directMessage } = action.payload;
        const messageExists = conversation.directMessages.some(
          (msg) => msg.id === directMessage.id
        );
        if (!messageExists) {
          conversation.directMessages = [directMessage , ...(conversation.directMessages || []), ];
        }
      }
    },
    addDirectMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    softDeleteDirectMessageStart: (state, action: PayloadAction<{ conversationId: string; directMessageId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    softDeleteDirectMessageSuccess: (
      state,
      action: PayloadAction<{ conversationId: string; directMessageId: string }>
    ) => {
      state.loading = false;
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conversation) {
        const directMessage = conversation.directMessages.find(
          (dm) => dm.id === action.payload.directMessageId
        );
        if (directMessage) {
          directMessage.deleted = true;
        }
      }
    },
    softDeleteDirectMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    hardDeleteDirectMessageStart: (state, action: PayloadAction<{ conversationId: string; directMessageId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    hardDeleteDirectMessageSuccess: (
      state,
      action: PayloadAction<{ conversationId: string; directMessageId: string }>
    ) => {
      state.loading = false;
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conversation) {
        conversation.directMessages = conversation.directMessages.filter(
          (dm) => dm.id !== action.payload.directMessageId
        );
      }
    },
    hardDeleteDirectMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateDirectMessageStart: (state, action: PayloadAction<{ conversationId: string; directMessageId: string }>) => {
      state.loading = true;
      state.error = null;
    },
    updateDirectMessageSuccess: (
      state,
      action: PayloadAction<{ conversationId: string; directMessage: DirectMessage }>
    ) => {
      state.loading = false;
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conversation) {
        const index = conversation.directMessages.findIndex(
          (dm) => dm.id === action.payload.directMessage.id
        );
        if (index !== -1) {
          conversation.directMessages[index] = action.payload.directMessage;
        }
      }
    },
    updateDirectMessageFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateConversationMessages: (
      state,
      action: PayloadAction<{ conversationId: string; directMessages: DirectMessage[] }>
    ) => {
      const { conversationId, directMessages } = action.payload;

      const updateConversationMessages = (conversation: Conversation): Conversation => {
        if (conversation.id !== conversationId) return conversation;

        // Append new messages to the end, avoiding duplicates
        const combinedMessages = [
          ...(conversation.directMessages || []),
          ...directMessages.filter(
            (newMsg) => !conversation.directMessages.some((existingMsg) => existingMsg.id === newMsg.id)
          ),
        ];

        // Sort newest at the end (optional, only if backend doesn't guarantee order)
        const sortedMessages = combinedMessages.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        return {
          ...conversation,
          directMessages: sortedMessages,
        };
      };

      state.conversations = state.conversations.map(updateConversationMessages);
    },
  },
});

export const {
  createConversationStart,
  createConversationSuccess,
  createConversationFailure,
  deleteConversationStart,
  deleteConversationSuccess,
  deleteConversationFailure,
  addDirectMessageStart,
  addDirectMessageSuccess,
  addDirectMessageFailure,
  softDeleteDirectMessageStart,
  softDeleteDirectMessageSuccess,
  softDeleteDirectMessageFailure,
  hardDeleteDirectMessageStart,
  hardDeleteDirectMessageSuccess,
  hardDeleteDirectMessageFailure,
  updateDirectMessageStart,
  updateDirectMessageSuccess,
  updateDirectMessageFailure,
  setActiveConversation,
  updateConversationMessages,
} = conversationSlice.actions;

export const conversationReducer = conversationSlice.reducer;