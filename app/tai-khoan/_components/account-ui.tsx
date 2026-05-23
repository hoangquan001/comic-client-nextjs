import Link from 'next/link';

export type IconName = 'user' | 'heart' | 'clock' | 'chart' | 'trophy' | 'target' | 'package' | 'file' | 'lock' | 'calendar' | 'camera' | 'save' | 'edit' | 'check' | 'alert' | 'search';

export function AccountIcon({ name, className = 'w-6 h-6' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {name === 'user' && (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      )}
      {name === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />}
      {name === 'clock' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </>
      )}
      {name === 'chart' && (
        <>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </>
      )}
      {name === 'trophy' && (
        <>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
        </>
      )}
      {name === 'target' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </>
      )}
      {name === 'package' && <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8z" />}
      {name === 'file' && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </>
      )}
      {name === 'lock' && (
        <>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
      )}
      {name === 'calendar' && (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      )}
      {name === 'camera' && (
        <>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </>
      )}
      {name === 'save' && (
        <>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17,21 17,13 7,13 7,21" />
          <polyline points="7,3 7,8 15,8" />
        </>
      )}
      {name === 'edit' && (
        <>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </>
      )}
      {name === 'check' && (
        <>
          <path d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="9" />
        </>
      )}
      {name === 'alert' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </>
      )}
    </svg>
  );
}

export function PageHeader({ icon, title, description, iconClassName = 'text-red-500' }: { icon: IconName; title: string; description?: string; iconClassName?: string }) {
  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-3 text-2xl font-bold text-neutral-900 dark:text-light-text">
        <AccountIcon name={icon} className={`w-8 h-8 ${iconClassName}`} />
        {title}
      </h2>
      {description && <p className="text-neutral-600 dark:text-neutral-400">{description}</p>}
    </div>
  );
}

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-xl transition-all duration-200 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800/95 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ icon, title, description, actionHref, actionLabel, actionIcon = 'search' }: { icon: IconName; title: string; description: string; actionHref?: string; actionLabel?: string; actionIcon?: IconName }) {
  return (
    <GlassCard className="p-12">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <AccountIcon name={icon} className="h-24 w-24 text-neutral-300 dark:text-neutral-600 [stroke-width:1]" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-light-text">{title}</h3>
        <p className="mx-auto max-w-md leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
        {actionHref && actionLabel && (
          <Link href={actionHref} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-lime-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500/50">
            <AccountIcon name={actionIcon} className="h-5 w-5" />
            {actionLabel}
          </Link>
        )}
      </div>
    </GlassCard>
  );
}

export function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-sky-500" />
      <p className="text-neutral-600 dark:text-neutral-400">{text}</p>
    </div>
  );
}
