'use client';

import { useRef } from 'react';

import { cn } from '@/lib/utils';

type HoverPerspectiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  clipping?: boolean;
};

export function HoverPerspectiveContainer({
  children,
  className,
  clipping,
}: HoverPerspectiveContainerProps) {
  const boundingRef = useRef<DOMRect | null>(null);
  return (
    <div
      className={cn(
        'group relative transform rounded-lg border shadow-lg transition-[transoform_border_box-shadow] duration-300 ease-out',
        className,
        clipping ? 'overflow-hidden' : 'overflow-visible'
      )}
      onMouseEnter={(event) => {
        boundingRef.current = event.currentTarget.getBoundingClientRect();
      }}
      onMouseLeave={(event) => {
        boundingRef.current = null;
        // Restore rotation
        event.currentTarget.style.transform = '';
      }}
      onMouseMove={(event) => {
        if (!boundingRef.current) return;
        const x = event.clientX - boundingRef.current.left;
        const y = event.clientY - boundingRef.current.top;
        const xPercentage = x / boundingRef.current.width;
        const yPercentage = y / boundingRef.current.height;
        const xRotation = (xPercentage - 0.5) * 20;
        const yRotation = (0.5 - yPercentage) * -20;
        event.currentTarget.style.transform = `perspective(1000px) rotateX(${yRotation}deg) rotateY(${xRotation}deg)`;
        // set glare x, y position
        event.currentTarget.style.setProperty('--x', `${xPercentage * 100}%`);
        event.currentTarget.style.setProperty('--y', `${yPercentage * 100}%`);
      }}
    >
      {children}
      <div className='pointer-events-none absolute inset-0 rounded-lg group-hover:bg-[radial-gradient(at_var(--x)_var(--y),hsl(var(--glare))_20%,transparent_80%)]'></div>
    </div>
  );
}
