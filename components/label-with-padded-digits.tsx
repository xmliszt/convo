import { cn } from '@/lib/utils';

type LabelWithPaddedDigitsProps = {
  label: string;
  value: number;
  padding: number;
  highlight?: boolean;
};

export function LabelWithPaddedDigits(props: LabelWithPaddedDigitsProps) {
  return (
    <div
      className='brightness-80 flex w-full items-center justify-between gap-x-4 rounded-sm border border-card bg-card/20 py-1 pl-3 pr-1 shadow-lg backdrop-blur-[2px]'
      style={{
        WebkitBackdropFilter: 'blur(2px)',
        boxShadow: props.highlight ? '0 0 15px 2px #ffcc0060' : 'none',
      }}
    >
      <span className='grow whitespace-nowrap font-bold'>{props.label}</span>
      <div
        className={cn(
          'relative h-[32px] w-full min-w-[120px] max-w-[120px] overflow-hidden text-center font-sans text-xl font-bold',
          '[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-center',
          'rounded-sm bg-card/20 shadow-[inset_0_0px_5px_1px_#00000020]'
        )}
      >
        <span className='absolute left-0 top-0 z-0 h-full w-full transition-colors'>
          {props.value.toString().padStart(props.padding, '0')}
        </span>
      </div>
    </div>
  );
}
