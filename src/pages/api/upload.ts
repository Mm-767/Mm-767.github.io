import type { APIRoute } from 'astro';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// ⚠️ SERVER ROUTE — requires an Astro server/hybrid adapter.
// This repo defaults to fully static output (deployed via GitHub Pages
// Actions, see .github/workflows/deploy.yml), which has no server at
// runtime — this route will 404 on that deploy target as-is.
//
// To actually use it:
//   1. Add a server adapter, e.g. `npx astro add vercel` (or netlify/node),
//      and switch `output: 'server'` or `'hybrid'` in astro.config.mjs.
//   2. Keep this file's `export const prerender = false` so only this
//      route runs server-side while the rest of the site stays static.
//   3. On Vercel specifically, prefer Vercel Blob over local disk — the
//      filesystem there is read-only/ephemeral per invocation. Swap the
//      writeFile block below for `put(filename, file, { access: 'public' })`
//      from `@vercel/blob` and return its returned `url` instead.
//
// If you deploy to GitHub Pages, skip this route: keep the client-side
// fallback in src/pages/new.astro (paste/drop → embed the image inline)
// instead, since there's no server to upload to.

export const prerender = false;

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase().slice(0, 8) || '.png';
  const stem = path
    .basename(original, path.extname(original))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'image';
  const unique = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  return `${stem}-${unique}${ext}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No file field named "file"' }), { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return new Response(JSON.stringify({ error: `Unsupported type: ${file.type}` }), { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return new Response(JSON.stringify({ error: 'File too large (max 8MB)' }), { status: 413 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = safeFilename(file.name || 'image.png');
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return new Response(JSON.stringify({ url: `/uploads/${filename}` }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
};
