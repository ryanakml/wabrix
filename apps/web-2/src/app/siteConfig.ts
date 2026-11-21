export const siteConfig = {
  name: 'Wabrix',
  url: 'https://wabrix.nylo.me',
  description:
    'Wabrix is a personal portfolio project and live demo of a WhatsApp-first AI customer communication platform.',
  ogImage: '/images/wabrix_cta_landscape.png',
  demoVideo: {
    url:
      process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ||
      'https://wabrix-media.wabrix-ingress-staging.workers.dev/wabrix-demo.mp4',
    poster: '/images/wabrix_cta_landscape.png',
    duration: '0:45',
  },
  baseLinks: {
    home: '/',
    docs: '/docs',
    setup: '/docs/setup',
    pricing: '/pricing',
    security: '/security',
    privacy: '/privacy-policy',
    terms: '/terms-of-service',
    about: '/about'
  },
  repositories: {
    current: 'https://github.com/ryanakml/wabrix',
    rearchitecture: 'https://github.com/ryanakml/wabrix-ai'
  }
} as const;
