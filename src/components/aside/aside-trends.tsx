import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { limit, orderBy, query, where } from 'firebase/firestore';
import { useMemo, type JSX } from 'react';
import { twemojiParse } from '@lib/twemoji';
import { formatNumber } from '@lib/date';
import { preventBubbling } from '@lib/utils';
import { trendsCollection } from '@lib/firebase/collections';
import { useCollection } from '@lib/hooks/useCollection';
import { HeroIcon } from '@components/ui/hero-icon';
import { Button } from '@components/ui/button';
import { ToolTip } from '@components/ui/tooltip';
import { Loading } from '@components/ui/loading';
import type { MotionProps } from 'framer-motion';

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

type AsideTrendsProps = {
  inTrendsPage?: boolean;
};

export function AsideTrends({ inTrendsPage }: AsideTrendsProps): JSX.Element {
  const oneWeekAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, []);

  const today = useMemo(() => new Date(), []);

  const trendsQuery = useMemo(
    () =>
      query(
        trendsCollection,
        where('createdAt', '>=', oneWeekAgo),
        where('createdAt', '<=', today),
        orderBy('createdAt'),
        orderBy('counter', 'desc'),
        limit(10)
      ),
    [oneWeekAgo, today]
  );

  const { data, loading } = useCollection(trendsQuery, {
    allowNull: true,
    includeUser: true
  });

  return (
    <section
      className={cn(
        !inTrendsPage &&
          'hover-animation rounded-2xl bg-main-sidebar-background'
      )}
    >
      {loading ? (
        <Loading />
      ) : data && data.length > 0 ? (
        <motion.div
          className={cn('inner:px-4 inner:py-3', inTrendsPage && 'mt-0.5')}
          {...variants}
        >
          {!inTrendsPage && (
            <h2 className='text-xl font-extrabold'>Trends for you</h2>
          )}
          {data.slice(0, 5).map(({ text, counter, user: { name } }) => (
            <Link
              href={''}
              key={text}
              className='hover-animation accent-tab hover-card relative
                          flex flex-col gap-0.5 px-4'
              onClick={preventBubbling()}
            >
              <div className='absolute right-2 top-2'>
                <Button
                  className='hover-animation group relative p-2
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
                <span
                  dangerouslySetInnerHTML={{ __html: twemojiParse(name) }}
                />
              </p>
              <p className='text-sm text-light-secondary dark:text-dark-secondary'>
                {`${formatNumber(counter + 1)} Tweet${
                  counter === 0 ? '' : 's'
                }`}
              </p>
            </Link>
          ))}
        </motion.div>
      ) : data === null ? (
        <></>
      ) : null}
    </section>
  );
}
