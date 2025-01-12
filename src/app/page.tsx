import { auth } from '@stock-day/core/auth/auth';
import { UserInfo } from '@stock-day/app/UserInfo';

export default async function Home() {
  const session = await auth();

  return (
    <div className={'flex w-full h-[100vh] justify-center items-center'}>
      <UserInfo email={session?.user?.email || ''} />;
    </div>
  );
}
