import * as signalR from "@microsoft/signalr";

interface ListenerCallback<T = any> {
  (data: T): void;
}

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private listeners: Record<string, ListenerCallback> = {};
  private hubUrl: string | null = null;
  private joinedGroups: Set<string> = new Set();

  public async startConnection(hubUrl: string): Promise<void> {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      await this.connection.stop();
    }

    this.hubUrl = hubUrl;
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onclose(() => console.log(`Connection to ${hubUrl} closed unexpectedly`));
      this.connection.onreconnecting(() => console.log(`Reconnecting to ${hubUrl}...`));
      this.connection.onreconnected(() => {
        this._registerListeners();
        this._rejoinGroups();
      });

      await this.connection.start();
      this._registerListeners();
    } catch (error) {
      console.error(`Error starting SignalR connection to ${hubUrl}:`, error);
      throw error;
    }
  }

  public on<T = any>(eventName: string, callback: ListenerCallback<T>): void {
    if (!this.connection) {
      console.error(`Cannot register listener for ${eventName}: SignalR connection not established`);
      return;
    }
    this.listeners[eventName] = callback;
    this.connection.on(eventName, callback);
  }

  public off(eventName: string): void {
    if (!this.connection || !this.listeners[eventName]) {
      return;
    }
    this.connection.off(eventName, this.listeners[eventName]);
    delete this.listeners[eventName];
  }

  public async invoke(methodName: string, ...args: any[]): Promise<void> {
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error(`Cannot invoke ${methodName}: SignalR connection not established or not connected`);
      return;
    }
    try {
      await this.connection.invoke(methodName, ...args);
    } catch (error) {
      throw error;
    }
  }

  public async joinChannelGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (this.joinedGroups.has(groupName)) return;
    await this.invoke("JoinGroup", groupName);
    this.joinedGroups.add(groupName);
  }

  public async leaveChannelGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (!this.joinedGroups.has(groupName)) return;
    await this.invoke("LeaveGroup", groupName);
    this.joinedGroups.delete(groupName);
  }

  public async joinMessageGroup(serverId: string, channelId: string): Promise<void> {
    const groupName = `${serverId},${channelId}`;
    if (this.joinedGroups.has(groupName)) return;
    await this.invoke("JoinGroup", groupName);
    this.joinedGroups.add(groupName);
  }

  public async leaveMessageGroup(serverId: string, channelId: string): Promise<void> {
    const groupName = `${serverId},${channelId}`;
    if (!this.joinedGroups.has(groupName)) return;
    await this.invoke("LeaveGroup", groupName);
    this.joinedGroups.delete(groupName);
  }

  public async joinMemberGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (this.joinedGroups.has(groupName)) return;
    await this.invoke("JoinGroup", groupName);
    this.joinedGroups.add(groupName);
  }

  public async leaveMemberGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (!this.joinedGroups.has(groupName)) return;
    await this.invoke("LeaveGroup", groupName);
    this.joinedGroups.delete(groupName);
  }

  public async joinServerGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (this.joinedGroups.has(groupName)) return;
    await this.invoke("JoinGroup", groupName);
    this.joinedGroups.add(groupName);
  }

  public async leaveServerGroup(serverId: string): Promise<void> {
    const groupName = serverId;
    if (!this.joinedGroups.has(groupName)) return;
    await this.invoke("LeaveGroup", groupName);
    this.joinedGroups.delete(groupName);
  }

  public async joinDMGroup(conversationId: string): Promise<void> {
    const groupName = conversationId;
    if (this.joinedGroups.has(groupName)) return;
    await this.invoke("JoinGroup", groupName);
    this.joinedGroups.add(groupName);
  }

  public async leaveDMGroup(conversationId: string): Promise<void> {
    const groupName = conversationId;
    if (!this.joinedGroups.has(groupName)) return;
    await this.invoke("LeaveGroup", groupName);
    this.joinedGroups.delete(groupName);
  }

  public async stopConnection(): Promise<void> {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      const groups = Array.from(this.joinedGroups);
      for (const groupName of groups) {
        await this.invoke("LeaveGroup", groupName).catch(console.error);
        this.joinedGroups.delete(groupName);
      }
      await this.connection.stop();
    }
  }

  private _registerListeners(): void {
    if (!this.connection) return;
    Object.keys(this.listeners).forEach((eventName) => {
      this.connection!.on(eventName, this.listeners[eventName]);
    });
  }

  private _rejoinGroups(): void {
    if (!this.connection) return;
    const groups = Array.from(this.joinedGroups);
    groups.forEach((groupName) => {
      this.invoke("JoinGroup", groupName).catch(error =>
        console.error(`Failed to rejoin group '${groupName}':`, error)
      );
    });
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

export const memberSignalRService = new SignalRService();
export const channelSignalRService = new SignalRService();
export const serverSignalRService = new SignalRService();
export const messageSignalRService = new SignalRService();
export const dmSignalRService = new SignalRService();