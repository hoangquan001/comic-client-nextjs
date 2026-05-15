import { IUser } from './user';

export enum Chanel {
  Admin = 0,
  World = 1,
  Group = 2,
  Bot = 3,
}

export interface IConversation {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  messages: IMessage[];
  lastMessage?: IMessage;
  channel: Chanel;
  icon?: string;
  hostId: number;
}

export interface IMessage {
  id: string;
  userId: number;
  content: string;
  conversationId: string;
  createdAt: string;
  user?: IUser;
}

export interface ISendMessage {
  content: string;
  conversationId?: string;
}

export interface IMessagePage {
  messages: IMessage[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}
