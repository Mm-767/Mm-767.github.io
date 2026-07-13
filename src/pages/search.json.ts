import { getAllPosts } from '../lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description || '',
    category: post.data.category,
    tags: post.data.tags,
    thumbnail: post.data.thumbnail || '',
    date: post.data.date.toISOString().slice(0, 10),
    dateLabel: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(post.data.date),
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
