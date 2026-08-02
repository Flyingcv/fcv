import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Gallery from '@/components/Gallery';
import BoardingPass from '@/components/BoardingPass';
import PackageCard from '@/components/PackageCard';
import { ArrowRight } from '@/components/icons';
import {
  DESTINATIONS, DESTINATION_LIST, PACKAGES, ORIGIN, inr,
  type DestinationSlug
} from '@/lib/data';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DESTINATION_LIST.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = DESTINATIONS[slug as DestinationSlug];
  if (!d) return { title: 'Destination not found' };
  return {
    title: `${d.name} tour packages`,
    description: d.blurb,
    openGraph: { title: `${d.name} — Flying Colours Vacations`, description: d.tagline }
  };
}

export default async function DestinationPage({ params }: Params) {
  const { slug } = await params;
  const d = DESTINATIONS[slug as DestinationSlug];
  if (!d) notFound();

  const packages = PACKAGES.filter((p) => p.dest === d.slug);
  const others = DESTINATION_LIST.filter((x) => x.slug !== d.slug);
  const sample = packages[0];

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={d.hero} alt={`${d.name} — ${d.tagline}`} priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span>
              <TLink href="/destinations">Destinations</TLink> <span>/</span>
              <span>{d.name}</span>
            </nav>

            <span className="tag tag--light">{ORIGIN.code} → {d.iata} · {d.tagline}</span>
            <SplitText as="h1" className="mt-1">{d.name}</SplitText>

            <div className="phero__meta">
              {Object.entries(d.facts).map(([k, v]) => (
                <div key={k}><span>{k}</span><b>{v}</b></div>
              ))}
              <div><span>From</span><b>{inr(d.fromPrice)}</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- overview */}
      <section className="section">
        <div className="wrap">
          <div className="dsplit dsplit--pass">
            <div>
              <span className="tag rise">The short version</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)' }}>
                Why {d.name}<br />is worth the flight.
              </SplitText>
              <p className="lede rise mt-2">{d.blurb}</p>

              <div className="dtile__tags mt-2">
                {d.cities.map((c) => (
                  <span
                    className="chip"
                    key={c}
                    style={{ borderColor: 'var(--hair-on-paper)', color: 'var(--ink-soft)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              <TLink href="/services#configurator" className="btn btn--navy mt-3" data-magnetic="0.3">
                Price a {d.name} trip
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="rise" data-px-y="-40">
              <BoardingPass
                notch="var(--paper-100)"
                from={ORIGIN.code}
                to={d.iata}
                fromCity={ORIGIN.city}
                toCity={d.name}
                stamp={`${d.facts['Best season']} · peak`}
                code={`FCV · ${d.iata} · ${d.facts['Flight time'].replace(/\s/g, '')} · ECONOMY`}
                fields={[
                  { label: 'Best season', value: d.facts['Best season'] },
                  { label: 'Visa', value: d.facts.Visa, mono: true },
                  { label: 'From', value: inr(d.fromPrice), big: true }
                ]}
                stubFields={[
                  { label: 'To', value: d.iata, mono: true },
                  { label: 'Cities', value: String(d.cities.length).padStart(2, '0'), mono: true },
                  { label: 'Trips', value: String(packages.length).padStart(2, '0'), mono: true }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- highlights */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="dsplit">
            <div className="media media--r3x4 media--px reveal-clip" data-px-y="-30">
              <Photo src={d.gallery[0]} alt={`Highlights of ${d.name}`} px={14} />
            </div>

            <div>
              <span className="tag rise">The non-negotiables</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)' }}>
                Five things you<br />should not skip.
              </SplitText>

              <ul className="hilite-list">
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
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- itinerary */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Sample itinerary · {d.itinerary.length} days</span>
              <SplitText as="h2">A {d.name} week,<br />hour by hour.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              This is a starting point, not a fixed menu. Every day below can be
              swapped, stretched or dropped entirely.
            </p>
          </div>

          <div className="itin-rail" data-stagger="0.06">
            {d.itinerary.map(([title, copy]) => (
              <article className="itin-card" key={title}>
                <h4>{title}</h4>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Gallery images={d.gallery} alt={d.name} />
        </div>
      </section>

      {/* ---------------------------------------------------------- packages */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{packages.length} ready-made routes</span>
              <SplitText as="h2">{d.name} packages</SplitText>
            </div>
            <TLink href="/services" className="link-u" style={{ color: 'var(--navy-800)' }}>
              Filter all packages <ArrowRight className="btn__icon" />
            </TLink>
          </div>

          <div className="pkg-grid" data-stagger="0.08">
            {packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>

          {sample && (
            <p className="mono mt-3" style={{ color: 'var(--ink-faint)', fontSize: 'var(--t-xs)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Prices are per person on twin sharing · land package · flights optional
            </p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- next stops */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Connecting flights</span>
              <SplitText as="h2">Pair it with</SplitText>
            </div>
          </div>

          <div className="grid grid-3" data-stagger="0.08">
            {others.map((o) => (
              <TLink key={o.slug} href={`/destinations/${o.slug}`} className="dtile" data-cursor="Open" style={{ minHeight: '320px' }}>
                <Photo src={o.cover} alt={o.name} px={8} />
                <div className="dtile__body">
                  <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>{o.name}</h3>
                  <div className="dtile__foot" style={{ marginTop: '.9rem' }}>
                    <span className="pass__label" style={{ color: 'var(--cream-on-navy)' }}>
                      from {inr(o.fromPrice)}
                    </span>
                    <ArrowRight className="btn__icon" style={{ color: 'var(--gold-400)' }} />
                  </div>
                </div>
              </TLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
