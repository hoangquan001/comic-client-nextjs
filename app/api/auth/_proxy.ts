import { NextResponse, type NextRequest } from 'next/server';
import { config } from '@/lib/config';
import { verifyTurnstileToken } from '@/lib/server/turnstile';

type AuthAction = 'login' | 'register';

interface AuthRequestBody {
  turnstileToken?: unknown;
  [key: string]: unknown;
}

function getClientIp(request: NextRequest): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    forwardedFor?.split(',')[0]?.trim()
  );
}

function verificationFailed(errorCodes?: string[]) {
  return NextResponse.json({
    status: 0,
    message: 'Xác minh bảo mật thất bại, vui lòng thử lại.',
    errors: errorCodes,
  });
}

export async function verifyTurnstileAndProxyAuth(
  request: NextRequest,
  action: AuthAction
) {
  let body: AuthRequestBody;

  try {
    body = (await request.json()) as AuthRequestBody;
  } catch {
    return NextResponse.json({
      status: 0,
      message: 'Dữ liệu gửi lên không hợp lệ.',
    });
  }

  const { turnstileToken, ...payload } = body;

  if (typeof turnstileToken !== 'string' || !turnstileToken) {
    return verificationFailed(['missing-input-response']);
  }

  const verification = await verifyTurnstileToken({
    token: turnstileToken,
    remoteIp: getClientIp(request),
    expectedAction: action,
  });

  if (!verification.success) {
    return verificationFailed(verification.errorCodes);
  }

  const upstreamResponse = await fetch(`${config.BASE_API_URL}/api/auth/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const responseText = await upstreamResponse.text();
  return new Response(responseText, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': upstreamResponse.headers.get('content-type') || 'application/json',
    },
  });
}

