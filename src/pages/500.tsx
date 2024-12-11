import { useRouter } from 'next/router';
import { NextImage } from '@components/ui/next-image';
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
          className='custom-button main-tab flex w-24 justify-center gap-2 border border-light-line-reply px-4 font-bold text-light-primary transition hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
          onClick={handleRefresh}
        >
          Retry
        </Button>
      </div>
      <NextImage
        className='absolute h-[100dvh] w-full'
        imgClassName='object-cover mt-auto sm:h-1/2 block'
        layout='fill'
        src='/assets/500-banner.png'
        alt='Internal server error banner'
      />
    </div>
  );
}
