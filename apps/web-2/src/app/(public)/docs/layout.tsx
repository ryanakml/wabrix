import { DocsSidebarNav } from '@/components/public/docs-sidebar-nav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 pb-24 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-6xl pt-36'>
        <div className='mb-8 lg:hidden'>
          <DocsSidebarNav mobile />
        </div>
        <div className='grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]'>
          <aside className='hidden lg:block'>
            <div className='sticky top-28'>
              <DocsSidebarNav />
            </div>
          </aside>
          <div>
            <p className='mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900'>
              Portfolio documentation for a live demo. This is not a commercial support offering.
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
