import { Typo } from '@stock-day/components/ui/Typo';
import { Button } from '@stock-day/components/ui/Button';

export const DesignSystem = () => {
  return (
    <div className={'flex gap-10'}>
      <div className={'flex flex-col gap-4'}>
        <Typo variant={'h1'}>Day</Typo>
        <Typo variant={'h2'}>Day</Typo>
        <Typo variant={'h3'}>Day</Typo>
        <Typo variant={'h4'}>Day</Typo>
        <Typo variant={'h5'}>Day</Typo>
        <Typo variant={'p'}>Day</Typo>
      </div>
      <div className={'flex flex-col gap-4'}>
        <Button variant={'default'} size={'lg'}>
          Day
        </Button>
        <Button variant={'secondary'}>Day</Button>
        <Button variant={'link'}>Day</Button>
        <Button variant={'ghost'}>Day</Button>
        <Button variant={'outline'}>Day</Button>
        <Button variant={'destructive'}>Day</Button>
      </div>
    </div>
  );
};
