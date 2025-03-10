import Link from 'next/link';
import cn from 'clsx';
import { preventBubbling } from '@lib/utils';
import { HeroIcon } from '@components/ui/hero-icon';
import type { MobileNavLink } from '@components/modal/mobile-sidebar-modal';

import type { JSX } from 'react';

type MobileSidebarLinkProps = MobileNavLink & {
  bottom?: boolean;
};

export function MobileSidebarLink({
  href,
  bottom,
  linkName,
  iconName,
  disabled
}: MobileSidebarLinkProps): JSX.Element {
  return (
    <Link
      href={href}
      key={href}
      className={cn(
        `custom-button accent-tab accent-bg-tab flex items-center rounded-md font-bold 
           transition hover:bg-light-primary/10 focus-visible:ring-2 first:focus-visible:ring-[#878a8c]
           dark:hover:bg-dark-primary/10 dark:focus-visible:ring-white`,
        bottom ? 'gap-2 p-1.5 text-base' : 'gap-4 p-2 text-xl',
        disabled && ''
      )}
      onClick={disabled ? preventBubbling() : undefined}
    >
      <HeroIcon
        className={bottom ? 'h-5 w-5' : 'h-7 w-7'}
        iconName={iconName}
      />
      {linkName}
    </Link>
  );
}
