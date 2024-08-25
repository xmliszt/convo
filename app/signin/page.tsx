import { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { GoogleOAuthButton } from './google-oauth-button';

export const metadata: Metadata = {
  title: 'Convo | Sign in',
  alternates: {
    canonical: '/signin',
  },
};

export default function Page() {
  return (
    <main>
      <div className='mx-auto flex h-full w-full max-w-lg flex-col justify-center px-4 py-20'>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Convo</CardTitle>
            <CardDescription>
              Sign in start any conversation with Convo. You will also be able
              to revisit your saved conversations and evaluation results in your
              profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='space-y-4'>
              <div className='flex flex-col justify-center space-y-4 px-4'>
                {/* OAuth buttons */}
                <GoogleOAuthButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
