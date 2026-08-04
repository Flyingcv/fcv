'use client';

import { useState } from 'react';

/* A branded stand-in so a blocked/expired photo never shows a broken icon.
   It is a real image, so object-fit and every layout rule still apply. */
const FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#10264F"/><stop offset="0.55" stop-color="#050F24"/><stop offset="1" stop-color="#C4862B"/>
</linearGradient>
<pattern id="p" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
<line x1="0" y1="0" x2="0" y2="34" stroke="#FBF8F1" stroke-opacity="0.05" stroke-width="10"/>
</pattern>
</defs>
<rect width="800" height="800" fill="url(#g)"/>
<rect width="800" height="800" fill="url(#p)"/>
<text x="400" y="410" text-anchor="middle" font-family="monospace" font-size="30" letter-spacing="14" fill="#FBF8F1" fill-opacity="0.34">FCV</text>
</svg>`);

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** parallax speed, read by the reveal engine */
  px?: number;
}

export default function Photo({ src, alt, className, priority, px }: PhotoProps) {
  const [source, setSource] = useState(src);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={source}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      data-px={px}
      onError={() => setSource((s) => (s === FALLBACK ? s : FALLBACK))}
    />
  );
}

// Refinement iteration 27 for code quality and clarity

// Refinement iteration 49 for code quality and clarity
