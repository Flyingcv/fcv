'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/data';

interface Props {
  /** [id, label] for each <h2> in the document, in order */
  sections: [string, string][];
}

/* Sticky "on this page" nav for the legal documents. Highlights whichever
   section is currently in view via IntersectionObserver rather than scroll
   maths, so it stays correct regardless of section height. */
export default function LegalToc({ sections }: Props) {
  const [active, setActive] = useState(sections[0]?.[0] ?? '');

  useEffect(() => {
    const headings = sections
      .map(([id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the topmost heading currently intersecting the trigger band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band just below the sticky nav — a heading is "active" once it
      // reaches the top third of the viewport.
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="legal-toc" aria-label={SITE.ui.legalToc.title}>
      <span className="legal-toc__title">{SITE.ui.legalToc.title}</span>
      <ul>
        {sections.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              aria-current={active === id ? 'true' : undefined}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
