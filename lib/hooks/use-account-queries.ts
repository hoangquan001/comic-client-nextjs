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

export function useFollowedComics(page = 1, size = 28) {
  return useQuery({
    queryKey: ['followedComics', page, size],
    queryFn: () =>
      clientFetch<IServiceResponse<ComicList>>(
        `/user/followed-comics?page=${page}&size=${size}`
      ).then(unwrap),
  });
}

export function useCommentsByComicId(
  comicId: number | null,
  page = 1,
  step = 10
) {
  return useQuery({
    queryKey: ['comments', comicId, page, step],
    queryFn: () =>
      clientFetch<IServiceResponse<CommentList>>(
        `/comments/comic/${comicId}?page=${page}&size=${step}`
      ).then(unwrap),
    enabled: !!comicId,
  });
}

export function useUserNotify() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      clientFetch<IServiceResponse<INotification[]>>(`/user/notify`).then(
        unwrap
      ),
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
      clientFetch<IServiceResponse<IUser>>('/auth/dang-nhap', {
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
      clientFetch('/user/comment', {
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
    mutationFn: (newPassword: string) =>
      clientFetch('/user/update/password', {
        method: 'POST',
        data: { newPassword },
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
