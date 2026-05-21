import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const authCookie = Cookies.get('auth');
  if (authCookie) {
    try {
      const user = JSON.parse(authCookie);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {}
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export async function clientFetch<T>(
  path: string,
  options: { method?: string; data?: any; headers?: Record<string, string> } = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : path;
  const res = await apiClient.request<T>({
    url,
    method: options.method || 'GET',
    data: options.data,
    headers: options.headers,
  });
  return res.data;
}
