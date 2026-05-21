import type { TurnstileServerValidationResponse } from '@marsidev/react-turnstile';

const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileValidationResult {
  success: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstileToken({
  token,
  remoteIp,
  expectedAction,
}: {
  token: string;
  remoteIp?: string;
  expectedAction?: string;
}): Promise<TurnstileValidationResult> {
  const secret =
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { success: false, errorCodes: ['missing-secret-key'] };
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);
  formData.append('idempotency_key', crypto.randomUUID());
  if (remoteIp) formData.append('remoteip', remoteIp);

  try {
    const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });
    const result = (await response.json()) as TurnstileServerValidationResponse;

    if (!result.success) {
      return { success: false, errorCodes: result['error-codes'] };
    }

    if (expectedAction && result.action && result.action !== expectedAction) {
      return { success: false, errorCodes: ['invalid-action'] };
    }

    return { success: true };
  } catch {
    return { success: false, errorCodes: ['internal-error'] };
  }
}

