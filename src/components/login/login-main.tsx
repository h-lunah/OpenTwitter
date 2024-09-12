import { Button } from '@components/ui/button';
import { CustomIcon } from '@components/ui/custom-icon';
import { NextImage } from '@components/ui/next-image';
import { useAuth } from '@lib/context/auth-context';
import Image from 'next/image';
import { useState } from 'react';
import { LoginSingIn } from './login-sign-in';
import { LoginSingUp } from './login-sign-up';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const handleCloseSignIn = () => setIsSignInOpen(!isSignInOpen);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const handleCloseSignUp = () => setIsSignUpOpen(!isSignUpOpen);

  return (
    <main className='grid lg:grid-cols-[1fr,45vw]'>
      <div className='relative hidden items-center justify-center  lg:flex'>
        <NextImage
          imgClassName='object-cover'
          blurClassName='bg-accent-blue'
          src='/assets/twitter-banner.png'
          alt='Twitter banner'
          layout='fill'
          useSkeleton
        />
      </div>
      <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
        <i className='mb-0 self-center lg:mb-10 lg:self-auto'>
          <CustomIcon
            className='-mt-4 h-6 w-6 text-accent-blue lg:h-12 lg:w-12 dark:lg:text-twitter-icon'
            iconName='TwitterIcon'
          />
        </i>
        <div className='flex max-w-xs flex-col gap-4 font-twitter-chirp-extended lg:max-w-none lg:gap-16'>
          <h1
            className='text-3xl before:content-["See_what’s_happening_in_the_world_right_now."] 
                       lg:text-6xl lg:before:content-["Happening_now"]'
          />
          <h2 className='hidden text-xl lg:block lg:text-3xl'>
            Join Twitter today.
          </h2>
        </div>
        <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
          <div className='grid gap-3 font-bold'>
            <Button
              className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                         hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                         dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
              onClick={signInWithGoogle}
            >
              <CustomIcon iconName='GoogleIcon' /> Sign up with Google
            </Button>

            <Button
              className='flex  justify-center gap-2 border border-light-line-reply font-bold text-light-primary
                         transition hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0
                         dark:bg-white dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
            >
              <CustomIcon iconName='AppleIcon' /> Sign up with Apple
            </Button>

            <Button
              onClick={() => setIsSignUpOpen(true)}
              className='border border-light-line-reply bg-[#EF2182] font-bold text-[#FFF] hover:bg-[#EF2182]/10
                         focus-visible:bg-[#EF2182]/10 focus-visible:!ring-[#EF2182]/80 active:bg-[#EF2182]/20
                         dark:border-light-secondary'
            >
              Sign up with phone or email
            </Button>

            <p
              className='inner:custom-underline inner:custom-underline text-center text-xs
                         text-light-secondary inner:text-[#EF2182] dark:text-dark-secondary'
            >
              By signing up, you agree to the{' '}
              <a
                href='/rules-and-policies/terms'
                target='_blank'
                rel='noreferrer'
              >
                Terms of Service
              </a>{' '}
              e{' '}
              <a
                href='/rules-and-policies/policy'
                target='_blank'
                rel='noreferrer'
              >
                Privacy Policy
              </a>
              , incluindo{' '}
              <a
                href='/rules-and-policies/cookies'
                target='_blank'
                rel='noreferrer'
              >
                Cookie Use
              </a>
              .
            </p>
          </div>

          <div className='flex flex-col gap-3'>
            <p className='font-bold'>Already have an account?</p>
            <Button
              className='border border-light-line-reply font-bold text-[#EF2182] hover:bg-[#EF2182]/10
                         focus-visible:bg-[#EF2182]/10 focus-visible:!ring-[#EF2182]/80 active:bg-[#EF2182]/20
                         dark:border-light-secondary'
              onClick={() => setIsSignInOpen(true)}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>

      <LoginSingIn
        title='Sign in to Twitter'
        googleProviderTitle='Sign in'
        isModalOpen={isSignInOpen}
        onCloseModal={handleCloseSignIn}
      />

      <LoginSingUp
        title='Cadastre-se no Fofoca.me'
        googleProviderTitle='Inscreva-se'
        isModalOpen={isSignUpOpen}
        onCloseModal={handleCloseSignUp}
      />
    </main>
  );
}
