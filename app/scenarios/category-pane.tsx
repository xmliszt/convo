import { lowerCase, startCase } from 'lodash';
import Link from 'next/link';

import { cn } from '@/lib/utils';

type CategoryPaneProps = {
  categories: string[];
  selectedCategory?: string;
};

export function CategoryPane(props: CategoryPaneProps) {
  return (
    <div className='flex w-full flex-col items-start gap-4 p-4'>
      <div className='flex flex-wrap gap-2'>
        {props.categories.map((category) => (
          <Link
            href={`/scenarios?category=${category}`}
            className={cn(
              'cursor-pointer rounded-md border px-3 py-1 text-center transition-transform hover:scale-110',
              lowerCase(props.selectedCategory) === lowerCase(category)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/40 text-secondary-foreground'
            )}
            key={category}
          >
            {startCase(category)}
          </Link>
        ))}
      </div>
      {props.selectedCategory && (
        <Link
          href='/scenarios'
          className='cursor-pointer px-2 text-center text-red-600 transition-transform hover:scale-110'
        >
          Clear filter
        </Link>
      )}
    </div>
  );
}
