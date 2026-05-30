import { cookies } from "next/headers";
import { StoredSettingsPayload } from "../settings/type";
import { IUser } from "@/types";

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
      const settings = await getServerCookie<StoredSettingsPayload>('app-settings');
      const gridType = parseInt(settings?.values?.gridType  ?? '0');
      return gridType
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerCookie<IUser>('auth');
  return !!user;
}