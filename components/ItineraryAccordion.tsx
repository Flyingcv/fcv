'use client';

import { useState } from 'react';
import { Caret } from '@/components/icons';
import { SITE, type ItineraryDay } from '@/lib/data';

const U = SITE.ui.itineraryAccordion;

interface Props {
  days: ItineraryDay[];
}

export default function ItineraryAccordion({ days }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="accordion" data-stagger="0.04">
      {days.map((day, i) => {
        const isOpen = open.has(i);
        return (
          <div className={`accordion__row rise${isOpen ? ' is-open' : ''}`} key={day.title}>
            <button
              type="button"
              className="accordion__head"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <span className="accordion__day">{U.dayLabelPrefix} {String(i + 1).padStart(2, '0')}</span>
              <span className="accordion__title">{day.title}</span>
              <Caret className="accordion__caret" />
            </button>
            <div className="accordion__body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
              <div className="accordion__body-inner">
                <p className="accordion__summary">{day.summary}</p>
                <ul className="accordion__activities">
                  {day.activities.map((a) => <li key={a}>{a}</li>)}
                </ul>
                <p className="accordion__included"><span>{U.includedLabel}</span> {day.included}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
