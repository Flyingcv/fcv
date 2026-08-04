'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons';
import { CONTACT, ORIGIN, type Package, type Destination } from '@/lib/data';

interface Props {
  pkg: Package;
  destination: Destination;
}

/* jsPDF's built-in fonts have no ₹ glyph — it silently falls back to a
   garbled superscript character, which also throws off the line's spacing.
   "Rs." is the safe, font-agnostic stand-in for PDF text only; the site
   itself keeps using the real ₹ symbol via inr(). */
const pdfMoney = (n: number) => 'Rs. ' + Math.round(n).toLocaleString('en-IN');

/* Client-side PDF generation — jsPDF draws directly onto a canvas-backed
   document, so there's no server round-trip and no pre-baked file to keep
   in sync with content edits in /content. */
export default function DownloadItineraryButton({ pkg, destination }: Props) {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 48;
      const contentW = pageW - margin * 2;
      const navy: [number, number, number] = [10, 27, 61];
      const gold: [number, number, number] = [196, 134, 43];
      const inkSoft: [number, number, number] = [70, 82, 105];
      let y = 0;

      // Header band
      doc.setFillColor(...navy);
      doc.rect(0, 0, pageW, 96, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('FLYING COLOURS VACATIONS', margin, 34);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...gold);
      doc.text('ADDING COLOURS TO EVERY JOURNEY', margin, 48);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(pkg.title, contentW);
      doc.text(titleLines, margin, 76);
      y = 96 + 34;

      // Quick facts row
      const facts: [string, string][] = [
        ['Route', `${ORIGIN.city} → ${destination.name}`],
        ['Duration', `${pkg.nights}N / ${pkg.days}D`],
        ['Price', `${pdfMoney(pkg.price)} per person`],
        ['Style', destination.tagline]
      ];
      const colW = contentW / facts.length;
      facts.forEach(([label, value], i) => {
        const x = margin + i * colW;
        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(label.toUpperCase(), x, y);
        doc.setTextColor(...navy);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(value, colW - 10);
        doc.text(lines, x, y + 14);
      });
      y += 40;
      doc.setDrawColor(220, 210, 190);
      doc.line(margin, y, pageW - margin, y);
      y += 26;

      // Route strip
      doc.setTextColor(...gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TRIP ROUTE', margin, y);
      y += 16;
      doc.setTextColor(...navy);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      const routeLine = pkg.route.join('   →   ');
      const routeLines = doc.splitTextToSize(routeLine, contentW);
      doc.text(routeLines, margin, y);
      y += routeLines.length * 14 + 22;

      // Day-by-day itinerary
      doc.setTextColor(...gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('DAY-BY-DAY ITINERARY', margin, y);
      y += 20;

      pkg.itinerary.forEach(([title, copy], i) => {
        const dayLabel = `DAY ${String(i + 1).padStart(2, '0')}`;
        const bodyLines = doc.splitTextToSize(copy, contentW - 70);
        const blockH = 16 + bodyLines.length * 12 + 14;

        if (y + blockH > 780) {
          doc.addPage();
          y = margin;
        }

        doc.setTextColor(...gold);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(dayLabel, margin, y);

        doc.setTextColor(...navy);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(title, margin + 70, y);

        doc.setTextColor(...inkSoft);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.text(bodyLines, margin + 70, y + 15);

        y += blockH;
        doc.setDrawColor(235, 228, 210);
        doc.line(margin, y - 6, pageW - margin, y - 6);
      });

      // Includes
      if (y + 90 > 780) { doc.addPage(); y = margin; } else { y += 10; }
      doc.setTextColor(...gold);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PACKAGE INCLUDES', margin, y);
      y += 16;
      doc.setTextColor(...navy);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const includesLine = pkg.includes.join('   ·   ');
      const includesLines = doc.splitTextToSize(includesLine, contentW);
      doc.text(includesLines, margin, y);
      y += includesLines.length * 14 + 24;

      // Footer / contact
      if (y + 70 > 780) { doc.addPage(); y = margin; }
      doc.setDrawColor(220, 210, 190);
      doc.line(margin, y, pageW - margin, y);
      y += 20;
      doc.setTextColor(...inkSoft);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        'Indicative pricing for planning. Final quote depends on travel dates, hotel availability and',
        margin, y
      );
      doc.text('live airfares — a planner confirms within 24 hours.', margin, y + 13);
      y += 32;
      doc.setTextColor(...navy);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`${CONTACT.phone}   ·   ${CONTACT.email}`, margin, y);

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
