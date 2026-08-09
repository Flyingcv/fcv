'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import DownloadItineraryButton from '@/components/DownloadItineraryButton';
import { ORIGIN, SITE_URL, inr, type Package, type Destination } from '@/lib/data';

interface Props {
  pkg: Package;
  destination: Destination;
}

const MIN_NIGHTS = 2;
const EXTRA_NIGHTS_CAP = 6;
const MIN_PAX = 1;
const MAX_PAX = 10;

/* Nights adjustable, priced off this package's own implied per-night rate —
   a quick "what if" without pretending to have a real itinerary for every
   possible length. The itinerary and PDF below always reflect the actual
   pkg.nights plan. Travellers scales the same per-person rate into a group
   total — the per-person figure stays the headline number since that's how
   every price on the site is already quoted. */
export default function PriceCard({ pkg, destination: d }: Props) {
  const [nights, setNights] = useState(pkg.nights);
  const [pax, setPax] = useState(2);
  const maxNights = pkg.nights + EXTRA_NIGHTS_CAP;
  const days = nights + 1;
  const perNightRate = pkg.price / pkg.nights;
  const total = Math.round(perNightRate * nights);
  const groupTotal = total * pax;

  // Built from the canonical SITE_URL rather than window.location.href —
  // branching on `typeof window` between server and client render produced a
  // hydration mismatch (the href silently changed right after hydration).
  const pageUrl = `${SITE_URL}/packages/${pkg.id}`;
  const waMessage = [
    `Hi! I'd like to know more about this package:`, ``,
    `${pkg.title} (${nights}N / ${days}D)`,
    `Travellers: ${pax}`,
    `Estimated price: ${inr(total)} per person (${inr(groupTotal)} total)`,
    pageUrl, ``,
    `Please share availability and next steps.`
  ].join('\n');
  const waLink = `https://wa.me/917017440214?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="price-card">
      <span className="price-card__tag">{pkg.badge} · {d.name}</span>

      <div className="price-card__price">
        {inr(total)}
        <small>per person · twin sharing</small>
      </div>

      <div className="price-card__stepper">
        <span>Trip length</span>
        <div className="stepper">
          <button
            type="button"
            onClick={() => setNights((n) => Math.max(MIN_NIGHTS, n - 1))}
            disabled={nights <= MIN_NIGHTS}
            aria-label="One night fewer"
          >−</button>
          <output>{nights}N</output>
          <button
            type="button"
            onClick={() => setNights((n) => Math.min(maxNights, n + 1))}
            disabled={nights >= maxNights}
            aria-label="One night more"
          >+</button>
        </div>
      </div>

      <div className="price-card__stepper">
        <span>Travellers</span>
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
        <span>Total for {pax} {pax === 1 ? 'traveller' : 'travellers'}</span>
        <b>{inr(groupTotal)}</b>
      </div>

      <div className="price-card__facts">
        <div><span>Duration</span><b>{nights}N / {days}D</b></div>
        <div><span>Route</span><b>{ORIGIN.code} → {d.iata}</b></div>
        <div><span>Style</span><b>{d.tagline}</b></div>
      </div>

      <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold" data-magnetic="0.28">
        Enquire on WhatsApp
        <ArrowRight className="btn__icon" />
      </a>
      <DownloadItineraryButton pkg={pkg} destination={d} nights={nights} pax={pax} />

      <p className="price-card__note">
        {nights === pkg.nights
          ? 'This matches the itinerary shown below.'
          : `Scaled for ${nights} nights — the itinerary below covers the original ${pkg.nights}N / ${pkg.days}D plan.`}{' '}
        Priced per person on twin sharing; a planner confirms the exact group quote.
      </p>
    </div>
  );
}
