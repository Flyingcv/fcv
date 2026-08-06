import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import LegalToc from '@/components/LegalToc';
import { CONTACT, img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Cancellation & refund policy',
  description: 'Payment terms, cancellation and refund policy for bookings made with Flying Colours Vacations.'
};

const SECTIONS: [string, string][] = [
  ['delivery', 'Delivery policy'],
  ['payment-terms', 'Payment terms'],
  ['amend-cancel', 'Amending or cancelling'],
  ['refunds', 'Refunds'],
  ['changes', 'Changes to this policy'],
  ['questions', 'Questions']
];

export default function CancellationPolicyPage() {
  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero" style={{ minHeight: 'clamp(38vh, 28vw, 50vh)' }}>
        <div className="phero__bg">
          <Photo src={img('1488646953014-85cb44e25828', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Cancellation policy</span>
            </nav>
            <span className="tag tag--light">Legal</span>
            <SplitText as="h1" className="mt-1">Cancellation<br />&amp; refund policy.</SplitText>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- body */}
      <section className="section">
        <div className="wrap">
          <div className="legal-layout">
            <div className="legal">
            <p className="legal__updated">Last updated · 2026</p>

            <h2 id="delivery">Delivery policy</h2>
            <p>
              A booking is confirmed as soon as payment is received and, in some cases, once we
              receive confirmation from the respective supplier for the booking made.
            </p>

            <h2 id="payment-terms">Payment terms</h2>
            <p>
              You will pay the price shown on your Booking Confirmation, which supersedes any
              rate shown elsewhere. Payment can be processed via online/internet banking, wire
              transfer to our bank account, or through an integrated payment gateway on our
              portal. If you use the payment gateway with a debit/credit card or net banking on
              someone else’s behalf, you are doing so with that card or account holder’s
              approval.
            </p>
            <ul>
              <li>If a transaction is flagged as suspicious by our risk-management checks, we may ask you to submit identification along with a front copy of the card used, to protect you from potential fraud. If the documents aren’t provided in time, the reservation will be cancelled with immediate effect.</li>
              <li>If a payment doesn’t go through for any reason, please share the payment receipt or a screenshot with us — otherwise the booking will be cancelled, and any re-booking will be subject to availability.</li>
              <li>Payment-gateway processing charges are borne by you. If a transaction is cancelled after being initiated, processing charges will still apply.</li>
            </ul>

            <h2 id="amend-cancel">Amending or cancelling a booking</h2>
            <p>
              Your ability to amend or cancel a tour booking is restricted by that booking’s own
              terms and conditions, or by our third-party suppliers’ cancellation policies.
              Depending on the booking type, there may be instances where an amendment or
              cancellation isn’t possible, or where it comes with specific conditions.
            </p>
            <p>
              To cancel a booking, please notify us in writing (email is fine) in addition to
              cancelling on our portal. Once we receive your cancellation request, we will
              acknowledge it by email and state any cancellation fee that applies. Each
              hotel/service provider has its own refund and cancellation policy, and we follow
              that policy accordingly.
            </p>

            <h2 id="refunds">Refunds</h2>
            <ul>
              <li>Refunds are made only through the original mode of payment.</li>
              <li>Bookings eligible for a refund under the applicable cancellation policy will be refunded within <strong>15 working days</strong> of the cancellation request, after deducting any payment-gateway processing or wire-transfer charges.</li>
              <li>If a paid service is not availed of, partly or fully, no refund will be made under any circumstances.</li>
            </ul>

            <h2 id="changes">Changes to this policy</h2>
            <p>
              We may update this policy from time to time to reflect changes to our practices. If
              we make any material changes, we may notify you by email (sent to the address on
              your booking), by phone or message, or by a notice on our website. We encourage you
              to periodically review this page for the latest information.
            </p>

            <h2 id="questions">Questions</h2>
            <p>
              For anything related to a payment, cancellation or refund, write to us at{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call{' '}
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.
            </p>
            </div>

            <LegalToc sections={SECTIONS} />
          </div>
        </div>
      </section>
    </>
  );
}
