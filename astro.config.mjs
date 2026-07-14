import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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

// Run a git command, returning trimmed stdout. On failure, throw an Error
// whose message is git's actual stderr (execFile's default message is just
// "Command failed" and hides the real reason), so the editor can show why.
async function git(cwd, args) {
  try {
    const { stdout } = await execFileAsync('git', args, { cwd, maxBuffer: 10 * 1024 * 1024 });
    return stdout.trim();
  } catch (err) {
    const detail = (err && (err.stderr || err.stdout || err.message) || '').toString().trim();
    throw new Error(detail || ('git ' + args[0] + ' failed'));
  }
}

// git add + commit for one file (local, fast). Returns { committed }
// ({ committed: false } when re-saving unchanged content — nothing to do).
// Throws with git's real stderr on failure (no repo, no identity, ...) so
// the caller can report it.
async function gitCommit(cwd, relPath, message) {
  await git(cwd, ['add', relPath]);
  const status = await git(cwd, ['status', '--porcelain', '--', relPath]);
  if (!status) return { committed: false };
  await git(cwd, ['commit', '-m', message]);
  return { committed: true };
}

// git push (network, slow) with recovery from the common "remote moved
// ahead" (non-fast-forward) rejection: on failure, fetch + rebase the
// current branch onto its upstream and retry once.
async function gitPush(cwd) {
  try {
    await git(cwd, ['push']);
  } catch (pushErr) {
    const branch = await git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
    try {
      await git(cwd, ['pull', '--rebase', 'origin', branch]);
    } catch {
      throw pushErr;
    }
    await git(cwd, ['push']);
  }
}

// Serialize background pushes so two quick saves don't race each other.
let pushQueue = Promise.resolve();
function queuePush(cwd) {
  pushQueue = pushQueue.then(() => gitPush(cwd)).catch((err) => {
    // Nothing is awaiting this — surface it in the dev terminal so a failed
    // publish (bad auth, unresolvable conflict) isn't silent. The commit is
    // already on disk locally; `git push` from a terminal will retry it.
    console.error('\n[save] git push failed — post is committed locally but NOT published to GitHub:\n' +
      (err instanceof Error ? err.message : String(err)) + '\n');
  });
  return pushQueue;
}

// Dev-only /api/save: writes a post's Markdown into /posts and commits it,
// then responds so the editor can redirect home immediately. The actual
// `git push` runs in the background (queuePush) — it's a slow network call,
// and if we awaited it the editor page would get reloaded by Astro's
// content watcher (triggered by the new .md file) before the response
// arrived, killing the redirect. Committing first is fast and local, so the
// response wins that race. NOTE: `git push` sends every unpushed local
// commit on the current branch, not just this one file.
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
              const { committed } = await gitCommit(cwd, path.join('posts', `${slug}.md`), commitMessageFor(content, slug, isNew));
              // Respond now; push to GitHub in the background.
              res.end(JSON.stringify({ ok: true, slug, committed }));
              if (committed) queuePush(cwd);
            } catch (gitErr) {
              // File is safely on disk even if git failed — report that
              // separately so the client can tell "saved locally" from
              // "actually committed" instead of treating this as a full failure.
              res.end(JSON.stringify({
                ok: true,
                slug,
                committed: false,
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
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
