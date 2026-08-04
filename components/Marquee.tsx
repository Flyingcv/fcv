'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';

interface Props {
  items: string[];
  /** pixels per second */
  speed?: number;
  dir?: 'left' | 'right';
}

export default function Marquee({ items, speed = 90, dir = 'left' }: Props) {
  const inner = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = inner.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const width = el.scrollWidth / 2;
      const duration = Math.max(width / speed, 8);

      const tween = dir === 'left'
        ? gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration, ease: 'none', repeat: -1 })
        : gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, duration, ease: 'none', repeat: -1 });

      // Scroll velocity briefly speeds the ticker up — a small, satisfying detail
      ScrollTrigger.create({
        trigger: wrap.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 2400, 2.4);
          gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: 'auto' });
          gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.35, overwrite: false });
        }
      });
    }, wrap);

    return () => ctx.revert();
  }, [speed, dir]);

  const track = (
    <div className="marquee__track">
      {items.map((t, i) => (
        <span className="marquee__item" key={i}>
          {t.startsWith('*') ? <em>{t.slice(1)}</em> : t}
          <span className="marquee__dot">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" ref={wrap} aria-hidden="true">
      <div className="marquee__inner" ref={inner}>
        {track}
        {track}
      </div>
    </div>
  );
}

// Refinement iteration 25 for code quality and clarity
