import TLink from '@/components/TLink';
import { Facebook, Instagram, WhatsApp, ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, CONTACT, SITE } from '@/lib/data';

export default function Footer() {
  const { footer } = SITE;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="footer__logo" src="/logo-transparent.png" alt={SITE.brandName} width={1339} height={349} />
            <p>{footer.tagline}</p>
            <div className="socials">
              <a href={footer.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
              <a href={footer.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
              <a href={footer.socials.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
            </div>
          </div>

          <div>
            <h4>{footer.columns.destinationsHeading}</h4>
            <ul>
              {DESTINATION_LIST.map((d) => (
                <li key={d.slug}>
                  <TLink href={`/destinations/${d.slug}`}>{d.name}</TLink>
                </li>
              ))}
              <li><TLink href="/destinations">{footer.columns.allDestinationsLabel}</TLink></li>
            </ul>
          </div>

          <div>
            <h4>{footer.columns.companyHeading}</h4>
            <ul>
              {footer.columns.companyLinks.map((l) => (
                <li key={l.href}><TLink href={l.href}>{l.label}</TLink></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{footer.columns.deskHeading}</h4>
            <ul>
              <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><p style={{ marginTop: '.4rem' }}>{CONTACT.address}</p></li>
            </ul>
            <TLink href="/contact" className="btn btn--ghost" style={{ marginTop: '1.4rem' }} data-magnetic="0.25">
              {footer.columns.callbackLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>

        <div className="footer__bottom">
          <span>{footer.bottomLine1Template.replace('{year}', String(new Date().getFullYear()))}</span>
          <span>{footer.bottomLine2}</span>
          <span><TLink href="/privacy-policy">{footer.privacyLabel}</TLink></span>
          <span><TLink href="/cancellation-policy">{footer.cancellationLabel}</TLink></span>
        </div>
        <div className="footer__credit">
          {footer.creditText}{' '}
          <a href={footer.creditUrl} target="_blank" rel="noreferrer">{footer.creditName}</a>
        </div>
      </div>
    </footer>
  );
}
