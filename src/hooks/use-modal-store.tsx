import { Channel, ChannelType } from '@/types/channel';
import { Server } from '@/types/server';
import { create } from 'zustand';

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "channels"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
  query?: Record<string, any>;
  messageId?: string;
  messageType?: string;
}

interface MessageFileModalData extends ModalData {
  onFileSelected?: (file: File) => void;
}

type SpecificModalData = MessageFileModalData;

interface ModalStore {
  type: ModalType | null;
  data: SpecificModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: SpecificModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));