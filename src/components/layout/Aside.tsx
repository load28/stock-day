'use client';

import { Typo } from '@stock-day/components/ui/Typo';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Aside = () => {
  const [dashboards, setDashboards] = useState<string[]>(['S&P 500', 'Nasdaq', 'Dow Jones', 'Russell 2000']);
  const [selectedId, setSelectedId] = useState<string>('S&P 500');

  return (
    <aside className={'w-60 p-4 border-r border-border'}>
      <nav>
        <ListGroup items={dashboards} selectedId={selectedId} />
      </nav>
    </aside>
  );
};

const ListGroup = ({ items, selectedId }: { items: string[]; selectedId: string }) => {
  const [show, setShow] = useState<boolean>(true);

  return (
    <section>
      <div
        className={'flex justify-between items-center w-full h-10 px-2 py-1 mb-1 rounded-md cursor-pointer select-none'}
        onClick={() => setShow(!show)}
      >
        <Typo weight={'semibold'}>Dashboards</Typo>
        {show ? <ChevronUp className={'w-4 h-4'} /> : <ChevronDown className={'w-4 h-4'} />}
      </div>
      {show && (
        <div className={'flex flex-col gap-0.5'}>
          {items.map((item) => {
            return <ListItem key={item} item={item} selectedId={selectedId} />;
          })}
        </div>
      )}
    </section>
  );
};

const ListItem = ({ item, selectedId }: { item: string; selectedId: string }) => {
  return (
    <Link href={''}>
      <div
        className={`px-2 py-1 rounded-md hover:bg-secondary select-none ${selectedId === item ? 'bg-secondary' : ''}`}
      >
        <Typo>{item}</Typo>
      </div>
    </Link>
  );
};
