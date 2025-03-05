// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
// import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  // outDir: './dist/astro',  // 公開用の出力先を指定
  // adapter: cloudflare(),
});