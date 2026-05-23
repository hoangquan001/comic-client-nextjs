import Link from 'next/link';
import { config } from '@/lib/config';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  style?: 'default' | 'transparent';
}

function toAbsoluteUrl(href?: string) {
  if (!href) return undefined;

  try {
    return new URL(href, config.BASE_URL).toString();
  } catch {
    return undefined;
  }
}



export function Breadcrumb({ items, style = 'default', }: BreadcrumbProps) {
  const isTransparent = style === 'transparent';

  const containerClassName = isTransparent
    ? 'border-transparent bg-transparent shadow-none dark:border-transparent dark:bg-transparent'
    : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800';

  const linkClassName = isTransparent
    ? 'text-neutral-100 hover:bg-white/20 dark:hover:bg-black/20'
    : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-100 dark:text-neutral-200 dark:hover:bg-neutral-700';

  const currentClassName = isTransparent
    ? 'bg-primary-100/20 text-white dark:bg-primary-100/10'
    : 'bg-primary-100/10 text-primary-100 dark:bg-primary-100/20 dark:text-primary-100';

  const dividerClassName = isTransparent
    ? 'text-white'
    : 'text-neutral-400 dark:text-neutral-200';

  if (items.length === 0) return null;

  return (
    <>

      <nav
        aria-label="Breadcrumb navigation"
        className={`w-full overflow-hidden rounded-lg border text-sm ${containerClassName}`}
      >
        <div className="flex items-center gap-3 p-1.5">
          <ol
            className="flex min-w-0 flex-1 items-center gap-1"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {items.map((item, index) => {
              const isCurrent = index === items.length - 1;
              const itemKey = `${item.href ?? item.label}-${index}`;

              return (
                <li
                  key={itemKey}
                  className={`flex min-w-0 items-center md:gap-2 ${isCurrent ? 'text-primary-100' : ''}`}
                  itemProp="itemListElement"
                  itemScope
                  itemType="https://schema.org/ListItem"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      title={item.label}
                      itemProp="item"
                      className={`inline-flex min-w-0 items-center rounded-md px-1 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-100/50 md:px-2 ${isCurrent ? currentClassName : linkClassName}`}
                    >
                      <span
                        itemProp="name"
                        className={isCurrent ? 'line-clamp-1 truncate font-bold' : 'truncate max-w-36 sm:max-w-48 md:max-w-none'}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <span
                      itemProp="name"
                      title={item.label}
                      className={`line-clamp-1 truncate rounded-md px-2 py-1 text-sm font-bold ${currentClassName}`}
                    >
                      {item.label}
                    </span>
                  )}
                  <meta itemProp="position" content={String(index + 1)} />
                  {!isCurrent && (
                    <span className="flex items-center justify-center" aria-hidden="true">
                      <svg
                        className={`h-4 w-4 ${dividerClassName}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
