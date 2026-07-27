'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import { Caret, ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, inr } from '@/lib/data';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/destinations', label: 'Destinations', menu: true },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' }
];

export default function Nav() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  // The Destinations dropdown is otherwise pure CSS :hover — clicking a link
  // inside it navigates but the cursor doesn't move, so :hover never clears
  // and the panel stays open over the new page. This force-closes it until
  // the mouse actually leaves, then hands control back to :hover as normal.
  const [menuSuppressed, setMenuSuppressed] = useState(false);
  const closeMenu = () => setMenuSuppressed(true);

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
          <TLink href="/" className="nav__logo" aria-label="Flying Colours Vacations — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-flying-colours-vacations.webp" alt="Flying Colours Vacations" width={480} height={98} />
          </TLink>

          <nav className="nav__menu" aria-label="Primary">
            {LINKS.map((l) => (
              <div
                key={l.href}
                className={`nav__item${l.menu ? ' nav__item--has-menu' : ''}${l.menu && menuSuppressed ? ' is-suppressed' : ''}`}
                onMouseLeave={l.menu ? () => setMenuSuppressed(false) : undefined}
              >
                <TLink
                  href={l.href}
                  className={`nav__link${isActive(l.href) ? ' is-active' : ''}`}
                  aria-current={isActive(l.href) ? 'page' : undefined}
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
                      <span>04 destinations · 60+ itineraries</span>
                      <TLink href="/destinations" onClick={closeMenu}>View all <ArrowRight className="btn__icon" style={{ display: 'inline', verticalAlign: '-2px' }} /></TLink>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <TLink href="/services" className="btn btn--gold" data-magnetic="0.28" style={{ marginLeft: '.6rem' }}>
              Plan my trip
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
          <span>Talk to a planner</span>
          <a href="tel:+917017440214">+91 70174 40214</a>
          <a href="mailto:info@flyingcoloursvacations.com">info@flyingcoloursvacations.com</a>
        </div>
      </div>
    </>
  );
}
