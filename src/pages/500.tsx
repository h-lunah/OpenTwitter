import { useRouter } from 'next/router';
import Image from 'next/image';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';

export default function InternalServerError(): JSX.Element {
  const { push, asPath } = useRouter();

  const handleRefresh = (): void => {
    void push(asPath);
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
        <h1 className='text-3xl font-bold'>This page is down</h1>
        <p>
          I scream. You scream. We all scream... for us to fix this page. We’ll
          stop making jokes and get things up and running soon.
        </p>
        <Button
          className='custom-button main-tab self-start border bg-light-primary px-4 py-1.5 font-bold text-white hover:bg-light-primary/90  focus-visible:bg-light-primary/90 active:bg-light-border/75 dark:bg-light-border  dark:text-light-primary dark:hover:bg-light-border/90 dark:focus-visible:bg-light-border/90  dark:active:bg-light-border/75'
          onClick={handleRefresh}
        >
          Retry
        </Button>
      </div>
      <Image
        className='fixed lg:h-[100dvh] lg:object-center h-1/2 w-full bottom-0 object-cover object-right'
        src='/assets/500-banner.png'
        alt='Internal server error banner'
      />
    </div>
  );
}
