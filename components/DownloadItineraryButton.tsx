'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import {
  BROCHURE, CONTACT, PACKAGE_EXCLUDES,
  type Package, type Destination
} from '@/lib/data';

interface Props {
  pkg: Package;
  destination: Destination;
}

/* jsPDF's built-in fonts only cover WinAnsi (Windows-1252) — ₹, ₫, ฿, ★, →
   and the ✓/✕ bullets all fall outside it. Left alone, a missing glyph
   doesn't just vanish, it throws off that whole string's measured width and
   mangles the spacing of everything after it. Every piece of dynamic text
   goes through this before it reaches doc.text(). */
const pdfText = (s: string) => s
  .replace(/₹/g, 'Rs. ')
  .replace(/₫/g, 'd')
  .replace(/฿/g, 'B')
  .replace(/★/g, ' Star')
  .replace(/[→➜➔]/g, '->')
  .replace(/[✓✔✕✗]/g, '')
  .replace(/[""]/g, '"')
  .replace(/['']/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const pdfMoney = (n: number) => 'Rs. ' + Math.round(n).toLocaleString('en-IN');

const NAVY: [number, number, number] = [10, 27, 61];
const GOLD: [number, number, number] = [196, 134, 43];
const GOLD_LIGHT: [number, number, number] = [227, 166, 60];
const INK: [number, number, number] = [32, 44, 68];
const INK_SOFT: [number, number, number] = [70, 82, 105];
const INK_FAINT: [number, number, number] = [140, 148, 165];
const HAIRLINE: [number, number, number] = [231, 222, 201];
const BAND: [number, number, number] = [248, 245, 237];

/** Loads an image and crops it (canvas-side) to exactly fill targetW x
 *  targetH — true "cover" fit, so photos never look stretched in the PDF.
 *  Returns null on any failure (CORS, 404, ...) so the PDF still builds. */
async function loadImageCover(src: string, targetW: number, targetH: number): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('image load failed'));
      img.src = src;
    });

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const srcRatio = img.naturalWidth / img.naturalHeight;
    const dstRatio = targetW / targetH;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (srcRatio > dstRatio) {
      sw = img.naturalHeight * dstRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / dstRatio;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch {
    return null;
  }
}

/** Loads a same-origin image (the logo) at its natural size, preserving
 *  transparency via PNG — unlike loadImageCover this doesn't crop or
 *  recompress to JPEG, since a logo needs a clean edge, not a photo fit. */
async function loadImagePng(src: string): Promise<{ dataUrl: string; ratio: number } | null> {
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('logo load failed'));
      img.src = src;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return { dataUrl: canvas.toDataURL('image/png'), ratio: img.naturalWidth / img.naturalHeight };
  } catch {
    return null;
  }
}

export default function DownloadItineraryButton({ pkg, destination: d }: Props) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const M = 46;                    // page margin
      const CW = pageW - M * 2;        // content width
      const BOTTOM = pageH - 62;       // where the footer zone starts

      // Landscape banner (~2.35:1) rather than a full-bleed portrait cover —
      // it's a strip at the top of page 1, not the whole first page.
      const [banner, logo] = await Promise.all([
        loadImageCover(d.hero.replace(/w=\d+/, 'w=1600'), 1600, 680),
        loadImagePng('/logo-flying-colours-vacations.webp')
      ]);

      let y = 0;

      /* ---------------------------------------------------------- helpers */
      /* splitTextToSize measures with whatever font is *currently* active, so
         wrapping before setting the draw font silently produces the wrong
         line count (a 9.5pt paragraph measured at the 15pt heading size wraps
         far too narrow). Pass `size` whenever the active font isn't already
         the one the text will be drawn at. */
      const wrap = (text: string, maxW: number, size?: number) => {
        if (size !== undefined) doc.setFontSize(size);
        return doc.splitTextToSize(pdfText(text), maxW);
      };

      const rule = (yy: number, x1 = M, x2 = pageW - M, color = HAIRLINE) => {
        doc.setDrawColor(...color);
        doc.setLineWidth(0.75);
        doc.line(x1, yy, x2, yy);
      };

      const room = (needed: number) => {
        if (y + needed > BOTTOM) { doc.addPage(); y = M; return true; }
        return false;
      };

      /** Gold eyebrow label */
      const label = (text: string, x: number, yy: number, color = GOLD, size = 8) => {
        doc.setTextColor(...color);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(size);
        doc.text(pdfText(text).toUpperCase(), x, yy);
      };

      /** Starts a new major section. Sections flow down the page rather than
       *  each forcing doc.addPage() — that was leaving 400-550pt of dead
       *  space at the foot of any section that didn't fill a full page.
       *  Adds breathing room above, then breaks only if the heading would
       *  otherwise orphan near the bottom. */
      const section = (gapAbove = 18) => {
        if (y > M) y += gapAbove;
      };

      /** Big section heading with a rule under it. Advances y.
       *  Reserves space for the heading plus a first chunk of content so a
       *  heading is never stranded alone at the bottom of a page. */
      const heading = (text: string, sub?: string) => {
        room(95);
        doc.setTextColor(...GOLD);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(pdfText(text), M, y);
        y += 8;
        rule(y + 7);
        y += 21;
        if (sub) {
          doc.setTextColor(...INK_SOFT);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          const lines = wrap(sub, CW, 9.5);
          doc.text(lines, M, y);
          y += lines.length * 13 + 8;
        }
      };

      const bullet = (x: number, yy: number, color: [number, number, number] = GOLD) => {
        doc.setFillColor(...color);
        doc.circle(x, yy - 3, 1.7, 'F');
      };

      const drawCheck = (x: number, yy: number) => {
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(1.4);
        doc.line(x, yy - 2.5, x + 2.5, yy);
        doc.line(x + 2.5, yy, x + 7, yy - 6.5);
      };
      const drawCross = (x: number, yy: number) => {
        doc.setDrawColor(...INK_FAINT);
        doc.setLineWidth(1.2);
        doc.line(x, yy - 5.5, x + 6, yy);
        doc.line(x, yy, x + 6, yy - 5.5);
      };

      /** Small rounded pill with text, returns its width */
      const pill = (text: string, x: number, yy: number, fill: [number, number, number], txt: [number, number, number]) => {
        const t = pdfText(text);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        const w = doc.getTextWidth(t) + 14;
        doc.setFillColor(...fill);
        doc.roundedRect(x, yy - 8, w, 13, 3, 3, 'F');
        doc.setTextColor(...txt);
        doc.text(t, x + 7, yy);
        return w;
      };

      /* jsPDF's opacity API isn't in the published .d.ts but is present at
         runtime (verified against the installed jspdf version). Used for
         the anti-copy watermark below. */
      const withOpacity = (op: number, draw: () => void) => {
        const gd = doc as unknown as { GState(o: { opacity: number }): unknown; setGState(g: unknown): void };
        gd.setGState(gd.GState({ opacity: op }));
        draw();
        gd.setGState(gd.GState({ opacity: 1 }));
      };

      /** Faint tiled brand text across the whole page, behind and over the
       *  content — makes a screenshot or photocopy traceable back to us
       *  without hurting legibility of the real text sitting on top. */
      const drawWatermark = (onDark: boolean) => {
        withOpacity(onDark ? 0.07 : 0.05, () => {
          doc.setTextColor(...(onDark ? [255, 255, 255] as [number, number, number] : NAVY));
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          const text = 'FLYING COLOURS VACATIONS';
          const stepX = 230, stepY = 100;
          let row = 0;
          for (let ry = 40; ry < pageH + 60; ry += stepY, row += 1) {
            for (let rx = -140 + (row % 2 ? stepX / 2 : 0); rx < pageW + 100; rx += stepX) {
              doc.text(text, rx, ry, { angle: 28 });
            }
          }
        });
      };

      /** Small logo mark, top-right, on every page. On the navy back cover
       *  it sits on a white chip — the logo's wordmark is navy-on-transparent
       *  and would vanish drawn directly onto navy. */
      const drawCornerLogo = (onDark: boolean) => {
        if (!logo) return;
        const w = 68;
        const h = w / logo.ratio;
        const x = pageW - M - w;
        const yTop = 22;
        if (onDark) {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(x - 8, yTop - 8, w + 16, h + 16, 4, 4, 'F');
        }
        doc.addImage(logo.dataUrl, 'PNG', x, yTop, w, h);
      };

      /* ============================================================ PAGE 1 */
      y = M;
      doc.setTextColor(...GOLD);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('FLYING COLOURS VACATIONS', M, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...INK_FAINT);
      doc.text('ADDING COLOURS TO EVERY JOURNEY', M, y + 12);
      y += 34;

      const bannerH = CW * 0.42;
      if (banner) {
        doc.addImage(banner, 'JPEG', M, y, CW, bannerH);
      } else {
        doc.setFillColor(...NAVY);
        doc.rect(M, y, CW, bannerH, 'F');
      }
      doc.setDrawColor(...HAIRLINE);
      doc.setLineWidth(1);
      doc.rect(M, y, CW, bannerH);
      y += bannerH + 24;

      doc.setTextColor(...NAVY);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text(pdfText(d.name).toUpperCase(), M, y);
      y += 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...GOLD);
      doc.text(pdfText(d.tagline), M, y);
      y += 28;

      doc.setTextColor(...NAVY);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      const coverTitle = wrap(pkg.title, CW, 15);
      doc.text(coverTitle, M, y);
      y += coverTitle.length * 18 + 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...INK_SOFT);
      doc.text(
        pdfText(`${pkg.badge}  ·  ${pkg.nights}N / ${pkg.days}D  ·  from ${pdfMoney(pkg.price)} per person`),
        M, y
      );
      y += 26;

      label('Trip route', M, y);
      y += 15;
      doc.setTextColor(...INK);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const coverRoute = wrap(pkg.route.join('   ->   '), CW, 10.5);
      doc.text(coverRoute, M, y);
      y += coverRoute.length * 14 + 22;

      label('About this trip', M, y);
      y += 15;
      doc.setTextColor(...INK_SOFT);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const blurbLines = wrap(`${pkg.blurb} ${d.blurb}`, CW, 10);
      doc.text(blurbLines, M, y);
      y += blurbLines.length * 13.5 + 20;

      label('Good to know', M, y);
      y += 16;
      const factEntries = Object.entries(d.facts);
      const factColW = CW / factEntries.length;
      factEntries.forEach(([k, v], i) => {
        const x = M + i * factColW;
        doc.setTextColor(...INK_FAINT);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(pdfText(k).toUpperCase(), x, y);
        doc.setTextColor(...NAVY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const lines = wrap(v, factColW - 10, 9.5);
        doc.text(lines, x, y + 14);
      });
      y += 40;

      /* =================================================== QUICK DETAILS */
      section();
      heading('Quick details', 'Everything at a glance before you read the day-by-day plan.');

      const qd = Object.entries(pkg.quickDetails);
      qd.forEach(([k, v], i) => {
        const lines = wrap(v, CW - 172, 9.5);
        const rowH = Math.max(22, lines.length * 12 + 12);
        room(rowH + 4);

        if (i % 2 === 0) {
          doc.setFillColor(...BAND);
          doc.rect(M, y - 11, CW, rowH, 'F');
        }
        doc.setTextColor(...INK_FAINT);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(pdfText(k).toUpperCase(), M + 10, y);

        doc.setTextColor(...INK);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(lines, M + 172, y);
        y += rowH;
      });

      section(24);
      heading('Where you stay');
      pkg.hotels.forEach((h) => {
        const lines = wrap(h, CW - 16, 9.5);
        room(lines.length * 13 + 8);
        bullet(M + 3, y);
        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(lines, M + 14, y);
        y += lines.length * 13 + 8;
      });
      y += 6;
      doc.setTextColor(...INK_FAINT);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      const hotelNote = wrap(
        'Hotels are the properties we book most often on this route. If one is unavailable for your dates we substitute the same or a higher category and confirm it in writing.',
        CW, 8.5
      );
      room(hotelNote.length * 11);
      doc.text(hotelNote, M, y);
      y += hotelNote.length * 11;

      /* ================================================== SKETCH ITINERARY */
      section();
      heading('Itinerary at a glance', 'The whole trip on one page — days, plan, where you sleep and which meals are covered.');

      const colX = [M + 8, M + 58, M + 300, M + 400];
      doc.setFillColor(...NAVY);
      doc.rect(M, y - 12, CW, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('DAY', colX[0], y);
      doc.text('ITINERARY', colX[1], y);
      doc.text('STAY', colX[2], y);
      doc.text('MEALS', colX[3], y);
      y += 20;

      pkg.itinerary.forEach((day, i) => {
        const titleLines = wrap(day.title, 232, 9);
        const stayLines = wrap(day.stay, 92, 8.5);
        const mealLines = wrap(day.meals, CW - (colX[3] - M) - 12, 8.5);
        const rowH = Math.max(titleLines.length, stayLines.length, mealLines.length) * 11 + 14;

        if (room(rowH)) {
          doc.setFillColor(...NAVY);
          doc.rect(M, y - 12, CW, 22, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text('DAY', colX[0], y);
          doc.text('ITINERARY', colX[1], y);
          doc.text('STAY', colX[2], y);
          doc.text('MEALS', colX[3], y);
          y += 20;
        }

        if (i % 2 === 0) {
          doc.setFillColor(...BAND);
          doc.rect(M, y - 11, CW, rowH, 'F');
        }

        doc.setTextColor(...GOLD);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(String(i + 1).padStart(2, '0'), colX[0], y);

        doc.setTextColor(...INK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(titleLines, colX[1], y);

        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(stayLines, colX[2], y);
        doc.text(mealLines, colX[3], y);

        y += rowH;
        rule(y - 9);
      });

      /* ================================================ DAYWISE ITINERARY */
      section();
      heading('Day-by-day itinerary');

      pkg.itinerary.forEach((day, i) => {
        const summaryLines = wrap(day.summary, CW - 84, 9.5);
        const activityLines = day.activities.map((a) => wrap(a, CW - 102, 9));
        const inclLines = wrap(`Included: ${day.included}`, CW - 84, 8);
        const actH = activityLines.reduce((h, l) => h + l.length * 12 + 5, 0);
        const blockH = 17 + summaryLines.length * 12.5 + 12 + actH + 10 + inclLines.length * 11 + 18;

        room(Math.min(blockH, 260));

        doc.setFillColor(...GOLD);
        doc.roundedRect(M, y - 11, 64, 17, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(`DAY ${String(i + 1).padStart(2, '0')}`, M + 32, y, { align: 'center' });

        doc.setTextColor(...NAVY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(pdfText(day.title), M + 84, y);

        let px = M + 84;
        const py = y + 15;
        px += pill(day.type, px, py, [237, 231, 216], INK_SOFT) + 6;
        pill(day.meals, px, py, [237, 231, 216], INK_SOFT);

        let dy = py + 17;

        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(summaryLines, M + 84, dy);
        dy += summaryLines.length * 12.5 + 8;

        activityLines.forEach((lines) => {
          bullet(M + 88, dy);
          doc.setTextColor(...INK_SOFT);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text(lines, M + 98, dy);
          dy += lines.length * 12 + 5;
        });

        dy += 4;
        doc.setTextColor(...GOLD);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(inclLines, M + 84, dy);
        dy += inclLines.length * 11 + 13;

        y = dy;
        rule(y - 7);
      });

      /* =================================================== INCL / EXCL */
      section();
      heading('Inclusions & exclusions');

      const halfW = CW / 2 - 14;
      const topY = y;

      // Dynamic — sourced from pkg.includes plus every unique "Included: X"
      // line across the day-by-day plan, so editing content/packages.json
      // is the only thing that ever needs to change this list.
      label('Included', M, y, GOLD);
      let incY = y + 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      pkg.includes.forEach((item) => {
        const lines = wrap(item, halfW - 18, 9.5);
        drawCheck(M, incY);
        doc.setTextColor(...INK_SOFT);
        doc.text(lines, M + 15, incY);
        incY += lines.length * 12.5 + 7;
      });
      const dayIncl = Array.from(new Set(pkg.itinerary.flatMap((dd) => dd.included.split(' + ').map((s) => s.trim()))));
      dayIncl.forEach((item) => {
        if (pkg.includes.some((i2) => i2.toLowerCase() === item.toLowerCase())) return;
        const lines = wrap(item, halfW - 18, 9.5);
        drawCheck(M, incY);
        doc.setTextColor(...INK_SOFT);
        doc.text(lines, M + 15, incY);
        incY += lines.length * 12.5 + 7;
      });

      const exX = M + halfW + 28;
      label('Not included', exX, topY, INK_FAINT);
      let exY = topY + 20;
      PACKAGE_EXCLUDES.forEach((item) => {
        const lines = wrap(item, halfW - 18, 9.5);
        drawCross(exX, exY);
        doc.setTextColor(...INK_FAINT);
        doc.text(lines, exX + 15, exY);
        exY += lines.length * 12.5 + 7;
      });

      y = Math.max(incY, exY) + 18;

      /* ======================================================= HIGHLIGHTS */
      section(24);
      heading(`${d.name} highlights`);
      d.highlights.forEach(([title, copy]) => {
        const lines = wrap(copy, CW - 16, 9.5);
        const h = 13 + lines.length * 12 + 11;
        room(h);
        doc.setTextColor(...NAVY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text(pdfText(title), M, y);
        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(lines, M, y + 14);
        y += h;
      });

      /* ========================================================== PRICING */
      section();
      heading(
        'What you pay',
        'Per person on twin-sharing basis, land package. Return flights price constantly — add one on request at the fare live on your travel date, or use the estimate in Optional add-ons below.'
      );

      pkg.priceVariants.forEach((v, i) => {
        const noteLines = wrap(v.note, CW - 200, 8.5);
        const rowH = Math.max(34, noteLines.length * 12 + 24);
        room(rowH + 4);

        const featured = i === 0;
        doc.setFillColor(...(featured ? NAVY : BAND));
        doc.roundedRect(M, y - 12, CW, rowH, 5, 5, 'F');

        doc.setTextColor(...(featured ? GOLD_LIGHT : GOLD));
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(pdfText(v.label), M + 14, y + 4);

        doc.setTextColor(...(featured ? [220, 224, 235] as [number, number, number] : INK_SOFT));
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(noteLines, M + 90, y + 4);

        doc.setTextColor(...(featured ? [255, 255, 255] as [number, number, number] : NAVY));
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(pdfMoney(v.price), pageW - M - 14, y + 6, { align: 'right' });

        y += rowH + 8;
      });

      section(24);
      heading('Optional add-ons');

      doc.setFillColor(...NAVY);
      doc.rect(M, y - 12, CW, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('SERVICE', M + 10, y);
      doc.text('DESCRIPTION', M + 150, y);
      doc.text('PRICE', pageW - M - 10, y, { align: 'right' });
      y += 20;

      BROCHURE.addons.forEach((a, i) => {
        const descLines = wrap(a.description, 220, 8.5);
        const rowH = Math.max(22, descLines.length * 12 + 12);
        room(rowH);
        if (i % 2 === 0) {
          doc.setFillColor(...BAND);
          doc.rect(M, y - 11, CW, rowH, 'F');
        }
        doc.setTextColor(...INK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(pdfText(a.service), M + 10, y);
        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(descLines, M + 150, y);
        doc.setTextColor(...GOLD);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.text(pdfText(a.price), pageW - M - 10, y, { align: 'right' });
        y += rowH;
      });

      /* ============================================ NOTES + PAYMENT + WHY */
      section();
      heading('Good to know');
      BROCHURE.notes.forEach((n) => {
        const lines = wrap(n, CW - 18, 9);
        room(lines.length * 12.5 + 9);
        bullet(M + 4, y);
        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(lines, M + 15, y);
        y += lines.length * 12.5 + 7;
      });

      section(24);
      heading('Payment & booking');
      label('We accept', M, y);
      y += 16;
      doc.setTextColor(...INK_SOFT);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(pdfText(BROCHURE.paymentMethods.join('   ·   ')), M, y);
      y += 22;

      BROCHURE.paymentTerms.forEach((t) => {
        const lines = wrap(t, CW - 18, 9);
        room(lines.length * 12.5 + 9);
        bullet(M + 4, y);
        doc.setTextColor(...INK_SOFT);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(lines, M + 15, y);
        y += lines.length * 12.5 + 7;
      });

      section(24);
      heading('Why travel with us');
      // Two columns — these blurbs are short, and a single full-width column
      // ran the section long enough to widow its last items onto a page of
      // their own.
      {
        const colW = CW / 2 - 14;
        const colX2 = [M, M + CW / 2 + 14];
        for (let i = 0; i < BROCHURE.whyUs.length; i += 2) {
          const pair = BROCHURE.whyUs.slice(i, i + 2);
          const wrapped = pair.map((w) => wrap(w.copy, colW, 9.5));
          const rowH = Math.max(...wrapped.map((l) => 13 + l.length * 12 + 12));
          room(rowH);
          pair.forEach((w, j) => {
            doc.setTextColor(...NAVY);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.text(pdfText(w.title), colX2[j], y);
            doc.setTextColor(...INK_SOFT);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(wrapped[j], colX2[j], y + 14);
          });
          y += rowH;
        }
      }

      /* ===================================================== BACK / CONTACT */
      doc.addPage();
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, pageW, pageH, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('FLYING COLOURS VACATIONS', M, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...GOLD_LIGHT);
      doc.text('ADDING COLOURS TO EVERY JOURNEY', M, 76);

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text('Ready when', M, pageH / 2 - 60);
      doc.text('you are.', M, pageH / 2 - 28);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(220, 224, 235);
      doc.text(wrap('Send us your dates and we will turn this into a confirmed, priced itinerary — usually the same day.', CW - 120, 11), M, pageH / 2 + 6);

      let cy = pageH / 2 + 90;
      doc.setDrawColor(90, 100, 130);
      doc.setLineWidth(0.75);
      doc.line(M, cy - 26, pageW - M, cy - 26);

      const contactRows: [string, string][] = [
        ['Phone / WhatsApp', CONTACT.phone],
        ['Email', CONTACT.email],
        ['Office', CONTACT.address],
        ['Desk hours', CONTACT.hours]
      ];
      contactRows.forEach(([k, v]) => {
        const lines = wrap(v, CW - 150, 10);
        doc.setTextColor(...GOLD_LIGHT);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(pdfText(k).toUpperCase(), M, cy);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(lines, M + 150, cy);
        cy += Math.max(20, lines.length * 13 + 8);
      });

      doc.setTextColor(...GOLD_LIGHT);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('flyingcoloursvacations.com', M, pageH - 56);

      /* ------------------------------------------------------------- footer */
      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p += 1) {
        doc.setPage(p);
        const isBackCover = p === pageCount;

        drawWatermark(isBackCover);
        drawCornerLogo(isBackCover);

        if (!isBackCover) {
          doc.setDrawColor(...HAIRLINE);
          doc.setLineWidth(0.5);
          doc.line(M, pageH - 34, pageW - M, pageH - 34);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(...INK_FAINT);
          doc.text(pdfText(`${pkg.title}  ·  ${pkg.nights}N / ${pkg.days}D`), M, pageH - 20);
          doc.text(`${p} / ${pageCount}`, pageW - M, pageH - 20, { align: 'right' });
        }
      }

      doc.save(`${pkg.id}-itinerary.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={handleDownload}
      disabled={busy}
      data-magnetic="0.25"
    >
      {busy ? 'Preparing PDF…' : 'Download itinerary'}
      <ArrowRight className="btn__icon" />
    </button>
  );
}
