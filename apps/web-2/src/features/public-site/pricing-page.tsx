import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/app/siteConfig';

export function PricingPageView() {
  return (
    <div className='px-4 pb-24 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-6xl flex-col gap-10 pt-40'>
        <header className='max-w-3xl space-y-4'>
          <p className='text-sm font-semibold tracking-[0.24em] text-violet-600 uppercase'>
            Pricing
          </p>
          <h1 className='text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl'>
            Demo only, no billing.
          </h1>
          <p className='text-lg leading-8 text-gray-600'>
            Wabrix is a personal portfolio project and live demo. It has no
            commercial plans, no customers, and no payment processing on this
            site. Nothing on this page is an offer, and no payment details will
            be collected.
          </p>
        </header>

        <section className='grid gap-4 md:grid-cols-2'>
          <Card className='border-gray-200 bg-white'>
            <CardHeader>
              <CardTitle className='text-xl text-gray-900'>
                What this demo includes
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3 text-base leading-7 text-gray-600'>
              <p>
                Sign in to explore the dashboard, shared inbox, bot
                configuration, knowledge base, and WhatsApp integration screens.
              </p>
              <p>
                The repository also contains billing integration code for
                demonstration. The hosted demo is not configured to charge
                anyone.
              </p>
            </CardContent>
          </Card>

          <Card className='border-gray-200 bg-white'>
            <CardHeader>
              <CardTitle className='text-xl text-gray-900'>
                Where to go next
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-wrap gap-3'>
                <Button asChild>
                  <Link href='/auth/sign-in'>Open the demo</Link>
                </Button>
                <Button asChild variant='secondary'>
                  <Link href='/docs/setup'>Read setup docs</Link>
                </Button>
              </div>
              <p className='text-sm leading-6 text-gray-500'>
                Source code:{' '}
                <a
                  href={siteConfig.repositories.current}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900'
                >
                  github.com/ryanakml/wabrix
                </a>
                . The Express and PostgreSQL re-architecture is at{' '}
                <a
                  href={siteConfig.repositories.rearchitecture}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900'
                >
                  github.com/ryanakml/wabrix-ai
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
