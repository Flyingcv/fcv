import type { ReactNode } from 'react';

/** Turns the small, fixed vocabulary of inline markup used in content JSON
 *  headings (`<br />`, `<em>…</em>`, a handful of HTML entities) into real
 *  React nodes. SplitText walks its `children` to split each word into its
 *  own animated span — dangerouslySetInnerHTML would skip that entirely, so
 *  every `*Html` field from /content that feeds a <SplitText> goes through
 *  this instead of being set directly as HTML. */
export function parseInlineHtml(html: string): ReactNode[] {
  const decoded = html.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, '\'');
  const lines = decoded.split(/<br\s*\/?>/i);
  const nodes: ReactNode[] = [];

  lines.forEach((line, i) => {
    if (i > 0) nodes.push(<br key={`br-${i}`} />);
    const parts = line.split(/(<em>.*?<\/em>)/g);
    parts.forEach((part, j) => {
      const match = part.match(/^<em>(.*?)<\/em>$/);
      if (match) nodes.push(<em key={`em-${i}-${j}`}>{match[1]}</em>);
      else if (part) nodes.push(part);
    });
  });

  return nodes;
}

export interface LegalBlock {
  /** 'p' | 'ul' — loosened to string since this comes straight from JSON */
  type: string;
  text?: string;
  items?: string[];
}

/** Legal-copy text supports **bold** and two tokens — {{email}} / {{phone}} —
 *  that render as real mailto:/tel: links using live contact.json values, so
 *  the phone number or email only ever needs editing in one place. */
function renderLegalInline(text: string, contact: { email: string; phone: string; phoneHref: string }): ReactNode[] {
  const parts = text.split(/(\{\{email\}\}|\{\{phone\}\}|\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part === '{{email}}') return <a key={i} href={`mailto:${contact.email}`}>{contact.email}</a>;
    if (part === '{{phone}}') return <a key={i} href={contact.phoneHref}>{contact.phone}</a>;
    const bold = part.match(/^\*\*(.*)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return part || null;
  });
}

/** Renders a section's `blocks` (paragraphs / bullet lists) from /content/legal.json. */
export function renderLegalBlocks(
  blocks: LegalBlock[],
  contact: { email: string; phone: string; phoneHref: string }
): ReactNode[] {
  return blocks.map((block, i) => {
    if (block.type === 'ul') {
      return (
        <ul key={i}>
          {(block.items ?? []).map((item, j) => <li key={j}>{renderLegalInline(item, contact)}</li>)}
        </ul>
      );
    }
    return <p key={i}>{renderLegalInline(block.text ?? '', contact)}</p>;
  });
}
