import type { Metadata } from 'next';

import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import LegalToc from '@/components/LegalToc';
import { CONTACT, LEGAL, img } from '@/lib/data';
import { renderLegalBlocks, parseInlineHtml } from '@/lib/richtext';

const { cancellation } = LEGAL;

export const metadata: Metadata = {
  title: cancellation.meta.title,
  description: cancellation.meta.description
};

export default function CancellationPolicyPage() {
  const sections: [string, string][] = cancellation.sections.map((s) => [s.id, s.label]);

  return (
    <>
      {/* --------------------------------------------------------- page hero */}
      <section className="phero" style={{ minHeight: 'clamp(38vh, 28vw, 50vh)' }}>
        <div className="phero__bg">
          <Photo src={img('1488646953014-85cb44e25828', 2000)} alt="" priority px={10} />
        </div>

        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Cancellation policy</span>
            </nav>
            <span className="tag tag--light">{cancellation.heroTag}</span>
            <SplitText as="h1" className="mt-1">{parseInlineHtml(cancellation.heroHeadingHtml)}</SplitText>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- body */}
      <section className="section">
        <div className="wrap">
          <div className="legal-layout">
            <div className="legal">
              <p className="legal__updated">{cancellation.lastUpdated}</p>

              {renderLegalBlocks(cancellation.intro, CONTACT)}

              {cancellation.sections.map((s) => (
                <div key={s.id}>
                  <h2 id={s.id}>{s.heading}</h2>
                  {renderLegalBlocks(s.blocks, CONTACT)}
                </div>
              ))}
            </div>

            <LegalToc sections={sections} />
          </div>
        </div>
      </section>
    </>
  );
}
