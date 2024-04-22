'use client';

import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Lightning } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { AnimatedButtonWithTransition } from '@/components/animated-button-with-transition';

import { signInAnonymously } from './services/signin-anonymously';

export function AnonymousSignInButton() {
  const [hCaptchaToken, setHCaptchaToken] = useState('');
  const [isPending, startTransition] = useTransition();
  const captchaComponentRef = useRef<HCaptcha>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const router = useRouter();

  const handleAnonymousSignIn = useCallback(() => {
    if (!showCaptcha) {
      setShowCaptcha(true);
      return;
    }
    startTransition(async () => {
      if (!hCaptchaToken) {
        toast.error('Please complete the captcha');
        return;
      }
      try {
        await signInAnonymously({ captchaToken: hCaptchaToken });
        toast.success('Signed in successfully!');
        router.replace('/scenarios');
        router.refresh();
      } catch (error) {
        toast.error('Failed to sign in anonymously');
      } finally {
        captchaComponentRef.current?.resetCaptcha();
      }
    });
  }, [hCaptchaToken, router, showCaptcha]);

  return (
    <div className='flex w-full flex-col items-stretch gap-y-4'>
      <AnimatePresence>
        {showCaptcha && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className='flex w-full justify-center'
          >
            <HCaptcha
              ref={captchaComponentRef}
              sitekey='14d9a1ec-bbff-4b75-a16f-fceca3852a6c'
              onVerify={setHCaptchaToken}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <AnimatedButtonWithTransition
          disabled={isPending || (showCaptcha && !hCaptchaToken)}
          onClick={handleAnonymousSignIn}
          isPending={isPending}
          normalLabel={'Sign in anonymously with Supabase'}
          normalIcon={<Lightning />}
          loadingLabel={'Signing into Convo...'}
          variant='outline'
          className='w-full grow'
        />
        <p className='my-1 text-xs text-muted-foreground'>
          By signing in anonymously, your conversations will be saved with your
          anonymous profile. If you sign out, clear your browsing data or switch
          devices, you will not be able to access your saved conversations
          anymore.
        </p>
      </div>
    </div>
  );
}
