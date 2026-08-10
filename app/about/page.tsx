import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import Marquee from '@/components/Marquee';
import Gallery from '@/components/Gallery';
import { ArrowRight, Pin, Star, Plane, Check, Mail, Phone } from '@/components/icons';
import { img, ABOUT, SITE } from '@/lib/data';
import { parseInlineHtml } from '@/lib/richtext';

const GLIMPSES = Array.from({ length: 17 }, (_, i) => `/trip-glimpses/glimpse-${String(i + 1).padStart(2, '0')}.jpg`);

const PERK_ICONS = { pin: Pin, star: Star, plane: Plane, check: Check, mail: Mail, phone: Phone };

export const metadata: Metadata = {
  title: ABOUT.meta.title,
  description: ABOUT.meta.description
};

export default function AboutPage() {
  const { hero, story, missionVision, values, perks, glimpses, team, cta } = ABOUT;

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero">
        <div className="phero__bg">
          <Photo src={img('1469854523086-cc02fe5d8800', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>About</span>
            </nav>
            <span className="tag tag--light">{hero.tag}</span>
            <SplitText as="h1" className="mt-1">{parseInlineHtml(hero.headingHtml)}</SplitText>

            <div className="phero__meta">
              {hero.stats.map((s) => (
                <div key={s.label}><span>{s.label}</span><b>{s.value}</b></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- story */}
      <section className="section">
        <div className="wrap">
          <div className="intro__layout">
            <div className="intro__copy">
              <span className="tag rise">{story.tag}</span>
              <SplitText as="h2">{parseInlineHtml(story.headingHtml)}</SplitText>
              {story.paragraphs.map((p) => (
                <p className="lede rise mt-2" key={p}>{p}</p>
              ))}

              <TLink href={story.ctaHref} className="btn btn--navy mt-3" data-magnetic="0.3">
                {story.ctaLabel}
                <ArrowRight className="btn__icon" />
              </TLink>
            </div>

            <div className="intro__media">
              <div className="media media--r4x5 media--px media--a reveal-clip">
                <Photo src={img('1488646953014-85cb44e25828', 1200)} alt="Trip planning desk with maps and tickets" px={14} />
              </div>
              <div className="media media--r1x1 media--px media--b reveal-clip">
                <Photo src={img('1507525428034-b723cf961d3e', 900)} alt="Beach at sunrise" px={10} />
              </div>
              <div className="intro__badge" data-px-y="-40">{parseInlineHtml(story.ratingBadgeHtml)}</div>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ABOUT.marqueeItems} />

      {/* ----------------------------------------------------- mission & vision */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{missionVision.tag}</span>
              <SplitText as="h2">{parseInlineHtml(missionVision.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              {missionVision.paragraph}
            </p>
          </div>

          <div className="mv-grid" data-stagger="0.08">
            <article className="mv-card rise">
              <h3>{missionVision.mission.title}</h3>
              <p>{missionVision.mission.copy}</p>
            </article>
            <article className="mv-card rise">
              <h3>{missionVision.vision.title}</h3>
              <p>{missionVision.vision.copy}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ values */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{values.tag}</span>
              <SplitText as="h2">{parseInlineHtml(values.headingHtml)}</SplitText>
            </div>
          </div>

          <div>
            {values.items.map(({ title, copy }, i) => (
              <article className="value-row rise" key={title}>
                <span className="value-row__n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- why choose us */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{perks.tag}</span>
              <SplitText as="h2">{parseInlineHtml(perks.headingHtml)}</SplitText>
            </div>
          </div>

          <div className="perk-grid" data-stagger="0.06">
            {perks.items.map(({ icon, title, copy }) => {
              const Icon = PERK_ICONS[icon as keyof typeof PERK_ICONS];
              return (
                <article className="perk rise" key={title}>
                  <span className="perk__ico"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- trip glimpses */}
      <section className="section on-navy" id="glimpses">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{glimpses.tag}</span>
              <SplitText as="h2">{parseInlineHtml(glimpses.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '42ch' }}>
              {glimpses.paragraph}
            </p>
          </div>

          <Gallery images={GLIMPSES} alt={SITE.glimpseAltText} layout="grid" />
        </div>
      </section>

      {/* -------------------------------------------------------------- team */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{team.tag}</span>
              <SplitText as="h2">{parseInlineHtml(team.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '46ch' }}>
              {team.paragraph}
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- CTA band */}
      <section className="cta-band">
        <div className="cta-band__bg">
          <Photo src={img('1552733407-5d5c46c3bb3b', 1800)} alt="" px={12} />
        </div>
        <div className="wrap">
          <div className="cta-band__inner">
            <span className="tag tag--light tag--plain">{cta.tag}</span>
            <SplitText as="h2">{parseInlineHtml(cta.headingHtml)}</SplitText>
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
