import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Currency Strength Analysis`,
    description: post.excerpt,
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

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link 
        href="/blog" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform mr-1">←</span> Back to Analysis
      </Link>
      
      <article>
        <header className="mb-10 text-center">
          <div className="text-gray-500 mb-3">{post.date}</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            {post.title}
          </h1>
          {post.author && (
            <div className="text-sm font-medium text-gray-600">
              Analysis by {post.author}
            </div>
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
  );
}
