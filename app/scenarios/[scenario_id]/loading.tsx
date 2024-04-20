import { ConvoLoader } from '@/lib/convo-loader';

export default function Loading() {
  return (
    <div className='relative h-full w-full'>
      <div
        className='absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center backdrop-blur-[10px]'
        style={{
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <ConvoLoader />
      </div>
    </div>
  );
}
