'use client';

/* Trailing ring + instant dot. Any element with data-cursor="Explore"
   expands the ring and prints that label inside it. Desktop pointers only. */

import { useEffect, useRef, useState } from 'react';
import { gsap, isCoarsePointer, prefersReducedMotion } from '@/lib/gsap';

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('View');

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return;
    const r = ring.current, d = dot.current;
    if (!r || !d) return;

    gsap.set([r, d], { autoAlpha: 0 });

    const xR = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3' });
    const yR = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3' });
    const xD = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' });
    const yD = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) { shown = true; gsap.to([r, d], { autoAlpha: 1, duration: 0.4 }); }
      xR(e.clientX); yR(e.clientY);
      xD(e.clientX); yD(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      if (!t) return;
      document.body.classList.add('cursor-hover');
      setLabel(t.dataset.cursor || 'View');
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-cursor]')) {
        document.body.classList.remove('cursor-hover');
      }
    };
    const onLeave = () => gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
    const onEnter = () => gsap.to([r, d], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={ring} aria-hidden="true">
        <span className="cursor__label">{label}</span>
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
