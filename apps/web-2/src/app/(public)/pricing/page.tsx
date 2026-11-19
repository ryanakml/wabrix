import { PricingPageView } from '@/features/public-site/pricing-page';
import { createPageMetadata } from '@/lib/metadata';

export const metadata = createPageMetadata({
  title: 'Pricing',
  description: 'Wabrix is a portfolio project and live demo. No commercial plans, billing, or payments are offered.',
  path: '/pricing'
});

export default function PricingPage() {
  return <PricingPageView />;
}
