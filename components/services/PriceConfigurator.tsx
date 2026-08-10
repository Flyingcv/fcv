'use client';

/* Interactive pricing configurator.
   Slide the days, pick a tier, add extras — the boarding pass beside it
   re-prints in real time with the destination, duration and total. */

import { useEffect, useMemo, useRef, useState } from 'react';
import BoardingPass from '@/components/BoardingPass';
import { ArrowRight } from '@/components/icons';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import {
  DESTINATION_LIST, DESTINATIONS, TIERS, ORIGIN, FORMS,
  quote, inr, type DestinationSlug, type TierKey, type AddonKey
} from '@/lib/data';

const F = FORMS.priceConfigurator;
const MIN_DAYS = F.minDays;
const MAX_DAYS = F.maxDays;

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
  const [days, setDays] = useState(F.defaultDays);
  const [pax, setPax] = useState(F.defaultPax);
  const [tier, setTier] = useState<TierKey>('premium');
  // The "add to the package" picker is commented out below for now, so there
  // is nothing to toggle — quote() still accepts an addons list if it comes
  // back, it's just always empty while the picker is hidden.
  const addons: AddonKey[] = [];

  const d = DESTINATIONS[dest];
  const q = useMemo(() => quote({ dest, days, pax, tier, addons }), [dest, days, pax, tier, addons]);

  const daysFill = ((days - MIN_DAYS) / (MAX_DAYS - MIN_DAYS)) * 100;

  // Add-ons are commented out on the page for now — see the config__block
  // below — but toggle/addonCost stay so re-enabling is a one-line change.
  // const toggle = (key: AddonKey) =>
  //   setAddons((a) => (a.includes(key) ? a.filter((k) => k !== key) : [...a, key]));
  // const addonCost = (key: AddonKey) => {
  //   const a = ADDONS[key];
  //   const base = typeof a.rate === 'function' ? a.rate(d) : a.rate;
  //   return Math.round(a.kind === 'perPersonPerDay' ? base * days * pax : base * pax);
  // };

  const waMessage = [
    `Hi! I'd like a quote for a trip:`,
    ``,
    `Destination: ${d.name} (${d.iata})`,
    `Duration: ${days - 1} nights`,
    `Travellers: ${pax}`,
    `Stay: ${TIERS[tier].label}`,
    `Estimated total: ${inr(q.total)}`,
    ``,
    `Please share more details.`
  ].join('\n');
  const waLink = `https://wa.me/917017440214?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="config" id="configurator">
      {/* ------------------------------------------------------- controls */}
      <div className="config__panel">
        {/* destination */}
        <div className="config__block">
          <div className="config__head">
            <label>{F.labels.destination}</label>
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

        {/* days (slider still steps by whole days; display is nights-only) */}
        <div className="config__block">
          <div className="config__head">
            <label htmlFor="days">{F.labels.tripLength}</label>
            <span className="config__val">
              {String(days - 1).padStart(2, '0')}<small>{F.labels.nightsSuffix}</small>
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
              aria-valuetext={`${days - 1} nights`}
            />
            <div className="ticks" aria-hidden="true">
              {Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }).map((_, i) => (
                <i key={i} className={MIN_DAYS + i <= days ? 'on' : ''} />
              ))}
            </div>
            <div className="range-ends">
              <span>{MIN_DAYS - 1} {F.labels.nightsSuffix}</span>
              <span>{MAX_DAYS - 1} {F.labels.nightsSuffix}</span>
            </div>
          </div>
        </div>

        {/* travellers */}
        <div className="config__block">
          <div className="config__head">
            <label>{F.labels.travellers}</label>
            <span className="config__val">
              {String(pax).padStart(2, '0')}
              <small>{pax >= 4 ? F.labels.travellingTogether : F.labels.twinSharing}</small>
            </span>
          </div>
          <div className="stepper">
            <button onClick={() => setPax((p) => Math.max(F.minPax, p - 1))} disabled={pax <= F.minPax} aria-label="One traveller fewer">−</button>
            <output>{pax}</output>
            <button onClick={() => setPax((p) => Math.min(F.maxPax, p + 1))} disabled={pax >= F.maxPax} aria-label="One traveller more">+</button>
          </div>
        </div>

        {/* tier */}
        <div className="config__block">
          <div className="config__head"><label>{F.labels.stayStandard}</label></div>
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

        {/* add-ons — commented out for now, see the note by the `addons` const above
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
        */}
      </div>

      {/* --------------------------------------------------- live output */}
      <div className="config__out">
        <BoardingPass
          className="config__pass"
          notch="var(--paper-200)"
          from={ORIGIN.code}
          to={d.iata}
          fromCity={ORIGIN.city}
          toCity={d.name}
          title={F.passTitle}
          stamp={`${TIERS[tier].label} · ${pax} PAX`}
          code={`FCV · ${d.iata} · ${String(days).padStart(2, '0')}D · ${TIERS[tier].label.toUpperCase()} · ${pax}PAX`}
          fields={[
            { label: 'Duration', value: `${String(days - 1).padStart(2, '0')}N / ${String(days).padStart(2, '0')}D`, mono: true },
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
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn--gold" data-magnetic="0.28">
            {F.sendQuoteLabel}
            <ArrowRight className="btn__icon" />
          </a>
        </div>

        <p className="form__note mt-2">
          {F.disclaimerNote}
        </p>
      </div>
    </div>
  );
}

// Refinement iteration 36 for code quality and clarity

// Refinement iteration 58 for code quality and clarity

// Refinement iteration 31 for code quality and clarity

// Refinement iteration 53 for code quality and clarity
