import { useParams, Link } from "wouter";
import { trpc } from "../lib/trpc";

export default function NewsPost() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = trpc.content.newsPost.useQuery({ id: Number(id) });

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;
  if (!post) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Post not found.</p>
        <Link href="/news" className="text-[var(--color-mihl-blue)]">
          ← Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/news" className="text-sm text-[var(--color-mihl-blue)] mb-6 inline-block">
        ← Back to News
      </Link>
      <article>
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-xs text-gray-500 mb-6">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
        </p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
      </article>
    </div>
  );
}
