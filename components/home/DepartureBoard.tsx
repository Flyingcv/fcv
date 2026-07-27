'use client';

/* Split-flap departures board — the most on-theme way to list destinations.
   Characters shuffle through a character pool and settle column by column. */

import { useEffect, useRef, useState } from 'react';
import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import { BOARD_ROWS, DESTINATION_LIST } from '@/lib/data';
import { prefersReducedMotion } from '@/lib/gsap';
import { ArrowRight } from '@/components/icons';

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ·-';

function FlapWord({ text, active, delay = 0, className = '' }: {
  text: string; active: boolean; delay?: number; className?: string;
}) {
  const target = text.toUpperCase();
  const [cells, setCells] = useState<string[]>(() => target.split(''));
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    if (prefersReducedMotion()) return;

    const chars = target.split('');
    const settleAt = chars.map((c, i) =>
      c === ' ' ? 0 : Math.round(delay / 45) + i * 1.4 + 6 + Math.random() * 8
    );
    let frame = 0;

    setCells(chars.map((c) => (c === ' ' ? ' ' : POOL[Math.floor(Math.random() * POOL.length)])));

    const id = setInterval(() => {
      frame++;
      let remaining = 0;
      const next = chars.map((c, i) => {
        if (c === ' ') return ' ';
        if (frame >= settleAt[i]) return c;
        remaining++;
        return POOL[Math.floor(Math.random() * POOL.length)];
      });
      setCells(next);
      if (!remaining) clearInterval(id);
    }, 45);

    return () => clearInterval(id);
  }, [active, target, delay]);

  return (
    <span className={`flap-word ${className}`} aria-label={text}>
      {cells.map((c, i) => (
        <span className="flap" key={i} aria-hidden="true">{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  );
}

export default function DepartureBoard() {
  const [active, setActive] = useState(false);
  const [clock, setClock] = useState('--:--:-- IST');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, '0');
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} IST`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="section on-navy">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__text">
            <span className="tag">Departures · Terminal FCV</span>
            <SplitText as="h2">Four countries.<br />One boarding pass.</SplitText>
          </div>
          <TLink href="/destinations" className="link-u" data-magnetic="0.2">
            All destinations <ArrowRight className="btn__icon" />
          </TLink>
        </div>

        <div className="board" ref={ref}>
          <div className="board__top">
            <span>FCV International Departures</span>
            <span suppressHydrationWarning>{clock}</span>
          </div>

          <div className="board__cols">
            <span>Flight</span>
            <span>Destination</span>
            <span>Gate</span>
            <span>Duration</span>
            <span>Status</span>
          </div>

          {BOARD_ROWS.map((r, i) => (
            <div className="board__row" key={r.flight}>
              <FlapWord text={r.flight} active={active} delay={i * 90} />
              <FlapWord text={r.dest} active={active} delay={i * 90 + 120} className="flap-word--lg" />
              <FlapWord text={r.gate} active={active} delay={i * 90 + 260} />
              <FlapWord text={r.dur} active={active} delay={i * 90 + 320} />
              <span className={`board__status${r.soon ? ' board__status--soon' : ''}`}>{r.status}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-4 mt-3" data-stagger="0.09">
          {DESTINATION_LIST.map((d) => (
            <TLink
              key={d.slug}
              href={`/destinations/${d.slug}`}
              className="svc-card"
              data-cursor="Explore"
              style={{ background: 'rgba(251,248,241,.04)', borderColor: 'rgba(251,248,241,.14)' }}
            >
              <span className="svc-card__num">{d.iata}</span>
              <h3 style={{ color: 'var(--paper-100)' }}>{d.name}</h3>
              <p style={{ color: 'var(--cream-on-navy)' }}>{d.tagline}</p>
              <p className="mono mt-1" style={{ color: 'var(--gold-400)', fontSize: '.8rem', letterSpacing: '.1em' }}>
                FROM ₹{d.fromPrice.toLocaleString('en-IN')}
              </p>
            </TLink>
          ))}
        </div>
      </div>
    </section>
  );
}
