import { useRouter } from 'next/router';
import Image from 'next/image';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';

export default function NotFound(): JSX.Element {
  const { push } = useRouter();

  const handleRefresh = (): void => {
    void push('/');
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='z-1 flex h-1/2 w-96 flex-col gap-4 p-8'>
        <i className='mb-0'>
          <CustomIcon
            className='-mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12'
            iconName='TwitterIcon'
          />
        </i>
        <h1 className='text-3xl font-bold'>Nothing to see here</h1>
        <p>
          Looks like this page doesn’t exist. Here’s a picture of a poodle
          sitting in a chair for your trouble.
        </p>
        <Button
          className='custom-button main-tab self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90  focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border  dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90  dark:active:bg-light-border/75'
          onClick={handleRefresh}
        >
          Looking for this?
        </Button>
      </div>
      <Image
        className='fixed lg:h-[100dvh] lg:object-center h-1/2 w-full bottom-0 object-cover object-right'
        src='/assets/404-banner.png'
        alt='Not found banner'
      />
    </div>
  );
}
