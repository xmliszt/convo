'use client';

import { GoogleLogo } from '@phosphor-icons/react';
import { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { signInGoogle } from './services/signin-google';

export function GoogleOAuthButton() {
  const [isPending, startTransition] = useTransition();
  const handleGoogleOAuth = useCallback(() => {
    startTransition(async () => {
      try {
        await signInGoogle({ redirectOrigin: window.location.origin });
      } catch (error) {
        toast.error('Failed to sign in with Google');
      }
    });
  }, []);

  return (
    <Button
      disabled={isPending}
      type='button'
      variant='default'
      onClick={handleGoogleOAuth}
    >
      <GoogleLogo className='mr-2' /> Sign in with Google
    </Button>
  );
}
