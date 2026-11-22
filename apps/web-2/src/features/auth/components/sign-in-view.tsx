import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AuthLegalLinks } from './auth-legal-links';
import { InteractiveGridPattern } from './interactive-grid';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to Wabrix and continue managing WhatsApp conversations and automations.'
};

export default function SignInViewPage() {
  return (
    <div className='relative flex min-h-dvh flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:px-0'>
      <Link
        href='/auth/sign-up'
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'absolute top-4 right-4 z-20 sm:top-6 sm:right-6 md:top-8 md:right-8 text-sm font-medium'
        )}
      >
        Sign up
      </Link>
      <div className='relative hidden h-full flex-col justify-between overflow-hidden border-r border-zinc-800 bg-zinc-950 p-10 text-zinc-100 lg:flex'>
        <div className='relative z-20 flex items-center justify-between'>
          <Link href='/' className='inline-flex items-center gap-2 transition-opacity hover:opacity-90'>
            <Image
              src='/logo.png'
              alt='Wabrix logo'
              width={120}
              height={40}
              className='h-auto w-32'
              priority
            />
          </Link>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 font-mono text-xs font-medium text-violet-300'>
            <span className='size-1.5 rounded-full bg-violet-400' />
            WhatsApp Platform
          </span>
        </div>
        <InteractiveGridPattern
          className={cn(
            '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)] [-webkit-mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-0 h-full opacity-40 skew-y-12'
          )}
          squaresClassName='stroke-zinc-800 hover:fill-violet-500/20'
        />
        <div className='relative z-20 space-y-4'>
          <blockquote className='space-y-2'>
            <p className='text-lg leading-relaxed font-normal text-zinc-200'>
              "Keep WhatsApp conversations context-aware and ready for the next reply window
              without losing operational control."
            </p>
            <footer className='flex items-center gap-2 text-xs text-zinc-400'>
              <span className='font-medium text-zinc-300'>Shared Inbox & Automation</span>
              <span>&middot;</span>
              <span>Wabrix portfolio demo</span>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full w-full items-center justify-center p-6 sm:p-8 lg:p-12'>
        <div className='flex w-full max-w-sm sm:max-w-md flex-col items-center justify-center space-y-6'>
          <div className='flex flex-col items-center text-center lg:hidden'>
            <Link href='/' className='mb-2 inline-flex items-center gap-2'>
              <Image
                src='/logo.png'
                alt='Wabrix logo'
                width={120}
                height={40}
                className='h-auto w-28'
                priority
              />
            </Link>
            <p className='text-xs text-muted-foreground'>WhatsApp AI Platform Demo</p>
          </div>
          <ClerkSignInForm
            initialValues={{
              emailAddress: 'your_mail+clerk_test@example.com'
            }}
            signUpUrl='/auth/sign-up'
          />
          <div className='text-muted-foreground space-y-1 px-4 text-center text-xs leading-5'>
            <p>
              Sign in to access your shared inbox, bot configuration, knowledge base, and WhatsApp
              integration settings.
            </p>
          </div>
          <AuthLegalLinks />
        </div>
      </div>
    </div>
  );
}
