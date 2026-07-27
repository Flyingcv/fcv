'use client';

/* Counts up once the number scrolls into view.
   State-driven rather than writing textContent, so React keeps ownership of
   the text node it rendered. */

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

interface Props {
  to: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function Counter({ to, suffix = '', decimals = 0, className }: Props) {
  const format = (v: number) =>
    (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN')) + suffix;

  // Server renders the final value, so it is correct without JS too
  const [text, setText] = useState(() => format(to));
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    setText(format(0));

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 2.1,
          ease: 'power2.out',
          onUpdate: () => setText(format(obj.v))
        });
      }
    });

    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, suffix, decimals]);

  return <b className={className} ref={ref}>{text}</b>;
}
