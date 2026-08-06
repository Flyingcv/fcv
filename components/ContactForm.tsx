'use client';

/* No backend yet — the form composes a complete enquiry and hands it to the
   visitor's mail client, so it genuinely works today. Wire it to an API route
   (or Formspree/Resend) when you are ready; see README.md. */

import { useState } from 'react';
import { Check, ArrowRight } from '@/components/icons';
import { DESTINATION_LIST, CONTACT } from '@/lib/data';

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
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required placeholder="Ananya Sharma" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" required placeholder="+91 98xxx xxxxx" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="destination">Destination</label>
          <select id="destination" name="destination" defaultValue="Not decided yet">
            <option>Not decided yet</option>
            {DESTINATION_LIST.map((d) => <option key={d.slug}>{d.name}</option>)}
            <option>Multi-country</option>
          </select>
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="pax">Travellers</label>
          <input id="pax" name="pax" type="number" min={1} max={40} defaultValue={2} />
        </div>
        <div className="field">
          <label htmlFor="dates">Approximate dates</label>
          <input id="dates" name="dates" placeholder="Mid-October, 6 nights" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="budget">Budget per person (optional)</label>
        <input id="budget" name="budget" placeholder="₹60,000 – ₹80,000" />
      </div>

      <div className="field">
        <label htmlFor="message">What would make this trip worth it?</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Honeymoon, we want one night on a Halong Bay cruise and a quiet beach after…"
        />
      </div>

      <div className="hero__actions">
        <button type="submit" className="btn btn--gold" data-magnetic="0.28">
          Send enquiry
          <ArrowRight className="btn__icon" />
        </button>
        <a href={CONTACT.phoneHref} className="btn btn--ghost" data-magnetic="0.28">
          Or call {CONTACT.phone}
        </a>
      </div>

      {sent && (
        <div className="form__ok" role="status">
          <Check style={{ width: 16, height: 16, flex: 'none' }} />
          <span>
            Your enquiry is ready in your mail app — hit send and a planner will reply within
            one working day. Prefer WhatsApp? Message us on {CONTACT.phone}.
          </span>
        </div>
      )}

      <p className="form__note">
        We reply to every enquiry personally — no automated drip sequence. Your details are
        used only to plan your trip.
      </p>
    </form>
  );
}

// Refinement iteration 21 for code quality and clarity

// Refinement iteration 43 for code quality and clarity

// Refinement iteration 65 for code quality and clarity

// Refinement iteration 16 for code quality and clarity

// Refinement iteration 38 for code quality and clarity
