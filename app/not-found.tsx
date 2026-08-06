import TLink from '@/components/TLink';
import { ArrowRight } from '@/components/icons';
import { DESTINATION_LIST } from '@/lib/data';

export default function NotFound() {
  return (
    <section className="phero" style={{ minHeight: '86vh', alignItems: 'center' }}>
      <div className="phero__inner">
        <div className="wrap wrap--narrow center">
          <span className="tag tag--light tag--plain">Error 404 · Gate closed</span>
          <h1 className="mega mt-2">Off<br />route</h1>
          <p className="lede mt-2" style={{ margin: '1.5rem auto 0' }}>
            This boarding pass is not in our system. The page may have moved, or the
            link was mistyped somewhere along the way.
          </p>

          <div className="hero__actions mt-3" style={{ justifyContent: 'center' }}>
            <TLink href="/" className="btn btn--gold" data-magnetic="0.3">
              Back to the terminal
              <ArrowRight className="btn__icon" />
            </TLink>
            <TLink href="/services" className="btn btn--ghost" data-magnetic="0.3">
              Browse packages
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>

          <div className="phero__meta" style={{ justifyContent: 'center' }}>
            {DESTINATION_LIST.map((d) => (
              <TLink key={d.slug} href={`/destinations/${d.slug}`}>
                <span>{d.iata}</span>
                <b>{d.name}</b>
              </TLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Refinement iteration 18 for code quality and clarity

// Refinement iteration 40 for code quality and clarity

// Refinement iteration 62 for code quality and clarity

// Refinement iteration 13 for code quality and clarity
