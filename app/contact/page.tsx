import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import { Phone, Mail, Pin, Clock, ArrowRight } from '@/components/icons';
import { CONTACT, CONTACT_PAGE, img } from '@/lib/data';
import { parseInlineHtml } from '@/lib/richtext';

export const metadata: Metadata = {
  title: CONTACT_PAGE.meta.title,
  description: CONTACT_PAGE.meta.descriptionTemplate
    .replace('{phone}', CONTACT.phone)
    .replace('{email}', CONTACT.email)
};

export default function ContactPage() {
  const { hero, cardsSection, formSection, faqSection, faqs } = CONTACT_PAGE;

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero" style={{ minHeight: 'clamp(46vh, 34vw, 60vh)' }}>
        <div className="phero__bg">
          <Photo src={img('1506665531195-3566af2b4dfa', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Contact</span>
            </nav>
            <span className="tag tag--light">{hero.tag}</span>
            <SplitText as="h1" className="mt-1">{hero.heading}</SplitText>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ form + cards */}
      <section className="section on-navy">
        <div className="wrap">
          <div className="contact-split">
            <div>
              <span className="tag rise">{cardsSection.tag}</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)' }}>
                {parseInlineHtml(cardsSection.headingHtml)}
              </SplitText>

              <div className="contact-cards mt-3" data-stagger="0.08">
                <a className="ccard" href={CONTACT.phoneHref}>
                  <span className="ccard__ico"><Phone /></span>
                  <span>
                    <span>{cardsSection.callCard.label}</span>
                    <b>{CONTACT.phone}</b>
                    <p>{CONTACT.emergency}</p>
                  </span>
                </a>

                <a className="ccard" href={`mailto:${CONTACT.email}`}>
                  <span className="ccard__ico"><Mail /></span>
                  <span>
                    <span>{cardsSection.emailCard.label}</span>
                    <b>{CONTACT.email}</b>
                    <p>{cardsSection.emailCard.note}</p>
                  </span>
                </a>

                <div className="ccard">
                  <span className="ccard__ico"><Pin /></span>
                  <span>
                    <span>{cardsSection.officeCard.label}</span>
                    <b>{cardsSection.officeCard.title}</b>
                    <p>{CONTACT.address}</p>
                  </span>
                </div>

                <div className="ccard">
                  <span className="ccard__ico"><Clock /></span>
                  <span>
                    <span>{cardsSection.hoursCard.label}</span>
                    <b>{CONTACT.hours}</b>
                    <p>{cardsSection.hoursCard.note}</p>
                  </span>
                </div>
              </div>
            </div>

            <div className="rise">
              <span className="tag">{formSection.tag}</span>
              <SplitText as="h2" className="mt-1" style={{ fontSize: 'var(--t-2xl)', marginBottom: '2rem' }}>
                {parseInlineHtml(formSection.headingHtml)}
              </SplitText>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- FAQ */}
      <section className="section" id="faq" style={{ scrollMarginTop: '90px' }}>
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">{faqSection.tag}</span>
              <SplitText as="h2">{parseInlineHtml(faqSection.headingHtml)}</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '34ch' }}>
              {faqSection.paragraph}
            </p>
          </div>

          <Faq items={faqs as [string, string][]} />

          <div className="hero__actions mt-3">
            <TLink href={faqSection.primaryHref} className="btn btn--navy" data-magnetic="0.3">
              {faqSection.primaryLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
            <TLink href={faqSection.secondaryHref} className="btn btn--ghost" data-magnetic="0.3">
              {faqSection.secondaryLabel}
              <ArrowRight className="btn__icon" />
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
