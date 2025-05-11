import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@lib/context/user-context';
import { Loading } from '@components/ui/loading';
import { UserNav } from '@components/user/user-nav';
import { variants } from '@components/user/user-header';
import type { LayoutProps } from './common-layout';

import type { JSX } from 'react';

export function UserFollowLayout({ children }: LayoutProps): JSX.Element {
  const { user: userData, loading } = useUser();

  return (
    <>
      {!userData ? (
        <motion.section {...variants}>
          {loading ? (
            <Loading className='mt-5 w-full' />
          ) : (
            <div className='w-full p-8 text-center'>
              <p className='text-3xl font-bold'>This account doesn’t exist</p>
              <p className='text-light-secondary dark:text-dark-secondary'>
                Try searching for another.
              </p>
            </div>
          )}
        </motion.section>
      ) : userData.isBanned ? (
        <div className='w-full p-8 text-center'>
          <p className='text-3xl font-bold'>Account suspended</p>
          <p className='text-light-secondary dark:text-dark-secondary'>
            Twitter suspends accounts that violate the{' '}
            <Link href='https://twitter.com/rules'>Twitter Rules</Link>
          </p>
        </div>
      ) : (
        <>
          <UserNav follow />
          {children}
        </>
      )}
    </>
  );
}
