import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { query, where, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { twemojiParse } from '@lib/twemoji';
import { conversationsCollection } from '@lib/firebase/collections';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { useAuth } from '@lib/context/auth-context';
import { Error } from '@components/ui/error';
import { Loading } from '@components/ui/loading';
import type { ConversationWithUser } from '@lib/types/conversation';
import type { MotionProps } from 'framer-motion';

import type { JSX } from 'react';

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

export function MessageTable(): JSX.Element {
  const { user } = useAuth();

  const { data: senders, loading: sLoading } = useInfiniteScroll(
    query(conversationsCollection),
    [where('userId', '==', user?.id), orderBy('updatedAt', 'desc')],
    { includeUser: 'targetUserId' }
  );

  const { data: emitters, loading: eLoading } = useInfiniteScroll(
    query(conversationsCollection),
    [where('targetUserId', '==', user?.id), orderBy('updatedAt', 'desc')],
    { includeUser: 'userId' }
  );

  const data = [...(senders ?? []), ...(emitters ?? [])];

  return (
    <section>
      {sLoading || eLoading ? (
        <Loading />
      ) : data ? (
        <motion.div className={cn('space-y-4 py-4')} {...variants}>
          {data.map((conversation) => (
            <Link
              href={`/messages/${conversation.id}`}
              key={conversation.id}
              legacyBehavior
            >
              <div className='hover-animation accent-tab hover-card relative my-0 flex cursor-pointer items-center gap-0.5 border-b border-light-border bg-white p-4 duration-200 dark:border-dark-border dark:bg-main-background'>
                <Image
                  src={(conversation as ConversationWithUser).user.photoURL}
                  className='mr-2 h-14 w-14 flex-none rounded-full object-cover'
                  width={56}
                  height={56}
                  objectFit='cover'
                  alt={`User picture of ${
                    (conversation as ConversationWithUser).user.name ??
                    (conversation as ConversationWithUser).user.username
                  }`}
                />
                <div className='flex min-w-0 flex-1 flex-col items-start'>
                  <p className='w-full truncate font-bold'>
                    {
                      <span
                        dangerouslySetInnerHTML={{
                          __html: twemojiParse(
                            (conversation as ConversationWithUser).user.name ??
                              (conversation as ConversationWithUser).user
                                .username
                          )
                        }}
                      />
                    }
                  </p>
                  <a className='text-sm text-light-secondary dark:text-dark-secondary'>
                    View message
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
