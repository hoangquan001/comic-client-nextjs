import { cookies } from "next/headers";
import { StoredSettingsPayload } from "../settings/type";
import { IUser } from "@/types";
import type { SettingsRecord } from "@/types";
import { normalizeSettingsPayload } from "../settings/settings-shared";

export function parseCookie<T>(rawCookie: string | undefined): T | null {
    if (!rawCookie) return null;

    try {
        // decodeURIComponent để xử lý cookie bị encode
        const decoded = decodeURIComponent(rawCookie);

        return JSON.parse(decoded) as T;
    } catch (error) {
        console.error("Failed to parse cookie:", error);
        return null;
    }
}

export async function getServerCookie<T>(...args: [name: string] ): Promise<T | null> {
  const authCookie = (await cookies()).get(...args)?.value;
  const data = parseCookie<T>(authCookie);
  return data
}
  
export async function getServerGridType() : Promise<number>
{
      const settings = await getServerSettings();
      const gridType = parseInt(String(settings.gridType ?? '0'));
      return gridType
}

export async function getServerSettings(): Promise<SettingsRecord> {
  const settings = await getServerCookie<StoredSettingsPayload>('app-settings');
  return normalizeSettingsPayload(settings);
}

export async function getServerTheme(): Promise<'light' | 'dark' | 'auto'> {
  const settings = await getServerSettings();
  const theme = settings.theme;
  return theme === 'dark' || theme === 'auto' ? theme : 'light';
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerCookie<IUser>('auth');
  return !!user;
}
