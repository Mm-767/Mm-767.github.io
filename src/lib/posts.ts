import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u00c0-\u024f\uac00-\ud7a3]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export interface Taxon {
  name: string;
  slug: string;
  count: number;
}

export async function getAllTags(): Promise<Taxon[]> {
  const posts = await getAllPosts();
  const map = new Map<string, Taxon>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = slugify(name);
      const entry = map.get(slug) ?? { name, slug, count: 0 };
      entry.count += 1;
      map.set(slug, entry);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}
