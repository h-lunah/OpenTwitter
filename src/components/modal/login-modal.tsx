import { Dialog } from '@headlessui/react';
import { useAuth } from '@lib/context/auth-context';
import { CustomIcon } from '@components/ui/custom-icon';
import { Button } from '@components/ui/button';

type LoginModalProps = {
  open: boolean;
  closeModal: () => void;
};

export function LoginModal({ open, closeModal }: LoginModalProps): JSX.Element {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async (): Promise<void> => {
    await signInWithGoogle();
    closeModal();
  };

  return (
    <Dialog open={open} onClose={closeModal} className='relative z-50'>
      <div className='fixed inset-0 bg-black/40' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-sm rounded-2xl bg-main-background p-8'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <i className='mx-auto'>
                <CustomIcon
                  className='h-10 w-10 text-accent-blue dark:text-twitter-icon'
                  iconName='TwitterIcon'
                />
              </i>
              <div className='flex flex-col gap-2 text-center'>
                <Dialog.Title className='text-2xl font-bold'>
                  Sign in required
                </Dialog.Title>
                <Dialog.Description className='text-light-secondary dark:text-dark-secondary'>
                  You need to be signed in to perform this action
                </Dialog.Description>
              </div>
            </div>
            <div className='flex flex-col gap-3 inner:py-2 inner:font-bold'>
              <Button
                className='bg-accent-blue text-white hover:bg-accent-blue/90 active:bg-accent-blue/75'
                onClick={handleSignIn}
              >
                Sign in with Google
              </Button>
              <Button
                className='border border-light-line-reply hover:bg-light-primary/10 focus-visible:bg-light-primary/10 
                           active:bg-light-primary/20 dark:border-light-secondary dark:text-light-border 
                           dark:hover:bg-light-border/10 dark:focus-visible:bg-light-border/10 
                           dark:active:bg-light-border/20'
                onClick={closeModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
