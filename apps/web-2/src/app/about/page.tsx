import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/app/siteConfig';
import { WabrixLogo } from '@/components/landing-page/WabrixLogo';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Wabrix is a personal portfolio project and live demo, not a commercial product.'
};

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-10 flex items-center justify-between'>
          <Link href='/' aria-label='Wabrix home'>
            <WabrixLogo className='w-40' />
          </Link>
          <Link
            href='/'
            className='text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
          >
            Back to home
          </Link>
        </div>

        <div className='mb-10 space-y-4'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            About Wabrix
          </h1>
          <p className='text-lg leading-8 text-gray-600'>
            Wabrix is a personal portfolio project and live demo of a
            WhatsApp-first AI customer communication platform. It is not a
            commercial product, has no external customers, and is not offered
            for sale.
          </p>
        </div>

        <div className='space-y-6'>
          <section className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
            <h2 className='mb-3 text-xl font-semibold text-gray-900'>
              Two implementations
            </h2>
            <div className='space-y-4 text-base leading-7 text-gray-600'>
              <p>
                This repository is the version behind the hosted demo at{' '}
                <a
                  href={siteConfig.url}
                  className='font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
                >
                  wabrix.nylo.me
                </a>
                . It uses Next.js, Convex, Clerk, and Cloudflare Workers with
                Hono.
              </p>
              <p>
                <a
                  href={siteConfig.repositories.rearchitecture}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
                >
                  wabrix-ai
                </a>{' '}
                is a re-architecture of the same product on Express 5,
                PostgreSQL, and React with Vite, including a transactional
                outbox. It runs locally with <code>make compose-up</code>. The
                hosted demo does not run that codebase.
              </p>
            </div>
          </section>

          <section className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
            <h2 className='mb-3 text-xl font-semibold text-gray-900'>
              What the demo includes
            </h2>
            <ul className='list-disc space-y-2 pl-5 text-base leading-7 text-gray-600'>
              <li>Sign-in with Clerk and organization-scoped workspaces.</li>
              <li>
                A shared inbox with assignments, notes, bot pause and resume,
                and human handoff.
              </li>
              <li>
                Bot configuration and knowledge sources used to ground replies.
              </li>
              <li>
                WhatsApp integration screens for credentials, webhooks, and
                message templates.
              </li>
              <li>
                Public documentation for setup and WhatsApp operations.
              </li>
            </ul>
          </section>

          <section className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
            <h2 className='mb-3 text-xl font-semibold text-gray-900'>
              Source and links
            </h2>
            <ul className='space-y-2 text-base leading-7 text-gray-600'>
              <li>
                Source code:{' '}
                <a
                  href={siteConfig.repositories.current}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
                >
                  github.com/ryanakml/wabrix
                </a>
              </li>
              <li>
                Re-architecture:{' '}
                <a
                  href={siteConfig.repositories.rearchitecture}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
                >
                  github.com/ryanakml/wabrix-ai
                </a>
              </li>
              <li>
                Documentation:{' '}
                <Link
                  href='/docs'
                  className='font-medium text-gray-800 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
                >
                  wabrix.nylo.me/docs
                </Link>
              </li>
            </ul>
          </section>

          <p className='text-sm leading-6 text-gray-500'>
            No payments are collected on this site. If you sign in, account and
            workspace data is handled by the services described in the{' '}
            <Link
              href='/privacy-policy'
              className='font-medium text-gray-700 underline decoration-gray-300 underline-offset-4 hover:text-gray-900'
            >
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
