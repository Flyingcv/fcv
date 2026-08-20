'use client';


import { useRef } from 'react';
import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';

interface Props {
  images: string[];
  alt: string;
  /** pixels per second */
  speed?: number;
}

/* Auto-scrolling photo rail — same double-track loop technique as
   <Marquee>, just dragging photo tiles instead of text. Pauses on
   hover/focus so a click is still easy to land. */
export default function GlimpseRail({ images, alt, speed = 55 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = inner.current;
    const wrapEl = wrap.current;
    if (!el || !wrapEl || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const width = el.scrollWidth / 2;
      const duration = Math.max(width / speed, 14);
      const tween = gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration, ease: 'none', repeat: -1 });

      const slow = () => gsap.to(tween, { timeScale: 0, duration: 0.5, overwrite: true });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true });
      wrapEl.addEventListener('mouseenter', slow);
      wrapEl.addEventListener('mouseleave', resume);
      wrapEl.addEventListener('focusin', slow);
      wrapEl.addEventListener('focusout', resume);

      // Scroll velocity briefly speeds it up, matching the destinations marquee
      ScrollTrigger.create({
        trigger: wrapEl,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 2400, 2);
          gsap.to(tween, { timeScale: boost, duration: 0.3, overwrite: 'auto' });
          gsap.to(tween, { timeScale: 1, duration: 1.2, delay: 0.35, overwrite: false });
        }
      });

      return () => {
        wrapEl.removeEventListener('mouseenter', slow);
        wrapEl.removeEventListener('mouseleave', resume);
        wrapEl.removeEventListener('focusin', slow);
        wrapEl.removeEventListener('focusout', resume);
      };
    }, wrap);

    return () => ctx.revert();
  }, [speed]);

  const track = (
    <div className="glimpse-rail__track">
      {images.map((src, i) => (
        <TLink href="/about#glimpses" className="glimpse-rail__item" key={src + i}>
          <Photo src={src} alt={alt} />
        </TLink>
      ))}
    </div>
  );

  return (
    <div className="glimpse-rail" ref={wrap}>
      <div className="glimpse-rail__inner" ref={inner}>
        {track}
        {track}
      </div>
    </div>
  );
}
