import { Link } from "wouter";
import { trpc } from "../lib/trpc";

export default function News() {
  const { data, isLoading } = trpc.content.newsFeed.useQuery();

  if (isLoading) return <div className="px-4 py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">News</h1>
      <div className="space-y-8">
        {data?.length === 0 && <p className="text-gray-500">No news yet.</p>}
        {data?.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <Link href={`/news/${post.id}`}>
              <h2 className="text-xl font-semibold mb-1 hover:text-[var(--color-mihl-blue)] cursor-pointer">
                {post.title}
              </h2>
            </Link>
            <p className="text-xs text-gray-500 mb-3">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : ""}
            </p>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
