import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';

import config from '@/lib/config';

type AutoLinkProps = {
  href: string;
  children: ReactNode;
  className?: string | undefined;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function AutoLink({
  href,
  children,
  className,
  onClick,
}: AutoLinkProps) {
  const parsedUrl = new URL(href, config.siteUrl);
  const isInternal = parsedUrl.origin === config.siteUrl;

  // Handle clicks for both internal and external links
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
  };

  if (isInternal) {
    return (
      <Link
        href={parsedUrl.pathname}
        className={className}
        onClick={onClick ? handleClick : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center ${className ? className : ''}`}
    >
      {children}
      <ExternalLink size={14} className="mt-px ml-1 inline-block" />
    </a>
  );
}
