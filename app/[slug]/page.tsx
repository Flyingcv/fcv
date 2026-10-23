import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogArticle from '@/components/blog/BlogArticle';
import { BLOG_POSTS } from '@/lib/data';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((article) => article.slug === slug);
  if (!post) return { title: 'Story not found' };

  const seoTitle = post.seo?.title || post.title;
  const seoDescription = post.seo?.description || post.metaDescription || post.excerpt;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [{ url: post.image, alt: post.imageAlt }]
    }
  };
}

export default async function BlogArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((article) => article.slug === slug);
  if (!post) notFound();

  return <BlogArticle post={post} />;
}