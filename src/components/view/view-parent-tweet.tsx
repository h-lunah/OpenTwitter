import { useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { useDocument } from '@lib/hooks/useDocument';
import { tweetsCollection } from '@lib/firebase/collections';
import { Tweet } from '@components/tweet/tweet';
import type { JSX, RefObject } from 'react';

type ViewParentTweetProps = {
  parentId: string;
  viewTweetRef: RefObject<HTMLElement | null>;
};

export function ViewParentTweet({
  parentId,
  viewTweetRef
}: ViewParentTweetProps): JSX.Element | null {
  const { data, loading } = useDocument(doc(tweetsCollection, parentId), {
    includeUser: true,
    allowNull: true
  });

  useEffect(() => {
    if (!loading) viewTweetRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, loading]);

  if (loading) return null;
  if (!data)
    return (
      <div className='px-4 pb-2 pt-3'>
        <p
          className='rounded-2xl bg-main-sidebar-background px-1 py-3 pl-4 
                     text-light-secondary dark:text-dark-secondary'
        >
          This Tweet was deleted by the Tweet author.{' '}
          <a
            className='custom-underline text-main-accent'
            href='https://help.twitter.com/rules-and-policies/notices-on-twitter'
            target='_blank'
            rel='noreferrer'
          >
            Learn more
          </a>
        </p>
      </div>
    );

  return <Tweet parentTweet {...data} />;
}
