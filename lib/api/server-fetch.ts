import { cookies, headers as nextHeaders } from 'next/headers';
import { config } from '@/lib/config';

export async function publicFetch<T>(path: string, revalidate: number = 60): Promise<T> {
  const baseUrl = config.BASE_API_URL + '/api';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: revalidate },
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function serverFetch<T>(
  path: string,
  options: { method?: string; data?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const cookieStore = await cookies();
  const headersList = await nextHeaders();

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const authToken = cookieStore.get('auth')?.value;
  if (authToken) {
    try {
      const user = JSON.parse(authToken);
      if (user?.token) reqHeaders['Authorization'] = `Bearer ${user.token}`;
    } catch { }
  }

  const realHost = headersList.get('host');
  if (realHost) reqHeaders['X-Real-Host'] = realHost;

  const baseUrl = config.BASE_API_URL + '/api';
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: reqHeaders,
    body: options.data ? JSON.stringify(options.data) : undefined,
  });

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}
