import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Counter from '@/components/Counter';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import BoardingPass from '@/components/BoardingPass';
import Hero from '@/components/home/Hero';
import HorizontalDestinations from '@/components/home/HorizontalDestinations';
import Testimonials from '@/components/home/Testimonials';
import GlimpseRail from '@/components/home/GlimpseRail';
import { ArrowRight, Star, Plane } from '@/components/icons';
import { img } from '@/lib/data';

const SERVICES = [
  ['01', 'Personalised itineraries', 'Nothing off a shelf. We build around your dates, your pace and the three things you actually care about seeing.'],
  ['02', 'Expert local guides', 'English-speaking guides we have travelled with ourselves, in every city on your route.'],
  ['03', 'Visas, flights & insurance', 'e-Visa filing, fare-class advice and cover that pays out. One invoice, no third parties.'],
  ['04', 'Stress-free on-trip support', 'A real person on WhatsApp for the whole trip — cancelled flights get solved before you finish reading the email.']
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        dir="right"
        items={[
          'Vietnam', '*Bali', 'Thailand', '*Malaysia',
          'Halong Bay', '*Nusa Penida', 'Phi Phi', '*Langkawi'
        ]}
      />

      {/* ------------------------------------------------------ who we are */}
      <section className="section">
        <div className="wrap">
          <div className="intro__layout">
            <div className="intro__copy">
              <span className="tag rise">Why Flying Colours</span>
              <SplitText as="h2">We don’t sell packages.<br />We plan journeys.</SplitText>
              <p className="lede rise" style={{ ['--d' as string]: '.1s' } as React.CSSProperties}>
                Since 2014 we have run one thing extremely well: Southeast Asia. Vietnam,
                Bali, Thailand and Malaysia — the four countries our team has walked,
                eaten and argued about, itinerary by itinerary.
              </p>
              <p className="rise mt-1" style={{ ['--d' as string]: '.18s' } as React.CSSProperties}>
                That focus is the whole product. We know which Halong cruise actually has hot
                water, which Ubud villa is worth the transfer, and which Krabi tour operator
                answers the phone in a storm. You get that judgement, not a call centre.
              </p>

              <div className="intro__stats">
                <div className="stat">
                  <Counter to={11} suffix="+" />
                  <span>Years planning<br />Southeast Asia</span>
                </div>
                <div className="stat">
                  <Counter to={12400} suffix="+" />
                  <span>Travellers<br />sent abroad</span>
                </div>
                <div className="stat">
                  <Counter to={4.8} decimals={1} />
                  <span>Average rating<br />1,564 reviews</span>
                </div>
              </div>

              <TLink href="/about" className="btn btn--navy mt-3" data-magnetic="0.3">
                Our story
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="intro__media">
              <div className="media media--r4x5 media--px media--a reveal-clip">
                <Photo src={img('1526481280693-3bfa7568e0f3', 1200)} alt="Traveller looking out over a Vietnamese valley" px={14} />
              </div>
              <div className="media media--r1x1 media--px media--b reveal-clip">
                <Photo src={img('1537996194471-e657df975ab4', 900)} alt="Rice terraces in Ubud, Bali" px={10} />
              </div>
              <div className="intro__badge" data-px-y="-40">
                Since<br />2014
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizontalDestinations />

      {/* -------------------------------------------- the pass / calculator */}
      <section className="section on-navy" style={{ overflow: 'hidden' }}>
        <div className="wrap">
          <div className="dsplit dsplit--pass" style={{ alignItems: 'center' }}>
            <div>
              <span className="tag rise">Transparent pricing</span>
              <SplitText as="h2" style={{ fontSize: 'var(--t-2xl)', marginBlock: '.8rem 1.4rem' }}>
                Your whole trip,<br />printed on one pass.
              </SplitText>
              <p className="lede rise">
                Move a slider, change the number of nights, pick a stay standard —
                and watch the price update live on your own boarding pass. No enquiry form
                before you can see a number.
              </p>

              <ul className="hilite-list">
                {[
                  ['Per-day pricing', 'Land cost is calculated per person per day, so 6 nights is never priced like 8.'],
                  ['One straight number', 'No hidden fees, no fine-print discount that only shows up at checkout.'],
                  ['Send it on WhatsApp', 'Get your quote straight to a planner and keep talking from there.']
                ].map(([t, d]) => (
                  <li className="hilite rise" key={t}>
                    <span>—</span>
                    <div>
                      <b>{t}</b>
                      <p>{d}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <TLink href="/services#configurator" className="btn btn--gold mt-3" data-magnetic="0.3">
                Open the price calculator
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="rise" data-px-y="-50">
              <BoardingPass
                notch="var(--paper-200)"
                from="DEL"
                to="SGN"
                fromCity="New Delhi"
                toCity="Ho Chi Minh"
                stamp="Fare locked · FCV"
                code="FCV · 214 · 0725 · SGN · ECONOMY"
                fields={[
                  { label: 'Passenger', value: 'Your name here' },
                  { label: 'Duration', value: '06 Days / 05 Nights', mono: true },
                  { label: 'Total', value: '₹62,999', big: true }
                ]}
                stubFields={[
                  { label: 'Flight', value: 'FCV 214', mono: true },
                  { label: 'Gate', value: 'A12', mono: true },
                  { label: 'Seat', value: '14A', mono: true }
                ]}
              />
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
              <SplitText as="h2">Everything between<br />booking and boarding.</SplitText>
            </div>
            <TLink href="/services" className="link-u" style={{ color: 'var(--navy-800)' }}>
              All services & packages <ArrowRight className="btn__icon" />
            </TLink>
          </div>

          <div className="grid grid-4" data-stagger="0.08">
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

      {/* ------------------------------------------------------ testimonials */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Seat 4.8 / 5 · 1,564 reviews</span>
              <SplitText as="h2">Postcards from<br />the people we sent.</SplitText>
            </div>
            <div className="stars" aria-label="4.8 out of 5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
            </div>
          </div>
        </div>

        <Testimonials />
      </section>

      {/* --------------------------------------------------------- glimpses */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Straight from their cameras</span>
              <SplitText as="h2">Glimpses from<br />the road.</SplitText>
            </div>
            <TLink href="/about#glimpses" className="link-u" style={{ color: 'var(--gold-600)' }}>
              See more glimpses <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>

        <GlimpseRail images={Array.from({ length: 17 }, (_, i) => `/trip-glimpses/glimpse-${String(i + 1).padStart(2, '0')}.jpg`)} />
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1470004914212-05527e49370b', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">Final call</span>
            <SplitText as="h2">Ready for take-off<br />in full <em>colours</em>?</SplitText>
            <p className="lede rise" style={{ margin: '0 auto' }}>
              Tell us your dates and rough budget. You will get a real itinerary and a
              real price from a planner — usually the same day.
            </p>
            <div className="hero__actions rise" style={{ justifyContent: 'center' }}>
              <TLink href="/contact" className="btn btn--gold" data-magnetic="0.3">
                Talk to a planner
                <ArrowRight className="btn__icon" />
              </TLink>
              <TLink href="/services#configurator" className="btn btn--ghost" data-magnetic="0.3">
                Price it myself
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Refinement iteration 17 for code quality and clarity

// Refinement iteration 39 for code quality and clarity

// Refinement iteration 61 for code quality and clarity

// Refinement iteration 12 for code quality and clarity

// Refinement iteration 34 for code quality and clarity

// Refinement iteration 1 for code quality and clarity

// Refinement iteration 3 for code quality and clarity
