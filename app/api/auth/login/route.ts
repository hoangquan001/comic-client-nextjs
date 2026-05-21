import type { NextRequest } from 'next/server';
import { verifyTurnstileAndProxyAuth } from '../_proxy';

export async function POST(request: NextRequest) {
  return verifyTurnstileAndProxyAuth(request, 'login');
}

