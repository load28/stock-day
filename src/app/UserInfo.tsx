'use client';

import { Typo } from '@stock-day/components/ui/Typo';
import { Button } from '@stock-day/components/ui/Button';
import { googleSignOut } from '@stock-day/core/auth/auth-actions';

export const UserInfo = ({ email }: { email: string }) => {
  const onLogout = async () => await googleSignOut();

  return (
    <div className={'flex flex-col gap-10'}>
      <Typo variant={'h1'}>{email}</Typo>
      <Button onClick={onLogout}>Logout</Button>
    </div>
  );
};
