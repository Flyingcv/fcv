'use client';

/* No backend yet — the form composes a complete enquiry and hands it to the
   visitor's mail client, so it genuinely works today. Wire it to an API route
   (or Formspree/Resend) when you are ready; see README.md. */

import { useState } from 'react';
import { Check, ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, CONTACT, FORMS } from '@/lib/data';

const F = FORMS.contactForm;

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();

    const body = [
      `Name: ${get('name')}`,
      `Email: ${get('email')}`,
      `Phone: ${get('phone')}`,
      `Destination: ${get('destination')}`,
      `Travellers: ${get('pax')}`,
      `Approx. dates: ${get('dates')}`,
      `Budget per person: ${get('budget') || 'not specified'}`,
      '',
      'What we would like:',
      get('message')
    ].join('\n');

    window.location.href =
      `mailto:${CONTACT.email}` +
      `?subject=${encodeURIComponent(`Trip enquiry — ${get('destination')} — ${get('name')}`)}` +
      `&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="name">{F.fields.name.label}</label>
          <input id="name" name="name" required placeholder={F.fields.name.placeholder} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="email">{F.fields.email.label}</label>
          <input id="email" name="email" type="email" required placeholder={F.fields.email.placeholder} autoComplete="email" />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="phone">{F.fields.phone.label}</label>
          <input id="phone" name="phone" type="tel" required placeholder={F.fields.phone.placeholder} autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="destination">{F.fields.destination.label}</label>
          <select id="destination" name="destination" defaultValue={F.fields.destination.defaultOption}>
            <option>{F.fields.destination.defaultOption}</option>
            {DESTINATION_LIST.map((d) => <option key={d.slug}>{d.name}</option>)}
            <option>{F.fields.destination.multiCountryOption}</option>
          </select>
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="pax">{F.fields.pax.label}</label>
          <input id="pax" name="pax" type="number" min={F.fields.pax.min} max={F.fields.pax.max} defaultValue={F.fields.pax.default} />
        </div>
        <div className="field">
          <label htmlFor="dates">{F.fields.dates.label}</label>
          <input id="dates" name="dates" placeholder={F.fields.dates.placeholder} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="budget">{F.fields.budget.label}</label>
        <input id="budget" name="budget" placeholder={F.fields.budget.placeholder} />
      </div>

      <div className="field">
        <label htmlFor="message">{F.fields.message.label}</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder={F.fields.message.placeholder}
        />
      </div>

      <div className="hero__actions">
        <button type="submit" className="btn btn--gold" data-magnetic="0.28">
          {F.submitLabel}
          <ArrowRight className="btn__icon" />
        </button>
        <a href={CONTACT.phoneHref} className="btn btn--ghost" data-magnetic="0.28">
          {F.callLabelPrefix} {CONTACT.phone}
        </a>
      </div>

      {sent && (
        <div className="form__ok" role="status">
          <Check style={{ width: 16, height: 16, flex: 'none' }} />
          <span>
            {F.successMessage.replace('{phone}', CONTACT.phone)}
          </span>
        </div>
      )}

      <p className="form__note">
        {F.disclaimerNote}
      </p>
    </form>
  );
}
