import { auth } from '@stock-day/core/auth/auth';
import { UserInfo } from '@stock-day/app/UserInfo';
import { Typo } from '@stock-day/components/ui/Typo';

export default async function Home() {
  const session = await auth();
  const email = session?.user?.email;

  return (
    <div className={'flex flex-col w-full h-[100vh]  justify-center items-center'}>
      {email && <UserInfo email={email} />}
      <Typo variant={'h3'}>파일 제목입니다 </Typo>
      <Typo variant={'h3'}>파일 제목입니다 </Typo>
    </div>
  );
}
