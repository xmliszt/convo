'use client';

import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { deleteUser } from './services/delete-user';

type DangerZoneProps = {
  userId: string;
};

export function DangerZone(props: DangerZoneProps) {
  const [openAlert, setOpenAlert] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteUser = useCallback(() => {
    startTransition(async () => {
      try {
        await deleteUser({ userId: props.userId });
        toast.success('Account deleted');
        router.push('/signin');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    });
  }, [props.userId, router]);

  return (
    <Card className='border-destructive bg-red-200/20'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-destructive'>
          Danger zone
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-start gap-y-4'>
        <p>
          You are about to delete your account. This is irreversible and all
          your data will be lost.
        </p>
        <Button
          disabled={isPending}
          className='bg-destructive text-destructive-foreground hover:bg-destructive/50'
          onClick={() => setOpenAlert(true)}
        >
          Delete my account
        </Button>
      </CardContent>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive'>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and all your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-white hover:bg-destructive/50'
              onClick={() => {
                setOpenAlert(false);
                handleDeleteUser();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
