import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import { CONTACT, img } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Flying Colours Vacations collects, uses, discloses and protects your personal information.'
};

export default function PrivacyPolicyPage() {
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
              <TLink href="/">Home</TLink> <span>/</span> <span>Privacy policy</span>
            </nav>
            <span className="tag tag--light">Legal</span>
            <SplitText as="h1" className="mt-1">Privacy policy.</SplitText>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- body */}
      <section className="section">
        <div className="wrap">
          <div className="legal">
            <p className="legal__updated">Last updated · 2026</p>

            <p>
              All defined terms used below shall have the meanings set forth in Our Terms and
              Conditions. At Flying Colours Vacations, we value and respect your privacy. This
              Privacy Policy explains how we collect, use, disclose and protect your personal
              information when you visit our website or use our services. By accessing or using
              our website, you consent to the terms outlined in this Privacy Policy.
            </p>

            <h2>1. Information we collect</h2>
            <p>
              <strong>Personal information.</strong> We may collect personal information such as
              your name, email address, phone number and billing details when you make a
              reservation, register on our website, or contact us for inquiries.
            </p>
            <p>
              <strong>Non-personal information.</strong> We also gather non-personal information
              like your IP address, browser type, operating system and website usage data through
              cookies and similar technologies. This data helps us enhance your browsing
              experience and improve our services.
            </p>
            <p>
              <strong>Information collected automatically.</strong> When you access or use the
              site, we may also automatically collect:
            </p>
            <ul>
              <li><strong>Transaction information</strong> — product/package details, purchase price, and the date and location of a booking.</li>
              <li><strong>Log information</strong> — browser type, access times, pages viewed, your IP address and the page you visited before navigating to this site.</li>
              <li><strong>Device information</strong> — hardware model, operating system and version, and browsing behaviour.</li>
              <li><strong>Location information</strong> — approximate location each time you access this site, or precise location if you consent to it.</li>
              <li><strong>Cookies and tracking technologies</strong> — used to understand how you browse and interact with the site. Most browsers accept cookies by default; you can usually change your browser settings to remove or reject them.</li>
            </ul>
            <p>
              We may also receive information about you from other sources — for example
              demographic or change-of-address data from third-party sources, or information from
              third-party social media platforms if you log in using those credentials.
            </p>

            <h2>2. How we use your information</h2>
            <p>
              We use your personal information to process reservations, respond to inquiries and
              provide customer support, including confirmation emails and service-related
              announcements (for example, if a booking needs to be rescheduled). We may also send
              you relevant updates, offers or newsletters if you have opted to receive them — you
              can unsubscribe at any time. Because we have to communicate with you about bookings
              you place, you cannot opt out of emails related to an active booking.
            </p>
            <p>
              We analyse non-personal information to understand user behaviour, improve this
              site’s content and layout, and inform our own marketing efforts.
            </p>

            <h2>3. Information sharing &amp; disclosure</h2>
            <p>
              Except as set out below, we do not sell, rent, trade or license your personal or
              financial information to anyone.
            </p>
            <ul>
              <li><strong>Service providers.</strong> We may share your information with trusted third parties who assist us in delivering our services, such as processing payments or managing customer support — only to the extent necessary for them to perform that service.</li>
              <li><strong>Payment processing.</strong> We must provide your card details to financial-services corporations such as payment processors and issuers as required to process your booking, using industry-standard security including data encryption.</li>
              <li><strong>Legal compliance.</strong> We may disclose information in response to law enforcement investigations, subpoenas, a court order, or where required by law — or where necessary to protect our legal rights, enforce our Terms and Conditions, or reduce the risk of fraud.</li>
              <li><strong>Business transfers.</strong> In the event of a merger, acquisition or sale of our business, your personal information may be transferred to the acquiring entity, subject to the same privacy obligations set out in this policy.</li>
              <li><strong>Aggregated data.</strong> We may share non-personal, aggregated information (such as the number of daily visitors to a page) with partners — this does not identify you personally.</li>
            </ul>

            <h2>4. Data security</h2>
            <p>
              We take reasonable administrative, technical and physical measures to safeguard your
              personal information from unauthorised access, alteration, disclosure or
              destruction. No data transmission or storage method is entirely secure, and we
              cannot guarantee absolute security.
            </p>

            <h2>5. Third-party links</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not
              responsible for the privacy practices or content of such websites, and we encourage
              you to review their privacy policies before providing any personal information.
            </p>

            <h2>6. Children’s privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18 and we do not
              knowingly collect personal information from children. If you believe we have
              inadvertently collected information from a minor, please contact us and we will
              promptly delete it.
            </p>

            <h2>7. Your choices — opt out &amp; corrections</h2>
            <p>
              On request, we will correct or update your personal information, stop sending
              marketing emails to your address, or disable your account to prevent future
              purchases through it. You can make these requests by emailing us at{' '}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Please do not email your
              card number or other sensitive payment information to us directly.
            </p>

            <h2>8. Offline collection</h2>
            <p>
              We may also collect information offline — for example, when you call us to place a
              booking or ask a question. We only ask for the information needed to help you, and
              any information collected offline is treated consistently with this policy.
            </p>

            <h2>9. Updates to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              communicated through our website or other appropriate means. Continuing to use our
              services after such changes signifies your acceptance of the updated policy. We
              encourage you to review this page periodically.
            </p>

            <h2>10. Contact us</h2>
            <p>
              If you have any questions, concerns or requests regarding your privacy or this
              policy, write to us at <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or
              call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
