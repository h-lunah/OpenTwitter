import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserFollowLayout } from '@components/layout/user-follow-layout';
import { UserFollow } from '@components/user/user-follow';
import type { ReactElement, ReactNode, JSX } from 'react';

export default function UserFollowers(): JSX.Element {
  return <UserFollow type='followers' />;
}

UserFollowers.getLayout = (page: ReactElement<unknown>): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserFollowLayout>{page}</UserFollowLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
