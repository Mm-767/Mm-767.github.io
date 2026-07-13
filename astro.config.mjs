import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9À-ɏ가-힣]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function commitMessageFor(content, slug, isNew) {
  const m = content.match(/title:\s*"([^"]*)"/);
  const title = m ? m[1] : slug;
  return (isNew ? 'Add post: ' : 'Update post: ') + title;
}

// Best-effort git add/commit/push for one file. Returns { committed, pushed }
// on success ({ committed: false } if there was nothing to commit — e.g.
// re-saving unchanged content). Throws on any git failure (no git repo, no
// configured identity, rejected push, ...) so the caller can report it
// without pretending the publish step succeeded.
async function gitPublish(cwd, relPath, message) {
  await execFileAsync('git', ['add', relPath], { cwd });
  const { stdout } = await execFileAsync('git', ['status', '--porcelain', '--', relPath], { cwd });
  if (!stdout.trim()) return { committed: false, pushed: false };
  await execFileAsync('git', ['commit', '-m', message], { cwd });
  await execFileAsync('git', ['push'], { cwd });
  return { committed: true, pushed: true };
}

// Dev-only /api/save: writes a post's Markdown straight into /posts, then
// commits and pushes it so saving actually publishes to GitHub Pages
// without a separate manual git step. NOTE: `git push` sends every
// unpushed local commit on the current branch, not just this one file.
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
            const cwd = process.cwd();
            const postsDir = path.join(cwd, 'posts');
            await mkdir(postsDir, { recursive: true });
            const filePath = path.join(postsDir, `${slug}.md`);
            const isNew = !existsSync(filePath);
            await writeFile(filePath, content, 'utf8');

            res.setHeader('Content-Type', 'application/json');
            try {
              const publish = await gitPublish(cwd, path.join('posts', `${slug}.md`), commitMessageFor(content, slug, isNew));
              res.end(JSON.stringify({ ok: true, slug, publish }));
            } catch (gitErr) {
              // File is safely on disk even if git failed — report that
              // separately so the client can tell "saved locally" from
              // "actually published" instead of treating this as a full failure.
              res.end(JSON.stringify({
                ok: true,
                slug,
                publish: { committed: false, pushed: false },
                gitError: gitErr instanceof Error ? gitErr.message : String(gitErr),
              }));
            }
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
