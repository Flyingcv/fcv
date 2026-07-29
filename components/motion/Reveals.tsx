'use client';

/* ==========================================================================
   Reveals — one declarative scroll-animation engine for the whole site.
   Mark up any element and it animates:
     data-split      word-mask rise for headings / lede copy
     .rise           fade + rise (CSS transition, JS just flips .is-in)
     .reveal-clip    clip-path wipe
     data-stagger    stagger the direct children
     data-px="14"    vertical parallax scrub on an image
     data-px-y="-90" slow drift for decorative layers
   Counting numbers are their own component — see components/Counter.tsx.
   Re-scans on every route change; already-processed nodes are skipped.
   ========================================================================== */


import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';

const DONE = 'rv';

export default function Reveals() {
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const scope = document.querySelector('main');
    if (!scope) return;

    // Respect reduced motion: show everything, animate nothing.
    // (Word masks and counters handle this themselves — see globals.css and Counter.)
    if (prefersReducedMotion()) {
      scope.querySelectorAll('.rise, .reveal-clip').forEach((el) => el.classList.add('is-in'));
      return;
    }

    const fresh = <T extends HTMLElement>(sel: string) =>
      gsap.utils.toArray<T>(scope.querySelectorAll(sel)).filter((el) => {
        if (el.dataset[DONE] === '1') return false;
        el.dataset[DONE] = '1';
        return true;
      });

    const ctx = gsap.context(() => {
      /* ---------------------------------------------- word-mask headings */
      /* <SplitText> already rendered the .w > i masks — we only animate them,
         never rewrite the DOM React owns. */
      fresh('[data-split]').forEach((el) => {
        if (el.closest('[data-hero]')) return; // the hero runs its own entrance
        const words = Array.from(el.querySelectorAll<HTMLElement>('.w > i'));
        if (!words.length) return;
        gsap.set(words, { yPercent: 108 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(words, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.028 })
        });
      });

      /* ------------------------------------------------- fade + rise */
      fresh('.rise').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => el.classList.add('is-in')
        });
      });

      /* ------------------------------------------------- clip wipes */
      fresh('.reveal-clip').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: () => el.classList.add('is-in')
        });
      });

      /* ------------------------------------------------- child stagger */
      fresh('[data-stagger]').forEach((wrap) => {
        const kids = Array.from(wrap.children) as HTMLElement[];
        if (!kids.length) return;
        gsap.set(kids, { y: 42, opacity: 0 });
        ScrollTrigger.create({
          trigger: wrap, start: 'top 85%', once: true,
          onEnter: () => gsap.to(kids, {
            y: 0, opacity: 1, duration: 1.05, ease: 'expo.out',
            stagger: Number(wrap.dataset.stagger) || 0.08
          })
        });
      });

      /* ------------------------------------------------- image parallax */
      fresh('[data-px]').forEach((el) => {
        const amount = Number(el.dataset.px) || 12;
        gsap.fromTo(el,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom', end: 'bottom top', scrub: true
            }
          });
      });

      /* ------------------------------------------------- drifting layers */
      fresh('[data-px-y]').forEach((el) => {
        gsap.to(el, {
          y: Number(el.dataset.pxY) || -90,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
      });

      /* ------------------------------------------------- hero parallax */
      // Symmetric drift, so the oversized photo never exposes an edge
      const heroBg = scope.querySelector<HTMLElement>('[data-hero-bg] video, [data-hero-bg] img');
      if (heroBg && heroBg.dataset[DONE] !== 'px') {
        heroBg.dataset[DONE] = 'px';
        gsap.fromTo(heroBg,
          { yPercent: -6 },
          {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true }
          });
      }
      const heroInner = scope.querySelector<HTMLElement>('[data-hero-inner]');
      if (heroInner && heroInner.dataset[DONE] !== 'px') {
        heroInner.dataset[DONE] = 'px';
        gsap.to(heroInner, {
          y: -70, opacity: 0.12, ease: 'none',
          scrollTrigger: { trigger: '[data-hero]', start: 'center top', end: 'bottom top', scrub: true }
        });
      }

    }, scope);

    // Fonts change metrics — remeasure once they land.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(id);
      ctx.kill(); // kill triggers, keep revealed elements revealed
    };
  }, [pathname]);

  return null;
}
