import TLink from '@/components/TLink';
import Photo from '@/components/Photo';
import { ArrowRight } from '@/components/icons';
import type { BlogBlock, BlogPost } from '@/lib/data';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`));

function ArticleBlock({ block }: { block: BlogBlock }) {
  if (block.type === 'heading') return <h2>{block.text}</h2>;
  if (block.type === 'list') {
    return (
      <ul>
        {(block.items ?? []).map((item) => <li key={item}>{item}</li>)}
      </ul>
    );
  }
  if (block.type === 'link' && block.href && block.label) {
    return (
      <p className="blog-article__inline-link">
        {block.href.startsWith('/') ? (
          <TLink href={block.href}>{block.label} <ArrowRight className="btn__icon" /></TLink>
        ) : (
          <a href={block.href} target="_blank" rel="noreferrer">{block.label} <ArrowRight className="btn__icon" /></a>
        )}
      </p>
    );
  }
  return <p>{block.text}</p>;
}

export default function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article className="blog-article">
      <section className="phero phero--blogs blog-article__hero">
        <div className="phero__bg">
          <Photo src={post.image} alt="" priority px={10} />
        </div>
        <div className="phero__inner">
          <div className="wrap wrap--narrow">
            <nav className="phero__crumbs" aria-label="Breadcrumb">
              <TLink href="/">Home</TLink> <span>/</span>
              <TLink href="/travel-guides">Travel Guides</TLink> <span>/</span>
              <span>{post.category}</span>
            </nav>
            <span className="tag tag--light">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="blog-article__dek">{post.excerpt}</p>
            <div className="blog-article__byline">
              <span>{formatDate(post.publishedAt)}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section blog-article__content">
        <div className="wrap wrap--narrow">
          {post.body.map((block, index) => <ArticleBlock block={block} key={`${block.type}-${index}`} />)}
          <div className="blog-article__back">
            <TLink href="/travel-guides" className="btn btn--navy">
              <ArrowRight className="btn__icon blog-article__back-icon" /> Back to all stories
            </TLink>
          </div>
        </div>
      </section>
    </article>
  );
}