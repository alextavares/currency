import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Market Analysis Blog',
  description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Market Analysis Blog',
    description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market Analysis Blog',
    description: 'Forex market analysis, currency strength insights, and strength-based trade ideas.',
    images: ['/opengraph-image'],
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Dashboard',
                item: 'https://liveforexstrength.com/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://liveforexstrength.com/blog',
              },
            ],
          }),
        }}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Market Analysis</h1>
        <Link 
          href="/" 
          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No analysis articles published yet.</p>
          <p className="mt-2">Check back soon for daily market updates.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
              <Card className="h-full transition-all hover:shadow-lg border-gray-200 hover:border-blue-200">
                <CardHeader>
                  <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt || 'Read the full market analysis...'}
                  </p>
                  <div className="mt-4 text-sm font-medium text-blue-500 group-hover:underline">
                    Read Analysis →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
