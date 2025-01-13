import { Header } from '@stock-day/components/layout/Header';
import { Aside } from '@stock-day/components/layout/Aside';
import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className={'flex flex-col flex-1'}>
      <Header />
      <div className={'flex flex-1'}>
        <Aside />
        <main className={'flex-1 px-6 py-4'}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
