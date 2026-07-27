import type { Metadata } from 'next';
import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import { ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, PACKAGES, inr, img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Vietnam, Bali, Thailand and Malaysia — four Southeast Asian countries we know street by street. Browse itineraries, best seasons and starting prices.'
};

export default function DestinationsPage() {
  return (
    <>
      <section className="phero">
        <div className="phero__bg">
          <Photo src={img('1552733407-5d5c46c3bb3b', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Destinations</span>
            </nav>
            <span className="tag tag--light">04 countries · 26 cities</span>
            <SplitText as="h1" className="mt-1">The whole<br />map, curated.</SplitText>
            <p className="lede mt-2" style={{ maxWidth: '52ch' }}>
              We deliberately do not sell the world. These four countries are the ones our
              planners have walked end to end — which is why the itineraries actually work.
            </p>

            <div className="phero__meta">
              <div><span>Countries</span><b>04</b></div>
              <div><span>Cities</span><b>26</b></div>
              <div><span>Itineraries</span><b>{PACKAGES.length}+</b></div>
              <div><span>From</span><b>{inr(28999)}</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="dgrid">
            {DESTINATION_LIST.map((d, i) => {
              const count = PACKAGES.filter((p) => p.dest === d.slug).length;
              return (
                <TLink
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="dtile rise"
                  data-cursor="Discover"
                  style={{ ['--d' as string]: `${i * 0.08}s` } as React.CSSProperties}
                >
                  <Photo src={d.cover} alt={`${d.name} — ${d.tagline}`} px={10} />
                  <span className="dtile__code" aria-hidden="true">{d.iata}</span>

                  <div className="dtile__body">
                    <span className="tag tag--light tag--plain">{d.facts['Best season']}</span>
                    <h3 className="mt-1">{d.name}</h3>
                    <p style={{ color: 'var(--cream-on-navy)', marginTop: '.6rem', maxWidth: '44ch' }}>
                      {d.tagline}
                    </p>

                    <div className="dtile__tags">
                      {d.cities.slice(0, 5).map((c) => (
                        <span className="chip" key={c}>{c}</span>
                      ))}
                    </div>

                    <div className="dtile__foot">
                      <div>
                        <span className="pass__label">{count} itineraries · from</span>
                        <span className="pass__value" style={{ color: 'var(--gold-400)', fontSize: '1.5rem' }}>
                          {inr(d.fromPrice)}
                        </span>
                      </div>
                      <span className="link-u" style={{ color: 'var(--paper-100)' }}>
                        Explore <ArrowRight className="btn__icon" />
                      </span>
                    </div>
                  </div>
                </TLink>
              );
            })}
          </div>
        </div>
      </section>

      <Marquee
        dir="right"
        items={['Halong Bay', '*Ubud', 'Krabi', '*Langkawi', 'Hoi An', '*Nusa Penida', 'Phuket', '*Genting']}
      />

      <section className="section on-navy">
        <div className="wrap wrap--narrow center">
          <span className="tag rise">Not sure yet?</span>
          <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)' }}>
            Tell us the vibe.<br />We’ll pick the country.
          </SplitText>
          <p className="lede rise mt-2" style={{ margin: '0 auto' }}>
            Honeymoon, first passport stamp, three generations travelling together, or ten
            days of nothing but islands — each one points somewhere different.
          </p>
          <div className="hero__actions mt-3" style={{ justifyContent: 'center' }}>
            <TLink href="/services" className="btn btn--gold" data-magnetic="0.3">
              Filter every package
              <ArrowRight className="btn__icon" />
            </TLink>
            <TLink href="/contact" className="btn btn--ghost" data-magnetic="0.3">
              Ask a planner
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
