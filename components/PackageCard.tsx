import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import { ArrowRight } from '@/components/icons';
import { DESTINATIONS, inr, type Package } from '@/lib/data';

export default function PackageCard({ pkg }: { pkg: Package }) {
  const d = DESTINATIONS[pkg.dest];

  return (
    <article className="pkg" data-cursor="Details">
      <div className="pkg__media">
        <Photo src={pkg.image} alt={pkg.title} />
        <span className="pkg__badge">{pkg.badge}</span>
        <span className="pkg__days">{pkg.days}D / {pkg.nights}N</span>
      </div>

      <div className="pkg__body">
        <span className="pkg__where">{d.iata} · {pkg.where}</span>
        <h3>{pkg.title}</h3>
        <p>{pkg.blurb}</p>

        <div className="pkg__inc">
          {pkg.includes.map((inc) => <span key={inc}>{inc}</span>)}
        </div>

        <div className="pkg__foot">
          <div className="pkg__price">
            <small>Per person from</small>
            <b>{inr(pkg.price)}</b>
            <del>{inr(pkg.was)}</del>
          </div>
          <TLink href={`/destinations/${pkg.dest}`} className="link-u" style={{ color: 'var(--gold-400)' }}>
            View <ArrowRight className="btn__icon" />
          </TLink>
        </div>
      </div>
    </article>
  );
}
