'use client';

/* Live filter over every package — destination, trip length and budget.
   Nothing is submitted; results re-stagger in as soon as a control moves. */

import { useEffect, useMemo, useRef, useState } from 'react';
import PackageCard from '@/components/PackageCard';
import { useMotion } from '@/components/motion/MotionProvider';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { PACKAGES, DESTINATION_LIST, inr, type DestinationSlug } from '@/lib/data';

type DestFilter = 'all' | DestinationSlug;
type LenFilter = 'any' | 'short' | 'mid' | 'long';
type Sort = 'price' | 'days' | 'popular';

const LENGTHS: { key: LenFilter; label: string; test: (d: number) => boolean }[] = [
  { key: 'any', label: 'Any', test: () => true },
  { key: 'short', label: '4 days', test: (d) => d <= 4 },
  { key: 'mid', label: '5 – 6 days', test: (d) => d >= 5 && d <= 6 },
  { key: 'long', label: '7+ days', test: (d) => d >= 7 }
];

const MIN_BUDGET = 25000;
const MAX_BUDGET = 125000;

export default function PackageFilter() {
  const [dest, setDest] = useState<DestFilter>('all');
  const [len, setLen] = useState<LenFilter>('any');
  const [budget, setBudget] = useState(MAX_BUDGET);
  const [sort, setSort] = useState<Sort>('popular');

  const { lenis } = useMotion();
  const filterRef = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  /* Bring the results to just under the sticky filter after a change, so
     "select a filter" always means "see the results" — no manual scrolling.
     Only called on discrete actions (chip clicks, slider release), never on
     every tick of a slider drag, which would be a jarring scroll-while-typing. */
  const scrollToResults = () => {
    const el = grid.current;
    if (!el || prefersReducedMotion()) return;
    const offset = (filterRef.current?.offsetHeight ?? 0) + 16;
    if (lenis) lenis.scrollTo(el, { offset: -offset, duration: 1 });
    else {
      const rect = el.getBoundingClientRect();
      if (rect.top < offset + 40) return; // already in view, don't yank it
      window.scrollTo({ top: window.scrollY + rect.top - offset, behavior: 'smooth' });
    }
  };

  const results = useMemo(() => {
    const lenTest = LENGTHS.find((l) => l.key === len)!.test;
    const list = PACKAGES.filter(
      (p) => (dest === 'all' || p.dest === dest) && lenTest(p.days) && p.price <= budget
    );

    if (sort === 'price') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'days') return [...list].sort((a, b) => a.days - b.days);
    return list;
  }, [dest, len, budget, sort]);

  /* Re-stagger the grid whenever the result set changes */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prefersReducedMotion() || !grid.current) return;

    const cards = grid.current.children;
    if (!cards.length) return;

    const tween = gsap.fromTo(cards,
      { y: 26, opacity: 0, scale: 0.985 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.04, overwrite: true });

    return () => { tween.kill(); };
  }, [results]);

  const reset = () => {
    setDest('all'); setLen('any'); setBudget(MAX_BUDGET); setSort('popular');
    scrollToResults();
  };
  const pick = <T,>(setter: (v: T) => void, value: T) => () => { setter(value); scrollToResults(); };
  const fill = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
  const active = dest !== 'all' || len !== 'any' || budget !== MAX_BUDGET || sort !== 'popular';

  return (
    <>
      <div className="filter" ref={filterRef}>
        {/* ------------------------------------------------- destination */}
        <div className="filter__cell">
          <div className="filter__label">
            <span>Destination</span>
            <b>{dest === 'all' ? 'All 4 countries' : DESTINATION_LIST.find((d) => d.slug === dest)?.name}</b>
          </div>
          <div className="chips" role="group" aria-label="Filter by destination">
            <button className="chipbtn" aria-pressed={dest === 'all'} onClick={pick(setDest, 'all')}>All</button>
            {DESTINATION_LIST.map((d) => (
              <button
                key={d.slug}
                className="chipbtn"
                aria-pressed={dest === d.slug}
                onClick={pick(setDest, d.slug)}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="filter__row">
          {/* ------------------------------------------- trip length */}
          <div className="filter__cell">
            <div className="filter__label"><span>Trip length</span></div>
            <div className="chips" role="group" aria-label="Filter by number of days">
              {LENGTHS.map((l) => (
                <button
                  key={l.key}
                  className="chipbtn"
                  aria-pressed={len === l.key}
                  onClick={pick(setLen, l.key)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------ budget */}
          <div className="filter__cell">
            <div className="filter__label">
              <label htmlFor="budget">Budget per person</label>
              <b>up to {inr(budget)}</b>
            </div>
            <input
              id="budget"
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={1000}
              value={budget}
              style={{ ['--fill' as string]: `${fill}%` } as React.CSSProperties}
              onChange={(e) => setBudget(Number(e.target.value))}
              onPointerUp={scrollToResults}
              onKeyUp={scrollToResults}
            />
            <div className="range-ends">
              <span>{inr(MIN_BUDGET)}</span>
              <span>{inr(MAX_BUDGET)}+</span>
            </div>
          </div>

          {/* -------------------------------------------------- sort */}
          <div className="filter__cell">
            <div className="filter__label"><span>Sort by</span></div>
            <div className="chips" role="group" aria-label="Sort results">
              {([['popular', 'Popular'], ['price', 'Price'], ['days', 'Days']] as [Sort, string][]).map(([k, label]) => (
                <button key={k} className="chipbtn" aria-pressed={sort === k} onClick={pick(setSort, k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter__foot">
          <span>
            Showing <b>{String(results.length).padStart(2, '0')}</b> of {PACKAGES.length} itineraries
          </span>
          {active && <button className="filter__reset" onClick={reset}>× Clear filters</button>}
        </div>
      </div>

      <div className="pkg-grid" ref={grid}>
        {results.map((p) => <PackageCard key={p.id} pkg={p} />)}
      </div>

      {results.length === 0 && (
        <div className="filter-empty">
          <h3>No route matches that yet.</h3>
          <p>Widen the budget or the trip length — or let a planner build something custom.</p>
          <button className="btn btn--gold mt-2" onClick={reset}>Reset filters</button>
        </div>
      )}
    </>
  );
}
