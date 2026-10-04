import type { Metadata } from 'next';
import TLink from '@/components/TLink';
import SplitText from '@/components/SplitText';
import Photo from '@/components/Photo';
import { ArrowRight } from '@/components/icons';
import { BLOG_PAGE, BLOG_POSTS } from '@/lib/data';
import { parseInlineHtml } from '@/lib/richtext';

export const metadata: Metadata = {
  title: BLOG_PAGE.meta.title,
  description: BLOG_PAGE.meta.description
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));

export default function TravelGuidesPage() {
  const { hero } = BLOG_PAGE;

  return (
    <>
      <section className="phero phero--blogs">
        <div className="phero__bg">
          <Photo src={hero.image} alt={hero.imageAlt} priority px={10} />
        </div>
        <div className="phero__inner">
          <div className="wrap">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span> <span>Travel Guides</span>
            </nav>
            <span className="tag tag--light">{hero.tag}</span>
            <SplitText as="h1" className="mt-1">{parseInlineHtml(hero.heading)}</SplitText>
            <p className="lede mt-2" style={{ maxWidth: '52ch' }}>{hero.paragraph}</p>
            <div className="phero__meta">
              <div><span>Journal</span><b>{BLOG_POSTS.length} stories</b></div>
              <div><span>Topics</span><b>Guides · Inspiration</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-head__text">
              <span className="tag">The latest dispatches</span>
              <SplitText as="h2">Ideas for the journey</SplitText>
            </div>
            <p className="lede" style={{ maxWidth: '38ch' }}>
              Practical notes and considered inspiration to help you plan a trip at your own pace.
            </p>
          </div>

          {BLOG_POSTS.length > 0 ? (
            <div className="blog-grid">
              {BLOG_POSTS.map((post, index) => (
                <TLink
                  key={post.slug}
                  href={`/${post.slug}`}
                  className="blog-card rise"
                  data-cursor="Read story"
                  style={{ ['--d' as string]: `${index * 0.08}s` } as React.CSSProperties}
                >
                  <div className="blog-card__media">
                    <Photo src={post.image} alt={post.imageAlt} />
                    <span className="blog-card__category">{post.category}</span>
                  </div>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="blog-card__link">Read the story <ArrowRight className="btn__icon" /></span>
                  </div>
                </TLink>
              ))}
            </div>
          ) : (
            <p className="blog-empty">New stories are on their way. Please check back soon.</p>
          )}
        </div>
      </section>
    </>
  );
}