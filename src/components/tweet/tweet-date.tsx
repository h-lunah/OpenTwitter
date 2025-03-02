import Link from 'next/link';
import cn from 'clsx';
import { formatDate, getTweetTime } from '@lib/date';
import { ToolTip } from '@components/ui/tooltip';
import type { Tweet } from '@lib/types/tweet';

import type { JSX } from 'react';

type TweetDateProps = Pick<Tweet, 'createdAt'> & {
  tweetLink: string;
  viewTweet?: boolean;
};

export function TweetDate({
  createdAt,
  tweetLink,
  viewTweet
}: TweetDateProps): JSX.Element {
  return (
    <div className={cn('flex gap-1', viewTweet && 'py-4')}>
      {!viewTweet && <i>·</i>}
      <div className='group relative'>
        <Link
          href={tweetLink}
          className={cn(
            'custom-underline peer whitespace-nowrap',
            viewTweet && 'text-light-secondary dark:text-dark-secondary'
          )}
        >
          {viewTweet ? getTweetTime(createdAt) : formatDate(createdAt, 'tweet')}
        </Link>
        <ToolTip
          className='translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible
                     peer-focus-visible:delay-200'
          tip={formatDate(createdAt, 'full')}
        />
      </div>
    </div>
  );
}
