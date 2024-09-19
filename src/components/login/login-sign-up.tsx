import { Button } from '@components/ui/button';
import { CustomIcon } from '@components/ui/custom-icon';
import { useAuth } from '@lib/context/auth-context';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

type TLoginSingUp = {
  isModalOpen: boolean;
  onCloseModal: (value: boolean) => void;
  title?: string;
  googleProviderTitle?: string;
};

export function LoginSingUp({
  isModalOpen,
  onCloseModal,
  title,
  googleProviderTitle
}: TLoginSingUp): JSX.Element {
  const { signUpWithEmail, signInWithGoogle, error } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmShowPassword, setConfirmShowPassword] =
    useState<boolean>(false);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length <= 5) {
      toast.error('The password must at least have 6 characters.');
      return;
    }

    if (password != confirmPassword) {
      toast.error('The passwords do not match.');
      return;
    }

    void signUpWithEmail(email, password);

    if (error?.message.split('(')[1] === 'auth/email-already-in-use).') {
      toast.error('The email is already in use.');
      return;
    }

    setPassword('');
    setEmail('');
  };

  return isModalOpen ? (
    <div
      className='fixed top-0 left-0 right-0 bottom-0 z-[1000] flex items-center justify-center bg-[#0000007f]'
      onClick={() => onCloseModal(false)}
    >
      <div
        className='relative flex min-w-[550px] flex-col items-center justify-center rounded-lg bg-light-primary py-4 px-12'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex max-w-[364px] flex-col gap-4'>
          <div className='relative flex items-center justify-center'>
            <Image
              src='/logo512.png'
              width={64}
              height={64}
              alt='Twitter logo'
            />
          </div>

          <h2 className='font-twitter-chirp-extended text-3xl'>{title}</h2>

          <div className='grid gap-3 font-bold'>
            <Button
              className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                         hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                         dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
              onClick={signInWithGoogle}
            >
              <CustomIcon iconName='GoogleIcon' /> {googleProviderTitle} com
              Google
            </Button>

            {/* <Button
              className='flex cursor-not-allowed justify-center gap-2 border border-light-line-reply font-bold text-light-primary
                         transition hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0
                         dark:bg-white dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
            >
              <CustomIcon iconName='AppleIcon' /> Inscreva-se com Apple
            </Button> */}

            <div className='flex items-center justify-center'>
              <hr className='mr-3 mt-1 w-full border-gray-500/20' />
              <span>ou</span>
              <hr className='ml-3 mt-1 w-full border-gray-500/20' />
            </div>
          </div>

          <form onSubmit={handleSignUp} className='flex flex-col gap-2'>
            <input
              className='rounded-md border border-gray-500/20 bg-transparent p-4'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
              required
            />

            <div className='relative flex w-full items-center justify-between'>
              <input
                className='w-full rounded-md border border-gray-500/20 bg-transparent p-4'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
              />

              {showPassword ? (
                <div
                  className='absolute right-4'
                  onClick={() => setShowPassword(false)}
                >
                  <CustomIcon
                    iconName='EyeOff'
                    className='h-4 w-auto cursor-pointer'
                  />
                </div>
              ) : (
                <div
                  className='absolute right-4'
                  onClick={() => setShowPassword(true)}
                >
                  <CustomIcon
                    iconName='EyeOn'
                    className='h-4 w-auto cursor-pointer'
                  />
                </div>
              )}
            </div>

            <div className='relative flex w-full items-center justify-between'>
              <input
                className='w-full rounded-md border border-gray-500/20 bg-transparent p-4'
                type={confirmShowPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm password'
                required
              />

              {confirmShowPassword ? (
                <div
                  className='absolute right-4'
                  onClick={() => setConfirmShowPassword(false)}
                >
                  <CustomIcon
                    iconName='EyeOff'
                    className='h-4 w-auto cursor-pointer'
                  />
                </div>
              ) : (
                <div
                  className='absolute right-4'
                  onClick={() => setConfirmShowPassword(true)}
                >
                  <CustomIcon
                    iconName='EyeOn'
                    className='h-4 w-auto cursor-pointer'
                  />
                </div>
              )}
            </div>

            <Button
              type='submit'
              className='border border-light-line-reply bg-[#EF2182] font-bold text-[#FFF] hover:bg-[#EF2182]/10
                         focus-visible:bg-[#EF2182]/10 focus-visible:!ring-[#EF2182]/80 active:bg-[#EF2182]/20
                         dark:border-light-secondary'
            >
              Entrar
            </Button>
          </form>

          <button onClick={() => onCloseModal(false)}>Fechar</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
