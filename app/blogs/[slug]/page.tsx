import { permanentRedirect } from 'next/navigation';

type Params = { params: Promise<{ slug: string }> };

export default async function LegacyBlogArticlePage({ params }: Params) {
  const { slug } = await params;
  permanentRedirect(`/${slug}`);
}