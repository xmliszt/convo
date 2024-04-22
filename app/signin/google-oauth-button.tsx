'use client';

import { GoogleLogo } from '@phosphor-icons/react';
import { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { AnimatedButtonWithTransition } from '@/components/animated-button-with-transition';

import { signInGoogle } from './services/signin-google';

export function GoogleOAuthButton() {
  const [isPending, startTransition] = useTransition();
  const handleGoogleOAuth = useCallback(() => {
    startTransition(async () => {
      try {
        await signInGoogle();
      } catch (error) {
        toast.error('Failed to sign in with Google');
      }
    });
  }, []);

  return (
    <div>
      <AnimatedButtonWithTransition
        disabled={isPending}
        variant='default'
        onClick={handleGoogleOAuth}
        isPending={isPending}
        normalLabel='Sign in with Google'
        normalIcon={<GoogleLogo />}
        loadingLabel='Signing in with Google...'
      />
      <p className='my-1 text-xs text-muted-foreground'>
        Consider signing in with Google to access your saved conversations
        across devices.
      </p>
    </div>
  );
}
