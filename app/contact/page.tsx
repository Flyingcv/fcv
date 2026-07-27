import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import { Phone, Mail, Pin, Clock, ArrowRight } from '@/components/icons';
import { CONTACT, img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Talk to a Southeast Asia planner at Flying Colours Vacations — Noida office, +91 70174 40214, info@flyingcoloursvacations.com.'
};

const FAQS: [string, string][] = [
  ['How far in advance should I book?',
    'For peak season (October to March) we recommend 8–10 weeks, mainly for hotel availability rather than airfare. Bali in July–August and Vietnam over New Year fill earliest. Short breaks can be turned around in under two weeks if you are flexible on hotels.'],
  ['What does the price include?',
    'Every package price on this site is per person on twin sharing and covers the land package — hotels, listed tours, private transfers and daily breakfast. Flights, visas and insurance are optional add-ons you can toggle in the price calculator so you always see exactly what you are paying for.'],
  ['Do you handle visas?',
    'Yes. We file Vietnam e-Visas on your behalf, guide you through visa-on-arrival for Bali, and Thailand and Malaysia are visa-free for Indian passport holders on the durations we sell. Documents are checked before you fly, not at the airport.'],
  ['What happens if a flight is cancelled mid-trip?',
    'You message the same planner who built your itinerary. We rebook, inform the hotel, and reschedule any tours that are affected. That support runs 24/7 for the whole time you are travelling — it is not an outsourced call centre.'],
  ['Can you plan for large families or groups?',
    'Regularly. Groups of four or more automatically get a lower per-day rate in our pricing, and we plan around mixed-age pacing — no 5am treks for the grandparents while the kids are at a water park.'],
  ['How do I pay?',
    'Bank transfer, UPI, credit or debit card, or a secure payment link. Typically a booking advance to hold hotels and the balance closer to departure. Card payments may carry a gateway charge, which we always show before you confirm.']
];

export default function ContactPage() {
  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero" style={{ minHeight: 'clamp(46vh, 34vw, 60vh)' }}>
        <div className="phero__bg">
          <Photo src={img('1506665531195-3566af2b4dfa', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Contact</span>
            </nav>
            <span className="tag tag--light">Departures desk · open now</span>
            <SplitText as="h1" className="mt-1">Let’s plan it.</SplitText>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ form + cards */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="contact-split">
            <div>
              <span className="tag rise">Reach us directly</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)' }}>
                One desk.<br />One number.
              </SplitText>

              <div className="contact-cards mt-3" data-stagger="0.08">
                <a className="ccard" href={CONTACT.phoneHref}>
                  <span className="ccard__ico"><Phone /></span>
                  <span>
                    <span>Call or WhatsApp</span>
                    <b>{CONTACT.phone}</b>
                    <p>{CONTACT.emergency}</p>
                  </span>
                </a>

                <a className="ccard" href={`mailto:${CONTACT.email}`}>
                  <span className="ccard__ico"><Mail /></span>
                  <span>
                    <span>Email</span>
                    <b>{CONTACT.email}</b>
                    <p>Replies from a planner, usually same day</p>
                  </span>
                </a>

                <div className="ccard">
                  <span className="ccard__ico"><Pin /></span>
                  <span>
                    <span>Office</span>
                    <b>Bhutani Alphathum, Noida</b>
                    <p>{CONTACT.address}</p>
                  </span>
                </div>

                <div className="ccard">
                  <span className="ccard__ico"><Clock /></span>
                  <span>
                    <span>Desk hours</span>
                    <b>{CONTACT.hours}</b>
                    <p>On-trip support runs around the clock</p>
                  </span>
                </div>
              </div>

              <div className="map-frame mt-3 rise">
                <iframe
                  title="Flying Colours Vacations office location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.38%2C28.49%2C77.44%2C28.53&layer=mapnik&marker=28.5106%2C77.4109"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="rise">
              <span className="tag">Trip enquiry</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)', marginBottom: '2rem' }}>
                Tell us the shape<br />of the trip.
              </SplitText>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="section" id="faq" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Before you ask</span>
              <SplitText as="h2">The questions<br />we get most.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '34ch' }}>
              Still stuck? Call the desk — it is genuinely faster than typing it out.
            </p>
          </div>

          <Faq items={FAQS} />

          <div className="hero__actions mt-3">
            <TLink href="/services#configurator" className="btn btn--navy" data-magnetic="0.3">
              Price a trip yourself
              <ArrowRight className="btn__icon" />
            </TLink>
            <TLink href="/destinations" className="btn btn--ghost" data-magnetic="0.3">
              Browse destinations
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
