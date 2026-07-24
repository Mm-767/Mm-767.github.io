import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/posts';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

// GET /rss.xml — feed of published posts (drafts are excluded by getAllPosts),
// newest first. `context.site` comes from `site` in astro.config, so links are
// absolute. Add <link rel="alternate" type="application/rss+xml"> in the layout
// head (done) so browsers and readers can discover it.
export async function GET(context) {
  const posts = await getAllPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/posts/${post.id}/`,
    })),
  });
}
