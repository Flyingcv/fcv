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

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
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