'use client';

import { useEffect, useRef } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { config } from '@/lib/config';

interface GoogleSignInButtonProps {
  onSuccess: (data: { email: string; firstName: string; lastName: string; photoUrl?: string }) => void;
  onError?: () => void;
}
const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];

  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(base64Url.length / 4) * 4, '=');

  return JSON.parse(atob(base64));
};
export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      debugger
      const payload = parseJwt(credentialResponse.credential);

      onSuccess({
        email: payload.email || '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        photoUrl: payload.picture || '',
      });
    } catch {
      onError?.();
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => onError?.()}
      size="large"
      shape="rectangular"
      theme="filled_black"
      text="signin_with"
      width={280}
      auto_select={false}
    />
  );
}
