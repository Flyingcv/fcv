import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Gallery from '@/components/Gallery';
import PackageCard from '@/components/PackageCard';
import ItineraryAccordion from '@/components/ItineraryAccordion';
import PriceCard from '@/components/PriceCard';
import { ArrowRight, Check, Close } from '@/components/icons';
import { PACKAGES, DESTINATIONS, ORIGIN, PACKAGE_EXCLUDES, inr } from '@/lib/data';

type Params = { params: Promise<{ id: string }> };

const GLIMPSES = Array.from({ length: 17 }, (_, i) => `/trip-glimpses/glimpse-${String(i + 1).padStart(2, '0')}.jpg`);

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) return { title: 'Package not found' };
  return {
    title: `${pkg.title} — ${pkg.nights}N/${pkg.days}D`,
    description: pkg.blurb,
    openGraph: { title: `${pkg.title} — Flying Colours Vacations`, description: pkg.blurb }
  };
}

export default async function PackagePage({ params }: Params) {
  const { id } = await params;
  const pkg = PACKAGES.find((p) => p.id === id);
  if (!pkg) notFound();

  const d = DESTINATIONS[pkg.dest];
  const more = PACKAGES.filter((p) => p.dest === pkg.dest && p.id !== pkg.id).slice(0, 3);

  const waMessage = [
    `Hi! I'd like to know more about this package:`, ``,
    `${pkg.title} (${pkg.nights}N / ${pkg.days}D)`,
    `Price: ${inr(pkg.price)} per person`, ``,
    `Please share availability and next steps.`
  ].join('\n');
  const waLink = `https://wa.me/917017440214?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={pkg.image.replace('w=900', 'w=2000')} alt={pkg.title} priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span>
              <TLink href="/services">Packages</TLink> <span>/</span>
              <span>{pkg.title}</span>
            </nav>

            <span className="tag tag--light">{pkg.badge} · {pkg.where}</span>
            <SplitText as="h1" className="mt-1">{pkg.title}</SplitText>

            <div className="phero__meta">
              <div><span>Duration</span><b>{pkg.nights}N / {pkg.days}D</b></div>
              <div><span>Route</span><b>{ORIGIN.code} → {d.iata}</b></div>
              <div><span>Price</span><b>{inr(pkg.price)} / person</b></div>
              <div><span>Style</span><b>{d.tagline}</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- trip route */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <span className="tag rise">Trip route</span>
          <div className="route-strip mt-1" data-stagger="0.04">
            {pkg.route.map((stop, i) => (
              <span className="route-strip__stop rise" key={stop}>
                {i > 0 && <span className="route-strip__arrow">→</span>}
                {stop}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ main + sticky price */}
      <section className="section">
        <div className="wrap">
          <div className="pkg-detail">
            <div className="pkg-detail__main">

              {/* --------------------------------------------- quick details */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Quick details</span>
                    <SplitText as="h2">The trip,<br />at a glance.</SplitText>
                  </div>
                </div>
                <dl className="qd-table">
                  {Object.entries(pkg.quickDetails).map(([k, v]) => (
                    <div className="qd-row" key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* ------------------------------------------------- itinerary */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Day by day · {pkg.days} days</span>
                    <SplitText as="h2">The full<br />itinerary.</SplitText>
                  </div>
                  <p className="lede" style={{ maxWidth: '34ch' }}>
                    A starting point, not a fixed menu — tap a day to open it.
                  </p>
                </div>
                <ItineraryAccordion days={pkg.itinerary} />
              </div>

              {/* ---------------------------------------------------- hotels */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Where you stay</span>
                    <SplitText as="h2">Hotels on<br />this route.</SplitText>
                  </div>
                </div>
                <ul className="inex-list inex-list--yes">
                  {pkg.hotels.map((h) => <li key={h}><Check /> {h}</li>)}
                </ul>
                <p className="form__note mt-2">
                  If a hotel is unavailable for your dates we substitute the same or a
                  higher category and confirm it with you in writing.
                </p>
              </div>

              {/* --------------------------------------------- included / not */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Package breakdown</span>
                    <SplitText as="h2">What’s included<br />&amp; what’s not.</SplitText>
                  </div>
                </div>
                <div className="inex-grid">
                  <div>
                    <h3><Check style={{ width: 16, height: 16, color: 'var(--gold-600)' }} /> Included</h3>
                    <ul className="inex-list inex-list--yes">
                      {pkg.includes.map((inc) => (
                        <li key={inc}><Check /> {inc}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3><Close style={{ width: 16, height: 16, color: 'var(--ink-faint)' }} /> Not included</h3>
                    <ul className="inex-list inex-list--no">
                      {PACKAGE_EXCLUDES.map((ex) => (
                        <li key={ex}><Close /> {ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------ costing */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Costing</span>
                    <SplitText as="h2">What you<br />pay.</SplitText>
                  </div>
                </div>
                <div className="variant-list">
                  {pkg.priceVariants.map((v, i) => (
                    <div className={`variant${i === 0 ? ' variant--featured' : ''}`} key={v.label + v.note}>
                      <div>
                        <b>{v.label}</b>
                        <span>{v.note}</span>
                      </div>
                      <em>{inr(v.price)}</em>
                    </div>
                  ))}
                </div>
                <p className="lede mt-2" style={{ maxWidth: '60ch' }}>
                  All prices are per person on twin sharing. Applicable GST and TCS are
                  charged as per Indian government regulations. Build a fully custom
                  quote on the{' '}
                  <TLink href="/services#configurator">price calculator</TLink>.
                </p>
              </div>

              {/* ------------------------------------------------ about the trip */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">About this trip</span>
                    <SplitText as="h2">The short<br />version.</SplitText>
                  </div>
                </div>
                <p className="lede" style={{ maxWidth: '68ch' }}>{pkg.blurb} {d.blurb}</p>
              </div>

              {/* -------------------------------------------------- highlights */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Trip highlights</span>
                    <SplitText as="h2">Don’t miss<br />these.</SplitText>
                  </div>
                </div>
                <ul className="hilite-list" data-stagger="0.06">
                  {d.highlights.map(([title, copy], i) => (
                    <li className="hilite rise" key={title}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <b>{title}</b>
                        <p>{copy}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---------------------------------------------- traveller gallery */}
              <div>
                <div className="section-head">
                  <div className="section-head__text">
                    <span className="tag">Gallery by travellers</span>
                    <SplitText as="h2">Real trips,<br />real photos.</SplitText>
                  </div>
                </div>
                <Gallery images={GLIMPSES} alt="Flying Colours Vacations traveller" layout="grid" />
              </div>

            </div>

            {/* ------------------------------------------------- sticky price */}
            <aside className="pkg-detail__sidebar">
              <PriceCard pkg={pkg} destination={d} />
            </aside>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- more packages */}
      {more.length > 0 && (
        <section className="section on-navy" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <div className="section-head__text">
                <span className="tag">Also in {d.name}</span>
                <SplitText as="h2">More ways<br />to go.</SplitText>
              </div>
            </div>
            <div className="pkg-grid" data-stagger="0.08">
              {more.map((p) => <PackageCard pkg={p} key={p.id} />)}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={d.hero} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">Ready when you are</span>
            <SplitText as="h2">Let’s make this<br />trip <em>real</em>.</SplitText>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold rise" data-magnetic="0.3">
              Enquire on WhatsApp
              <ArrowRight className="btn__icon" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
