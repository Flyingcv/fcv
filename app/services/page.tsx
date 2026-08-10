import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import PackageFilter from '@/components/services/PackageFilter';
import PriceConfigurator from '@/components/services/PriceConfigurator';
import { ArrowRight, Plane } from '@/components/icons';
import { img, PACKAGES, SERVICES_PAGE } from '@/lib/data';
import { parseInlineHtml } from '@/lib/richtext';

export const metadata: Metadata = {
  title: SERVICES_PAGE.meta.title,
  description: SERVICES_PAGE.meta.description
};

export default function ServicesPage() {
  const { hero, services, pricing, steps, packages, cta } = SERVICES_PAGE;

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={img('1436491865332-7a61a109cc05', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Services</span>
            </nav>
            <span className="tag tag--light">{hero.tag}</span>
            <SplitText as="h1" className="mt-1">{parseInlineHtml(hero.headingHtml)}</SplitText>
            <p className="lede mt-2" style={{ maxWidth: '52ch' }}>
              {hero.paragraphTemplate.replace('{count}', String(PACKAGES.length))}
            </p>

            <div className="hero__actions mt-3">
              <a href={hero.primaryHref} className="btn btn--gold" data-magnetic="0.3">
                {hero.primaryLabel}
                <ArrowRight className="btn__icon" />
              </a>
              <a href={hero.secondaryHref} className="btn btn--ghost" data-magnetic="0.3">
                {hero.secondaryLabel}
                <ArrowRight className="btn__icon" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- services */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{services.tag}</span>
              <SplitText as="h2">{parseInlineHtml(services.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '36ch' }}>
              {services.paragraph}
            </p>
          </div>

          <div className="grid grid-3" data-stagger="0.07">
            {services.items.map((s) => (
              <article className="svc-card" key={s.num}>
                <span className="svc-card__num">{s.num}</span>
                <Plane className="svc-card__ico" />
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ pricing calculator */}
      <section className="section on-navy" id="configurator" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{pricing.tag}</span>
              <SplitText as="h2">{parseInlineHtml(pricing.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              {pricing.paragraph}
            </p>
          </div>

          <PriceConfigurator />
        </div>
      </section>

      {/* ---------------------------------------------------- how it works */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{steps.tag}</span>
              <SplitText as="h2">{parseInlineHtml(steps.headingHtml)}</SplitText>
            </div>
          </div>

          <div className="itin">
            {steps.items.map(({ title, copy }, i) => (
              <article className="itin__day rise" key={title}>
                <span className="itin__num">Step {String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- packages + filter */}
      <section className="section on-navy" id="packages" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{packages.tagTemplate.replace('{count}', String(PACKAGES.length))}</span>
              <SplitText as="h2">{packages.heading}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '36ch' }}>
              {packages.paragraph}
            </p>
          </div>

          <PackageFilter />
        </div>
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1488646953014-85cb44e25828', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">{cta.tag}</span>
            <SplitText as="h2">{parseInlineHtml(cta.headingHtml)}</SplitText>
            <p className="lede rise" style={{ margin: '0 auto' }}>
              {cta.paragraph}
            </p>
            <TLink href={cta.ctaHref} className="btn btn--gold rise" data-magnetic="0.3">
              {cta.ctaLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
