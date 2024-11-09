import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { orderBy, query } from 'firebase/firestore';
import { twemojiParse } from '@lib/twemoji';
import { preventBubbling } from '@lib/utils';
import { trendsCollection } from '@lib/firebase/collections';
import { formatNumber } from '@lib/date';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import {
  TrendsLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { MainContainer } from '@components/home/main-container';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { Error } from '@components/ui/error';
import { Loading } from '@components/ui/loading';
import { HeroIcon } from '@components/ui/hero-icon';
import type { ReactElement, ReactNode } from 'react';
import type { MotionProps } from 'framer-motion';

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export default function Trends({
  inTrendsPage
}: AsideTrendsProps): JSX.Element {
  const { back } = useRouter();
  const { data, loading } = useInfiniteScroll(
    query(trendsCollection),
    [orderBy('counter', 'desc')],
    { includeUser: true }
  );

  return (
    <MainContainer>
      <SEO title='Trends / Twitter' />
      <MainHeader useActionButton title='Trends' action={back}>
        <Button
          className='dark-bg-tab group relative ml-auto  p-2 hover:bg-light-primary/10
                     active:bg-light-primary/20 dark:hover:bg-dark-primary/10 dark:active:bg-dark-primary/20'
        >
          <HeroIcon className='h-5 w-5' iconName='Cog8ToothIcon' />
          <ToolTip tip='Settings' />
        </Button>
      </MainHeader>

      {loading ? (
        <Loading />
      ) : data ? (
        <motion.div
          className={cn(
            'space-y-4 py-4 inner:px-4 inner:py-3',
            inTrendsPage && 'mt-0.5'
          )}
          {...variants}
        >
          {!inTrendsPage && (
            <h2 className='text-xl font-extrabold'>Trends for you</h2>
          )}
          {data.map(({ text, counter, user: { name } }) => {
            return (
              <Link
                href={''}
                key={text}
                className='hover-animation accent-tab hover-card relative flex flex-col gap-0.5 border-b border-light-border bg-white p-4 duration-200 dark:border-dark-border dark:bg-main-background'
              >
                <span
                  className='flex  flex-col gap-0.5'
                  onClick={preventBubbling()}
                >
                  <div className='absolute right-2 top-2 hidden'>
                    <Button
                      className='hover-animation group relative  p-2
                              hover:bg-accent-blue/10 focus-visible:bg-accent-blue/20 
                              focus-visible:!ring-accent-blue/80'
                      onClick={preventBubbling()}
                    >
                      <HeroIcon
                        className='h-5 w-5 text-light-secondary group-hover:text-accent-blue 
                                group-focus-visible:text-accent-blue dark:text-dark-secondary'
                        iconName='EllipsisHorizontalIcon'
                      />
                      <ToolTip tip='More' />
                    </Button>
                  </div>
                  <p className='text-sm text-light-secondary dark:text-dark-secondary'>
                    Trending
                  </p>
                  <p className='truncate font-bold'>{text}</p>
                  <p className='truncate text-sm text-light-secondary dark:text-dark-secondary'>
                    Created by{' '}
                    {
                      <span
                        dangerouslySetInnerHTML={{ __html: twemojiParse(name) }}
                      />
                    }
                  </p>
                  <p className='text-sm text-light-secondary dark:text-dark-secondary'>
                    {`${formatNumber(counter + 1)} Tweet${
                      counter === 0 ? '' : 's'
                    }`}
                  </p>
                </span>
              </Link>
            );
          })}
          {!inTrendsPage && (
            <Link href='/trends'>
              <span
                className='custom-button accent-tab hover-card block w-full rounded-2xl
                                    rounded-t-none text-center text-main-accent'
              >
                Show more
              </span>
            </Link>
          )}
        </motion.div>
      ) : (
        <Error />
      )}

      {/* <AsideTrends inTrendsPage /> */}
    </MainContainer>
  );
}

Trends.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <TrendsLayout>{page}</TrendsLayout>
    </MainLayout>
  </ProtectedLayout>
);
