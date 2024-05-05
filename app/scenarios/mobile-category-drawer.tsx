import { Stack } from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

import { CategoryPane } from './category-pane';

type MobileCategoryDrawerProps = {
  categories: string[];
  selectedCategory?: string;
};

export function MobileCategoryDrawer(props: MobileCategoryDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className='visible fixed bottom-8 left-4 z-20 flex h-8 items-center gap-x-1 rounded-full border border-input bg-background px-3 py-1 transition-colors lg:invisible'
          variant='ghost'
        >
          <Stack />
          <span className='text-xs'>Filter by category</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <CategoryPane
          categories={props.categories}
          selectedCategory={props.selectedCategory}
        />
      </DrawerContent>
    </Drawer>
  );
}
