import { cookies, headers as nextHeaders } from 'next/headers';
import { config } from '@/lib/config';

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const headersList = await nextHeaders();

  const authToken = cookieStore.get('auth')?.value;
  const realHost = headersList.get('host');

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    try {
      const user = JSON.parse(authToken);
      if (user?.token) {
        reqHeaders['Authorization'] = `Bearer ${user.token}`;
      }
    } catch {}
  }

  if (realHost) {
    reqHeaders['X-Real-Host'] = realHost;
  }

  const baseUrl = config.BASE_API_URL + '/api';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: reqHeaders,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
