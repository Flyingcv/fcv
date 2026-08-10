'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import { Caret, ArrowRight } from '@/components/icons';
import { useMotion } from '@/components/motion/MotionProvider';
import { DESTINATION_LIST, SITE, CONTACT, inr } from '@/lib/data';

const LINKS = SITE.nav.links;

export default function Nav() {
  const pathname = usePathname();
  const { revealed } = useMotion();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  // The Destinations dropdown's visibility is plain React state now, not
  // CSS :hover. A pure-:hover panel doesn't reliably close on click: hiding
  // it via pointer-events:none while the cursor still sits over it (over
  // whatever page content is underneath) makes the browser re-target the
  // hit-test to that content, and since that element isn't a descendant of
  // .nav__item, it can fire a spurious mouseleave/mouseenter pair that
  // leaves hover state inconsistent. Driving it from state sidesteps that
  // entirely.
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeMenu = () => setDropdownOpen(false);

  // Belt and braces: the instant ANY navigation starts (the curtain begins
  // closing), force the dropdown shut too — regardless of where the mouse
  // is or which link triggered it. `revealed` goes false the moment
  // MotionProvider.navigate() runs, well before the route actually changes.
  useEffect(() => {
    if (!revealed) setDropdownOpen(false);
  }, [revealed]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /* Solid background past the fold; auto-hide while scrolling down */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(!open && y > last && y > 320);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  /* Drawer body lock + escape to close */
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Any route change closes the drawer */
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={`nav${solid ? ' is-solid' : ''}${hidden ? ' is-hidden' : ''}`}>
        <div className="nav__inner">
          <TLink href="/" className="nav__logo" aria-label={`${SITE.brandName} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-transparent.png" alt={SITE.brandName} width={1339} height={349} />
          </TLink>

          <nav className="nav__menu" aria-label="Primary">
            {LINKS.map((l) => (
              <div
                key={l.href}
                className={`nav__item${l.menu ? ' nav__item--has-menu' : ''}${l.menu && dropdownOpen ? ' is-open' : ''}`}
                onMouseEnter={l.menu ? () => setDropdownOpen(true) : undefined}
                onMouseLeave={l.menu ? () => setDropdownOpen(false) : undefined}
                onFocus={l.menu ? () => setDropdownOpen(true) : undefined}
                onBlur={l.menu ? (e) => {
                  // React's onBlur bubbles via focusout; only close once focus
                  // has actually left the whole group (dropdown included),
                  // not when it's just moving between links inside it.
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdownOpen(false);
                } : undefined}
              >
                <TLink
                  href={l.href}
                  className={`nav__link${isActive(l.href) ? ' is-active' : ''}`}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  aria-expanded={l.menu ? dropdownOpen : undefined}
                  onClick={l.menu ? closeMenu : undefined}
                >
                  {l.label}
                  {l.menu && <Caret className="nav__caret" />}
                </TLink>

                {l.menu && (
                  <div className="dropdown" role="menu">
                    {DESTINATION_LIST.map((d) => (
                      <TLink key={d.slug} href={`/destinations/${d.slug}`} className="drop-card" role="menuitem" onClick={closeMenu}>
                        <Photo src={d.cover} alt={d.name} className="drop-card__img" />
                        <span>
                          <span className="drop-card__code">{d.iata} · SOUTHEAST ASIA</span>
                          <span className="drop-card__name">{d.name}</span>
                          <span className="drop-card__meta">from {inr(d.fromPrice)} · {d.cities.length} cities</span>
                        </span>
                      </TLink>
                    ))}
                    <div className="dropdown__footer">
                      <span>{SITE.nav.dropdownFooterText}</span>
                      <TLink href="/destinations" onClick={closeMenu}>{SITE.nav.dropdownViewAllLabel} <ArrowRight className="btn__icon" style={{ display: 'inline', verticalAlign: '-2px' }} /></TLink>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <TLink href="/services" className="btn btn--gold" data-magnetic="0.28" style={{ marginLeft: '.6rem' }}>
              {SITE.nav.ctaLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
          </nav>

          <button
            className="burger"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <i /><i /><i />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------ mobile drawer */}
      <div className="drawer-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="drawer" id="mobile-menu">
        <div className="drawer__list">
          {LINKS.map((l, i) => (
            <div key={l.href}>
              <TLink href={l.href} className="drawer__link" style={{ ['--i' as string]: i }}>
                <i>{String(i + 1).padStart(2, '0')}</i>
                {l.label}
              </TLink>
              {l.menu && (
                <div className="drawer__sub">
                  {DESTINATION_LIST.map((d) => (
                    <TLink key={d.slug} href={`/destinations/${d.slug}`}>
                      {d.iata} — {d.name}
                    </TLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="drawer__foot">
          <span>{SITE.nav.drawerFootLabel}</span>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>
    </>
  );
}

// Refinement iteration 26 for code quality and clarity

// Refinement iteration 48 for code quality and clarity

// Refinement iteration 70 for code quality and clarity

// Refinement iteration 21 for code quality and clarity

// Refinement iteration 43 for code quality and clarity

// Refinement iteration 2 for code quality and clarity

// Refinement iteration 5 for code quality and clarity
