import { Typo } from '@stock-day/components/ui/Typo';
import { Button } from '@stock-day/components/ui/Button';
import { Badge } from '@stock-day/components/ui/badge';
import { X } from 'lucide-react';
import React from 'react';

interface BaseItem {
  id: string;
}

interface SelectedViewProps<T extends BaseItem> {
  selectedItems: T[];
  renderSelectedItem: (item: T) => React.ReactNode;
  onRemove: (itemId: string) => void;
  onReset: () => void;
}

export const StockSelectedView = <T extends BaseItem>({
  selectedItems,
  onRemove,
  onReset,
  renderSelectedItem
}: SelectedViewProps<T>) => {
  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex justify-between items-center'}>
        <Typo variant={'h5'}>Selected Stocks</Typo>
        <Button size={'sm'} onClick={() => onReset()}>
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
            {renderSelectedItem(item)}
            <button onClick={() => onRemove(item.id)} className="ml-1 hover:bg-gray-200 rounded-full p-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
