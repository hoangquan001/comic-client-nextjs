import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm py-2">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-400">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-primary-100 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
