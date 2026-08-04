'use client';

/* Continuously scrolling wall of reviews. Two identical tracks sit side by
   side and the pair slides by exactly -50%, so the loop is seamless without
   measuring anything. Hovering slows it right down so a card can be read. */

import { useRef } from 'react';
import { Star } from '@/components/icons';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';
import { REVIEWS } from '@/lib/data';

export default function Testimonials() {
  const inner = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useIsoLayoutEffect(() => {
    const el = inner.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const distance = el.scrollWidth / 2;
      tween.current = gsap.fromTo(el,
        { xPercent: 0 },
        { xPercent: -50, duration: Math.max(distance / 55, 24), ease: 'none', repeat: -1 });
    }, wrap);

    return () => { tween.current = null; ctx.revert(); };
  }, []);

  const slow = () => tween.current && gsap.to(tween.current, { timeScale: 0.12, duration: 0.5 });
  const resume = () => tween.current && gsap.to(tween.current, { timeScale: 1, duration: 0.6 });

  const track = (aria: boolean) => (
    <div className="tmq__track" aria-hidden={aria ? undefined : true}>
      {REVIEWS.map((r, i) => (
        <article className="quote-card" key={`${r.name}-${i}`}>
          <div className="stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, s) => <Star key={s} />)}
          </div>
          <blockquote>“{r.text}”</blockquote>
          <div className="quote-card__by">
            <b>{r.name}</b>
            <span>{r.meta}</span>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div
      className="tmq"
      ref={wrap}
      onMouseEnter={slow}
      onMouseLeave={resume}
      onFocusCapture={slow}
      onBlurCapture={resume}
    >
      <div className="tmq__inner" ref={inner}>
        {track(true)}
        {track(false)}
      </div>
    </div>
  );
}

// Refinement iteration 31 for code quality and clarity

// Refinement iteration 53 for code quality and clarity
