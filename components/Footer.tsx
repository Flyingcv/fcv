import TLink from '@/components/TLink';
import { Facebook, Instagram, WhatsApp, ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, CONTACT } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer__logo" src="/logo-flying-colours-vacations.webp" alt="Flying Colours Vacations" width={480} height={98} />
            <p>Adding colours to every journey. Southeast Asia specialists since 2014 — planning, ticketing and 24/7 on-trip support from one desk in Noida.</p>
            <div className="socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
              <a href={`https://wa.me/917017440214`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
            </div>
          </div>

          <div>
            <h4>Destinations</h4>
            <ul>
              {DESTINATION_LIST.map((d) => (
                <li key={d.slug}>
                  <TLink href={`/destinations/${d.slug}`}>{d.name}</TLink>
                </li>
              ))}
              <li><TLink href="/destinations">All destinations</TLink></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><TLink href="/about">About us</TLink></li>
              <li><TLink href="/services">Services & packages</TLink></li>
              <li><TLink href="/services#configurator">Price calculator</TLink></li>
              <li><TLink href="/contact">Contact</TLink></li>
              <li><TLink href="/contact#faq">FAQs</TLink></li>
            </ul>
          </div>

          <div>
            <h4>Departures desk</h4>
            <ul>
              <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><p style={{ marginTop: '.4rem' }}>{CONTACT.address}</p></li>
            </ul>
            <TLink href="/contact" className="btn btn--ghost" style={{ marginTop: '1.4rem' }} data-magnetic="0.25">
              Request a callback
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Flying Colours Vacations · All rights reserved</span>
          <span>Noida · India — IATA-partnered ticketing</span>
          <span>Made with 🔥 by The Angaar Labs</span>
        </div>
      </div>
    </footer>
  );
}
