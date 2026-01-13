import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/blog/${slug}`;
  const publishedTime = safeDate(post.date);

  return {
    // The root layout already applies the `| LiveForexStrength` template to `title`,
    // so keep it short and avoid stacking suffixes in SERPs.
    title: post.title,
    description: post.excerpt || 'Forex market analysis and currency strength insights.',
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description: post.excerpt || 'Forex market analysis and currency strength insights.',
      publishedTime: publishedTime ?? undefined,
      authors: post.author ? [post.author] : undefined,
      images: [{ url: '/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || 'Forex market analysis and currency strength insights.',
      images: ['/opengraph-image'],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://liveforexstrength.com').replace(
    /\/+$/,
    '',
  );
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const publishedTime = safeDate(post.date);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Dashboard', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedTime ?? undefined,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    publisher: { '@type': 'Organization', name: 'LiveForexStrength', url: siteUrl },
    image: `${siteUrl}/opengraph-image`,
    isAccessibleForFree: true,
    inLanguage: 'en',
  };

  return (
    <>
      <Script
        id={`blogpost-breadcrumbs-jsonld-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id={`blogpost-jsonld-${slug}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(articleSchema)}
      </Script>

      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform mr-1">←</span> Back to
          Analysis
        </Link>

        <article>
          <header className="mb-10 text-center">
            <div className="text-gray-500 mb-3">{post.date}</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              {post.title}
            </h1>
            {post.author && (
              <div className="text-sm font-medium text-gray-600">Analysis by {post.author}</div>
            )}
          </header>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 mb-4">Want real-time data?</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Live Currency Strength Meter
          </Link>
        </div>
      </div>
    </>
  );
}

function safeDate(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
