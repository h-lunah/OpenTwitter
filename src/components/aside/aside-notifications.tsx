import Link from 'next/link';
import cn from 'clsx';
import { motion } from 'framer-motion';
import { query, updateDoc, where, doc, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { twemojiParse } from '@lib/twemoji';
import { preventBubbling } from '@lib/utils';
import { notificationsCollection } from '@lib/firebase/collections';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';
import { useAuth } from '@lib/context/auth-context';
import { Error } from '@components/ui/error';
import { Loading } from '@components/ui/loading';
import { NotificationTypes } from '@components/common/notifications';
import type { NotificationWithUser } from '@lib/types/notification';
import type { MotionProps } from 'framer-motion';

import type { JSX } from 'react';

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8 }
};

type AsideNotificationsProps = {
  inNotificationsPage?: boolean;
};

export function AsideNotifications({
  inNotificationsPage
}: AsideNotificationsProps): JSX.Element {
  const { user } = useAuth();
  const navigator = useRouter();

  const { data, loading } = useInfiniteScroll(
    query(notificationsCollection),
    [where('targetUserId', '==', user?.id), orderBy('createdAt', 'desc')],
    { includeUser: 'userId' }
  );

  return (
    <section
      className={cn(
        !inNotificationsPage &&
          'hover-animation accent-tab hover-card relative flex flex-col gap-0.5 border-b border-light-border bg-white p-4 duration-200 dark:border-dark-border dark:bg-main-background'
      )}
    >
      {loading ? (
        <Loading />
      ) : data ? (
        <motion.div
          className={cn(
            'space-y-4 py-4 inner:px-4 inner:py-3',
            inNotificationsPage && 'mt-0.5'
          )}
          {...variants}
        >
          {data.map((notification) => {
            const NotificationProps = NotificationTypes(
              notification as NotificationWithUser
            );

            return (
              !notification.isChecked && (
                <Link
                  href={NotificationProps.url}
                  key={notification.id}
                  legacyBehavior
                >
                  <a
                    className='hover-animation accent-tab hover-card relative my-0 flex flex-col gap-0.5 border-b border-light-border bg-white p-4 duration-200 dark:border-dark-border dark:bg-main-background'
                    onClick={async (): Promise<void> => {
                      preventBubbling();
                      void navigator.push(NotificationProps.url);

                      const docRef = doc(
                        notificationsCollection,
                        notification.id
                      );

                      await updateDoc(docRef, {
                        isChecked: true
                      });
                    }}
                  >
                    <div className='flex w-full items-center'>
                      <Image
                        src={NotificationProps.image_url}
                        className='mr-2  h-14 w-14 rounded-full object-cover'
                        width={56}
                        height={56}
                        objectFit='cover'
                        alt={`User image ${
                          (notification as NotificationWithUser).user.name
                        }`}
                      />
                      <div className='flex flex-col items-start'>
                        <p className='font-bold'>{NotificationProps.title}</p>
                        <p className='multiline text-sm text-light-secondary dark:text-dark-secondary'>
                          {
                            <span
                              dangerouslySetInnerHTML={{
                                __html: twemojiParse(
                                  NotificationProps.description
                                )
                              }}
                            />
                          }
                        </p>
                      </div>
                    </div>

                    {!notification.isChecked && (
                      <div className='absolute right-2 top-2'>
                        <p className='text-sm text-light-secondary dark:text-dark-secondary'>
                          New
                        </p>
                      </div>
                    )}
                  </a>
                </Link>
              )
            );
          })}
        </motion.div>
      ) : (
        <Error />
      )}
    </section>
  );
}
