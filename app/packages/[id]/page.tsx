import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Gallery from '@/components/Gallery';
import PackageCard from '@/components/PackageCard';
import DownloadItineraryButton from '@/components/DownloadItineraryButton';
import { ArrowRight } from '@/components/icons';
import { PACKAGES, DESTINATIONS, ORIGIN, inr } from '@/lib/data';

type Params = { params: Promise<{ id: string }> };

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

      {/* --------------------------------------------------- route + actions */}
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

          <div className="hero__actions mt-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold" data-magnetic="0.28">
              Enquire on WhatsApp
              <ArrowRight className="btn__icon" />
            </a>
            <DownloadItineraryButton pkg={pkg} destination={d} />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- itinerary */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">Day by day · {pkg.days} days</span>
              <SplitText as="h2">The full<br />itinerary.</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              A starting point, not a fixed menu — every day can be swapped,
              stretched or dropped entirely.
            </p>
          </div>

          <div className="itin" data-stagger="0.06">
            {pkg.itinerary.map(([title, copy], i) => (
              <div className="itin__day" key={title}>
                <span className="itin__num">Day {String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ includes */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">What’s included</span>
              <SplitText as="h2">Package<br />breakdown.</SplitText>
            </div>
          </div>

          <div className="pkg__inc" style={{ fontSize: 'var(--t-sm)', gap: '.6rem' }}>
            {pkg.includes.map((inc) => <span key={inc}>{inc}</span>)}
          </div>

          <p className="lede mt-3" style={{ maxWidth: '60ch' }}>
            Price shown is per person on twin sharing for the land package. Flights,
            visa and travel insurance are optional — build them into your own quote
            with the <TLink href="/services#configurator">price calculator</TLink>.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">More from {d.name}</span>
              <SplitText as="h2">A closer<br />look.</SplitText>
            </div>
          </div>
          <Gallery images={d.gallery} alt={d.name} />
        </div>
      </section>

      {/* --------------------------------------------------------- more packages */}
      {more.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
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
