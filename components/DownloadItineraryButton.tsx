'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import {
  BROCHURE, CONTACT, PACKAGE_EXCLUDES, PDF_COPY,
  type Package, type Destination
} from '@/lib/data';

const fill = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), template);

interface Props {
  pkg: Package;
  destination: Destination;
  /** Trip length and traveller count as currently configured on the price
   *  card — the PDF's pricing mirrors whatever the visitor has selected
   *  rather than always printing the package's base price. */
  nights: number;
  pax: number;
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

/** Loads the pre-cut transparent brand logo (see /public/logo-transparent.png
 *  — the same JPEG lockup with its flat cream background keyed out) at its
 *  natural size. Used for both the corner mark and the centre-page
 *  watermark, so both stay clean on light and navy pages alike instead of
 *  showing a pale rectangle around the artwork. */
async function loadBrandLogoPng(src: string): Promise<{ dataUrl: string; ratio: number } | null> {
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

export default function DownloadItineraryButton({ pkg, destination: d, nights, pax }: Props) {
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
        loadBrandLogoPng('/logo-transparent.png')
      ]);

      // Mirrors the price card's own math exactly, so the PDF a visitor
      // downloads always matches the nights/travellers they had selected.
      const selNights = nights;
      const selDays = selNights + 1;
      const perNightRate = pkg.price / pkg.nights;
      const perPersonTotal = Math.round(perNightRate * selNights);
      const groupTotal = perPersonTotal * pax;

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

      // Every page carries the corner logo (drawn later, on top, in the
      // footer loop) — new pages reserve clearance under it so body content
      // that starts right at the top of a page never renders underneath it.
      const LOGO_CLEAR = 78;
      const room = (needed: number) => {
        if (y + needed > BOTTOM) { doc.addPage(); y = LOGO_CLEAR; return true; }
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

      /** One large brand mark centred on the page, behind and over the
       *  content — makes a screenshot or photocopy traceable back to us
       *  without hurting legibility of the real text sitting on top. Falls
       *  back silently (draws nothing) if the logo asset failed to load. */
      const drawWatermark = (onDark: boolean) => {
        if (!logo) return;
        withOpacity(onDark ? 0.12 : 0.07, () => {
          const wmW = pageW * 0.62;
          const wmH = wmW / logo.ratio;
          const x = (pageW - wmW) / 2;
          const y = (pageH - wmH) / 2;
          doc.addImage(logo.dataUrl, 'PNG', x, y, wmW, wmH);
        });
      };

      /** Logo mark, top-right, on every page. On the navy back cover it
       *  sits on a white chip — the logo's wordmark is navy-on-transparent
       *  and would vanish drawn directly onto navy. */
      const drawCornerLogo = (onDark: boolean) => {
        if (!logo) return;
        const w = 150;
        const h = w / logo.ratio;
        const x = pageW - M - w;
        const yTop = 20;
        if (onDark) {
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(x - 8, yTop - 8, w + 16, h + 16, 4, 4, 'F');
        }
        doc.addImage(logo.dataUrl, 'PNG', x, yTop, w, h);
      };

      /* ============================================================ PAGE 1 */
      // No text brand lockup here — the corner logo (drawn on top, in the
      // footer loop below) already carries the brand name on every page,
      // including this one.
      y = LOGO_CLEAR;

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
      doc.text(pdfText(pkg.style ?? d.tagline), M, y);
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
      const coverMeta = wrap(
        `${pkg.badge}  ·  ${selNights}N / ${selDays}D  ·  ${pax} ${pax === 1 ? 'traveller' : 'travellers'}  ·  ${pdfMoney(perPersonTotal)} per person  ·  ${pdfMoney(groupTotal)} total`,
        CW, 10
      );
      doc.text(coverMeta, M, y);
      y += coverMeta.length * 14 + 12;

      label(PDF_COPY.cover.tripRouteLabel, M, y);
      y += 15;
      doc.setTextColor(...INK);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const coverRoute = wrap(pkg.route.join('   ->   '), CW, 10.5);
      doc.text(coverRoute, M, y);
      y += coverRoute.length * 14 + 22;

      label(PDF_COPY.cover.aboutLabel, M, y);
      y += 15;
      doc.setTextColor(...INK_SOFT);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const blurbLines = wrap(`${pkg.blurb} ${d.blurb}`, CW, 10);
      doc.text(blurbLines, M, y);
      y += blurbLines.length * 13.5 + 20;

      label(PDF_COPY.cover.goodToKnowLabel, M, y);
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
      heading(PDF_COPY.quickDetails.heading, PDF_COPY.quickDetails.sub);

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
      heading(PDF_COPY.whereYouStay.heading);
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
      const hotelNote = wrap(PDF_COPY.whereYouStay.hotelNote, CW, 8.5);
      room(hotelNote.length * 11);
      doc.text(hotelNote, M, y);
      y += hotelNote.length * 11;

      /* ================================================== SKETCH ITINERARY */
      section();
      heading(PDF_COPY.itineraryGlance.heading, PDF_COPY.itineraryGlance.sub);

      const [colDay, colItin, colStay, colMeals] = PDF_COPY.itineraryGlance.columns;
      const colX = [M + 8, M + 58, M + 300, M + 400];
      doc.setFillColor(...NAVY);
      doc.rect(M, y - 12, CW, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(colDay, colX[0], y);
      doc.text(colItin, colX[1], y);
      doc.text(colStay, colX[2], y);
      doc.text(colMeals, colX[3], y);
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
          doc.text(colDay, colX[0], y);
          doc.text(colItin, colX[1], y);
          doc.text(colStay, colX[2], y);
          doc.text(colMeals, colX[3], y);
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
      heading(PDF_COPY.dayByDay.heading);

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
      heading(PDF_COPY.inclExcl.heading);

      const halfW = CW / 2 - 14;
      const topY = y;

      // Dynamic — sourced from pkg.inclusions when the package defines its
      // own detailed list, otherwise from pkg.includes plus every unique
      // "Included: X" line across the day-by-day plan. Editing
      // content/packages.json is the only thing that ever needs to change
      // this list.
      label(PDF_COPY.inclExcl.includedLabel, M, y, GOLD);
      let incY = y + 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const inclusionsList = pkg.inclusions ?? pkg.includes;
      inclusionsList.forEach((item) => {
        const lines = wrap(item, halfW - 18, 9.5);
        drawCheck(M, incY);
        doc.setTextColor(...INK_SOFT);
        doc.text(lines, M + 15, incY);
        incY += lines.length * 12.5 + 7;
      });
      if (!pkg.inclusions) {
        const dayIncl = Array.from(new Set(pkg.itinerary.flatMap((dd) => dd.included.split(' + ').map((s) => s.trim()))));
        dayIncl.forEach((item) => {
          if (inclusionsList.some((i2) => i2.toLowerCase() === item.toLowerCase())) return;
          const lines = wrap(item, halfW - 18, 9.5);
          drawCheck(M, incY);
          doc.setTextColor(...INK_SOFT);
          doc.text(lines, M + 15, incY);
          incY += lines.length * 12.5 + 7;
        });
      }

      const exX = M + halfW + 28;
      label(PDF_COPY.inclExcl.notIncludedLabel, exX, topY, INK_FAINT);
      let exY = topY + 20;
      (pkg.exclusions ?? PACKAGE_EXCLUDES).forEach((item) => {
        const lines = wrap(item, halfW - 18, 9.5);
        drawCross(exX, exY);
        doc.setTextColor(...INK_FAINT);
        doc.text(lines, exX + 15, exY);
        exY += lines.length * 12.5 + 7;
      });

      y = Math.max(incY, exY) + 18;

      /* ======================================================= HIGHLIGHTS */
      section(24);
      heading(fill(PDF_COPY.highlightsHeadingTemplate, { name: d.name }));
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
      heading(PDF_COPY.pricing.heading, PDF_COPY.pricing.sub);

      // The visitor's live configuration from the price card — kept visually
      // distinct (navy, "Your selection") from the fixed catalog variants
      // below it, since the two are different things: this is a what-if
      // scaled off the base per-night rate, those are specific fixed plans.
      {
        const rowH = 56;
        room(rowH + 10);

        doc.setFillColor(...NAVY);
        doc.roundedRect(M, y - 12, CW, rowH, 6, 6, 'F');

        label(PDF_COPY.pricing.yourSelectionLabel, M + 16, y + 2, GOLD_LIGHT, 8);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(
          pdfText(`${selNights}N / ${selDays}D  ·  ${pax} ${pax === 1 ? 'traveller' : 'travellers'}`),
          M + 16, y + 21
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(210, 216, 230);
        doc.text(pdfText(`${pdfMoney(perPersonTotal)} per person, twin sharing`), M + 16, y + 35);

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(pdfMoney(groupTotal), pageW - M - 16, y + 14, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(210, 216, 230);
        doc.text(PDF_COPY.pricing.totalForGroupLabel, pageW - M - 16, y + 27, { align: 'right' });

        y += rowH + 12;

        if (selNights !== pkg.nights) {
          doc.setTextColor(...INK_FAINT);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          const scaledNote = wrap(
            fill(PDF_COPY.pricing.scaledNoteTemplate, {
              baseNights: String(pkg.nights),
              baseDays: String(pkg.days),
              perNightRate: pdfMoney(perNightRate)
            }),
            CW, 8.5
          );
          room(scaledNote.length * 11);
          doc.text(scaledNote, M, y);
          y += scaledNote.length * 11 + 10;
        }
      }

      if (pkg.priceVariants.length) {
        section(10);
        label(PDF_COPY.pricing.otherOptionsLabel, M, y);
        y += 18;

        pkg.priceVariants.forEach((v) => {
          const noteLines = wrap(v.note, CW - 200, 8.5);
          const rowH = Math.max(34, noteLines.length * 12 + 24);
          room(rowH + 4);

          doc.setFillColor(...BAND);
          doc.roundedRect(M, y - 12, CW, rowH, 5, 5, 'F');

          doc.setTextColor(...GOLD);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.text(pdfText(v.label), M + 14, y + 4);

          doc.setTextColor(...INK_SOFT);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.text(noteLines, M + 90, y + 4);

          doc.setTextColor(...NAVY);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text(pdfMoney(v.price), pageW - M - 14, y + 6, { align: 'right' });

          y += rowH + 8;
        });
      }

      const addons = pkg.addons ?? BROCHURE.addons;
      if (addons.length > 0) {
        section(24);
        heading(PDF_COPY.addons.heading);

        const [colService, colDescription, colPrice] = PDF_COPY.addons.columns;
        doc.setFillColor(...NAVY);
        doc.rect(M, y - 12, CW, 22, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(colService, M + 10, y);
        doc.text(colDescription, M + 150, y);
        doc.text(colPrice, pageW - M - 10, y, { align: 'right' });
        y += 20;

        addons.forEach((a, i) => {
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
      }

      /* ============================================ NOTES + PAYMENT + WHY */
      section();
      heading(PDF_COPY.goodToKnow.heading);
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
      heading(PDF_COPY.payment.heading);
      label(PDF_COPY.payment.weAcceptLabel, M, y);
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
      heading(PDF_COPY.whyUs.heading);
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

      // No text brand lockup here either — the corner logo (white chip,
      // drawn on top in the footer loop) already carries it.

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text(PDF_COPY.backCover.headingLine1, M, pageH / 2 - 60);
      doc.text(PDF_COPY.backCover.headingLine2, M, pageH / 2 - 28);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(220, 224, 235);
      doc.text(wrap(PDF_COPY.backCover.paragraph, CW - 120, 11), M, pageH / 2 + 6);

      let cy = pageH / 2 + 90;
      doc.setDrawColor(90, 100, 130);
      doc.setLineWidth(0.75);
      doc.line(M, cy - 26, pageW - M, cy - 26);

      const contactRows: [string, string][] = [
        [PDF_COPY.backCover.contactLabels.phone, CONTACT.phone],
        [PDF_COPY.backCover.contactLabels.email, CONTACT.email],
        [PDF_COPY.backCover.contactLabels.office, CONTACT.address],
        [PDF_COPY.backCover.contactLabels.hours, CONTACT.hours]
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
      doc.text(PDF_COPY.backCover.website, M, pageH - 56);

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
          doc.text(pdfText(`${pkg.title}  ·  ${selNights}N / ${selDays}D`), M, pageH - 20);
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
      {busy ? PDF_COPY.button.busyLabel : PDF_COPY.button.idleLabel}
      <ArrowRight className="btn__icon" />
    </button>
  );
}
