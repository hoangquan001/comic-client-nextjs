import Cookies from 'js-cookie';
import { config } from '@/lib/config';

const REQUEST_TIMEOUT = 15000;
const API_BASE_URL = `${config.BASE_API_URL.replace(/\/$/, '')}/api`;

interface ClientFetchOptions {
  method?: string;
  data?: unknown;
  headers?: HeadersInit;
}

function getAuthToken(): string | undefined {
  const authCookie = Cookies.get('auth');
  if (!authCookie) return undefined;

  try {
    const user = JSON.parse(authCookie) as { token?: string };
    return user.token;
  } catch {
    return undefined;
  }
}

export async function clientFetch<T>(
  path: string,
  options: ClientFetchOptions = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}/${path.replace(/^\//, '')}`;
  const headers = new Headers(options.headers);
  const token = getAuthToken();
  const formData = typeof FormData !== 'undefined' && options.data instanceof FormData
    ? options.data
    : null;
  const body = options.data === undefined
    ? undefined
    : formData ?? JSON.stringify(options.data);

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!formData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body,
      signal: controller.signal,
    });
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return responseText ? JSON.parse(responseText) as T : undefined as T;
  } finally {
    clearTimeout(timeout);
  }
}
