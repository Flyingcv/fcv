/* ==========================================================================
   FLYING COLOURS VACATIONS — Shared data layer
   Nav dropdown, destination pages, the Services filter and the pricing
   configurator all read from here. Change content in ONE place.
   ========================================================================== */

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
   DESTINATIONS
   -------------------------------------------------------------------------- */
export const DESTINATIONS: Record<DestinationSlug, Destination> = {
  vietnam: {
    slug: 'vietnam',
    name: 'Vietnam',
    iata: 'SGN',
    tagline: 'Limestone bays, lantern-lit lanes',
    blurb:
      'Emerald karsts rising out of Halong Bay, motorbike symphonies in Hanoi, and the tailor shops of Hoi An glowing under a thousand silk lanterns. Vietnam moves fast and rewards travellers who slow down.',
    cover: img('1528181304800-259b08848526'),
    hero: img('1583417319070-4a69db38a482', 2000),
    cities: ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Hoi An', 'Halong', 'Sapa', 'Phu Quoc', 'Nha Trang'],
    facts: {
      'Flight time': '5h 20m direct',
      'Best season': 'Oct — Apr',
      Currency: 'VND (₫)',
      Visa: 'e-Visa · 3 days'
    },
    perDay: 5200,
    flight: 24000,
    fromPrice: 42999,
    highlights: [
      ['Halong Bay overnight cruise', 'Sleep on the water among 1,600 limestone islands, kayak into hidden lagoons at sunrise.'],
      ['Hoi An lantern old town', 'A UNESCO trading port frozen in the 15th century — best walked after dark.'],
      ['Ba Na Hills & Golden Bridge', 'Cable car above the clouds to the stone hands holding a walkway in the sky.'],
      ['Sapa rice terraces trek', 'Homestay with Hmong families on staircase valleys carved over 300 years.'],
      ['Mekong Delta floating market', 'Sampan through coconut canals to a market that opens at 5am on the water.']
    ],
    itinerary: [
      ['Arrive Hanoi', 'Airport meet-and-greet, transfer to the Old Quarter. Evening egg-coffee walk and a water puppet show on Hoan Kiem lake.'],
      ['Ninh Binh day trip', 'Rowboat through the Trang An caves, cycle to Hoa Lu, climb the 500 steps to Mua Cave for the valley panorama.'],
      ['Halong Bay cruise', 'Board a deluxe junk, kayak Luon Cave, squid fishing after dinner, sunrise tai chi on the sundeck.'],
      ['Fly to Da Nang', 'My Khe beach afternoon, then the Dragon Bridge fire show. Overnight in Da Nang.'],
      ['Hoi An & Ba Na Hills', 'Golden Bridge in the morning, lantern-lit Ancient Town in the evening with a basket-boat ride.'],
      ['Departure', 'Free morning for tailoring pick-up and cafés before the transfer to the airport.']
    ],
    gallery: [
      img('1528127269322-539801943592'),
      img('1526481280693-3bfa7568e0f3'),
      img('1555921015-5532091f6026'),
      img('1470004914212-05527e49370b')
    ]
  },

  bali: {
    slug: 'bali',
    name: 'Bali',
    iata: 'DPS',
    tagline: 'Island of a thousand temples',
    blurb:
      'Volcanic ridgelines, cliff-edge temples over the Indian Ocean, and rice terraces that look engineered by water and patience. Bali does honeymoons, surf trips and slow family weeks equally well.',
    cover: img('1537996194471-e657df975ab4'),
    hero: img('1552733407-5d5c46c3bb3b', 2000),
    cities: ['Seminyak', 'Ubud', 'Uluwatu', 'Nusa Penida', 'Canggu', 'Kintamani'],
    facts: {
      'Flight time': '7h 10m · 1 stop',
      'Best season': 'Apr — Oct',
      Currency: 'IDR (Rp)',
      Visa: 'Visa on arrival'
    },
    perDay: 6100,
    flight: 27500,
    fromPrice: 48999,
    highlights: [
      ['Nusa Penida day cruise', 'Kelingking cliff, Broken Beach and snorkelling with manta rays off Manta Point.'],
      ['Ubud rice terraces', 'Tegallalang at first light, then a jungle swing over the Ayung river gorge.'],
      ['Uluwatu Kecak fire dance', 'Sunset over a clifftop temple with 70 chanting performers and no instruments.'],
      ['Mount Batur sunrise trek', 'A 2am start and a two-hour climb rewarded with breakfast steamed over a volcano vent.'],
      ['Private villa living', 'Pool villas in Seminyak and Ubud with breakfast cooked in your own kitchen.']
    ],
    itinerary: [
      ['Arrive Denpasar', 'Private transfer to your Seminyak villa. Sunset at Double Six beach and a seafood grill in Jimbaran.'],
      ['Uluwatu & the south', 'Padang Padang beach, Uluwatu temple, and the Kecak fire dance as the sun drops.'],
      ['Nusa Penida', 'Fast boat across the strait for Kelingking, Angel’s Billabong and Broken Beach.'],
      ['Move to Ubud', 'Tegallalang terraces, Tirta Empul holy spring, and a Balinese cooking class with a local family.'],
      ['Mount Batur sunrise', 'Guided summit trek, natural hot springs afterwards, free afternoon in the Ubud art market.'],
      ['Departure', 'Spa morning at the villa, late checkout, transfer to DPS.']
    ],
    gallery: [
      img('1573790387438-4da905039392'),
      img('1518548419970-58e3b4079ab2'),
      img('1604999333679-b86d54738315'),
      img('1555400038-63f5ba517a47')
    ]
  },

  thailand: {
    slug: 'thailand',
    name: 'Thailand',
    iata: 'BKK',
    tagline: 'Temples, islands and night markets',
    blurb:
      'Gold-tiled temples in Bangkok, longtail boats cutting between Krabi’s limestone stacks, and street food that has no business being that good for that little. The easiest first passport stamp in Asia.',
    cover: img('1552465011-b4e21bf6e79a'),
    hero: img('1508009603885-50cf7c579365', 2000),
    cities: ['Bangkok', 'Phuket', 'Krabi', 'Pattaya', 'Phi Phi', 'Chiang Mai'],
    facts: {
      'Flight time': '4h 15m direct',
      'Best season': 'Nov — Mar',
      Currency: 'THB (฿)',
      Visa: 'Visa-free · 60 days'
    },
    perDay: 4800,
    flight: 19500,
    fromPrice: 34999,
    highlights: [
      ['Phi Phi & Maya Bay', 'Speedboat island hop with snorkelling stops at Bamboo Island and Pileh Lagoon.'],
      ['Grand Palace & Wat Arun', 'Bangkok’s royal complex, then a Chao Phraya ferry to the Temple of Dawn.'],
      ['James Bond Island canoe', 'Sea-canoe through Phang Nga’s hidden sea caves and mangrove hongs.'],
      ['Floating & night markets', 'Damnoen Saduak by boat, then Asiatique or Chatuchak after sunset.'],
      ['Krabi four-island tour', 'Railay, Chicken Island, Tup and Poda — the postcard version of Thailand.']
    ],
    itinerary: [
      ['Arrive Bangkok', 'Transfer to Sukhumvit, evening Chao Phraya dinner cruise past the illuminated temples.'],
      ['Bangkok city', 'Grand Palace, Wat Pho reclining Buddha and Wat Arun, then Chinatown street food by tuk-tuk.'],
      ['Fly to Krabi', 'Ao Nang check-in, sunset at Railay West with a longtail transfer.'],
      ['Four-island tour', 'Chicken Island sandbar, Tup Island walk-across, snorkelling at Poda.'],
      ['Phi Phi speedboat', 'Maya Bay, Viking Cave, Monkey Beach and lunch on Phi Phi Don.'],
      ['Departure', 'Free morning, transfer to Krabi airport for the flight home.']
    ],
    gallery: [
      img('1563492065599-3520f775eeed'),
      img('1528181304800-259b08848526'),
      img('1552465011-b4e21bf6e79a'),
      img('1506665531195-3566af2b4dfa')
    ]
  },

  malaysia: {
    slug: 'malaysia',
    name: 'Malaysia',
    iata: 'KUL',
    tagline: 'Skylines, highlands, rainforest',
    blurb:
      'Twin towers over a food capital, a casino city in the clouds an hour away, and Langkawi’s duty-free beaches. Malaysia packs three completely different holidays into one short-haul flight.',
    cover: img('1596422846543-75c6fc197f07'),
    hero: img('1508062878650-88b52897f298', 2000),
    cities: ['Kuala Lumpur', 'Genting Highlands', 'Langkawi', 'Penang', 'Malacca'],
    facts: {
      'Flight time': '4h 45m direct',
      'Best season': 'Dec — Apr',
      Currency: 'MYR (RM)',
      Visa: 'Visa-free entry'
    },
    perDay: 5000,
    flight: 21000,
    fromPrice: 37999,
    highlights: [
      ['Petronas Towers skybridge', 'Level 86 observation deck plus the KLCC fountain show after dark.'],
      ['Genting Highlands', 'Awana SkyWay cable car into the cloud forest, Skytropolis indoor theme park.'],
      ['Batu Caves', '272 rainbow steps up to a limestone cathedral guarded by a 42m gold statue.'],
      ['Langkawi Sky Bridge', 'Cable car to Gunung Mat Cincang and a curved bridge suspended over the rainforest.'],
      ['Island hopping & eagle feeding', 'Dayang Bunting lake, Beras Basah beach and the Kilim geoforest mangroves.']
    ],
    itinerary: [
      ['Arrive Kuala Lumpur', 'Transfer to Bukit Bintang. Evening at the KLCC park fountain show and Jalan Alor food street.'],
      ['KL city tour', 'Batu Caves, King’s Palace, Merdeka Square and the Petronas Towers skybridge.'],
      ['Genting Highlands', 'Awana SkyWay, Chin Swee temple, and an afternoon at Skytropolis before returning to KL.'],
      ['Fly to Langkawi', 'Beach afternoon at Pantai Cenang, sunset dinner on the sand.'],
      ['Island hopping & SkyCab', 'Morning island hop, afternoon Sky Bridge and the Panorama cable car.'],
      ['Departure', 'Duty-free shopping in Kuah town before the transfer to LGK.']
    ],
    gallery: [
      img('1516426122078-c23e76319801'),
      img('1512100356356-de1b84283e18'),
      img('1508062878650-88b52897f298'),
      img('1528181304800-259b08848526')
    ]
  }
};

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
  was: number;
  badge: string;
  type: string[];
  blurb: string;
  includes: string[];
  image: string;
}

export const PACKAGES: Package[] = [
  {
    id: 'vn-halong-heritage',
    dest: 'vietnam',
    title: 'Hanoi · Ninh Binh · Halong Bay',
    where: 'North Vietnam',
    days: 6, nights: 5, price: 62999, was: 74999,
    badge: 'Bestseller', type: ['culture', 'nature'],
    blurb: 'Old Quarter mornings, a Trang An rowboat afternoon and a night anchored among the karsts of Halong Bay.',
    includes: ['4★ Hotels', 'Overnight Cruise', 'All Transfers', 'Daily Breakfast'],
    image: img('1528127269322-539801943592', 900)
  },
  {
    id: 'vn-central-express',
    dest: 'vietnam',
    title: 'Da Nang & Hoi An Heritage',
    where: 'Central Vietnam',
    days: 4, nights: 3, price: 42999, was: 49999,
    badge: 'Short break', type: ['culture', 'beach'],
    blurb: 'Golden Bridge above the clouds, My Khe beach afternoons and lantern-lit evenings in the Ancient Town.',
    includes: ['4★ Hotels', 'Ba Na Hills', 'Basket Boat', 'Airport Pickup'],
    image: img('1583417319070-4a69db38a482', 900)
  },
  {
    id: 'vn-grand-tour',
    dest: 'vietnam',
    title: 'Grand Vietnam — North to South',
    where: 'Hanoi → Saigon',
    days: 10, nights: 9, price: 118999, was: 139999,
    badge: 'Signature', type: ['culture', 'nature'],
    blurb: 'Sapa terraces, Halong Bay, Hoi An lanterns and the Mekong Delta in one carefully paced ten-day arc.',
    includes: ['4★ & 5★ Mix', '2 Domestic Flights', 'Sapa Homestay', 'Private Guide'],
    image: img('1526481280693-3bfa7568e0f3', 900)
  },
  {
    id: 'vn-phu-quoc',
    dest: 'vietnam',
    title: 'Phu Quoc Island & VinWonders',
    where: 'Phu Quoc',
    days: 5, nights: 4, price: 56999, was: 65999,
    badge: 'Family', type: ['beach', 'family'],
    blurb: 'The world’s longest sea cable car, a safari park, and sunsets from the quietest beaches in Vietnam.',
    includes: ['Beach Resort', 'VinWonders Pass', 'Safari Entry', 'Half Board'],
    image: img('1555921015-5532091f6026', 900)
  },
  {
    id: 'bali-honeymoon',
    dest: 'bali',
    title: 'Bali Honeymoon — Villas & Volcanoes',
    where: 'Seminyak → Ubud',
    days: 6, nights: 5, price: 74999, was: 89999,
    badge: 'Honeymoon', type: ['honeymoon', 'luxury'],
    blurb: 'Private pool villas, a floating breakfast, Kecak fire dance at Uluwatu and a candlelit dinner on the sand.',
    includes: ['Pool Villas', 'Floating Breakfast', 'Couple Spa', 'Romantic Dinner'],
    image: img('1537996194471-e657df975ab4', 900)
  },
  {
    id: 'bali-island-hop',
    dest: 'bali',
    title: 'Bali & Nusa Penida Explorer',
    where: 'Bali + Nusa Islands',
    days: 7, nights: 6, price: 84999, was: 97999,
    badge: 'Adventure', type: ['adventure', 'beach'],
    blurb: 'Kelingking cliff, Manta Point snorkelling and a 2am summit push up Mount Batur for sunrise.',
    includes: ['4★ Hotels', 'Fast Boat', 'Batur Trek', 'Snorkel Gear'],
    image: img('1573790387438-4da905039392', 900)
  },
  {
    id: 'bali-quick',
    dest: 'bali',
    title: 'Bali Beach Escape',
    where: 'Seminyak & Kuta',
    days: 4, nights: 3, price: 48999, was: 55999,
    badge: 'Value', type: ['beach'],
    blurb: 'A long weekend of beach clubs, sunset cliffs and warungs — the shortest way to feel far away.',
    includes: ['4★ Hotel', 'Beach Club Entry', 'Uluwatu Tour', 'Breakfast'],
    image: img('1518548419970-58e3b4079ab2', 900)
  },
  {
    id: 'bali-family',
    dest: 'bali',
    title: 'Bali Family Week',
    where: 'Nusa Dua → Ubud',
    days: 8, nights: 7, price: 92999, was: 108999,
    badge: 'Family', type: ['family', 'nature'],
    blurb: 'Waterbom park, a safari and marine park, elephant sanctuary and gentle rice-terrace walks for all ages.',
    includes: ['Family Rooms', 'Park Tickets', 'Kids Eat Free', 'Private Van'],
    image: img('1604999333679-b86d54738315', 900)
  },
  {
    id: 'th-bangkok-pattaya',
    dest: 'thailand',
    title: 'Bangkok & Pattaya Classic',
    where: 'Bangkok · Pattaya',
    days: 5, nights: 4, price: 34999, was: 42999,
    badge: 'Bestseller', type: ['culture', 'beach'],
    blurb: 'Grand Palace mornings, Coral Island afternoons and the Alcazar show to close the night.',
    includes: ['4★ Hotels', 'Coral Island', 'Alcazar Show', 'All Transfers'],
    image: img('1508009603885-50cf7c579365', 900)
  },
  {
    id: 'th-krabi-phi-phi',
    dest: 'thailand',
    title: 'Krabi & Phi Phi Islands',
    where: 'Andaman Coast',
    days: 6, nights: 5, price: 52999, was: 61999,
    badge: 'Islands', type: ['beach', 'adventure'],
    blurb: 'Four-island longtail tour, Maya Bay by speedboat and sea-canoeing through Phang Nga’s hidden hongs.',
    includes: ['Beachfront Stay', '2 Island Tours', 'Snorkelling', 'Breakfast'],
    image: img('1552465011-b4e21bf6e79a', 900)
  },
  {
    id: 'th-phuket-quick',
    dest: 'thailand',
    title: 'Phuket Long Weekend',
    where: 'Phuket',
    days: 4, nights: 3, price: 28999, was: 34999,
    badge: 'Value', type: ['beach'],
    blurb: 'Patong sunsets, a James Bond Island day trip and enough time to do absolutely nothing.',
    includes: ['3★+ Hotel', 'Phang Nga Tour', 'Airport Transfer', 'Breakfast'],
    image: img('1563492065599-3520f775eeed', 900)
  },
  {
    id: 'th-grand',
    dest: 'thailand',
    title: 'Thailand Grand Circuit',
    where: 'Bangkok · Chiang Mai · Phuket',
    days: 9, nights: 8, price: 89999, was: 104999,
    badge: 'Signature', type: ['culture', 'adventure', 'beach'],
    blurb: 'Temples in the capital, elephants in the north and the Andaman islands to finish — two domestic flights.',
    includes: ['4★ Hotels', '2 Domestic Flights', 'Elephant Sanctuary', 'Private Guide'],
    image: img('1506665531195-3566af2b4dfa', 900)
  },
  {
    id: 'my-kl-genting',
    dest: 'malaysia',
    title: 'Kuala Lumpur & Genting Highlands',
    where: 'KL · Genting',
    days: 5, nights: 4, price: 37999, was: 45999,
    badge: 'Bestseller', type: ['culture', 'family'],
    blurb: 'Petronas skybridge, Batu Caves and a cable car ride into the cloud forest above Kuala Lumpur.',
    includes: ['4★ Hotels', 'SkyWay Cable Car', 'City Tour', 'Breakfast'],
    image: img('1596422846543-75c6fc197f07', 900)
  },
  {
    id: 'my-langkawi',
    dest: 'malaysia',
    title: 'Langkawi Island Retreat',
    where: 'Langkawi',
    days: 4, nights: 3, price: 33999, was: 39999,
    badge: 'Short break', type: ['beach', 'honeymoon'],
    blurb: 'Sky Bridge above the rainforest canopy, island hopping by speedboat and duty-free sunsets at Cenang.',
    includes: ['Beach Resort', 'SkyCab Tickets', 'Island Hopping', 'Breakfast'],
    image: img('1516426122078-c23e76319801', 900)
  },
  {
    id: 'my-twin-city',
    dest: 'malaysia',
    title: 'Malaysia Twin City — KL & Langkawi',
    where: 'KL → Langkawi',
    days: 7, nights: 6, price: 64999, was: 76999,
    badge: 'Popular', type: ['family', 'beach', 'culture'],
    blurb: 'City energy first, island time second — connected by a 55-minute domestic hop.',
    includes: ['4★ Hotels', 'Domestic Flight', '2 Tours', 'All Transfers'],
    image: img('1512100356356-de1b84283e18', 900)
  },
  {
    id: 'my-luxe',
    dest: 'malaysia',
    title: 'Borneo & Langkawi Luxury',
    where: 'Kota Kinabalu · Langkawi',
    days: 8, nights: 7, price: 104999, was: 124999,
    badge: 'Luxury', type: ['luxury', 'nature'],
    blurb: 'Orangutan sanctuary mornings, private-island resorts and a sunset cruise on the South China Sea.',
    includes: ['5★ Resorts', 'Domestic Flights', 'Private Guide', 'Half Board'],
    image: img('1508062878650-88b52897f298', 900)
  }
];

/* --------------------------------------------------------------------------
   PRICING MODEL — drives the interactive configurator
   -------------------------------------------------------------------------- */
export type TierKey = 'comfort' | 'premium' | 'luxury';
export type AddonKey = 'flights' | 'visa' | 'guide' | 'experiences';

export const TIERS: Record<TierKey, { label: string; note: string; mult: number }> = {
  comfort: { label: 'Comfort', note: '3★ / 4★', mult: 1.0 },
  premium: { label: 'Premium', note: '4★ / 5★', mult: 1.45 },
  luxury: { label: 'Luxury', note: '5★ + villas', mult: 2.1 }
};

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

/** Longer trips and bigger groups reduce the per-day land cost. */
export const lengthDiscount = (days: number) => (days >= 10 ? 0.1 : days >= 7 ? 0.06 : 0);
export const groupDiscount = (pax: number) => (pax >= 6 ? 0.08 : pax >= 4 ? 0.05 : 0);

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
  saved: number;
  total: number;
  perPerson: number;
  lines: { label: string; amount: number }[];
}

export function quote({ dest, days, pax, tier, addons }: QuoteInput): Quote {
  const d = DESTINATIONS[dest];
  const t = TIERS[tier];

  const landRaw = d.perDay * days * pax * t.mult;
  const disc = lengthDiscount(days) + groupDiscount(pax);
  const land = Math.round(landRaw * (1 - disc));
  const saved = Math.round(landRaw - land);

  const lines = [{ label: `${t.label} land package · ${days}D / ${days - 1}N`, amount: land }];

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
  return { land, extras, saved, total, perPerson: Math.round(total / pax), lines };
}

/** ₹ 62,999 — Indian digit grouping */
export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

/* --------------------------------------------------------------------------
   SUPPORTING CONTENT
   -------------------------------------------------------------------------- */
export const REVIEWS = [
  {
    text: 'The romantic dinner on the beach in Da Nang and the private tours in Phu Quoc were genuinely magical. Everything was handled before we even thought to ask.',
    name: 'Rhea S.',
    meta: 'Honeymoon · Vietnam',
    avatar: img('1494790108377-be9c29b29330', 200)
  },
  {
    text: 'Three generations, ages 6 to 71, and not one complaint. The Bali itinerary was paced so nobody was ever rushed. That takes real planning experience.',
    name: 'Arvind M.',
    meta: 'Family of 9 · Bali',
    avatar: img('1507003211169-0a1dd7228f2d', 200)
  },
  {
    text: 'Our Krabi flight got cancelled at 11pm. They had us rebooked and the hotel informed before we finished reading the airline email. That is the whole value.',
    name: 'Nikita Deshpande',
    meta: 'Islands · Thailand',
    avatar: img('1438761681033-6461ffad8d80', 200)
  },
  {
    text: 'I had quotes from four agencies. Flying Colours was the only one that showed me a per-day breakup instead of one lump sum. That transparency is why I booked.',
    name: 'Karthik Raghavan',
    meta: 'Bengaluru · Malaysia',
    avatar: img('1500648767791-00dcc994a43e', 200)
  },
  {
    text: 'The floating breakfast photo everyone posts — they arranged it without us even asking, on our anniversary morning. Small thing, but we still talk about it.',
    name: 'Meera & Devansh Patel',
    meta: 'Anniversary · Bali',
    avatar: img('1531427186611-ecfd6d936c79', 200)
  },
  {
    text: 'Travelling solo as a woman, I was nervous about Vietnam. My planner shared driver details and hotel contacts before every leg. I never once felt unsure.',
    name: 'Ishita Bose',
    meta: 'Solo · Vietnam',
    avatar: img('1544005313-94ddf0286df2', 200)
  },
  {
    text: 'Fourteen of us, three cities, one bus, zero chaos. Whoever built that Kuala Lumpur to Langkawi schedule deserves a raise.',
    name: 'Harpreet Singh Gill',
    meta: 'Group of 14 · Malaysia',
    avatar: img('1506794778202-cad84cf45f1d', 200)
  },
  {
    text: 'My parents are in their seventies and needed a slower pace. The Halong cruise cabin they picked had step-free access — nobody else even thought to check.',
    name: 'Ananya Krishnan',
    meta: 'With parents · Vietnam',
    avatar: img('1573497019940-1c28c88b4f3e', 200)
  }
];

export const BOARD_ROWS = [
  { flight: 'FCV 214', dest: 'HO CHI MINH', gate: 'A12', dur: '5H 20M', status: 'BOARDING', soon: false },
  { flight: 'FCV 508', dest: 'DENPASAR BALI', gate: 'B04', dur: '7H 10M', status: 'ON TIME', soon: false },
  { flight: 'FCV 331', dest: 'BANGKOK', gate: 'C21', dur: '4H 15M', status: 'BOARDING', soon: false },
  { flight: 'FCV 776', dest: 'KUALA LUMPUR', gate: 'A07', dur: '4H 45M', status: 'ON TIME', soon: false },
  { flight: 'FCV 119', dest: 'PHU QUOC', gate: 'D02', dur: '6H 40M', status: 'CHECK IN', soon: true }
];

export const CONTACT = {
  phone: '+91 70174 40214',
  phoneHref: 'tel:+917017440214',
  email: 'info@flyingcoloursvacations.com',
  address: 'Unit 604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, UP 201305',
  hours: 'Mon – Sat · 10:00 – 19:00 IST',
  emergency: '24 / 7 on-trip support for travelling guests'
};
