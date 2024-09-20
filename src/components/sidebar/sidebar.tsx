import Link from 'next/link';
import {
  CiHome,
  CiHashtag,
  CiMail,
  CiBellOn,
  CiBookmark,
  CiUser
} from 'react-icons/ci';
import Image from 'next/image';
import { useAuth } from '@lib/context/auth-context';
import { useWindow } from '@lib/context/window-context';
import { useModal } from '@lib/hooks/useModal';
import { Modal } from '@components/modal/modal';
import { Input } from '@components/input/input';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';
import { SidebarLink } from './sidebar-link';
import { MoreSettings } from './more-settings';
import { SidebarProfile } from './sidebar-profile';
import { SidebarLinkWrapper } from './sidebar-wrapper';
import type { ReactNode } from 'react';
import type { IconName } from '@components/ui/hero-icon';

export type NavLink = {
  href: string;
  linkName: string;
  iconName: IconName;
  isNotification?: boolean;
  disabled?: boolean;
  canBeHidden?: boolean;
  icon?: ReactNode;
};

const navLinks: Readonly<NavLink[]> = [
  {
    href: '/home',
    linkName: 'Home',
    iconName: 'HomeIcon',
    icon: <CiHome size={34} />
  },
  {
    href: '/explore',
    linkName: 'Explore',
    iconName: 'HashtagIcon',
    disabled: true,
    canBeHidden: true,
    icon: <CiHashtag size={34} />
  },
  {
    href: '/notifications',
    linkName: 'Notifications',
    iconName: 'BellIcon',
    disabled: false,
    isNotification: true,
    icon: <CiBellOn size={34} />
  },
  {
    href: '/messages',
    linkName: 'Messages',
    iconName: 'EnvelopeIcon',
    disabled: false,
    icon: <CiMail size={34} />
  },
  {
    href: '/bookmarks',
    linkName: 'Bookmarks',
    iconName: 'BookmarkIcon',
    canBeHidden: true,
    icon: <CiBookmark size={34} />
  }
];

export function Sidebar(): JSX.Element {
  const { user } = useAuth();
  const { isMobile } = useWindow();

  const { open, openModal, closeModal } = useModal();

  const username = user?.username as string;

  return (
    <header
      id='sidebar'
      className='flex w-0 shrink-0 transition-opacity duration-200 xs:w-20 md:w-24
                 lg:max-w-none xl:-mr-4 xl:w-full xl:max-w-xs xl:justify-end'
    >
      <Modal
        className='flex items-start justify-center'
        modalClassName='bg-main-background rounded-2xl max-w-xl w-full mt-8 overflow-hidden'
        open={open}
        closeModal={closeModal}
      >
        <Input modal closeModal={closeModal} />
      </Modal>
      <div
        className='fixed bottom-0 z-10 flex w-full flex-col justify-between border-t border-light-border 
                   bg-main-background py-0 dark:border-dark-border xs:top-0 xs:h-full xs:w-auto xs:border-0 
                   xs:bg-transparent xs:px-2 xs:py-3 xs:pt-2 md:px-4 xl:w-72'
      >
        <section className='flex flex-col justify-center gap-2 xs:items-center xl:items-stretch'>
          <h1 className='hidden xs:flex'>
            <Link href='/home'>
              <span
                className='custom-button main-tab text-accent-blue transition 
                           focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80
                           '
              >
                <Image
                  alt='Twitter logo'
                  width={64}
                  height={64}
                  src={'/logo512.png'}
                />
              </span>
            </Link>
          </h1>
          <nav className='flex items-center justify-around xs:flex-col xs:justify-center xl:block'>
            {navLinks.map(({ ...linkData }) =>
              linkData.isNotification ? (
                <SidebarLinkWrapper {...linkData} Component={SidebarLink} />
              ) : (
                <SidebarLink {...linkData} key={linkData.href} />
              )
            )}
            <SidebarLink
              href={`/${username}`}
              username={username}
              linkName='Perfil'
              iconName='UserIcon'
              icon={<CiUser size={34} />}
            />
            {!isMobile && <MoreSettings />}
          </nav>
          <Button
            className='accent-tab absolute right-4 -translate-y-[72px] bg-main-accent text-lg font-bold text-white
                       outline-none transition hover:brightness-90 active:brightness-75 xs:static xs:translate-y-0
                       xs:hover:bg-main-accent/90 xs:active:bg-main-accent/75 xl:w-11/12'
            onClick={openModal}
          >
            <CustomIcon
              className='block h-6 w-6 xl:hidden'
              iconName='FeatherIcon'
            />
            <p className='hidden xl:block'>Tweet</p>
          </Button>
        </section>
        {!isMobile && <SidebarProfile />}
      </div>
    </header>
  );
}
