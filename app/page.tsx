import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Counter from '@/components/Counter';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import BoardingPass from '@/components/BoardingPass';
import Hero from '@/components/home/Hero';
import HorizontalDestinations from '@/components/home/HorizontalDestinations';
import Testimonials from '@/components/home/Testimonials';
import GlimpseRail from '@/components/home/GlimpseRail';
import { ArrowRight, Star, Plane } from '@/components/icons';
import { img, HOME, SITE } from '@/lib/data';
import { parseInlineHtml } from '@/lib/richtext';

export default function HomePage() {
  const { whyUs, pricingExplainer, services, testimonials, glimpses, cta } = HOME;

  return (
    <>
      <Hero />

      <Marquee dir="right" items={HOME.marqueeItems} />

      {/* ------------------------------------------------------ who we are */}
      <section className="section">
        <div className="wrap">
          <div className="intro__layout">
            <div className="intro__copy">
              <span className="tag rise">{whyUs.tag}</span>
              <SplitText as="h2">{parseInlineHtml(whyUs.headingHtml)}</SplitText>
              {whyUs.paragraphs.map((p, i) => (
                <p
                  key={p}
                  className={i === 0 ? 'lede rise' : 'rise mt-1'}
                  style={{ ['--d' as string]: `${0.1 + i * 0.08}s` } as React.CSSProperties}
                >
                  {p}
                </p>
              ))}

              <div className="intro__stats">
                {whyUs.stats.map((s) => (
                  <div className="stat" key={s.labelHtml}>
                    <Counter to={s.to} suffix={s.suffix} decimals={s.decimals} />
                    <span>{parseInlineHtml(s.labelHtml)}</span>
                  </div>
                ))}
              </div>

              <TLink href={whyUs.ctaHref} className="btn btn--navy mt-3" data-magnetic="0.3">
                {whyUs.ctaLabel}
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="intro__media">
              <div className="media media--r4x5 media--px media--a reveal-clip">
                <Photo src={img('1526481280693-3bfa7568e0f3', 1200)} alt="Traveller looking out over a Vietnamese valley" px={14} />
              </div>
              <div className="media media--r1x1 media--px media--b reveal-clip">
                <Photo src={img('1537996194471-e657df975ab4', 900)} alt="Rice terraces in Ubud, Bali" px={10} />
              </div>
              <div className="intro__badge" data-px-y="-40">
                {parseInlineHtml(whyUs.badgeHtml)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizontalDestinations />

      {/* -------------------------------------------- the pass / calculator */}
      <section className="section on-navy" style={{ overflow: 'hidden' }}>
        <div className="wrap">
          <div className="dsplit dsplit--pass" style={{ alignItems: 'center' }}>
            <div>
              <span className="tag rise">{pricingExplainer.tag}</span>
              <SplitText as="h2" style={{ fontSize: 'var(--t-2xl)', marginBlock: '.8rem 1.4rem' }}>
                {parseInlineHtml(pricingExplainer.headingHtml)}
              </SplitText>
              <p className="lede rise">
                {pricingExplainer.paragraph}
              </p>

              <ul className="hilite-list">
                {pricingExplainer.bullets.map((b) => (
                  <li className="hilite rise" key={b.title}>
                    <span>—</span>
                    <div>
                      <b>{b.title}</b>
                      <p>{b.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <TLink href={pricingExplainer.ctaHref} className="btn btn--gold mt-3" data-magnetic="0.3">
                {pricingExplainer.ctaLabel}
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="rise" data-px-y="-50">
              <BoardingPass
                notch="var(--paper-200)"
                from={pricingExplainer.demoPass.from}
                to={pricingExplainer.demoPass.to}
                fromCity={pricingExplainer.demoPass.fromCity}
                toCity={pricingExplainer.demoPass.toCity}
                stamp={pricingExplainer.demoPass.stamp}
                code={pricingExplainer.demoPass.code}
                fields={[
                  { label: 'Passenger', value: pricingExplainer.demoPass.passenger },
                  { label: 'Duration', value: pricingExplainer.demoPass.duration, mono: true },
                  { label: 'Total', value: pricingExplainer.demoPass.total, big: true }
                ]}
                stubFields={[
                  { label: 'Flight', value: pricingExplainer.demoPass.flight, mono: true },
                  { label: 'Gate', value: pricingExplainer.demoPass.gate, mono: true },
                  { label: 'Seat', value: pricingExplainer.demoPass.seat, mono: true }
                ]}
              />
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
            <TLink href="/services" className="link-u" style={{ color: 'var(--navy-800)' }}>
              {services.linkLabel} <ArrowRight className="btn__icon" />
            </TLink>
          </div>

          <div className="grid grid-4" data-stagger="0.08">
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

      {/* ------------------------------------------------------ testimonials */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{testimonials.tag}</span>
              <SplitText as="h2">{parseInlineHtml(testimonials.headingHtml)}</SplitText>
            </div>
            <div className="stars" aria-label="4.8 out of 5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}
            </div>
          </div>
        </div>

        <Testimonials />
      </section>

      {/* --------------------------------------------------------- glimpses */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{glimpses.tag}</span>
              <SplitText as="h2">{parseInlineHtml(glimpses.headingHtml)}</SplitText>
            </div>
            <TLink href={glimpses.linkHref} className="link-u" style={{ color: 'var(--gold-600)' }}>
              {glimpses.linkLabel} <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>

        <GlimpseRail images={Array.from({ length: 17 }, (_, i) => `/trip-glimpses/glimpse-${String(i + 1).padStart(2, '0')}.jpg`)} alt={SITE.glimpseAltText} />
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1470004914212-05527e49370b', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">{cta.tag}</span>
            <SplitText as="h2">{parseInlineHtml(cta.headingHtml)}</SplitText>
            <p className="lede rise" style={{ margin: '0 auto' }}>
              {cta.paragraph}
            </p>
            <div className="hero__actions rise" style={{ justifyContent: 'center' }}>
              <TLink href={cta.primaryHref} className="btn btn--gold" data-magnetic="0.3">
                {cta.primaryLabel}
                <ArrowRight className="btn__icon" />
              </TLink>
              <TLink href={cta.secondaryHref} className="btn btn--ghost" data-magnetic="0.3">
                {cta.secondaryLabel}
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
