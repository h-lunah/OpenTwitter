import {
  query,
  orderBy,
  startAt,
  endAt
} from 'firebase/firestore';
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { useCollection } from '@lib/hooks/useCollection';
import { usersCollection } from '@lib/firebase/collections';
import { useDebounce } from '@lib/hooks/useDebounce';
import { MainContainer } from '@components/home/main-container';
import {
  ExploreLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserCard } from '@components/user/user-card';
import { UserSearchBar } from '@components/user/user-search';
import { MainHeader } from '@components/home/main-header';
import { UpdateUsername } from '@components/home/update-username';
import type { User } from '@lib/types/user';

export default function Search(): JSX.Element {
  const [input, setInput] = useState('');
  const [dataTest, setDataTes] = useState<User[] | null>(null);

  const debouncedInput = useDebounce(input, 500);

  const { data: usersData, loading } = useCollection(
    query(
      usersCollection,
      orderBy('username'),
      startAt(debouncedInput),
      endAt(debouncedInput + '\uf8ff')
    ),
    { allowNull: true }
  );

  useEffect(() => {
    if (usersData) setDataTes(usersData);
    if (usersData?.length === 0) setDataTes([]);
  }, [usersData]);

  return (
    <MainContainer>
      <MainHeader
        useMobileSidebar
        title='Search'
        className='flex items-center justify-between'
      >
        <UpdateUsername />
      </MainHeader>

      <div className='container mx-auto p-4'>
        <UserSearchBar
          value={input}
          onChange={(e): void => setInput(e.target.value)}
        />
        <section className='mt-6'>
          {loading ? (
            <p>Searching...</p>
          ) : usersData?.length === 0 ? (
            <p className='text-center'>No user found</p>
          ) : (
            <div>
              {dataTest?.map((user) => (
                <UserCard key={user?.id} {...user} />
              ))}
            </div>
          )}
        </section>
      </div>
    </MainContainer>
  );
}

Search.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <ExploreLayout>{page}</ExploreLayout>
    </MainLayout>
  </ProtectedLayout>
);
