import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@stock-day/components/ui/table';
import { Checkbox } from '@stock-day/components/ui/checkbox';
import { Input } from '@stock-day/components/ui/input';
import { Typo } from '@stock-day/components/ui/Typo';

interface BaseItem {
  id: string;
}

interface SearchTableProps<T extends BaseItem> {
  data: T[];
  selectedItems?: T[];
  onSelectedItemChange: (item: T[]) => void;
  filterPredicate: (item: T, searchTerm: string) => boolean;
  renderRow: (item: T) => React.ReactNode;
  searchInput?: React.ReactElement<HTMLInputElement>;
  tableHeaders: React.ReactNode;
}

export const SearchTable = <T extends BaseItem>({
  data,
  selectedItems = [],
  searchInput,
  onSelectedItemChange,
  filterPredicate,
  tableHeaders,
  renderRow
}: SearchTableProps<T>) => {
  const searchSchema = z.object({
    searchTerm: z.string()
  });

  const { control, watch } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: ''
    }
  });

  const searchTerm = watch('searchTerm');

  const filteredData = useMemo(() => {
    return data.filter((item) => filterPredicate(item, searchTerm));
  }, [data, filterPredicate, searchTerm]);

  const handleSelect = (item: T) => {
    const currentSelected = selectedItems || [];
    const isSelected = currentSelected.find((i) => i.id === item.id);

    if (isSelected) {
      onSelectedItemChange(currentSelected.filter((i) => i.id !== item.id));
    } else {
      onSelectedItemChange([...currentSelected, item]);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className={'flex flex-col gap-5'}>
        <Controller
          name="searchTerm"
          control={control}
          render={({ field }) => {
            return searchInput ? (
              React.cloneElement(searchInput as React.ReactElement<HTMLInputElement>, {
                ...field
              })
            ) : (
              <Input {...field} className="max-w-sm" />
            );
          }}
        />

        <div className="border rounded-md">
          <div className="relative w-full">
            <div className="h-[27.5rem] overflow-auto">
              <Table className={'h-full'}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    {tableHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow className={'cursor-pointer'} key={item.id} onClick={() => handleSelect(item)}>
                        <TableCell className={'flex-none h-10'}>
                          <Checkbox
                            checked={selectedItems?.some((i) => i.id === item.id)}
                            onCheckedChange={() => handleSelect(item)}
                          />
                        </TableCell>
                        {renderRow(item)}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className={'bg-muted/50'}>
                      <TableCell colSpan={1000} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Typo className={'text-gray-500'} variant={'h5'}>
                            No results found
                          </Typo>
                          <Typo className={'text-gray-400'} variant={'normal'}>
                            Try adjusting your search
                          </Typo>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
