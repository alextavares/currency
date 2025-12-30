import { getPostBySlug } from '@/lib/blog';

type Props = { params: Promise<{ slug: string }> };

export default async function Head({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const schema = {
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
      {
        '@type': 'ListItem',
        position: 3,
        name: post?.title ?? slug,
        item: `https://liveforexstrength.com/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

