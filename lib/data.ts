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
import brochureJson from '@/content/brochure.json';
import siteJson from '@/content/site.json';
import homeJson from '@/content/home.json';
import aboutJson from '@/content/about.json';
import servicesPageJson from '@/content/services-page.json';
import destinationsPageJson from '@/content/destinations-page.json';
import contactPageJson from '@/content/contact-page.json';
import packagePageJson from '@/content/package-page.json';
import legalJson from '@/content/legal.json';
import pdfJson from '@/content/pdf.json';
import formsJson from '@/content/forms.json';

/** Canonical production domain — matches metadataBase in app/layout.tsx.
 *  Used to build absolute links (e.g. inside WhatsApp enquiry messages)
 *  from server components, which have no window.location to fall back on. */
export const SITE_URL = siteJson.siteUrl;

/* --------------------------------------------------------------------------
   SITE-WIDE CONTENT — metadata, nav, footer, 404, brand strings.
   /content/site.json. Per-page copy lives in its own file (home.json,
   about.json, ...) — see the imports above and /content/README.md.
   -------------------------------------------------------------------------- */
export const SITE = siteJson;
export const HOME = homeJson;
export const ABOUT = aboutJson;
export const SERVICES_PAGE = servicesPageJson;
export const DESTINATIONS_PAGE = destinationsPageJson;
export const CONTACT_PAGE = contactPageJson;
export const PACKAGE_PAGE = packagePageJson;
export const LEGAL = legalJson;
export const PDF_COPY = pdfJson;
export const FORMS = formsJson;

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
export interface ItineraryDay {
  title: string;
  /** One-line overview of the day */
  summary: string;
  /** Specific bullet-point activities that make up the day */
  activities: string[];
  /** Short "X + Y + Z" recap of what that day's cost covers */
  included: string;
  /** "Half day" | "Full day" — shown as a badge on the day */
  type: string;
  /** e.g. "Breakfast + Lunch", "No meals" */
  meals: string;
  /** City the night is spent in; "-" on the departure day */
  stay: string;
  /** Indicative hour-by-hour schedule, used by the timing sheet */
  timings: string[];
}

export interface PriceVariant {
  /** e.g. "5N / 6D" */
  label: string;
  /** What that price covers */
  note: string;
  price: number;
}

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
  itinerary: ItineraryDay[];
  /** Label → value summary table (arrival, duration, meals, visa, …) */
  quickDetails: Record<string, string>;
  /** Properties we book most often on this route */
  hotels: string[];
  /** Same trip at different lengths / with flights included */
  priceVariants: PriceVariant[];
}

export const PACKAGES = packagesJson as unknown as Package[];

/** Shared across every package — shown on the package page and in the
 *  downloadable itinerary PDF. Kept in one place (/content/site.json) so
 *  the two can't drift. */
export const PACKAGE_EXCLUDES = siteJson.packageExcludes;

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

/** /content/site.json's `addons.flights` has no flat `rate` — it's priced
 *  off each destination's own `flight` field, which JSON can't express as a
 *  function, so that one case is wired up here. */
export const ADDONS: Record<AddonKey, Addon> = {
  flights: { ...siteJson.addons.flights, rate: (d) => d.flight } as Addon,
  visa: siteJson.addons.visa as Addon,
  guide: siteJson.addons.guide as Addon,
  experiences: siteJson.addons.experiences as Addon
};

export const ORIGIN = siteJson.origin;

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

/* --------------------------------------------------------------------------
   BROCHURE CONTENT — shared across every package's downloadable itinerary
   PDF (add-ons, booking notes, payment terms, why-us). /content/brochure.json
   -------------------------------------------------------------------------- */
export interface Brochure {
  addons: { service: string; description: string; price: string }[];
  notes: string[];
  paymentMethods: string[];
  paymentTerms: string[];
  whyUs: { title: string; copy: string }[];
}

export const BROCHURE = brochureJson as Brochure;
