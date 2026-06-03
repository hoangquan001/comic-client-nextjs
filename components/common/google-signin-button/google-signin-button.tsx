'use client';

import { useEffect, useRef } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { config } from '@/lib/config';

interface GoogleSignInButtonProps {
  onSuccess: (data: { email: string; firstName: string; lastName: string; photoUrl?: string }) => void;
  onError?: () => void;
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
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
