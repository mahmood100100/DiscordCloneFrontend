import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Server } from '@/types/server';
import { Member } from '@/types/member';
import { Channel } from '@/types/channel';
import { Message } from '@/types/message';

interface ServerState {
  servers: Server[];
  filteredServers: Server[];
  activeChannelId: string | null;
  loading: boolean;
  error: string | null;
  selectedServer: Server | null;
  signalrConnected: boolean;
}

const initialState: ServerState = {
  servers: [],
  filteredServers: [],
  activeChannelId : null,
  loading: false,
  error: null,
  selectedServer: null,
  signalrConnected: false,
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    fetchServersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchServersSuccess: (state, action: PayloadAction<Server[]>) => {
      state.servers = action.payload;
      state.filteredServers = action.payload;
      state.loading = false;
    },
    fetchServersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectServer: (state, action: PayloadAction<Server | null>) => {
      state.selectedServer = action.payload;
    },
    addServerSuccess: (state, action: PayloadAction<Server>) => {
      if (!state.servers.some(server => server.id === action.payload.id)) {
        state.servers.push(action.payload);
        state.filteredServers.push(action.payload);
      }
    },
    updateServerSuccess: (state, action: PayloadAction<Server>) => {
      state.servers = state.servers.map(server =>
        server.id === action.payload.id ? action.payload : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === action.payload.id ? action.payload : server
      );
      if (state.selectedServer?.id === action.payload.id) {
        state.selectedServer = action.payload;
      }
    },
    deleteServerSuccess: (state, action: PayloadAction<string>) => {
      state.servers = state.servers.filter(server => server.id !== action.payload);
      state.filteredServers = state.filteredServers.filter(server => server.id !== action.payload);
      if (state.selectedServer?.id === action.payload) {
        state.selectedServer = null;
      }
    },
    setServers: (state, action: PayloadAction<Server[]>) => {
      state.servers = action.payload;
      state.filteredServers = action.payload;
    },
    searchServers: (state, action: PayloadAction<string>) => {
      const query = action.payload.toLowerCase();
      state.filteredServers = state.servers.filter(server =>
        server.name.toLowerCase().includes(query)
      );
    },
    setActiveChannel: (state, action: PayloadAction<string | null>) => {
      state.activeChannelId = action.payload;
    },
    updateServerMember: (state, action: PayloadAction<{ serverId: string, member: Member }>) => {
      state.servers = state.servers.map(server =>
        server.id === action.payload.serverId
          ? {
              ...server,
              members: server.members.map(member =>
                member.id === action.payload.member.id ? action.payload.member : member
              ),
            }
          : server
      );
      if (state.selectedServer?.id === action.payload.serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          members: state.selectedServer.members.map(member =>
            member.id === action.payload.member.id ? action.payload.member : member
          ),
        };
      }
    },
    updateServerChannel: (state, action: PayloadAction<{ serverId: string, channel: Channel }>) => {
      state.servers = state.servers.map(server =>
        server.id === action.payload.serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === action.payload.channel.id ? action.payload.channel : channel
              ),
            }
          : server
      );
      if (state.selectedServer?.id === action.payload.serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(channel =>
            channel.id === action.payload.channel.id ? action.payload.channel : channel
          ),
        };
      }
    },
    removeServerMember: (state, action: PayloadAction<{ serverId: string, memberId: string, hard: boolean }>) => {
      const { serverId, memberId, hard } = action.payload;
      
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              members: hard
                ? server.members.filter(member => member.id !== memberId)
                : server.members.map(member =>
                    member.id === memberId
                      ? { ...member, deleted: true }
                      : member
                  ),
            }
          : server
      );
      
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              members: hard
                ? server.members.filter(member => member.id !== memberId)
                : server.members.map(member =>
                    member.id === memberId
                      ? { ...member, deleted: true }
                      : member
                  ),
            }
          : server
      );
      
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          members: hard
            ? state.selectedServer.members.filter(member => member.id !== memberId)
            : state.selectedServer.members.map(member =>
                member.id === memberId
                  ? { ...member, deleted: true }
                  : member
              ),
        };
      }
    },
    addServerMember: (state, action: PayloadAction<{ serverId: string; member: Member }>) => {
      const { serverId, member } = action.payload;
    
      const serverIndex = state.servers.findIndex(server => server.id === serverId);
      const server = state.servers[serverIndex];
    
      if (server) {
        const existingMemberIndex = server.members.findIndex(existingMember => existingMember.id === member.id);
        const existingMember = existingMemberIndex !== -1 ? server.members[existingMemberIndex] : null;
    
        if (existingMember) {
          if (existingMember.deleted) {
            server.members[existingMemberIndex] = {
              ...existingMember,
              deleted: false,
            };
          }
        } else {
          server.members.push({ ...member, deleted: false });
        }
    
        const filteredServerIndex = state.filteredServers.findIndex(filteredServer => filteredServer.id === serverId);
        if (filteredServerIndex !== -1) {
          const filteredServer = state.filteredServers[filteredServerIndex];
          const existingFilteredMemberIndex = filteredServer.members.findIndex(existingMember => existingMember.id === member.id);
          if (existingFilteredMemberIndex !== -1) {
            const existingFilteredMember = filteredServer.members[existingFilteredMemberIndex];
            if (existingFilteredMember.deleted) {
              state.filteredServers[filteredServerIndex].members[existingFilteredMemberIndex] = {
                ...existingFilteredMember,
                deleted: false,
              };
            }
          } else {
            state.filteredServers[filteredServerIndex].members.push({ ...member, deleted: false });
          }
        }
    
        if (state.selectedServer?.id === serverId) {
          const existingSelectedMemberIndex = state.selectedServer.members.findIndex(existingMember => existingMember.id === member.id);
          if (existingSelectedMemberIndex !== -1) {
            const existingSelectedMember = state.selectedServer.members[existingSelectedMemberIndex];
            if (existingSelectedMember.deleted) {
              state.selectedServer.members[existingSelectedMemberIndex] = {
                ...existingSelectedMember,
                deleted: false,
              };
            }
          } else {
            state.selectedServer.members.push({ ...member, deleted: false });
          }
        }
      }
    },
    
    addServerChannel: (state, action: PayloadAction<{ serverId: string; channel: Channel }>) => {
      const { serverId, channel } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.some(existingChannel => existingChannel.id === channel.id)
                ? server.channels
                : [...server.channels, channel],
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.some(existingChannel => existingChannel.id === channel.id)
                ? server.channels
                : [...server.channels, channel],
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        if (!state.selectedServer.channels.some(existingChannel => existingChannel.id === channel.id)) {
          state.selectedServer = {
            ...state.selectedServer,
            channels: [...state.selectedServer.channels, channel],
          };
        }
      }
    },
    removeServerChannel: (state, action: PayloadAction<{ serverId: string; channelId: string }>) => {
      const { serverId, channelId } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.filter(channel => channel.id !== channelId),
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.filter(channel => channel.id !== channelId),
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.filter(channel => channel.id !== channelId),
        };
      }
    },
    setSignalrStatus: (state, action: PayloadAction<boolean>) => {
      state.signalrConnected = action.payload;
    },
    addChannelMessage: (state, action: PayloadAction<{ serverId: string; channelId: string; message: Message }>) => {
      const { serverId, channelId, message } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.some(existingMessage => existingMessage.id === message.id)
                        ? channel.messages
                        : [message, ...channel.messages],
                    }
                  : channel
              ),
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.some(existingMessage => existingMessage.id === message.id)
                        ? channel.messages
                        : [message, ...channel.messages],
                    }
                  : channel
              ),
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(channel =>
            channel.id === channelId
              ? {
                  ...channel,
                  messages: channel.messages.some(existingMessage => existingMessage.id === message.id)
                    ? channel.messages
                    : [message, ...channel.messages],
                }
              : channel
          ),
        };
      }
    },
    updateChannelMessage: (state, action: PayloadAction<{ serverId: string; channelId: string; message: Message }>) => {
      const { serverId, channelId, message } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.map(msg =>
                        msg.id === message.id ? message : msg
                      ),
                    }
                  : channel
              ),
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.map(msg =>
                        msg.id === message.id ? message : msg
                      ),
                    }
                  : channel
              ),
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(channel =>
            channel.id === channelId
              ? {
                  ...channel,
                  messages: channel.messages.map(msg =>
                    msg.id === message.id ? message : msg
                  ),
                }
              : channel
          ),
        };
      }
    },
    hardDeleteChannelMessage: (state, action: PayloadAction<{ serverId: string; channelId: string; messageId: string }>) => {
      const { serverId, channelId, messageId } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.filter(msg => msg.id !== messageId),
                    }
                  : channel
              ),
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.filter(msg => msg.id !== messageId),
                    }
                  : channel
              ),
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(channel =>
            channel.id === channelId
              ? {
                  ...channel,
                  messages: channel.messages.filter(msg => msg.id !== messageId),
                }
              : channel
          ),
        };
      }
    },
    softDeleteChannelMessage: (state, action: PayloadAction<{ serverId: string; channelId: string; messageId: string }>) => {
      const { serverId, channelId, messageId } = action.payload;
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.map(msg =>
                        msg.id === messageId ? { ...msg, deleted: true } : msg
                      ),
                    }
                  : channel
              ),
            }
          : server
      );
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(channel =>
                channel.id === channelId
                  ? {
                      ...channel,
                      messages: channel.messages.map(msg =>
                        msg.id === messageId ? { ...msg, deleted: true } : msg
                      ),
                    }
                  : channel
              ),
            }
          : server
      );
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(channel =>
            channel.id === channelId
              ? {
                  ...channel,
                  messages: channel.messages.map(msg =>
                    msg.id === messageId ? { ...msg, deleted: true } : msg
                  ),
                }
              : channel
          ),
        };
      }
    },
    updateChannelMessages: (state, action: PayloadAction<{ serverId: string; channelId: string; messages: Message[] }>) => {
      const { serverId, channelId, messages } = action.payload;
      
      const updateChannelMessages = (channel: Channel): Channel => {
        if (channel.id !== channelId) return channel;
        
        const combinedMessages = [
          ...messages.filter(newMsg => 
            !channel.messages.some(existingMsg => existingMsg.id === newMsg.id)
          ),
          ...channel.messages
        ];
        
        const sortedMessages = combinedMessages.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        return {
          ...channel,
          messages: sortedMessages
        };
      };
    
      state.servers = state.servers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(updateChannelMessages)
            }
          : server
      );
      
      state.filteredServers = state.filteredServers.map(server =>
        server.id === serverId
          ? {
              ...server,
              channels: server.channels.map(updateChannelMessages)
            }
          : server
      );
      
      if (state.selectedServer?.id === serverId) {
        state.selectedServer = {
          ...state.selectedServer,
          channels: state.selectedServer.channels.map(updateChannelMessages),
        };
      }
    },
  },
});

export const {
  fetchServersStart,
  fetchServersSuccess,
  fetchServersFailure,
  selectServer,
  addServerSuccess,
  updateServerSuccess,
  deleteServerSuccess,
  setServers,
  searchServers,
  setActiveChannel,
  updateServerMember,
  updateServerChannel,
  removeServerMember,
  addServerMember,
  addServerChannel,
  removeServerChannel,
  setSignalrStatus,
  addChannelMessage,
  updateChannelMessage,
  hardDeleteChannelMessage,
  softDeleteChannelMessage,
  updateChannelMessages,
} = serverSlice.actions;

export const serverReducer = serverSlice.reducer;