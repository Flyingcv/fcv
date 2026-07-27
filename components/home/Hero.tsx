'use client';

import { useRef } from 'react';
import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import SplitText from '@/components/SplitText';
import { Plane, ArrowRight } from '@/components/icons';
import { useMotion } from '@/components/motion/MotionProvider';
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';
import { img } from '@/lib/data';

const HERO_IMG = img('1528181304800-259b08848526', 2400);

export default function Hero() {
  const { revealed } = useMotion();
  const root = useRef<HTMLElement>(null);
  const played = useRef(false);

  useIsoLayoutEffect(() => {
    if (!revealed || played.current) return;
    const el = root.current;
    if (!el) return;
    played.current = true;

    const title = el.querySelector<HTMLElement>('[data-hero-title]');
    const items = el.querySelectorAll<HTMLElement>('[data-hero-item]');
    const bg = el.querySelector<HTMLElement>('[data-hero-bg] img');
    const arc = el.querySelector<SVGPathElement>('[data-arc]');
    const mark = el.querySelector<HTMLElement>('[data-arc-plane]');

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      if (bg) {
        tl.fromTo(bg,
          { scale: 1.24, opacity: 0 },
          { scale: 1.06, opacity: 1, duration: 2.2, ease: 'power2.out' }, 0);
      }

      if (title) {
        const words = title.querySelectorAll<HTMLElement>('.w > i');
        gsap.set(words, { yPercent: 110 });
        tl.to(words, { yPercent: 0, duration: 1.35, stagger: 0.06 }, 0.15);
      }

      if (items.length) {
        tl.fromTo(items,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, stagger: 0.09 }, 0.5);
      }

      // Draw the flight path, then leave it as a dotted route line
      if (arc) {
        const len = arc.getTotalLength();
        gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(arc, {
          strokeDashoffset: 0,
          duration: 2.1,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(arc, { strokeDasharray: '6 9', strokeDashoffset: 0 })
        }, 0.35);
      }

      if (mark) {
        tl.fromTo(mark,
          { opacity: 0, scale: 0.4, rotate: 10 },
          { opacity: 1, scale: 1, rotate: 32, duration: 0.9, ease: 'back.out(1.7)' }, 1.5);
        gsap.to(mark, { y: -16, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.4 });
      }
    }, el);

    return () => ctx.revert();
  }, [revealed]);

  return (
    <section className="hero" data-hero ref={root}>
      <div className="hero__bg" data-hero-bg>
        <Photo src={HERO_IMG} alt="Limestone islands rising out of Halong Bay at golden hour" priority />
      </div>

      <svg className="hero__arc" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path data-arc d="M-80 800 C 280 620, 500 690, 745 500 S 1180 210, 1540 110" />
        <circle cx="745" cy="500" r="5" />
      </svg>

      <span className="hero__plane-mark" data-arc-plane aria-hidden="true">
        <Plane />
      </span>

      <div className="hero__inner" data-hero-inner>
        <div className="hero__eyebrow" data-hero-item>
          <span className="tag tag--light">Boarding pass to Southeast Asia</span>
          <span>EST. 2014 · NOIDA, INDIA</span>
        </div>

        <SplitText as="h1" className="hero__title" data-hero-title="">
          Southeast<br />Asia in full<br /><em>colours</em>
        </SplitText>

        <div className="hero__foot">
          <div data-hero-item>
            <p className="hero__blurb">
              Vietnam, Bali, Thailand and Malaysia — planned end to end by people who
              have walked the itineraries themselves. One desk, one number, zero surprises.
            </p>
            <div className="hero__actions mt-2">
              <TLink href="/destinations" className="btn btn--gold" data-magnetic="0.3">
                Explore destinations
                <ArrowRight className="btn__icon" />
              </TLink>
              <TLink href="/services#configurator" className="btn btn--ghost" data-magnetic="0.3">
                Build my price
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>
          </div>

          <div data-hero-item style={{ display: 'grid', gap: '1.4rem', justifyItems: 'end' }}>
            <div className="hero__ticker">
              <span><i className="dotlive" />NOW BOARDING</span>
              <span>SGN <b>₹42,999</b></span>
              <span>DPS <b>₹48,999</b></span>
              <span>BKK <b>₹34,999</b></span>
            </div>
            <span className="scroll-cue">Scroll <i /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
