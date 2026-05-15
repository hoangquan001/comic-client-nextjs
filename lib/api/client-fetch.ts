import Cookies from 'js-cookie';

export async function clientFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const authCookie = Cookies.get('auth');
  if (authCookie) {
    try {
      const user = JSON.parse(authCookie);
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    } catch {}
  }

  const url = path.startsWith('http') ? path : `/api${path}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
