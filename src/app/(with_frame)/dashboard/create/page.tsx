'use client';

import { Typo } from '@stock-day/components/ui/Typo';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { Badge } from '@stock-day/components/ui/badge';
import { Input } from '@stock-day/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@stock-day/components/ui/table';
import { Checkbox } from '@stock-day/components/ui/checkbox';

const Page = () => {
  return (
    <section>
      <Typo variant={'h4'} weight={'bold'}>
        Create Dashboard
      </Typo>
      <SearchTable />
    </section>
  );
};

export default Page;

// Zod 스키마 정의
const searchSchema = z.object({
  searchTerm: z.string(),
  selectedItems: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      category: z.string(),
      price: z.string()
    })
  )
});

type SearchFormValues = z.infer<typeof searchSchema>;

// 샘플 데이터
const data = [
  { id: 1, name: 'iPhone 14', category: 'Electronics', price: '$999' },
  { id: 2, name: 'MacBook Pro', category: 'Electronics', price: '$1999' },
  { id: 3, name: 'AirPods Pro', category: 'Electronics', price: '$249' },
  { id: 4, name: 'iPad Air', category: 'Electronics', price: '$599' },
  { id: 5, name: 'Apple Watch', category: 'Electronics', price: '$399' }
];

export function SearchTable() {
  const { control, watch, setValue } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchTerm: '',
      selectedItems: []
    }
  });

  const searchTerm = watch('searchTerm');
  const selectedItems = watch('selectedItems');

  // 검색어로 데이터 필터링
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value
        .toString()
        .toLowerCase()
        .includes((searchTerm || '').toLowerCase())
    )
  );

  // 아이템 선택/해제 처리
  const handleSelect = (item: (typeof data)[0]) => {
    const currentSelected = selectedItems || [];
    const isSelected = currentSelected.find((i) => i.id === item.id);

    if (isSelected) {
      setValue(
        'selectedItems',
        currentSelected.filter((i) => i.id !== item.id)
      );
    } else {
      setValue('selectedItems', [...currentSelected, item]);
    }
  };

  // 선택된 아이템 제거
  const handleRemove = (itemId: number) => {
    setValue(
      'selectedItems',
      (selectedItems || []).filter((item) => item.id !== itemId)
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* 선택된 아이템 뱃지 */}
      <div className="flex flex-wrap gap-2">
        {selectedItems?.map((item) => (
          <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
            {item.name}
            <button onClick={() => handleRemove(item.id)} className="ml-1 hover:bg-gray-200 rounded-full p-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* 검색 입력 필드 */}
      <Controller
        name="searchTerm"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Search items..." className="max-w-sm" />}
      />

      {/* 테이블 */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems?.some((i) => i.id === item.id)}
                    onCheckedChange={() => handleSelect(item)}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
