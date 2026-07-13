import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts live in /posts at the repo root. Add a .md file, push, done.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
