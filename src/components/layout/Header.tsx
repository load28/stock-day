import { Avatar, AvatarFallback, AvatarImage } from '@stock-day/components/ui/Avatar';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className={'flex justify-between items-center h-16 px-4 border border-border'}>
      <Image src={'/logo.svg'} alt={'Stock Day'} width={120} height={60} />
      <Avatar>
        <AvatarImage />
        <AvatarFallback />
      </Avatar>
    </header>
  );
};
