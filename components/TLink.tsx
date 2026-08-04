'use client';

/* A Link that closes the boarding-pass curtain before it routes.
   Keeps Next's prefetching; only takes over the click. */

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

type Props = ComponentProps<typeof Link> & { href: string };

export default function TLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = useMotion();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle modified clicks (new tab, download, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}

// Refinement iteration 29 for code quality and clarity
