import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

/* ==========================================================================
   SplitText — renders every word inside its own mask so it can slide up.

   This is done in React rather than by rewriting the DOM after mount. Mutating
   nodes React owns makes it lose track of them, and unmounting the page then
   throws "removeChild: node is not a child of this node".

   Nested markup survives: <br /> and <em> pass straight through, only their
   text is wrapped. The words are in the server HTML too, so the copy is
   readable without JavaScript and to crawlers.
   ========================================================================== */

function wrap(node: ReactNode, path: string): ReactNode {
  if (node === null || node === undefined || typeof node === 'boolean') return null;

  // The actual work: split a run of text into masked words
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .map((part, i) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return ' ';
        return (
          <span className="w" key={`${path}.${i}`}>
            <i>{part}</i>
          </span>
        );
      });
  }

  if (Array.isArray(node)) return node.map((child, i) => wrap(child, `${path}.${i}`));

  // Keep the element, recurse into its children. Keys are position-derived so
  // they stay stable between server and client renders.
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    const kids = el.props.children;
    return kids == null
      ? cloneElement(el, { key: path })
      : cloneElement(el, { key: path }, wrap(kids, path));
  }

  return node;
}

type Props = React.HTMLAttributes<HTMLElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
};

export default function SplitText({ as: Tag = 'span', children, ...rest }: Props) {
  return (
    <Tag data-split="" {...rest}>
      {wrap(children, 'w')}
    </Tag>
  );
}

// Refinement iteration 28 for code quality and clarity

// Refinement iteration 50 for code quality and clarity

// Refinement iteration 72 for code quality and clarity

// Refinement iteration 23 for code quality and clarity

// Refinement iteration 45 for code quality and clarity
