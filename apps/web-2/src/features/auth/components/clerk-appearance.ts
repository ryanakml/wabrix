import { dark, shadcn } from '@clerk/themes';

const sharedClerkVariables = {
  colorPrimary: '#7c3aed',
  colorPrimaryForeground: '#ffffff',
  colorForeground: 'var(--foreground)',
  colorBackground: 'var(--card)',
  colorInput: 'var(--border)',
  colorInputForeground: 'var(--foreground)',
  colorMuted: 'var(--muted)',
  colorMutedForeground: 'var(--muted-foreground)',
  colorNeutral: 'var(--foreground)',
  colorDanger: 'var(--destructive)',
  colorRing: '#7c3aed',
  colorInputBackground: 'var(--background)',
  colorInputText: 'var(--foreground)',
  borderRadius: 'calc(var(--radius) * 1)',
  fontFamily: 'var(--font-sans)'
} as const;

const sharedClerkElements = {
  rootBox: 'w-full',
  cardBox: 'w-full shadow-none',
  card: 'w-full rounded-2xl border border-border bg-card/95 shadow-xs p-6 sm:p-8',
  header: 'text-foreground',
  headerTitle: 'text-foreground font-semibold text-xl',
  headerSubtitle: 'text-muted-foreground text-sm',
  main: 'text-foreground',
  form: 'text-foreground',
  formFieldLabel: 'text-foreground text-sm font-medium',
  formFieldHintText: 'text-muted-foreground text-xs',
  formFieldErrorText: 'text-destructive text-xs',
  formFieldInput:
    'border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:border-violet-500 rounded-lg h-10 px-3.5 transition-colors text-sm',
  formButtonPrimary:
    'bg-violet-600 text-white font-medium shadow-xs hover:bg-violet-700 active:scale-[0.99] transition-all rounded-lg h-10 text-sm',
  socialButtonsBlockButton:
    'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-foreground rounded-lg transition-colors [&_*]:!text-foreground [&_*]:opacity-100',
  socialButtonsBlockButtonText: '!text-foreground !opacity-100 font-medium text-sm',
  socialButtonsIconButton:
    'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-foreground rounded-lg transition-colors',
  socialButtonsProviderIcon: 'opacity-100',
  socialButtonsBlockButtonArrow: '!text-muted-foreground opacity-100',
  providerIcon__apple: 'invert-0 dark:invert-0',
  providerIcon__github: 'invert-0 dark:invert-0',
  providerIcon__okx_wallet: 'invert-0 dark:invert-0',
  providerIcon__vercel: 'invert-0 dark:invert-0',
  dividerLine: 'bg-border',
  dividerText: 'text-muted-foreground text-xs uppercase tracking-wider',
  footerActionText: 'text-muted-foreground text-sm',
  footerActionLink: 'text-violet-600 hover:text-violet-700 font-medium transition-colors',
  formHeaderTitle: 'text-foreground font-semibold',
  formHeaderSubtitle: 'text-muted-foreground text-sm',
  formFieldSuccessText: 'text-emerald-600 dark:text-emerald-400 text-xs',
  identityPreviewText: 'text-foreground text-sm',
  identityPreviewEditButton: 'text-violet-600 hover:text-violet-700 font-medium text-sm',
  formResendCodeLink: 'text-violet-600 hover:text-violet-700 font-medium text-sm',
  otpCodeFieldInput:
    'border border-border bg-background text-foreground shadow-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:border-violet-500 rounded-lg',
  otpCodeFieldInputText: 'text-foreground',
  alert: 'border border-border bg-muted/50 text-foreground rounded-lg',
  alertText: 'text-foreground text-sm',
  formFieldWarningText: 'text-amber-600 dark:text-amber-400 text-xs',
  navbar: 'border border-border bg-card text-foreground',
  navbarButton: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  pageScrollBox: 'bg-background text-foreground',
  page: 'bg-background text-foreground',
  pageContent: 'text-foreground',
  profileSectionTitleText: 'text-foreground',
  profileSectionContent: 'text-foreground',
  profileSectionPrimaryButton: 'bg-violet-600 text-white hover:bg-violet-700 font-medium rounded-lg',
  profileSectionSecondaryButton: 'border border-border bg-background text-foreground hover:bg-accent rounded-lg',
  formFieldAction: 'text-violet-600 hover:text-violet-700 font-medium',
  badge: 'border border-border bg-muted text-muted-foreground',
  accordionTriggerButton:
    'text-foreground hover:bg-accent hover:text-accent-foreground rounded-md',
  accordionContent: 'text-foreground',
  menuButton: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  menuList: 'border border-border bg-popover text-popover-foreground rounded-lg shadow-md',
  menuItem: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  previewTextContainer: 'text-foreground',
  previewMainIdentifier: 'text-foreground',
  previewSecondaryIdentifier: 'text-muted-foreground',
  userButtonPopoverCard: 'border border-border bg-popover text-popover-foreground rounded-xl shadow-lg',
  userPreviewMainIdentifier: 'text-foreground',
  userPreviewSecondaryIdentifier: 'text-muted-foreground'
} as const;

export function getClerkAppearance(theme: 'dark' | 'light') {
  return {
    baseTheme: theme === 'dark' ? [shadcn, dark] : shadcn,
    variables: sharedClerkVariables,
    elements: sharedClerkElements,
    layout: {
      socialButtonsVariant: 'blockButton'
    }
  } as const;
}
