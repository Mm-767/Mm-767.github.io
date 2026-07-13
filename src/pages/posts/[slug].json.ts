import { getAllPosts } from '../../lib/posts';

// Feeds the "Edit Post" flow on /new — returns raw frontmatter + markdown body
// for one post so the editor can be prefilled with existing content.
// Static endpoint (prerendered at build, same as search.json.ts) — works on
// GitHub Pages with no server required.

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ params: { slug: post.id } }));
}

export async function GET({ params }: { params: { slug?: string } }) {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.id === params.slug);
  if (!post) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(
    JSON.stringify({
      slug: post.id,
      title: post.data.title,
      category: post.data.category,
      tags: post.data.tags,
      date: post.data.date.toISOString().slice(0, 10),
      thumbnail: post.data.thumbnail || '',
      description: post.data.description || '',
      body: post.body || '',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
