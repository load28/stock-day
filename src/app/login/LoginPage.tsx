'use client';

import { Button } from '@stock-day/components/ui/Button';
import { googleSignIn } from '@stock-day/core/auth/auth-actions';

export default function LoginPage() {
  const onLogin = async () => await googleSignIn();

  return (
    <div className={'w-full h-[100vh] flex justify-center items-center'}>
      <Button onClick={onLogin}>Start with Google</Button>
    </div>
  );
}
