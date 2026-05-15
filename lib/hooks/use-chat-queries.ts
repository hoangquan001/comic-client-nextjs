import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import type { IConversation, IMessagePage, IServiceResponse } from '@/types';

function unwrap<T>(res: IServiceResponse<T>): T {
  if (res.status !== 200 || !res.data) {
    throw new Error(res.message || 'API error');
  }
  return res.data;
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () =>
      clientFetch<IServiceResponse<IConversation[]>>(
        `/chat/conversations`
      ).then(unwrap),
  });
}

export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () =>
      clientFetch<IServiceResponse<IConversation>>(
        `/chat/conversation/${conversationId}`
      ).then(unwrap),
    enabled: !!conversationId,
  });
}

export function useMessages(
  conversationId: string | null,
  page = 1,
  pageSize = 20
) {
  return useQuery({
    queryKey: ['messages', conversationId, page, pageSize],
    queryFn: () =>
      clientFetch<IServiceResponse<IMessagePage>>(
        `/chat/messages/${conversationId}?page=${page}&pageSize=${pageSize}`
      ).then(unwrap),
    enabled: !!conversationId,
  });
}

export function useTopUsers(page = 1, size = 10) {
  return useQuery({
    queryKey: ['topUsers', page, size],
    queryFn: () =>
      clientFetch<IServiceResponse<any>>(
        `/top-users?page=${page}&size=${size}`
      ).then(unwrap),
  });
}
