import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { readFileSync } from 'node:fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  process.env = { ...process.env, ...env };
  console.log(`NODE_ENV is ${process.env.NODE_ENV}, mode is ${mode}.`);

  const file = fileURLToPath(new URL('package.json', import.meta.url));
  const json = readFileSync(file, 'utf8');
  const pkg = JSON.parse(json);

  return {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    server: {
      watch: {
        usePolling: true,
      }
    },
    base: env.VITE_BASE_URL || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      dedupe: ['vue']
    },
    test: {
      environment: 'jsdom',
    },
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
  }
})
