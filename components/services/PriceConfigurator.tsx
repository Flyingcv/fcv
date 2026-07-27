'use client';

/* Interactive pricing configurator.
   Slide the days, pick a tier, add extras — the boarding pass beside it
   re-prints in real time with the destination, duration and total. */

import { useEffect, useMemo, useRef, useState } from 'react';
import TLink from '@/components/TLink';
import BoardingPass from '@/components/BoardingPass';
import { Check, ArrowRight } from '@/components/icons';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import {
  DESTINATION_LIST, DESTINATIONS, TIERS, ADDONS, ORIGIN,
  quote, inr, type DestinationSlug, type TierKey, type AddonKey
} from '@/lib/data';

const MIN_DAYS = 3;
const MAX_DAYS = 14;

/** A number that counts to its new value instead of snapping.
 *  Driven by state so React keeps ownership of the text node. */
function Amount({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (prefersReducedMotion()) { setShown(value); from.current = value; return; }

    const obj = { v: from.current };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: () => setShown(obj.v),
      onComplete: () => { from.current = value; }
    });
    from.current = value;
    return () => { tween.kill(); };
  }, [value]);

  return <span className={`price-num ${className ?? ''}`}>{inr(shown)}</span>;
}

export default function PriceConfigurator() {
  const [dest, setDest] = useState<DestinationSlug>('vietnam');
  const [days, setDays] = useState(6);
  const [pax, setPax] = useState(2);
  const [tier, setTier] = useState<TierKey>('premium');
  const [addons, setAddons] = useState<AddonKey[]>(['flights', 'visa']);

  const d = DESTINATIONS[dest];
  const q = useMemo(() => quote({ dest, days, pax, tier, addons }), [dest, days, pax, tier, addons]);

  const toggle = (key: AddonKey) =>
    setAddons((a) => (a.includes(key) ? a.filter((k) => k !== key) : [...a, key]));

  const daysFill = ((days - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)) * 100;

  /* Cost of each add-on at the current configuration, for the row labels */
  const addonCost = (key: AddonKey) => {
    const a = ADDONS[key];
    const base = typeof a.rate === 'function' ? a.rate(d) : a.rate;
    return Math.round(a.kind === 'perPersonPerDay' ? base * days * pax : base * pax);
  };

  return (
    <div className="config" id="configurator">
      {/* ------------------------------------------------------- controls */}
      <div className="config__panel">
        {/* destination */}
        <div className="config__block">
          <div className="config__head">
            <label>Destination</label>
            <span className="config__val">{d.iata}<small>{d.name}</small></span>
          </div>
          <div className="chips">
            {DESTINATION_LIST.map((x) => (
              <button
                key={x.slug}
                className="chipbtn"
                aria-pressed={dest === x.slug}
                onClick={() => setDest(x.slug)}
              >
                {x.name}
              </button>
            ))}
          </div>
        </div>

        {/* days */}
        <div className="config__block">
          <div className="config__head">
            <label htmlFor="days">Trip length</label>
            <span className="config__val">
              {String(days).padStart(2, '0')}<small>days / {days - 1} nights</small>
            </span>
          </div>
          <div className="slider-wrap">
            <input
              id="days"
              type="range"
              min={MIN_DAYS}
              max={MAX_DAYS}
              step={1}
              value={days}
              style={{ ['--fill' as string]: `${daysFill}%` } as React.CSSProperties}
              onChange={(e) => setDays(Number(e.target.value))}
              aria-valuetext={`${days} days`}
            />
            <div className="ticks" aria-hidden="true">
              {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }).map((_, i) => (
                <i key={i} className={MIN_DAYS + i <= days ? 'on' : ''} />
              ))}
            </div>
            <div className="range-ends">
              <span>{MIN_DAYS} days</span>
              <span>{MAX_DAYS} days</span>
            </div>
          </div>
        </div>

        {/* travellers */}
        <div className="config__block">
          <div className="config__head">
            <label>Travellers</label>
            <span className="config__val">
              {String(pax).padStart(2, '0')}
              <small>{pax >= 4 ? `group discount ${pax >= 6 ? '8' : '5'}%` : 'twin sharing'}</small>
            </span>
          </div>
          <div className="stepper">
            <button onClick={() => setPax((p) => Math.max(1, p - 1))} disabled={pax <= 1} aria-label="One traveller fewer">−</button>
            <output>{pax}</output>
            <button onClick={() => setPax((p) => Math.min(12, p + 1))} disabled={pax >= 12} aria-label="One traveller more">+</button>
          </div>
        </div>

        {/* tier */}
        <div className="config__block">
          <div className="config__head"><label>Stay standard</label></div>
          <div className="opts" role="radiogroup" aria-label="Stay standard">
            {(Object.keys(TIERS) as TierKey[]).map((k) => (
              <label className="opt" key={k}>
                <input
                  type="radio"
                  name="tier"
                  checked={tier === k}
                  onChange={() => setTier(k)}
                />
                <span>{TIERS[k].label}<b>{TIERS[k].note}</b></span>
              </label>
            ))}
          </div>
        </div>

        {/* add-ons */}
        <div className="config__block">
          <div className="config__head"><label>Add to the package</label></div>
          <div className="addons">
            {(Object.keys(ADDONS) as AddonKey[]).map((k) => (
              <label className="addon" key={k}>
                <input type="checkbox" checked={addons.includes(k)} onChange={() => toggle(k)} />
                <span className="addon__box"><Check /></span>
                <span className="addon__txt">
                  <b>{ADDONS[k].label}</b>
                  {ADDONS[k].note}
                </span>
                <span className="addon__cost">+{inr(addonCost(k))}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- live output */}
      <div className="config__out">
        <BoardingPass
          className="config__pass"
          notch="var(--navy-900)"
          from={ORIGIN.code}
          to={d.iata}
          fromCity={ORIGIN.city}
          toCity={d.name}
          title="Live quote · Boarding pass"
          stamp={`${TIERS[tier].label} · ${pax} PAX`}
          code={`FCV · ${d.iata} · ${String(days).padStart(2, '0')}D · ${TIERS[tier].label.toUpperCase()} · ${pax}PAX`}
          fields={[
            { label: 'Duration', value: `${String(days).padStart(2, '0')}D / ${String(days - 1).padStart(2, '0')}N`, mono: true },
            { label: 'Travellers', value: String(pax).padStart(2, '0'), mono: true },
            { label: 'Per person', value: inr(q.perPerson) }
          ]}
          stubFields={[
            { label: 'Total', value: inr(q.total), mono: true },
            { label: 'Class', value: TIERS[tier].label, mono: true }
          ]}
        />

        <div className="config__breakdown">
          {q.lines.map((l) => (
            <div className="brk-row" key={l.label}>
              <span>{l.label}</span>
              <b>{inr(l.amount)}</b>
            </div>
          ))}

          {q.saved > 0 && (
            <div className="brk-row brk-row--save">
              <span>Length &amp; group discount</span>
              <b>− {inr(q.saved)}</b>
            </div>
          )}

          <div className="brk-row brk-row--total">
            <span>Total for {pax} {pax === 1 ? 'traveller' : 'travellers'}</span>
            <b><Amount value={q.total} /></b>
          </div>

          <div className="brk-row">
            <span>Per person</span>
            <b><Amount value={q.perPerson} /></b>
          </div>
        </div>

        <div className="hero__actions mt-2">
          <TLink href="/contact" className="btn btn--gold" data-magnetic="0.28">
            Send this quote to a planner
            <ArrowRight className="btn__icon" />
          </TLink>
        </div>

        <p className="form__note mt-2">
          Indicative pricing for planning. Final quote depends on travel dates, hotel
          availability and live airfares — a planner confirms within 24 hours.
        </p>
      </div>
    </div>
  );
}
