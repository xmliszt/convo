import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AnonymousSignInButton } from './anonymous-signin-button';
import { GoogleOAuthButton } from './google-oauth-button';

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
              {/* TODO(@xmliszt): Proper email provider signin flow */}
              {/* <div>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  name='email'
                  placeholder='Your email address...'
                />
              </div>
              <div>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  name='password'
                  placeholder='Your password...'
                />
              </div> */}
              <div className='flex flex-col justify-center space-y-4 px-4'>
                {/* <Button type='submit' variant='outline'>
                  <EnvelopeSimple className='mr-2' />
                  Sign in / Sign up with email
                </Button> */}

                {/* Anonymous signin button */}
                <AnonymousSignInButton />
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
