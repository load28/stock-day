'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@stock-day/components/ui/Avatar';
import Image from 'next/image';
import { useSessionQuery } from '@stock-day/core/react-query/session-client-query';
import { Button } from '@stock-day/components/ui/Button';
import { googleSignIn, googleSignOut } from '@stock-day/core/auth/auth-actions';

export const Header = () => {
  const { data: session } = useSessionQuery();

  return (
    <header className={'flex justify-between items-center h-16 px-4 border border-border'}>
      <Image src={'/logo.svg'} alt={'Stock Day'} width={120} height={60} />
      {session ? <MenuWithSession imageUrl={session.image} /> : <MenuWithoutSession />}
    </header>
  );
};

const MenuWithSession = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className={'flex gap-12'}>
      <Button onClick={() => googleSignOut()}>Sign out</Button>
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback />
      </Avatar>
    </div>
  );
};

const MenuWithoutSession = () => {
  return <Button onClick={() => googleSignIn()}>Sign In</Button>;
};
