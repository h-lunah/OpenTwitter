import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  updateDoc
} from 'firebase/firestore';
import * as emoji from 'node-emoji';
import cn from 'clsx';
import {
  useEffect,
  useState,
  useRef,
  type ReactElement,
  type ReactNode
} from 'react';
import { motion } from 'framer-motion';
import { BiNavigation } from 'react-icons/bi';
import { twemojiParseWithLinks } from '@lib/twemoji';
import {
  conversationsCollection,
  messagesCollection,
  usersCollection,
  notificationsCollection
} from '@lib/firebase/collections';
import { useCollection } from '@lib/hooks/useCollection';
import { useAuth } from '@lib/context/auth-context';
import {
  MessageLayout,
  ProtectedLayout
} from '@components/layout/common-layout';
import { MainLayoutWithoutSidebar } from '@components/layout/main-layout-without-sidebar';
import { SEO } from '@components/common/seo';
import { MainHeader } from '@components/home/main-header';
import { Button } from '@components/ui/button';
import { Loading } from '@components/ui/loading';
import type { Message } from '@lib/types/message';
import type {
  Conversation,
  ConversationWithUser
} from '@lib/types/conversation';
import type { Notification } from '@lib/types/notification';
import type { WithFieldValue, DocumentReference } from 'firebase/firestore';
import type { MotionProps } from 'framer-motion';

export const variants: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

export default function MessagePage(): JSX.Element {
  const [conversation, setConversation] = useState<ConversationWithUser>();
  const { user } = useAuth();
  const { back } = useRouter();
  const { conversation: conversationId } = useParams();

  const [inputValue, setInputValue] = useState('');

  const { data, loading } = useCollection(
    query(messagesCollection, where('conversationId', '==', conversationId))
  );

  const targetUserIdRef = useRef<string | null | undefined>(null);
  const conversationRef = useRef<
    DocumentReference<Conversation> | null | undefined
  >(null);

  useEffect(() => {
    void (async (): Promise<void> => {
      const conversationDocRef = doc(
        conversationsCollection,
        conversationId as string
      );
      const conversationData = (
        await getDoc(doc(conversationsCollection, conversationId as string))
      ).data();

      const targetUserId = conversationData?.targetUserId;
      targetUserIdRef.current = targetUserId;
      conversationRef.current = conversationDocRef;

      const userData = (
        await getDoc(
          doc(
            usersCollection,
            (conversationData?.targetUserId === user?.id
              ? conversationData?.userId
              : conversationData?.targetUserId) as string
          )
        )
      ).data();

      if (userData)
        setConversation({
          ...(conversationData as Conversation),
          user: userData
        });
    })().catch(() => {
      back();
    });
  }, [data, conversationId, user, back]);

  const handleSendMessage = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!inputValue) return;

    setInputValue('');

    await addDoc(messagesCollection, {
      conversationId: conversationId as string,
      text: inputValue,
      userId: user?.id,
      createdAt: serverTimestamp(),
      updatedAt: null
    } as WithFieldValue<Omit<Message, 'id'>>);

    if (conversationRef.current)
      await updateDoc(conversationRef.current, {
        updatedAt: serverTimestamp()
      });

    if (user?.id !== targetUserIdRef.current) {
      const notificationQuery = query(
        notificationsCollection,
        where('type', '==', 'message'),
        where('userId', '==', user?.id),
        where('targetUserId', '==', targetUserIdRef.current)
      );

      const notificationSnapshot = await getDocs(notificationQuery);

      if (notificationSnapshot.empty)
        await addDoc(notificationsCollection, {
          type: 'message',
          userId: user?.id,
          targetUserId: targetUserIdRef.current,
          createdAt: serverTimestamp(),
          updatedAt: null,
          isChecked: false
        } as WithFieldValue<Omit<Notification, 'id'>>);
    }
  };

  return (
    <main
      className={cn(
        'hover-animation dxl:min-h-screen flex min-h-[90dvh] w-full flex-col dark:border-dark-border xs:border-x'
      )}
    >
      <SEO title='Messages / Twitter' />
      <MainHeader
        useActionButton
        title={`Message ${
          conversation?.user.name ? `with ${conversation.user.name}` : ''
        }`}
        action={back}
      ></MainHeader>

      {loading ? (
        <Loading />
      ) : (
        <div className='h-[calc(100dvh-52px)] w-full '>
          <div
            className='
            relative flex h-full
            w-full flex-col items-center
            justify-end gap-0.5 rounded-md bg-white dark:border-main-background dark:bg-main-background'
          >
            <div className='with-scroll flex h-full w-full flex-col-reverse overflow-auto'>
              <div className='mb-2 flex h-full w-full flex-col justify-end gap-2 px-2 pb-2'>
                {data
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ?.sort((a, b) => (a.createdAt as any) - (b.createdAt as any))
                  .map((message) => (
                    <motion.div
                      className={`relative flex w-full items-end justify-start ${
                        message.userId === user?.id
                          ? 'flex-row-reverse'
                          : ' flex-row'
                      }`}
                      key={message.id}
                      {...variants}
                    >
                      <div
                        className={`border-4 border-b-main-accent border-t-transparent 
                          ${
                            message.userId === user?.id
                              ? 'rounded-r-lg border-l-main-accent border-r-transparent'
                              : 'rounded-l-lg border-l-transparent border-r-main-accent'
                          }
                        `}
                      >
                        {message.userId !== user?.id && (
                          <div className='absolute bottom-[1px] left-[3px] border-[3px] border-b-white border-l-transparent border-r-white border-t-transparent dark:border-b-zinc-900 dark:border-r-zinc-900'></div>
                        )}
                      </div>
                      <div
                        className={`multiline max-w-[80%] rounded-md border border-main-accent px-2 py-1 ${
                          message.userId === user?.id
                            ? 'rounded-br-none bg-main-accent text-white '
                            : 'rounded-bl-none text-main-accent '
                        }
                      `}
                      >
                        <p>
                          {
                            <span
                              dangerouslySetInnerHTML={{
                                __html: twemojiParseWithLinks(
                                  message.text,
                                  'text-white'
                                )
                              }}
                            />
                          }
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            <form
              className='bg-red flex w-full gap-2 p-3'
              onSubmit={handleSendMessage}
            >
              <input
                className='
                  shadow-full h-12 flex-1 rounded-full
                  border border-gray-200 bg-transparent bg-white px-3 py-3 outline-none transition
                  placeholder:text-light-secondary focus-within:bg-main-background focus-within:ring-2 focus-within:ring-main-accent dark:border-main-background dark:bg-zinc-900 dark:placeholder:text-dark-secondary
                '
                placeholder='Send a message'
                onChange={(e): void =>
                  setInputValue(emoji.emojify(e.target.value))
                }
                value={inputValue}
              />

              <Button
                type='submit'
                className='flex h-12 w-12 place-items-center justify-center bg-main-accent text-lg font-bold
                        text-white outline-none transition hover:brightness-90 active:brightness-75'
              >
                <BiNavigation className='text-white' />
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

MessagePage.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayoutWithoutSidebar>
      <MessageLayout>{page}</MessageLayout>
    </MainLayoutWithoutSidebar>
  </ProtectedLayout>
);
