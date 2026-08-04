'use client';

/* Photo mosaic with a click-to-open lightbox. Renders the same .mosaic
   markup as before, plus a full-screen overlay with prev/next/close. */

import { useEffect, useState } from 'react';
import Photo from '@/components/Photo';
import { ArrowRight, Close } from '@/components/icons';

interface Props {
  images: string[];
  alt: string;
}

export default function Gallery({ images, alt }: Props) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  useEffect(() => {
    if (openAt === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenAt(null);
      if (e.key === 'ArrowRight') setOpenAt((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setOpenAt((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openAt, images.length]);

  return (
    <>
      <div className="mosaic">
        {images.map((g, i) => (
          <button
            type="button"
            className="media reveal-clip lightbox-trigger"
            key={g + i}
            onClick={() => setOpenAt(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Photo src={g} alt={`${alt} photography ${i + 1}`} />
          </button>
        ))}
      </div>

      {openAt !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setOpenAt(null)}>
          <button type="button" className="lightbox__close" onClick={() => setOpenAt(null)} aria-label="Close">
            <Close />
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); setOpenAt((i) => (i === null ? i : (i - 1 + images.length) % images.length)); }}
          >
            <ArrowRight />
          </button>

          <img
            src={images[openAt]}
            alt={`${alt} photography ${openAt + 1}`}
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); setOpenAt((i) => (i === null ? i : (i + 1) % images.length)); }}
          >
            <ArrowRight />
          </button>

          <span className="lightbox__count">{openAt + 1} / {images.length}</span>
        </div>
      )}
    </>
  );
}

// Refinement iteration 24 for code quality and clarity

// Refinement iteration 46 for code quality and clarity

// Refinement iteration 68 for code quality and clarity
