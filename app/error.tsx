'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <AnimatePresence>
      <main className='flex items-center justify-center px-4'>
        <div className='mx-auto w-full max-w-lg px-4'>
          <article className='prose prose-neutral dark:prose-invert'>
            <motion.div
              className='flex flex-col border-l border-r border-primary text-center font-bold'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <h1 className='mb-0'>Something went wrong!</h1>
              <h3>{error.message}</h3>
            </motion.div>
            {error.stack && isObject(error.stack) && (
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                exit={{ opacity: 0, y: 50 }}
              >
                Here is something more technical:
                <pre className='scrollbar-hide'>
                  <code>
                    {JSON.stringify(JSON.parse(error.stack), null, 2)}
                  </code>
                </pre>
              </motion.p>
            )}
            <motion.div
              className='mt-4 flex flex-wrap justify-center gap-4'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
              exit={{ opacity: 0, y: 50 }}
            >
              <Button
                onClick={() => router.push('/scenarios')}
                className='w-[180px]'
                variant='outline'
              >
                Back to scenarios
              </Button>
              <Button onClick={reset} className='w-[180px]' variant='outline'>
                Try again
              </Button>
            </motion.div>
          </article>
        </div>
        <div
          className='fixed inset-0 left-0 top-0 -z-10 h-[120%] w-[120%] [mask:linear-gradient(to_bottom,transparent_0%,black_100%)]'
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1522856339183-9a8b06b05937?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(10px)',
            WebkitFilter: 'blur(10px)',
            WebkitMask:
              'linear-gradient(to bottom, transparent 0%, black 100%)',
          }}
        />
      </main>
    </AnimatePresence>
  );
}

function isObject(value: string): boolean {
  console.log(value);
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}
