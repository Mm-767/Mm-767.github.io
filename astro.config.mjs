import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// For GitHub Pages project sites, set site + base, e.g.:
// site: 'https://YOUR_USERNAME.github.io', base: '/YOUR_REPO_NAME'
export default defineConfig({
  integrations: [tailwind()],
});
