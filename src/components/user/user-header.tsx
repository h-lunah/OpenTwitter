import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { useDocument } from '@lib/hooks/useDocument';
import { useUser } from '@lib/context/user-context';
import { isPlural } from '@lib/utils';
import { userStatsCollection } from '@lib/firebase/collections';
import { UserName } from './user-name';
import type { Variants } from 'framer-motion';

import type { JSX } from 'react';

export const variants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export function UserHeader(): JSX.Element {
  const {
    pathname,
    query: { id }
  } = useRouter();
  const { user, loading: userLoading } = useUser();
  const userId = user?.id ?? null;

  const { data: statsData, loading: statsLoading } = useDocument(
    doc(userStatsCollection(userId ?? 'null'), 'stats'),
    {
      allowNull: true,
      disabled: !userId
    }
  );

  const [showContent, setShowContent] = useState<
    'loading' | 'found' | 'not-found'
  >('loading');

  useEffect(() => {
    if (userLoading && statsLoading) setShowContent('loading');
    else if (!userLoading && !user || user?.isBanned) setShowContent('not-found');
    else setShowContent('found');
  }, [userLoading, statsLoading, user]);

  const { tweets } = statsData ?? {};
  const [totalTweets, totalPhotos] = [
    (user?.totalTweets ?? 0) + (tweets?.length ?? 0),
    user?.totalPhotos
  ];

  const currentPage = pathname.split('/').pop() ?? '';
  const isInTweetPage = ['[username]', 'with_replies'].includes(currentPage);
  const isInFollowPage = ['following', 'followers'].includes(currentPage);

  return (
    <AnimatePresence mode='wait'>
      {showContent === 'loading' && (
        <motion.div {...variants} key='loading'>
          <div className='-mt-1 mb-1 h-5 w-24 animate-pulse rounded-lg bg-light-secondary dark:bg-dark-secondary' />
          <div className='h-4 w-12 animate-pulse rounded-lg bg-light-secondary dark:bg-dark-secondary' />
        </motion.div>
      )}

      {showContent === 'not-found' && (
        <motion.div {...variants} key='not-found'>
          <h2 className='text-xl font-bold'>
            {isInFollowPage ? `@${id as string}` : 'User'}
          </h2>
        </motion.div>
      )}

      {showContent !== 'loading' && (
        <motion.div {...variants} key='found' className='truncate'>
          <UserName
            tag='h2'
            name={user?.name ?? user?.username ?? ''}
            className='-mt-1 text-xl'
            iconClassName='w-6 h-6'
            verified={user?.verified ?? false}
          />
          <p className='text-xs text-light-secondary dark:text-dark-secondary'>
            {isInFollowPage
              ? `@${user?.username ?? ''}`
              : isInTweetPage
              ? totalTweets
                ? `${totalTweets} ${`Tweet${isPlural(totalTweets)}`}`
                : user ? '0 Tweets' : ''
              : currentPage === 'media'
              ? totalPhotos
                ? `${totalPhotos} photo${isPlural(
                    totalPhotos
                  )} & video${isPlural(totalPhotos)}`
                : '0 photos & videos'
              : totalTweets
              ? `${totalTweets} Tweet${isPlural(totalTweets)}`
              : '0 Tweets'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
