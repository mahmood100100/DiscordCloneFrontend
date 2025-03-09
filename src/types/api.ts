import { Message } from "@/types/message";
import { DirectMessage } from "@/types/direct-message";

export interface ApiResponseSuccess<T> {
  success: true;
  message: string;
  result: T;
}

export interface ApiResponseError {
  success: false;
  error: string;
  statusCode: number;
}

export type UpdateMessageApiResponse = ApiResponseSuccess<Message> | ApiResponseError;
export type UpdateDmApiResponse = ApiResponseSuccess<DirectMessage> | ApiResponseError;

export interface ChannelMessagesResult {
  messages: Message[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface DirectMessagesResult {
  directMessages: DirectMessage[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export type MessageApiResponse = ApiResponseSuccess<ChannelMessagesResult> | ApiResponseError;
export type DmApiResponse = ApiResponseSuccess<DirectMessagesResult> | ApiResponseError;