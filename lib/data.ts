/* ==========================================================================
   FLYING COLOURS VACATIONS — Shared data layer
   Nav dropdown, destination pages, the Services filter and the pricing
   configurator all read from here.

   The actual editable content (destinations, packages, prices, reviews,
   contact details) lives in plain JSON files under /content — see
   /content/README.md for a field-by-field editing guide. This file only
   types that JSON and holds the logic (quote(), inr(), etc.) built on
   top of it, so editing content never requires touching TypeScript.
   ========================================================================== */

import destinationsJson from '@/content/destinations.json';
import packagesJson from '@/content/packages.json';
import tiersJson from '@/content/tiers.json';
import reviewsJson from '@/content/reviews.json';
import contactJson from '@/content/contact.json';

/** Unsplash helper — swap for your own photography/CDN later.
 *  If a URL fails, <Photo> degrades the frame to a branded gradient. */
export const img = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type DestinationSlug = 'vietnam' | 'bali' | 'thailand' | 'malaysia';

export interface Destination {
  slug: DestinationSlug;
  name: string;
  iata: string;
  tagline: string;
  blurb: string;
  cover: string;
  hero: string;
  cities: string[];
  facts: Record<string, string>;
  /** Per person, per day land cost in INR at Comfort tier */
  perDay: number;
  /** Indicative return airfare per person, ex-Delhi */
  flight: number;
  fromPrice: number;
  highlights: [string, string][];
  itinerary: [string, string][];
  gallery: string[];
}

/* --------------------------------------------------------------------------
   DESTINATIONS — content lives in /content/destinations.json
   -------------------------------------------------------------------------- */
export const DESTINATIONS = destinationsJson as unknown as Record<DestinationSlug, Destination>;

export const DESTINATION_LIST = Object.values(DESTINATIONS);

/* --------------------------------------------------------------------------
   PACKAGES — powers the live filter on /services
   price = per person, land package
   -------------------------------------------------------------------------- */
export interface Package {
  id: string;
  dest: DestinationSlug;
  title: string;
  where: string;
  days: number;
  nights: number;
  price: number;
  badge: string;
  type: string[];
  blurb: string;
  includes: string[];
  image: string;
  /** Ordered list of stops, shown as the trip-route strip on the package page */
  route: string[];
  /** One entry per day: [title, description] */
  itinerary: [string, string][];
}

export const PACKAGES = packagesJson as unknown as Package[];

/* --------------------------------------------------------------------------
   PRICING MODEL — drives the interactive configurator
   Tier labels/notes/multipliers live in /content/tiers.json
   -------------------------------------------------------------------------- */
export type TierKey = 'comfort' | 'premium' | 'luxury';
export type AddonKey = 'flights' | 'visa' | 'guide' | 'experiences';

export const TIERS = tiersJson as Record<TierKey, { label: string; note: string; mult: number }>;

interface Addon {
  label: string;
  note: string;
  /** per person, or per person per day */
  kind: 'perPerson' | 'perPersonPerDay';
  /** flat rate, or derived from the destination */
  rate: number | ((d: Destination) => number);
}

export const ADDONS: Record<AddonKey, Addon> = {
  flights: { label: 'Return flights', note: 'Ex-Delhi, economy', kind: 'perPerson', rate: (d) => d.flight },
  visa: { label: 'Visa & travel insurance', note: 'Filing + 100% claim support', kind: 'perPerson', rate: 3500 },
  guide: { label: 'Private guide & car', note: 'English-speaking, full day', kind: 'perPersonPerDay', rate: 900 },
  experiences: { label: 'Signature experiences pack', note: 'Cruise, show, sunrise trek', kind: 'perPerson', rate: 6500 }
};

export const ORIGIN = { code: 'DEL', city: 'New Delhi' };

export interface QuoteInput {
  dest: DestinationSlug;
  days: number;
  pax: number;
  tier: TierKey;
  addons: AddonKey[];
}

export interface Quote {
  land: number;
  extras: number;
  total: number;
  perPerson: number;
  lines: { label: string; amount: number }[];
}

export function quote({ dest, days, pax, tier, addons }: QuoteInput): Quote {
  const d = DESTINATIONS[dest];
  const t = TIERS[tier];

  const land = Math.round(d.perDay * days * pax * t.mult);

  const lines = [{ label: `${t.label} land package · ${days - 1}N / ${days}D`, amount: land }];

  let extras = 0;
  for (const key of addons) {
    const a = ADDONS[key];
    if (!a) continue;
    const base = typeof a.rate === 'function' ? a.rate(d) : a.rate;
    const amount = Math.round(a.kind === 'perPersonPerDay' ? base * days * pax : base * pax);
    extras += amount;
    lines.push({ label: a.label, amount });
  }

  const total = land + extras;
  return { land, extras, total, perPerson: Math.round(total / pax), lines };
}

/** ₹ 62,999 — Indian digit grouping */
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/* --------------------------------------------------------------------------
   SUPPORTING CONTENT — reviews live in /content/reviews.json,
   contact details in /content/contact.json
   -------------------------------------------------------------------------- */
export const REVIEWS = reviewsJson;

export const CONTACT = contactJson;
