import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { transliterate } from 'transliteration';
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase
} from 'firebase/auth';
import nookies from 'nookies';
import { toast } from 'react-hot-toast';
import { auth } from '@lib/firebase/app';
import {
  userBookmarksCollection,
  usersCollection,
  userStatsCollection
} from '@lib/firebase/collections';
import { checkUsernameAvailability } from '@lib/firebase/utils';
import { getRandomId, getRandomInt } from '@lib/random';
import type { Bookmark } from '@lib/types/bookmark';
import type { Stats } from '@lib/types/stats';
import type { User } from '@lib/types/user';
import type { User as AuthUser } from 'firebase/auth';

import type { WithFieldValue } from 'firebase/firestore';
import type { JSX, ReactNode } from 'react';

type AuthContext = {
  user: User | null;
  error: Error | null;
  loading: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  randomSeed: string;
  userBookmarks: Bookmark[] | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInManual: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({
  children
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<Bookmark[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manageUser = async (authUser: AuthUser): Promise<void> => {
      const { uid, displayName, photoURL } = authUser;

      const token = await authUser.getIdToken();
      nookies.set(undefined, 'token', token, { path: '/' });

      const userSnapshot = await getDoc(doc(usersCollection, uid));

      if (!userSnapshot.exists()) {
        let available = await checkUsernameAvailability(
          transliterate(displayName?.replaceAll(/\s/g, '') ?? 'user')
        );
        let randomUsername = transliterate(
          displayName?.replaceAll(/\s/g, '') ?? 'user'
        );

        while (!available) {
          const normalizeName = transliterate(
            displayName?.replaceAll(/\s/g, '') ?? 'user'
          );
          const randomInt = getRandomInt(0, 1e5);

          randomUsername = `${normalizeName}${randomInt}`;

          const isUsernameAvailable = await checkUsernameAvailability(
            randomUsername
          );

          if (isUsernameAvailable) available = true;
        }

        const userData: WithFieldValue<User> = {
          id: uid,
          bio: null,
          name: displayName as string,
          theme: null,
          accent: null,
          website: null,
          location: null,
          photoURL: photoURL ?? '/assets/default-avatar.png',
          username: randomUsername,
          verified: false,
          following: [],
          followers: [],
          createdAt: serverTimestamp(),
          updatedAt: null,
          totalTweets: 0,
          totalPhotos: 0,
          pinnedTweet: null,
          coverPhotoURL: null,
          isBanned: false
        };

        const userStatsData: WithFieldValue<Stats> = {
          likes: [],
          tweets: [],
          updatedAt: null
        };

        try {
          await Promise.all([
            setDoc(doc(usersCollection, uid), userData),
            setDoc(doc(userStatsCollection(uid), 'stats'), userStatsData)
          ]);

          const newUser = (await getDoc(doc(usersCollection, uid))).data();
          setUser(newUser as User);
        } catch (error) {
          setError(error as Error);
        }
      } else {
        const userData = userSnapshot.data();

        if (userData?.isBanned) {
          toast.error('Your account is suspended.');
          await signOutFirebase(auth);
          return;
        }

        setUser(userData);
      }

      setLoading(false);
    };

    const handleUserAuth = (authUser: AuthUser | null): void => {
      setLoading(true);

      if (authUser) void manageUser(authUser);
      else {
        setUser(null);
        setLoading(false);
      }
    };

    onAuthStateChanged(auth, handleUserAuth);
  }, []);

  useEffect(() => {
    if (!user) return;

    const { id } = user;

    const unsubscribeUser = onSnapshot(doc(usersCollection, id), (doc) => {
      setUser(doc.data() as User);
    });

    const unsubscribeBookmarks = onSnapshot(
      userBookmarksCollection(id),
      (snapshot) => {
        const bookmarks = snapshot.docs.map((doc) => doc.data());
        setUserBookmarks(bookmarks);
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribeBookmarks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error as Error);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error as Error);
    }
  };
  const signInManual = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error as Error);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutFirebase(auth);
    } catch (error) {
      setError(error as Error);
    }
  };

  const isAdmin = user ? user.username === 'luna' : false;
  const isBanned = user?.isBanned ?? false;
  const randomSeed = useMemo(getRandomId, [user?.id]);

  const value: AuthContext = {
    user,
    error,
    loading,
    isAdmin,
    isBanned,
    randomSeed,
    userBookmarks,
    signOut,
    signInWithGoogle,
    signUpWithEmail,
    signInManual
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthContextProvider');

  return context;
}
