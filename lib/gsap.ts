/* Central GSAP entry — registers plugins exactly once, client-side only. */
import { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Module bodies evaluate once, and registerPlugin is idempotent anyway.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Use this for every GSAP setup — never plain useEffect.
 *
 * React runs layout-effect cleanups while it is tearing a tree down, but
 * defers passive (useEffect) cleanups until *after* it has already removed the
 * DOM nodes. ScrollTrigger's `pin` moves the pinned element into a pin-spacer
 * wrapper, so if the cleanup runs late React tries to remove the element from
 * a parent it no longer sits under — the "removeChild ... not a child of this
 * node" crash. A layout effect reverts the pin before React touches the DOM.
 *
 * Falls back to useEffect on the server, where layout effects warn.
 */
export const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* Word splitting lives in components/SplitText.tsx — it is rendered by React
   rather than patched into the DOM afterwards, so React never loses track of
   the nodes it owns. */
