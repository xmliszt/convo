'use client';

import { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { signoutUser } from './services/sign-out-user';

type SignoutProps = {
  isAnonymous: boolean;
};

export function Signout(props: SignoutProps) {
  const [isPending, startTransition] = useTransition();
  const [showAnonymousWarning, setShowAnonymousWarning] = useState(false);

  const handleSignout = useCallback(() => {
    startTransition(async () => {
      try {
        await signoutUser();
      } catch (error) {
        toast.error('Failed to sign out');
      }
    });
  }, []);

  return (
    <>
      <Button
        className='text-md group flex w-full items-center gap-2 text-muted-foreground'
        variant='link'
        onClick={() =>
          props.isAnonymous ? setShowAnonymousWarning(true) : handleSignout()
        }
        disabled={isPending}
      >
        <div className='grow border-t-0 border-transparent transition-[border-color_border-top-width] group-hover:border-t group-hover:border-muted-foreground' />
        Sign out
        <div className='grow border-t-0 border-transparent transition-[border-color_border-top-width] group-hover:border-t group-hover:border-muted-foreground' />
      </Button>
      <AlertDialog
        open={showAnonymousWarning}
        onOpenChange={setShowAnonymousWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are signed in as an anonymous user. Once signed out, there is
              no way to get back to this account and all your data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAnonymousWarning(false);
                handleSignout();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
