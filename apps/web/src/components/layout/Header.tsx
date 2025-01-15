'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@stock-day/components/ui/Avatar';
import Image from 'next/image';
import { useSessionQuery } from '@stock-day/core/react-query/session/session-client-query';
import { Button, buttonVariants } from '@stock-day/components/ui/Button';
import { googleSignIn, googleSignOut } from '@stock-day/core/auth/auth-actions';
import { PropsWithChildren } from 'react';
import Link from 'next/link';

export const Header = () => {
  const { data: session } = useSessionQuery();

  return (
    <HeaderContainer>
      {session ? <AuthenticatedHeader imageUrl={session.image} /> : <UnauthenticatedHeader />}
    </HeaderContainer>
  );
};

const HeaderContainer = ({ children }: PropsWithChildren) => {
  return (
    <header className={'flex justify-between items-center h-16 px-4 border-b border-border'}>
      <Image src={'/logo.svg'} alt={'Stock Day'} width={120} height={60} />
      {children}
    </header>
  );
};

const AuthenticatedHeader = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className={'flex gap-12'}>
      <Link className={buttonVariants({ variant: 'link' })} href={'/dashboard/create'}>
        Create Dashboard
      </Link>
      <Button variant={'secondary'} onClick={() => googleSignOut()}>
        Sign out
      </Button>
      <Avatar>
        <AvatarImage src={imageUrl} />
        <AvatarFallback />
      </Avatar>
    </div>
  );
};

const UnauthenticatedHeader = () => {
  return (
    <Button variant={'secondary'} onClick={() => googleSignIn()}>
      Sign In
    </Button>
  );
};
