import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react'; // Import useRef
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
    query: { id: queryId } // Renamed to avoid shadowing
  } = useRouter();
  const { user, loading: userLoading } = useUser();
  const userId = user?.id ?? null;
  const previousUserId = useRef<string | null>(null);

  // Safely get the currentId as a string or null
  const currentId = typeof queryId === 'string' ? queryId : null;

  const { data: statsData, loading: statsLoading } = useDocument(
    doc(userStatsCollection(userId ?? 'null'), 'stats'),
    {
      allowNull: true,
      disabled: !userId
    }
  );

  const [showContent, setShowContent] = useState<
    'loading' | 'found' | 'not-found' | 'transitioning'
  >('loading');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (currentId !== previousUserId.current) {
      setShowContent('transitioning');
      previousUserId.current = currentId;
    } else if (userLoading || statsLoading) setShowContent('loading');
    else if (!user)
      timeoutId = setTimeout(() => setShowContent('not-found'), 10);
    else timeoutId = setTimeout(() => setShowContent('found'), 10);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [userLoading, statsLoading, user, currentId]);

  const { tweets } = statsData ?? {};
  const [totalTweets, totalPhotos] = [
    (user?.totalTweets ?? 0) + (tweets?.length ?? 0),
    user?.totalPhotos
  ];

  const currentPage = pathname.split('/').pop() ?? '';
  const isInTweetPage = ['[username]', 'with_replies'].includes(currentPage);
  const isInFollowPage = ['following', 'followers'].includes(currentPage);

  return (
    <AnimatePresence mode='wait' key={currentId}>
      {showContent === 'loading' && (
        <motion.div {...variants} key='loading'>
          <div className='-mt-1 mb-1 h-5 w-24 animate-pulse rounded-lg bg-light-secondary dark:bg-dark-secondary' />
          <div className='h-4 w-12 animate-pulse rounded-lg bg-light-secondary dark:bg-dark-secondary' />
        </motion.div>
      )}

      {showContent === 'transitioning' && (
        <motion.div {...variants} key='transitioning'>
          <div className='-mt-1 mb-1 h-5 w-24 animate-pulse rounded-lg bg-light-secondary dark:bg-dark-secondary' />
          {/* You could show a slightly different loading state if desired */}
        </motion.div>
      )}

      {showContent === 'not-found' && (
        <motion.div {...variants} key='not-found'>
          <h2 className='text-xl font-bold'>
            {isInFollowPage ? `@${currentId as string}` : 'User'}
          </h2>
        </motion.div>
      )}

      {showContent === 'found' && user && (
        <motion.div {...variants} key='found' className='truncate'>
          <UserName
            tag='h2'
            name={user.name ?? user.username}
            className='-mt-1 text-xl'
            iconClassName='w-6 h-6'
            verified={user.verified}
          />
          <p className='text-xs text-light-secondary dark:text-dark-secondary'>
            {isInFollowPage
              ? `@${user.username}`
              : isInTweetPage
              ? totalTweets
                ? `${totalTweets} ${`Tweet${isPlural(totalTweets)}`}`
                : '0 Tweets'
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
