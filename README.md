# Flying Colours Vacations

A boarding-pass themed travel site for **Flying Colours Vacations** — Southeast Asia
holiday specialists. Built with Next.js (App Router), GSAP and Lenis.

> *Adding colours to every journey.*

---

## Run it

```bash
npm install      # already done
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

---

## The idea

The whole site is one long airline metaphor. Navy and gold come straight out of the
logo; the type pairs an editorial serif (Fraunces) with a mono (JetBrains Mono) used
the way a real ticket uses it — tiny uppercase field labels, tabular numbers, barcodes.

**The arrival sequence.** Land on any page and a boarding pass fills the screen: the
logo, a `DEL → Southeast Asia` route, a counter running to 100 and a progress bar. At
100 a perforation is scored across the middle, a plane streaks along it trailing a
contrail, and the pass *tears in half* — the two halves fly apart and reveal the hero
underneath. The hero then animates in behind the tear: the background photo scales
down from 1.24, the headline rises word by word behind masks, and a dotted flight arc
draws itself across the screen with a plane parked at the end.

Return visits (and every internal navigation) replay a shorter version of the same
curtain, so route changes feel like the plane carrying you to the next page rather
than a page load.

---

## Pages

| Route | What's there |
|---|---|
| `/` | Hero reveal, ticker marquee, studio intro with counters, pinned horizontal destination rail, boarding-pass pricing teaser, services grid, split-flap departures board, testimonials, CTA |
| `/about` | Story, marquee, 5-stop timeline, four values, team grid |
| `/destinations` | Offset tile grid of all four countries |
| `/destinations/[slug]` | Vietnam · Bali · Thailand · Malaysia — overview + boarding pass, 5 highlights, day-by-day itinerary, photo mosaic, that country's packages, cross-links |
| `/services` | Six services, **interactive price configurator**, four-step process, **live package filter**, CTA |
| `/contact` | Contact cards, enquiry form, map, FAQ accordion |

Nav: Home · About · **Destinations** (dropdown with all four, each with photo, IATA
code and starting price) · Services · Contact.

---

## The two interactive pieces on `/services`

### Live filter
Filters all 16 itineraries with no submit button. Destination chips, **trip-length
chips** (4 days / 5–6 / 7+), a **budget slider**, and a sort toggle. Results
re-stagger in on every change and the count updates live.
→ `components/services/PackageFilter.tsx`

### Pricing configurator
The centrepiece. A **days slider (3–14) with tick marks**, a travellers stepper, three
stay tiers and four optional add-ons — and beside it a **boarding pass that re-prints
live** with the route, duration, traveller count and total. Prices count up rather
than snap, and a full line-item breakdown sits underneath.
→ `components/services/PriceConfigurator.tsx`

The maths lives in `lib/data.ts` (`quote()`): land cost is per person **per day**, so
6 days is never priced like 8. Trips of 7+ days take 6% off the daily rate (10% at
10+), and groups of 4+ take another 5% (8% at 6+). Add-ons are per person, or per
person per day for the private guide.

---

## Motion

| Piece | Where |
|---|---|
| Lenis smooth scroll wired into the GSAP ticker | `components/motion/MotionProvider.tsx` |
| The tearing boarding-pass curtain + route transitions | same file |
| Scroll-reveal engine (declarative, re-scans per route) | `components/motion/Reveals.tsx` |
| Trailing cursor with contextual labels | `components/motion/Cursor.tsx` |
| Hero entrance + flight-arc draw | `components/home/Hero.tsx` |
| Pinned horizontal destination rail | `components/home/HorizontalDestinations.tsx` |
| Split-flap departures board | `components/home/DepartureBoard.tsx` |
| Velocity-reactive marquee | `components/Marquee.tsx` |

### Declarative animation API

Add these to any element and `Reveals.tsx` picks them up:

```jsx
<div className="rise">        {/* fade + rise */}
<div className="reveal-clip"> {/* clip-path wipe */}
<div data-stagger="0.08">     {/* staggers its direct children */}
<Photo px={14} />             {/* vertical parallax scrub */}
<div data-px-y="-40">         {/* slow drift for decorative layers */}
<a data-magnetic="0.3">       {/* magnetic pull toward the pointer */}
<a data-cursor="Explore">     {/* expands the cursor, prints this label */}
```

Two effects are components rather than attributes, because they need to own
their own text:

```jsx
<SplitText as="h2">Ready for take-off<br />in full <em>colours</em>?</SplitText>
<Counter to={12400} suffix="+" />
```

`SplitText` wraps each word as `<span class="w"><i>word</i></span>` **at render
time**, keeping `<br />` and `<em>` intact. This matters: an earlier version
split words by rewriting the DOM after mount, which made React lose track of
the text nodes it owned and threw *"removeChild: the node to be removed is not
a child of this node"* on the next route change. Nothing in this codebase
writes `textContent` or `innerHTML` into an element React rendered children
for — if you add an effect that animates text, give it its own component and
drive it with state, the way `Counter` does.

Everything respects `prefers-reduced-motion` — animations are skipped and content
renders in its final state. There is also a `<noscript>` guard so the curtain can
never trap a visitor with JS disabled, and an 8-second failsafe if a route hangs.

---

## Editing content

**`lib/data.ts` is the single source of truth.** Destinations, itineraries,
highlights, galleries, all 16 packages, the pricing model, reviews, the departures
board and contact details all live there. The nav dropdown, destination pages,
filter and configurator all read from it — add a fifth country there and it appears
everywhere automatically.

### Two things to swap before launch

1. **Photography.** Every photo is an Unsplash placeholder built from
   `img('<photo-id>')` in `lib/data.ts`. All URLs were verified to load, but they were
   picked by ID — **please eyeball each one and replace with your own shoot.** Drop
   files in `public/` and change `img(...)` to `/your-photo.jpg`. Any image that fails
   to load degrades to a branded navy-and-gold frame rather than a broken icon
   (`components/Photo.tsx`).

2. **The contact form.** `components/ContactForm.tsx` has no backend — it composes a
   complete enquiry and hands it to the visitor's mail client, which genuinely works
   today. To wire it up properly, add `app/api/contact/route.ts` and `POST` the form
   data to it (Resend, Formspree and Nodemailer all drop straight in).

Other content lives inline in the page files: `app/about/page.tsx` (timeline, values,
team), `app/services/page.tsx` (service list, process steps), `app/contact/page.tsx`
(FAQs).

---

## Design tokens

All in `app/globals.css` under `:root` — navy scale, gold scale, paper scale, fluid
type ramp, spacing and easings. `app/pages.css` holds the section-level modules
(hero, board, rail, filter, configurator, forms).

```
--navy-900  #050F24     --gold-500  #E3A63C     --paper-100  #FBF8F1
```

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · GSAP 3 + ScrollTrigger ·
Lenis · `next/font` (self-hosted Fraunces, Manrope, JetBrains Mono). No CSS framework
— the design system is hand-written.
