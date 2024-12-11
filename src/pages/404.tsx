import { useRouter } from 'next/router';
import { NextImage } from '@components/ui/next-image';
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
          className='custom-button main-tab flex w-48 justify-center gap-2 border border-light-line-reply px-4 font-bold text-light-primary transition hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
          onClick={handleRefresh}
        >
          Looking for this?
        </Button>
      </div>
      <NextImage
        className='absolute h-[100dvh] w-full'
        imgClassName='object-cover mt-auto sm:h-1/2 block'
        layout='fill'
        src='/assets/404-banner.png'
        alt='Not found banner'
      />
    </div>
  );
}
