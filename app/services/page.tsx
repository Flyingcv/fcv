import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import PackageFilter from '@/components/services/PackageFilter';
import PriceConfigurator from '@/components/services/PriceConfigurator';
import { ArrowRight, Plane } from '@/components/icons';
import { img, PACKAGES } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Services & packages',
  description:
    'Filter every Southeast Asia package by days and budget, then build your own price with the interactive boarding-pass calculator.'
};

const SERVICES = [
  ['01', 'Personalised itineraries', 'Built around your dates, your pace and the three things you actually want to see. Nothing off a shelf.'],
  ['02', 'Expert local guides', 'English-speaking guides in every city on your route — people we have travelled with ourselves.'],
  ['03', 'Flights & fare advice', 'IATA-partnered ticketing, honest advice on fare classes, and re-issue support if plans move.'],
  ['04', 'Visa & travel insurance', 'e-Visa filing for Vietnam, VOA guidance for Bali, and cover that actually pays out.'],
  ['05', 'Hotels & private transfers', 'Rooms we have inspected, drivers we have used, and airport meet-and-greet on every arrival.'],
  ['06', '24/7 on-trip support', 'One WhatsApp thread for the whole trip. Cancelled flights get solved before you finish the email.']
];

const STEPS = [
  ['Tell us the shape', 'Dates, rough budget, who is travelling and what you would hate to miss. Five minutes on a call.'],
  ['We draft the route', 'A day-by-day itinerary with real hotels and real prices — usually back with you the same day.'],
  ['You redraw it', 'Swap a city, add two nights, drop the 5am trek. We rebuild until it reads like your holiday.'],
  ['Fly, we stay on', 'Documents, transfers and a planner on WhatsApp for the entire trip. Then a postcard, hopefully.']
];

export default function ServicesPage() {
  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={img('1436491865332-7a61a109cc05', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Services</span>
            </nav>
            <span className="tag tag--light">Everything between booking and boarding</span>
            <SplitText as="h1" className="mt-1">Services<br />&amp; packages</SplitText>
            <p className="lede mt-2" style={{ maxWidth: '52ch' }}>
              Filter {PACKAGES.length} ready-made itineraries by length and budget — or move a
              slider and build your own price from scratch.
            </p>

            <div className="hero__actions mt-3">
              <a href="#configurator" className="btn btn--gold" data-magnetic="0.3">
                Open the price calculator
                <ArrowRight className="btn__icon" />
              </a>
              <a href="#packages" className="btn btn--ghost" data-magnetic="0.3">
                Browse packages
                <ArrowRight className="btn__icon" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- services */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">What we handle</span>
              <SplitText as="h2">Six jobs we take<br />off your desk.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '36ch' }}>
              One planner owns your file end to end. You never get passed to a
              different department halfway through.
            </p>
          </div>

          <div className="grid grid-3" data-stagger="0.07">
            {SERVICES.map(([num, title, copy]) => (
              <article className="svc-card" key={num}>
                <span className="svc-card__num">{num}</span>
                <Plane className="svc-card__ico" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ pricing calculator */}
      <section className="section on-navy" id="configurator" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Interactive · live pricing</span>
              <SplitText as="h2">Build the price.<br />Watch the pass print.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              Land cost is calculated per person per day, so nothing is rounded up to a
              package you did not ask for. Everything below updates instantly.
            </p>
          </div>

          <PriceConfigurator />
        </div>
      </section>

      {/* ---------------------------------------------------- how it works */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">How it works</span>
              <SplitText as="h2">Four steps from<br />idea to boarding.</SplitText>
            </div>
          </div>

          <div className="itin">
            {STEPS.map(([title, copy], i) => (
              <article className="itin__day rise" key={title}>
                <span className="itin__num">Step {String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- packages + filter */}
      <section className="section on-navy" id="packages" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{PACKAGES.length} itineraries · live filter</span>
              <SplitText as="h2">Find your route.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '36ch' }}>
              Filter by destination, number of days and budget per person. Results update
              as you move — nothing to submit.
            </p>
          </div>

          <PackageFilter />
        </div>
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1488646953014-85cb44e25828', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">Nothing quite right?</span>
            <SplitText as="h2">Then we’ll build<br />it from <em>scratch</em>.</SplitText>
            <p className="lede rise" style={{ margin: '0 auto' }}>
              Roughly 6 in 10 of our trips start as a custom brief rather than a listed
              package. Send us the shape and we will draft the rest.
            </p>
            <TLink href="/contact" className="btn btn--gold rise" data-magnetic="0.3">
              Start a custom trip
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}

// Refinement iteration 19 for code quality and clarity

// Refinement iteration 41 for code quality and clarity
