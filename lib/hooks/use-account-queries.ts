import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import type {
  IUser,
  ComicList,
  CommentList,
  INotification,
  VoteInfo,
  IServiceResponse,
} from '@/types';
import { getLevelUser } from '../constants';

function unwrap<T>(res: IServiceResponse<T>): T {
  if ((res.status !== 200 && res.status !== 1) || !res.data) {
    throw new Error(res.message || 'API error');
  }
  return res.data;
}

export function useRemoteUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () =>
      clientFetch<IServiceResponse<IUser>>(`/user/me`).then(unwrap),
  });
}

export function useUserById(id: number | null) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () =>
      clientFetch<IServiceResponse<IUser>>(`/user/${id}`).then(unwrap),
    enabled: !!id,
  });
}

export function useFollowedComics(page = 1, size = 28, enabled = true) {
  return useQuery({
    queryKey: ['followedComics', page, size],
    queryFn: () =>
      clientFetch<IServiceResponse<ComicList>>(
        `/user/followed-comics?page=${page}&size=${size}`
      ).then(unwrap),
    enabled,
  });
}

export function useCommentsByComicId(
  comicId: number | null,
  page = 1,
  step = 10,
  enabled = true
) {
  return useQuery({
    queryKey: ['comments', comicId, page, step],
    queryFn: () =>
      clientFetch<IServiceResponse<CommentList>>(
        `/comments/comic/${comicId}?page=${page}&size=${step}`
      ).then(unwrap),
    enabled: enabled && !!comicId,
  });
}

export function useUserNotify(enabled = true) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      clientFetch<IServiceResponse<INotification[]>>(`/user/notify`).then(
        unwrap
      ),
    enabled,
    refetchInterval: 60000,
  });
}

export function useVoteInfo(comicId: number | null) {
  return useQuery({
    queryKey: ['vote', comicId],
    queryFn: () =>
      clientFetch<IServiceResponse<VoteInfo>>(
        `/user/vote?comicId=${comicId}`
      ).then(unwrap),
    enabled: !!comicId,
  });
}

export function useLogin() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (data: { email: string; password: string; turnstileToken: string }) =>
      clientFetch<IServiceResponse<IUser>>('/auth/login', {
        method: 'POST',
        data,
      }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useLoginWithSocial() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (user: Partial<IUser>) =>
      clientFetch<IServiceResponse<IUser>>('/auth/social-login', {
        method: 'POST',
        data: user,
      }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; turnstileToken: string }) =>
      clientFetch<IServiceResponse<unknown>>('/auth/register', {
        method: 'POST',
        data,
      }),
  });
}

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ comicId, isFollow }: { comicId: number; isFollow: boolean }) =>
      clientFetch(`/user/follow?comicid=${comicId}&follow=${isFollow}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followedComics'] });
      queryClient.invalidateQueries({ queryKey: ['comic'] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      chapterId,
      content,
      replyfromUser,
      replyfromCmt,
    }: {
      chapterId: number;
      content: string;
      replyfromUser?: number;
      replyfromCmt?: number | null;
    }) =>
      clientFetch<IServiceResponse<unknown>>('/user/comment', {
        method: 'POST',
        data: {
          chapterId,
          content,
          replyfromUser: replyfromUser || undefined,
          replyfromCmt: replyfromCmt || undefined,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['recentComment'] });
    },
  });
}

export function useUpdateAvatar() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (avatar: FormData) =>
      clientFetch<IServiceResponse<IUser>>('/user/update/avatar', {
        method: 'POST',
        data: avatar,
        headers: {},
      }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useUpdateInfo() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (user: Partial<IUser>) =>
      clientFetch<IServiceResponse<IUser>>('/user/update', {
        method: 'POST',
        data: user,
      }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: { oldPassword: string; newPassword: string; rePassword: string }) =>
      clientFetch('/user/update/password', {
        method: 'POST',
        data: password,
      }),
  });
}

export function useUpdateTypeLevel() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (typeLevel: number) =>
      clientFetch<IServiceResponse<IUser>>(`/user/update/typelevel/${typeLevel}`, { method: 'POST' }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useUpdateMaxim() {
  const saveUser = useAuthStore((s) => s.saveUser);
  return useMutation({
    mutationFn: (maxim: string | null) =>
      clientFetch<IServiceResponse<IUser>>(`/user/update/maxim?maxim=${encodeURIComponent(maxim || '')}`, {
        method: 'POST',
      }),
    onSuccess: (res) => {
      if (res.data) saveUser(res.data);
    },
  });
}

export function useVoteComic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { comicId: number; votePoint: number }) =>
      clientFetch<IServiceResponse<VoteInfo>>('/user/vote/update', {
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vote'] });
    },
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      clientFetch(`/auth/forgot?email=${encodeURIComponent(email)}`),
  });
}

export function useSendEmailConfirm() {
  return useMutation({
    mutationFn: ({ email, userId }: { email: string; userId: number }) =>
      clientFetch(
        `/auth/send-confirm-email?email=${encodeURIComponent(email)}&userId=${userId}`
      ),
  });
}

export function useUpdateNotify() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { ID: number | null; IsRead: boolean | null }) =>
      clientFetch('/user/notify/update', {
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotify() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idNotify: number) =>
      clientFetch(`/user/notify/delete/${idNotify}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useUpdateViewAndExp() {
  return useMutation({
    mutationFn: ({
      comicId,
      chapterId,
      exp,
    }: {
      comicId: number;
      chapterId: number;
      exp?: number;
    }) =>
      clientFetch(
        `/comic/view_exp?comicId=${comicId}&exp=${exp ?? 10}&chapterId=${chapterId}`
      ),
  });
}
export function useDailyQuests() {
  return useQuery({
    queryKey: ['quests', 'daily'],
    queryFn: () =>
      clientFetch<IServiceResponse<any[]>>('/quest/daily').then((res) => {
        if (res.status !== 200 && res.status !== 1) return [];
        return res.data ?? [];
      }),
  });
}

export function useWeeklyQuests() {
  return useQuery({
    queryKey: ['quests', 'weekly'],
    queryFn: () =>
      clientFetch<IServiceResponse<any[]>>('/quest/weekly').then((res) => {
        if (res.status !== 200 && res.status !== 1) return [];
        return res.data ?? [];
      }),
  });
}

export function useQuestUserStats() {
  return useQuery({
    queryKey: ['quests', 'user-stats'],
    queryFn: () =>
      clientFetch<IServiceResponse<any>>('/quest/user-stats').then((res) => {
        if (res.status !== 200 && res.status !== 1) return null;
        return res.data ?? null;
      }),
  });
}

export function useClaimQuestReward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questId: string) =>
      clientFetch<IServiceResponse<any>>(`/quest/${questId}/claim`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
}

export function useItemInventory(page = 1, pageSize = 20, category?: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (category) params.set('category', category);
  return useQuery({
    queryKey: ['inventory', page, pageSize, category],
    queryFn: () =>
      clientFetch<IServiceResponse<any>>(`/item/inventory?${params}`).then((res) => {
        if (res.status !== 200 && res.status !== 1) return { items: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        return res.data ?? { items: [], totalItems: 0, currentPage: 1, totalPages: 1 };
      }),
  });
}

export function useEquippedItems() {
  return useQuery({
    queryKey: ['equipped'],
    queryFn: () =>
      clientFetch<IServiceResponse<any[]>>('/item/equipped').then((res) => {
        if (res.status !== 200 && res.status !== 1) return [];
        return res.data ?? [];
      }),
  });
}

export function useItemTemplates() {
  return useQuery({
    queryKey: ['itemTemplates'],
    queryFn: () =>
      clientFetch<IServiceResponse<any[]>>('/item/templates').then((res) => {
        if (res.status !== 200 && res.status !== 1) return [];
        return res.data ?? [];
      }),
  });
}

export function useItemAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ action, data }: { action: 'use' | 'equip' | 'unequip'; data: Record<string, any> }) =>
      clientFetch<IServiceResponse<any>>(`/item/${action}`, {
        method: 'POST',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['equipped'] });
    },
  });
}

export function useUserProfile( userId: number | null, visible = true) {
  return useQuery<IUser>({
      queryKey: ['user-profile', userId],
      queryFn: async () => {
        const res = await clientFetch<IServiceResponse<IUser>>(
          `/user/profile/${userId}`
        );
        if ((res.status !== 200 && res.status !== 1) || !res.data) {
          throw new Error(res.message || 'API error');
        }
        const user = res.data;
        if (user.experience != null && user.typeLevel != null) {
          user.levelInfo = getLevelUser(user.experience, user.typeLevel);
        }
        return user;
      },
      enabled: visible && !!userId,
    });
}
