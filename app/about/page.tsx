import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import { ArrowRight } from '@/components/icons';
import { img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About us',
  description:
    'Flying Colours Vacations has planned Southeast Asia holidays from Noida since 2014 — one desk, one planner per file, 24/7 on-trip support.'
};

const TIMELINE: [string, string, string][] = [
  ['2014', 'One desk, one country', 'We started selling Thailand only — because it was the only country we could honestly say we knew hotel by hotel.'],
  ['2017', 'Vietnam changes everything', 'A scouting trip through Hanoi, Halong and Hoi An turned into our most requested itinerary within a year.'],
  ['2019', 'Bali & the honeymoon desk', 'Villas, private dinners and Nusa Penida. A dedicated planner now handles honeymoons end to end.'],
  ['2021', 'The support promise', 'After two years of rebooking cancelled flights at 2am, 24/7 on-trip support became standard on every file.'],
  ['2024', '12,000 travellers later', 'Four countries, twenty-six cities, and a 4.8 average across 1,564 reviews — still one planner per trip.']
];

const VALUES: [string, string][] = [
  ['Depth over breadth', 'We sell four countries, not forty. Every planner here has walked the routes they sell.'],
  ['Real prices, up front', 'Our calculator shows you a number before you ever fill in a form. No “price on request”.'],
  ['One person, one file', 'The planner who drafts your itinerary is the same person answering at 11pm from Krabi.'],
  ['Fix it before you notice', 'Delays, closures and weather get re-planned while you are still in the air.']
];

const TEAM: [string, string, string][] = [
  ['Nitin Bhardwaj', 'Founder & Vietnam lead', '1507003211169-0a1dd7228f2d'],
  ['Aarushi Mehra', 'Honeymoons & Bali', '1494790108377-be9c29b29330'],
  ['Rohan Iyer', 'Thailand & islands', '1500648767791-00dcc994a43e'],
  ['Sana Qureshi', 'Groups & Malaysia', '1438761681033-6461ffad8d80']
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
              <div><span>Countries</span><b>04</b></div>
              <div><span>Travellers</span><b>12,400+</b></div>
              <div><span>Rating</span><b>4.8 / 5</b></div>
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
              <SplitText as="h2">We got tired of<br />selling brochures.</SplitText>
              <p className="lede rise mt-2">
                Flying Colours Vacations began with a simple frustration: agents were selling
                Southeast Asia from a PDF nobody had ever visited. Wrong hotels, impossible
                driving times, and a support number that stopped answering at 6pm.
              </p>
              <p className="rise mt-1">
                So we did it the slow way. One country at a time, walked end to end, hotel by
                hotel, guide by guide. Eleven years later we still refuse to sell a destination
                somebody on this team has not personally travelled — which is why the list is
                four countries long and not forty.
              </p>
              <p className="rise mt-1">
                Today we are a small team in Noida planning roughly 1,200 trips a year. Every
                file has one planner who owns it from the first call to the last transfer home.
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

      <Marquee items={['*Depth over breadth', 'Real prices', '*One planner per file', '24/7 support']} />

      {/* ---------------------------------------------------------- timeline */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">The route so far</span>
              <SplitText as="h2">Eleven years,<br />four countries.</SplitText>
            </div>
          </div>

          <div className="tl">
            {TIMELINE.map(([yr, title, copy]) => (
              <article className="tl__item rise" key={yr}>
                <span className="tl__yr">{yr}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ values */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">What we hold to</span>
              <SplitText as="h2">Four rules we<br />do not bend.</SplitText>
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

      {/* -------------------------------------------------------------- team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">The desk</span>
              <SplitText as="h2">Who picks up<br />when you call.</SplitText>
            </div>
          </div>

          <div className="grid grid-4" data-stagger="0.08">
            {TEAM.map(([name, role, photo]) => (
              <article className="team-card" key={name}>
                <div className="media media--r4x5 media--px">
                  <Photo src={img(photo, 700)} alt={name} px={10} />
                </div>
                <b>{name}</b>
                <span>{role}</span>
              </article>
            ))}
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
