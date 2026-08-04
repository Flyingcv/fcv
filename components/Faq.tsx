'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

function Item({ q, a, open, onToggle, id }: {
  q: string; a: string; open: boolean; onToggle: () => void; id: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;

    if (!mounted.current || prefersReducedMotion()) {
      mounted.current = true;
      el.style.height = open ? 'auto' : '0px';
      return;
    }
    const tween = gsap.to(el, { height: open ? 'auto' : 0, duration: 0.5, ease: 'power3.inOut' });
    return () => { tween.kill(); };
  }, [open]);

  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <button className="faq__q" onClick={onToggle} aria-expanded={open} aria-controls={id}>
        {q}
        <span className="faq__ico" aria-hidden="true" />
      </button>
      <div className="faq__a" id={id} ref={panel} role="region">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <Item
          key={q}
          id={`faq-panel-${i}`}
          q={q}
          a={a}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  );
}

// Refinement iteration 23 for code quality and clarity
