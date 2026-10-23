import type { ReactNode } from 'react';

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Renders inline rich text used in content JSON: `<br />`, `<em>…</em>`,
 *  `**bold**`, plus a few contact tokens used in policy/legal copy.
 *  The token split keeps React children stable while still supporting both
 *  HTML markup and markdown-like formatting used by editors. */
export function renderInlineText(text: string, contact?: { email: string; phone: string; phoneHref: string }): ReactNode[] {
  const decoded = decodeHtmlEntities(text);
  const lines = decoded.split(/<br\s*\/?>/i);
  const nodes: ReactNode[] = [];

  lines.forEach((line, i) => {
    if (i > 0) nodes.push(<br key={`br-${i}`} />);

    const parts = line.split(/(\*\*.*?\*\*|<em>.*?<\/em>|<strong>.*?<\/strong>|<a\b[^>]*>.*?<\/a>|\{\{email\}\}|\{\{phone\}\})/g);
    parts.forEach((part, j) => {
      if (!part) return;

      if (part === '{{email}}') {
        if (!contact) return;
        nodes.push(<a key={`email-${i}-${j}`} href={`mailto:${contact.email}`}>{contact.email}</a>);
        return;
      }

      if (part === '{{phone}}') {
        if (!contact) return;
        nodes.push(<a key={`phone-${i}-${j}`} href={contact.phoneHref}>{contact.phone}</a>);
        return;
      }

      const em = part.match(/^<em>(.*?)<\/em>$/i);
      if (em) {
        nodes.push(<em key={`em-${i}-${j}`}>{em[1]}</em>);
        return;
      }

      const strong = part.match(/^<strong>(.*?)<\/strong>$/i);
      if (strong) {
        nodes.push(<strong key={`strong-${i}-${j}`}>{strong[1]}</strong>);
        return;
      }

      const linkMatch = part.match(/^<a\s+([^>]*)>(.*?)<\/a>$/is);
      if (linkMatch) {
        const attrs = linkMatch[1];
        const href = attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[1] ?? attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[2] ?? attrs.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[3] ?? '#';
        const target = attrs.match(/target\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[1] ?? attrs.match(/target\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[2] ?? attrs.match(/target\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.[3];
        const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
        nodes.push(
          <a key={`link-${i}-${j}`} href={href} target={target} rel={rel}>
            {renderInlineText(linkMatch[2], contact)}
          </a>
        );
        return;
      }

      const bold = part.match(/^\*\*(.*)\*\*$/);
      if (bold) {
        nodes.push(<strong key={`bold-${i}-${j}`}>{bold[1]}</strong>);
        return;
      }

      nodes.push(part);
    });
  });

  return nodes;
}

/** Turns the small, fixed vocabulary of inline markup used in content JSON
 *  headings (`<br />`, `<em>…</em>`, `**bold**`, a handful of HTML entities)
 *  into real React nodes. SplitText walks its `children` to split each word
 *  into its own animated span — dangerouslySetInnerHTML would skip that
 *  entirely, so every `*Html` field from /content that feeds a <SplitText>
 *  goes through this instead of being set directly as HTML. */
export function parseInlineHtml(html: string): ReactNode[] {
  return renderInlineText(html);
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
  return renderInlineText(text, contact);
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
