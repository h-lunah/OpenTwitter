/* eslint-disable react-hooks/exhaustive-deps */

import Link from 'next/link';
import { useState, useEffect, useMemo, type JSX } from 'react';
import cn from 'clsx';
import { toast } from 'react-hot-toast';
import { useAuth } from '@lib/context/auth-context';
import { manageRetweet, manageLike, manageBookmark } from '@lib/firebase/utils';
import { preventBubbling } from '@lib/utils';
import { ViewTweetStats } from '@components/view/view-tweet-stats';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { TweetOption } from '@components/tweet/tweet-option';
import { TweetShare } from '@components/tweet/tweet-share';
import type { Tweet } from '@lib/types/tweet';

type TweetStatsProps = Pick<
  Tweet,
  'userLikes' | 'userRetweets' | 'userReplies'
> & {
  reply?: boolean;
  userId: string;
  isOwner: boolean;
  tweetId: string;
  tweetCreatedBy: string;
  viewTweet?: boolean;
  openModal?: () => void;
};

export function TweetStats({
  reply,
  userId,
  tweetId,
  tweetCreatedBy,
  userLikes,
  viewTweet,
  userRetweets,
  userReplies: totalReplies,
  openModal
}: TweetStatsProps): JSX.Element {
  const { userBookmarks } = useAuth();

  const totalLikes = userLikes.length;
  const totalTweets = userRetweets.length;

  const [{ currentReplies, currentTweets, currentLikes }, setCurrentStats] =
    useState({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });

  useEffect(() => {
    setCurrentStats({
      currentReplies: totalReplies,
      currentLikes: totalLikes,
      currentTweets: totalTweets
    });
  }, [totalReplies, totalLikes, totalTweets]);

  const replyMove = useMemo(
    () => (totalReplies > currentReplies ? -25 : 25),
    [totalReplies]
  );

  const likeMove = useMemo(
    () => (totalLikes > currentLikes ? -25 : 25),
    [totalLikes]
  );

  const tweetMove = useMemo(
    () => (totalTweets > currentTweets ? -25 : 25),
    [totalTweets]
  );

  const handleBookmark =
    (closeMenu: () => void, ...args: Parameters<typeof manageBookmark>) =>
    async (): Promise<void> => {
      const [type] = args;

      closeMenu();
      await manageBookmark(...args);

      toast.success(
        type === 'bookmark'
          ? (): JSX.Element => (
              <span className='flex gap-2'>
                Tweet added to your bookmarks
                <Link href='/bookmarks'>
                  <span className='custom-underline font-bold'>View</span>
                </Link>
              </span>
            )
          : 'Tweet removed from your bookmarks'
      );
    };

  const tweetIsBookmarked = !!userBookmarks?.some(({ id }) => id === tweetId);

  const tweetIsLiked = userLikes.includes(userId);
  const tweetIsRetweeted = userRetweets.includes(userId);

  const isStatsVisible = !!(totalReplies || totalTweets || totalLikes);

  return (
    <>
      {viewTweet && (
        <ViewTweetStats
          likeMove={likeMove}
          userLikes={userLikes}
          tweetMove={tweetMove}
          replyMove={replyMove}
          userRetweets={userRetweets}
          currentLikes={currentLikes}
          currentTweets={currentTweets}
          currentReplies={currentReplies}
          isStatsVisible={isStatsVisible}
        />
      )}
      <div
        className={cn(
          'flex text-light-secondary inner:outline-none dark:text-dark-secondary',
          viewTweet ? 'justify-around py-2' : 'max-w-md justify-between'
        )}
      >
        <TweetOption
          className='hover:text-accent-blue focus-visible:text-accent-blue'
          iconClassName='group-hover:bg-accent-blue/10 group-active:bg-accent-blue/20 
                         group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-accent-blue/80'
          tip='Reply'
          move={replyMove}
          stats={currentReplies}
          iconName='ChatBubbleOvalLeftIcon'
          viewTweet={viewTweet}
          onClick={openModal}
          disabled={reply}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-green focus-visible:text-accent-green',
            tweetIsRetweeted && 'text-accent-green [&>i>svg]:[stroke-width:2px]'
          )}
          iconClassName='group-hover:bg-accent-green/10 group-active:bg-accent-green/20
                         group-focus-visible:bg-accent-green/10 group-focus-visible:ring-accent-green/80'
          tip={tweetIsRetweeted ? 'Undo Retweet' : 'Retweet'}
          move={tweetMove}
          stats={currentTweets}
          iconName='ArrowPathRoundedSquareIcon'
          viewTweet={viewTweet}
          onClick={manageRetweet(
            tweetIsRetweeted ? 'unretweet' : 'retweet',
            userId,
            tweetId
          )}
        />
        <TweetOption
          className={cn(
            'hover:text-accent-pink focus-visible:text-accent-pink',
            tweetIsLiked && 'text-accent-pink [&>i>svg]:fill-accent-pink'
          )}
          iconClassName='group-hover:bg-accent-pink/10 group-active:bg-accent-pink/20
                         group-focus-visible:bg-accent-pink/10 group-focus-visible:ring-accent-pink/80'
          tip={tweetIsLiked ? 'Unlike' : 'Like'}
          move={likeMove}
          stats={currentLikes}
          iconName='HeartIcon'
          viewTweet={viewTweet}
          onClick={manageLike(tweetIsLiked ? 'unlike' : 'like', userId, {
            id: tweetId,
            createdBy: tweetCreatedBy
          } as Tweet)}
        />
        <div className='relative'>
          <button
            className='group relative flex items-center gap-1 p-0 outline-none 
                       transition-none hover:text-accent-blue focus-visible:text-accent-blue'
            onClick={preventBubbling(
              handleBookmark(
                close,
                !tweetIsBookmarked ? 'bookmark' : 'unbookmark',
                userId,
                tweetId
              )
            )}
          >
            <i className='relative rounded-full p-2 not-italic duration-200 group-hover:bg-accent-blue/10  group-focus-visible:bg-accent-blue/10 group-focus-visible:ring-2  group-focus-visible:ring-accent-blue/80 group-active:bg-accent-blue/20'>
              <HeroIcon
                iconName='BookmarkIcon'
                className={
                  !tweetIsBookmarked ? 'h-5 w-auto' : 'h-5 w-auto fill-current'
                }
              />
            </i>
            <ToolTip
              tip={!tweetIsBookmarked ? 'Bookmark' : 'Unbookmark'}
              className='bottom-0'
            />
          </button>
        </div>
        <TweetShare userId={userId} tweetId={tweetId} viewTweet={viewTweet} />
      </div>
    </>
  );
}
