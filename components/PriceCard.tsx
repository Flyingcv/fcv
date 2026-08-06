'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import DownloadItineraryButton from '@/components/DownloadItineraryButton';
import { ORIGIN, inr, type Package, type Destination } from '@/lib/data';

interface Props {
  pkg: Package;
  destination: Destination;
}

const MIN_NIGHTS = 2;
const EXTRA_NIGHTS_CAP = 6;

/* Nights adjustable, priced off this package's own implied per-night rate —
   a quick "what if" without pretending to have a real itinerary for every
   possible length. The itinerary and PDF below always reflect the actual
   pkg.nights plan. */
export default function PriceCard({ pkg, destination: d }: Props) {
  const [nights, setNights] = useState(pkg.nights);
  const maxNights = pkg.nights + EXTRA_NIGHTS_CAP;
  const days = nights + 1;
  const perNightRate = pkg.price / pkg.nights;
  const total = Math.round(perNightRate * nights);

  const waMessage = [
    `Hi! I'd like to know more about this package:`, ``,
    `${pkg.title} (${nights}N / ${days}D)`,
    `Estimated price: ${inr(total)} per person`, ``,
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

      <div className="price-card__facts">
        <div><span>Duration</span><b>{nights}N / {days}D</b></div>
        <div><span>Route</span><b>{ORIGIN.code} → {d.iata}</b></div>
        <div><span>Style</span><b>{d.tagline}</b></div>
      </div>

      <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold" data-magnetic="0.28">
        Enquire on WhatsApp
        <ArrowRight className="btn__icon" />
      </a>
      <DownloadItineraryButton pkg={pkg} destination={d} />

      <p className="price-card__note">
        {nights === pkg.nights
          ? 'This matches the itinerary shown below.'
          : `Scaled for ${nights} nights — the itinerary below covers the original ${pkg.nights}N / ${pkg.days}D plan.`}{' '}
        A planner confirms the exact quote.
      </p>
    </div>
  );
}
