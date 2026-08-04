'use client';

/* ==========================================================================
   MotionProvider — the spine of the site's motion
   · Lenis smooth scroll wired into the GSAP ticker
   · The boarding-pass curtain: a plane flies along the perforation and the
     pass "unzips" open behind it — a clip-path wipe that reveals the page
     from left to right in lockstep with the plane, rather than the two
     halves flying off bodily
   · Route transitions reuse the same curtain (zip shut → push → unzip open)
   ========================================================================== */

import {
  createContext, useCallback, useContext, useEffect, useRef, useState
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from '@/lib/gsap';
import { Plane } from '@/components/icons';

/* Module scope, not a ref: this survives StrictMode's double-invoke and any
   Fast Refresh remount, so the intro plays exactly once per page load. */
let introPlayed = false;

interface MotionCtx {
  /** Navigate with the curtain transition instead of an instant route swap */
  navigate: (href: string) => void;
  /** True once the curtain has torn open — heroes wait for this */
  revealed: boolean;
  lenis: Lenis | null;
}

const Ctx = createContext<MotionCtx>({ navigate: () => {}, revealed: true, lenis: null });
export const useMotion = () => useContext(Ctx);

const SEEN_KEY = 'fcv-intro-seen';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);

  const lenisRef = useRef<Lenis | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const perfRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLElement>(null);

  const covering = useRef(true);   // does the curtain currently hide the page?
  const prevPath = useRef(pathname);

  /* ---------------------------------------------------------------- scroll */
  const lock = useCallback(() => {
    lenisRef.current?.stop();
    document.body.classList.add('is-loading');
  }, []);

  const unlock = useCallback(() => {
    lenisRef.current?.start();
    document.body.classList.remove('is-loading');
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: 0.085
    });
    lenisRef.current = lenis;
    lenis.stop(); // the curtain is up — hold the page still

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* Same-page anchors route through Lenis so easing stays consistent */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenisRef.current) lenisRef.current.scrollTo(target as HTMLElement, { offset: -90, duration: 1.4 });
      else target.scrollIntoView({ behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  /* --------------------------------------------------------------- curtain */
  const openCurtain = useCallback((full: boolean) => {
    const root = rootRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    const plane = planeRef.current;
    if (!root || !top || !bot || !plane) return;

    const trail = trailRef.current;
    const perf = perfRef.current;
    const content = contentRef.current;
    const bar = barRef.current;
    const count = countRef.current;

    gsap.set(root, { autoAlpha: 1, pointerEvents: 'auto' });
    // The icon is drawn nose-up; rotate it so the plane flies along the tear
    gsap.set(plane, { yPercent: -50, x: -240, rotate: 90, autoAlpha: 1 });

    const flyOut = window.innerWidth + 260;
    const tl = gsap.timeline({
      onComplete: () => {
        covering.current = false;
        gsap.set(root, { autoAlpha: 0, pointerEvents: 'none' });
        unlock();
        ScrollTrigger.refresh();
      }
    });

    if (full) {
      const counter = { v: 0 };
      tl.set([top, bot], { clipPath: 'inset(0 0 0 0%)' })
        .from(content!.children, { y: 22, autoAlpha: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' })
        .to(bar, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0.2)
        .to(counter, {
          v: 100,
          duration: 1.25,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count) count.textContent = String(Math.round(counter.v)).padStart(3, '0');
          }
        }, 0.25)
        // Score the perforation across the pass
        .to(perf, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, '-=0.4')
        .to(content, { y: -18, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '-=0.2');
    } else {
      tl.set(content, { autoAlpha: 0 })
        .set([bar, perf], { scaleX: 1 })
        .set([top, bot], { clipPath: 'inset(0 0 0 0%)' });
    }

    // The plane flies the length of the tear; a clip-path wipe unzips the
    // pass open behind it, left edge to right, in the same beat as the plane.
    const unzip = { p: 0 };
    const flightDuration = 1;
    tl.to(trail, { scaleX: 1, duration: 0.8, ease: 'power2.in' }, full ? '-=0.1' : 0)
      .to(plane, { x: flyOut, duration: flightDuration, ease: 'power1.in' }, '<')
      .to(unzip, {
        p: 100,
        duration: flightDuration,
        ease: 'power1.in',
        onUpdate: () => gsap.set([top, bot], { clipPath: `inset(0 0 0 ${unzip.p}%)` })
      }, '<')
      .to(trail, { autoAlpha: 0, duration: 0.3 }, '-=0.3')
      .add(() => setRevealed(true), '-=0.55');
  }, [unlock]);

  const closeCurtain = useCallback((done: () => void) => {
    const root = rootRef.current;
    const top = topRef.current;
    const bot = botRef.current;
    const plane = planeRef.current;
    if (!root || !top || !bot || !plane) { done(); return; }

    gsap.set(root, { autoAlpha: 1, pointerEvents: 'auto' });
    gsap.set(contentRef.current, { autoAlpha: 0 });
    gsap.set(trailRef.current, { autoAlpha: 1, scaleX: 0 });
    // Start fully "unzipped" (open) so the close is the same wipe in reverse
    gsap.set([top, bot], { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(plane, { yPercent: -50, x: -240, rotate: 90, autoAlpha: 1 });

    const zip = { p: 0 };
    gsap.timeline({ onComplete: done })
      .to(plane, { x: window.innerWidth + 260, duration: 0.8, ease: 'power1.in' }, 0)
      .to(trailRef.current, { scaleX: 1, duration: 0.65, ease: 'power2.in' }, 0)
      .to(zip, {
        p: 100,
        duration: 0.8,
        ease: 'power1.in',
        onUpdate: () => gsap.set([top, bot], { clipPath: `inset(0 ${100 - zip.p}% 0 0)` })
      }, 0);
  }, []);

  /* ------------------------------------------------------ intro, once only */
  useIsoLayoutEffect(() => {
    if (introPlayed) return;
    introPlayed = true;

    if (prefersReducedMotion()) {
      gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: 'none' });
      covering.current = false;
      setRevealed(true);
      return;
    }

    // Full sequence on the first visit of a session; a quick tear after that
    let short = false;
    try {
      short = sessionStorage.getItem(SEEN_KEY) === '1';
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch { /* private mode — just play the full intro */ }

    lock();
    openCurtain(!short);
  }, [lock, openCurtain]);

  /* ------------------------------------------------- open on route arrival */
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();

    if (covering.current) openCurtain(false);
    else setRevealed(true);
  }, [pathname, openCurtain]);

  /* Never strand a visitor behind the curtain if a route hangs */
  useEffect(() => {
    if (revealed) return;
    const t = setTimeout(() => {
      if (covering.current) {
        covering.current = false;
        gsap.set(rootRef.current, { autoAlpha: 0, pointerEvents: 'none' });
        unlock();
        setRevealed(true);
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [revealed, unlock]);

  /* ------------------------------------------------------------- navigate */
  const navigate = useCallback((href: string) => {
    if (!href || href === pathname) return;
    if (prefersReducedMotion()) { router.push(href); return; }

    setRevealed(false);
    covering.current = true;
    lock();
    closeCurtain(() => router.push(href));
  }, [pathname, router, lock, closeCurtain]);

  /* --------------------------------------------------------------- render */
  return (
    <Ctx.Provider value={{ navigate, revealed, lenis: lenisRef.current }}>
      <div className="preloader" ref={rootRef} aria-hidden="true">
        <div className="pre__half pre__half--top" ref={topRef} />
        <div className="pre__half pre__half--bot" ref={botRef} />

        <div className="pre__perf">
          <span className="pre__perf-line" ref={perfRef} />
        </div>
        <span className="pre__contrail" ref={trailRef} />
        <Plane className="pre__plane" ref={planeRef} />

        <div className="pre__content" ref={contentRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pre__logo" src="/logo-flying-colours-vacations.webp" alt="Flying Colours Vacations" />

          <div className="pre__meta">
            <span>From<b>DEL</b></span>
            <span>To<b>Southeast Asia</b></span>
            <span>Class<b>Window Seat</b></span>
          </div>

          {/* Left empty on purpose: the intro timeline owns this text node,
              so React must not be holding a child of its own here. */}
          <div className="pre__count">
            <b ref={countRef} />
            <sup>%</sup>
          </div>

          <div className="pre__bar"><span ref={barRef} /></div>

          <p className="pre__tagline">Preparing for departure — adding colours to your journey</p>
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}

// Refinement iteration 33 for code quality and clarity
