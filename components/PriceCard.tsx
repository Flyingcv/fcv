'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import DownloadItineraryButton from '@/components/DownloadItineraryButton';
import { ORIGIN, SITE_URL, SITE, inr, type Package, type Destination } from '@/lib/data';

interface Props {
  pkg: Package;
  destination: Destination;
}

const MIN_PAX = 1;
const MAX_PAX = 10;
const U = SITE.ui.priceCard;

/* Trip length always matches the itinerary shown below — only the
   traveller count is adjustable here, scaling the per-person rate into a
   group total. The per-person figure stays the headline number since
   that's how every price on the site is already quoted. */
export default function PriceCard({ pkg, destination: d }: Props) {
  const [pax, setPax] = useState(2);
  const nights = pkg.nights;
  const days = pkg.days;
  const total = pkg.price;
  const groupTotal = total * pax;

  // Built from the canonical SITE_URL rather than window.location.href —
  // branching on `typeof window` between server and client render produced a
  // hydration mismatch (the href silently changed right after hydration).
  const pageUrl = `${SITE_URL}/packages/${pkg.id}`;
  const waMessage = [
    U.waMessage.intro, ``,
    `${pkg.title} (${nights}N / ${days}D)`,
    `${U.waMessage.travellersLine} ${pax}`,
    U.waMessage.priceLineTemplate.replace('{total}', inr(total)).replace('{groupTotal}', inr(groupTotal)),
    pageUrl, ``,
    U.waMessage.closing
  ].join('\n');
  const waLink = `https://wa.me/917017440214?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="price-card">
      <span className="price-card__tag">{pkg.badge} · {d.name}</span>

      <div className="price-card__price">
        {inr(total)}
        <small>{U.perPersonTwinSharing}</small>
      </div>

      <div className="price-card__stepper">
        <span>{U.travellersLabel}</span>
        <div className="stepper">
          <button
            type="button"
            onClick={() => setPax((p) => Math.max(MIN_PAX, p - 1))}
            disabled={pax <= MIN_PAX}
            aria-label="One traveller fewer"
          >−</button>
          <output>{pax}</output>
          <button
            type="button"
            onClick={() => setPax((p) => Math.min(MAX_PAX, p + 1))}
            disabled={pax >= MAX_PAX}
            aria-label="One traveller more"
          >+</button>
        </div>
      </div>

      <div className="price-card__total">
        <span>{U.totalForTemplate.replace('{pax}', String(pax)).replace('{travellerWord}', pax === 1 ? U.travellerSingular : U.travellerPlural)}</span>
        <b>{inr(groupTotal)}</b>
      </div>

      <div className="price-card__facts">
        <div><span>{U.durationLabel}</span><b>{nights}N / {days}D</b></div>
        <div><span>{U.routeLabel}</span><b>{ORIGIN.code} → {d.iata}</b></div>
        <div><span>{U.styleLabel}</span><b>{pkg.style ?? d.tagline}</b></div>
      </div>

      <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold" data-magnetic="0.28">
        {U.enquireLabel}
        <ArrowRight className="btn__icon" />
      </a>
      <DownloadItineraryButton pkg={pkg} destination={d} nights={nights} pax={pax} />

      <p className="price-card__note">
        {U.note}
      </p>
    </div>
  );
}
