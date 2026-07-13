import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9À-ɏ가-힣]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

// Dev-only /api/save: writes a post's Markdown straight into /posts.
//
// This is deliberately Vite dev-server middleware, NOT an Astro API route
// (src/pages/api/*.ts). An Astro route needs `prerender = false` to run
// server code, which in turn needs a server adapter — this repo has none
// and deploys the plain static `dist/` output to GitHub Pages (see
// .github/workflows/deploy.yml). src/pages/api/upload.ts hit exactly this
// and had to be deleted because it broke `astro build`. Middleware
// registered via `astro:server:setup` only exists while `astro dev` is
// running; `astro build` never sees it, so it can't break the static
// build, and there's no server on GitHub Pages to run it anyway — the
// editor (src/pages/new.astro) falls back to downloading the .md file
// when this endpoint isn't there.
function localSaveApi() {
  return {
    name: 'local-save-api',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/api/save', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end();
            return;
          }
          try {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const { slug: rawSlug, content } = JSON.parse(Buffer.concat(chunks).toString('utf8'));
            const slug = slugify(rawSlug);
            if (!slug || typeof content !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing title or content' }));
              return;
            }
            const postsDir = path.join(process.cwd(), 'posts');
            await mkdir(postsDir, { recursive: true });
            await writeFile(path.join(postsDir, `${slug}.md`), content, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, slug }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Save failed' }));
          }
        });
      },
    },
  };
}

// For GitHub Pages project sites, set site + base, e.g.:
// site: 'https://YOUR_USERNAME.github.io', base: '/YOUR_REPO_NAME'
export default defineConfig({
  integrations: [tailwind(), localSaveApi()],
});
