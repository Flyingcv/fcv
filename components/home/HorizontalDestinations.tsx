'use client';

/* A pinned section that turns vertical scroll into horizontal travel.
   On phones the pin is dropped and the row becomes a swipeable carousel. */

import { useRef } from 'react';
import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';
import { DESTINATION_LIST, inr } from '@/lib/data';
import { ArrowRight } from '@/components/icons';

/* A few sub-destinations per country so the rail has real depth */
const CARDS = DESTINATION_LIST.flatMap((d) =>
  d.gallery.slice(0, 2).map((image, i) => ({
    slug: d.slug,
    country: d.name,
    iata: d.iata,
    city: d.cities[i] ?? d.cities[0],
    image,
    price: d.fromPrice
  }))
);

export default function HorizontalDestinations() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    /* Held directly rather than inside a gsap.context(): the ScrollTrigger is
       created later, when the media query first matches, which a context does
       not reliably capture. mm.revert() unwinds the pin-spacer and puts this
       section back where React expects it — see the note in lib/gsap.ts. */
    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
      const el = track.current;
      if (!el) return;

      const distance = () => Math.max(el.scrollWidth - window.innerWidth + 80, 1);

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) gsap.set(bar.current, { scaleX: self.progress });
          }
        }
      });

      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hscroll" ref={section}>
      <div className="hscroll__head">
        <div>
          <span className="tag tag--light">The rail · 08 stops</span>
          <SplitText as="h2">Where we fly</SplitText>
        </div>
        <TLink href="/destinations" className="link-u" style={{ color: 'var(--paper-100)' }}>
          Full index <ArrowRight className="btn__icon" />
        </TLink>
      </div>

      <div className="hscroll__viewport">
        <div className="hscroll__track" ref={track}>
          {CARDS.map((c, i) => (
            <TLink
              key={`${c.slug}-${i}`}
              href={`/destinations/${c.slug}`}
              className="hcard"
              data-cursor="Open"
            >
              <Photo src={c.image} alt={`${c.city}, ${c.country}`} />
              <div className="hcard__top">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <b>{c.iata}</b>
              </div>
              <div className="hcard__body">
                <h3>{c.city}</h3>
                <div className="hcard__sub">{c.country}</div>
                <div className="hcard__price">
                  <span>Packages from</span>
                  <b>{inr(c.price)}</b>
                </div>
              </div>
            </TLink>
          ))}
        </div>
      </div>

      <div className="hscroll__progress"><i ref={bar} /></div>
    </section>
  );
}
