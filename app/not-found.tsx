import TLink from '@/components/TLink';
import { ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, SITE } from '@/lib/data';

export default function NotFound() {
  const { notFound } = SITE;

  return (
    <section className="phero" style={{ minHeight: '86vh', alignItems: 'center' }}>
      <div className="phero__inner">
        <div className="wrap wrap--narrow center">
          <span className="tag tag--light tag--plain">{notFound.tag}</span>
          <h1 className="mega mt-2" dangerouslySetInnerHTML={{ __html: notFound.heading }} />
          <p className="lede mt-2" style={{ margin: '1.5rem auto 0' }}>
            {notFound.paragraph}
          </p>

          <div className="hero__actions mt-3" style={{ justifyContent: 'center' }}>
            <TLink href="/" className="btn btn--gold" data-magnetic="0.3">
              {notFound.primaryLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
            <TLink href="/services" className="btn btn--ghost" data-magnetic="0.3">
              {notFound.secondaryLabel}
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
