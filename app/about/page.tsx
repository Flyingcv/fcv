import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import { ArrowRight, Pin, Star, Plane, Check, Mail, Phone } from '@/components/icons';
import { img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Flying Colours Vacations plans international holidays from Noida — transparent pricing, dependable service and 24/7 on-trip support.'
};

const VALUES: [string, string][] = [
  ['Customer first', 'Every recommendation we make is based on what’s best for you — never what’s easiest to sell.'],
  ['Professional service', 'From your first enquiry to your return journey, our team stays committed to seamless support.'],
  ['Best value', 'Premium hotels, exciting sightseeing and carefully selected experiences at prices that hold their own.'],
  ['Trust & transparency', 'Clear communication, honest pricing and dependable service — the foundation of everything we do.']
];

const PERKS: [typeof Pin, string, string][] = [
  [Pin, 'Destination experts', 'We specialise in carefully planned holidays to Vietnam, Bali, Thailand and Malaysia.'],
  [Star, 'Premium hotels', 'Accommodation selected for quality, location and guest satisfaction on every itinerary.'],
  [Plane, 'Airport transfers', 'Stress-free pick-up and drop-off included on most tour packages.'],
  [Check, 'Visa assistance', 'Complete guidance through the visa documentation process, start to finish.'],
  [Mail, 'Personalised planning', 'Every itinerary is built around your travel dates, budget and preferences.'],
  [Phone, 'Dedicated support', 'Quick assistance before, during and after your holiday — one desk, one number.']
];

export default function AboutPage() {
  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={img('1469854523086-cc02fe5d8800', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>About</span>
            </nav>
            <span className="tag tag--light">Est. 2014 · Noida, India</span>
            <SplitText as="h1" className="mt-1">Adding colours<br />to every journey.</SplitText>

            <div className="phero__meta">
              <div><span>Founded</span><b>2014</b></div>
              <div><span>Destinations</span><b>04</b></div>
              <div><span>Happy travellers</span><b>500+</b></div>
              <div><span>Support</span><b>24×7</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- story */}
      <section className="section">
        <div className="wrap">
          <div className="intro__layout">
            <div className="intro__copy">
              <span className="tag rise">Our story</span>
              <SplitText as="h2">Creating memorable<br />holidays, since day one.</SplitText>
              <p className="lede rise mt-2">
                Flying Colours Vacations was established with one simple goal — to make
                international travel affordable without compromising on quality or comfort.
                Every itinerary is built around who you are: honeymooners, families, students,
                working professionals or groups — never a one-size-fits-all template.
              </p>
              <p className="lede rise mt-2">
                Today we proudly serve travellers from across India who dream of exploring
                Southeast Asia’s most loved destinations. Our commitment is simple —
                transparent pricing, dependable service and memorable holidays that truly
                add colours to every journey.
              </p>

              <TLink href="/contact" className="btn btn--navy mt-3" data-magnetic="0.3">
                Meet a planner
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="intro__media">
              <div className="media media--r4x5 media--px media--a reveal-clip">
                <Photo src={img('1488646953014-85cb44e25828', 1200)} alt="Trip planning desk with maps and tickets" px={14} />
              </div>
              <div className="media media--r1x1 media--px media--b reveal-clip">
                <Photo src={img('1507525428034-b723cf961d3e', 900)} alt="Beach at sunrise" px={10} />
              </div>
              <div className="intro__badge" data-px-y="-40">4.8<br />/ 5</div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={['*Customer first', 'Transparent pricing', '*Trust & transparency', '24/7 support']} />

      {/* ----------------------------------------------------- mission & vision */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Our purpose</span>
              <SplitText as="h2">Mission<br />& vision.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              We strive to make international travel simple, affordable and
              unforgettable for every traveller.
            </p>
          </div>

          <div className="mv-grid" data-stagger="0.08">
            <article className="mv-card rise">
              <h3>Our mission</h3>
              <p>
                To provide thoughtfully designed international holiday packages that
                deliver premium travel experiences at budget-friendly prices. We build
                lasting relationships through honest advice, quality service,
                transparent pricing and personalised travel planning.
              </p>
            </article>
            <article className="mv-card rise">
              <h3>Our vision</h3>
              <p>
                To become one of India’s most trusted travel brands for international
                holidays — creating journeys filled with happiness, comfort and
                exceptional customer service.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ values */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Our values</span>
              <SplitText as="h2">What makes us<br />different.</SplitText>
            </div>
          </div>

          <div>
            {VALUES.map(([title, copy], i) => (
              <article className="value-row rise" key={title}>
                <span className="value-row__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- why choose us */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Why choose us</span>
              <SplitText as="h2">Why travellers pick<br />Flying Colours.</SplitText>
            </div>
          </div>

          <div className="perk-grid" data-stagger="0.06">
            {PERKS.map(([Icon, title, copy]) => (
              <article className="perk rise" key={title}>
                <span className="perk__ico"><Icon /></span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">The desk</span>
              <SplitText as="h2">Passionate travel<br />experts.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '46ch' }}>
              Every memorable holiday begins with proper planning. Our travel
              consultants work closely with every guest to build a trip that
              matches their interests, travel style and budget — from your
              first enquiry to the day you land back home.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1552733407-5d5c46c3bb3b', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">Come travel with us</span>
            <SplitText as="h2">Your turn to fly<br />in full <em>colours</em>.</SplitText>
            <TLink href="/destinations" className="btn btn--gold rise" data-magnetic="0.3">
              See where we fly
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
