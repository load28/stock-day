'use client';

import { Typo } from '@stock-day/components/ui/Typo';
import React, { useState } from 'react';
import { SearchTable } from '@stock-day/components/compound/SearchTable';
import { z } from 'zod';
import { TableCell, TableHead } from '@stock-day/components/ui/table';
import { StockSelectedView } from '@stock-day/app/(with_frame)/dashboard/StockSelectedView';
import { Input } from '@stock-day/components/ui/input';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stockSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string()
});

type TStockValues = z.infer<typeof stockSchema>;

const data: TStockValues[] = [
  { id: '1', name: 'iPhone 14', price: '$999' },
  { id: '2', name: 'MacBook Pro', price: '$1999' },
  { id: '3', name: 'AirPods Pro', price: '$249' },
  { id: '4', name: 'iPad Air', price: '$599' },
  { id: '5', name: 'Apple Watch', price: '$399' },
  { id: '6', name: 'iPhone 14', price: '$999' },
  { id: '7', name: 'MacBook Pro', price: '$1999' },
  { id: '8', name: 'AirPods Pro', price: '$249' },
  { id: '9', name: 'iPad Air', price: '$599' },
  { id: '10', name: 'Apple Watch', price: '$399' },
  { id: '11', name: 'iPhone 14', price: '$999' },
  { id: '12', name: 'MacBook Pro', price: '$1999' },
  { id: '13', name: 'AirPods Pro', price: '$249' },
  { id: '14', name: 'iPad Air', price: '$599' },
  { id: '15', name: 'Apple Watch', price: '$399' }
];

const Page = () => {
  const [selectedStocks, setSelectedStocks] = useState<TStockValues[]>([]);

  return (
    <section>
      <Typo className={'mb-8'} variant={'h4'} weight={'bold'}>
        Create Dashboard
      </Typo>
      <div className={'space-y-16'}>
        <SearchTable
          height={'27.5rem'}
          data={data}
          selectedItems={selectedStocks}
          onSelectedItemChange={setSelectedStocks}
          filterPredicate={(item, searchTerm) => item.name.toLowerCase().includes(searchTerm.toLowerCase())}
          searchInput={<Input placeholder="Search stock..." className="max-w-sm" />}
          tableHeaders={
            <>
              <TableHead>Name</TableHead>
              <TableHead>price</TableHead>
            </>
          }
          renderRow={(item) => (
            <>
              <TableCell className={'flex-1 h-10'}>{item.name}</TableCell>
              <TableCell className={'flex-1 h-10'}>{item.price}</TableCell>
            </>
          )}
        />
        <StockSelectedView
          selectedItems={selectedStocks}
          renderSelectedItem={(item) => `${item.name}`}
          onRemove={(itemId: string) => setSelectedStocks((selectedStocks || []).filter((item) => item.id !== itemId))}
          onReset={() => setSelectedStocks([])}
        />
      </div>
    </section>
  );
};

export default Page;
