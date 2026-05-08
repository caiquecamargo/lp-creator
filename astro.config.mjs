import { defineConfig, envField } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import Icons from 'unplugin-icons/vite';
import { cmsPlugin } from '@caiquecamargo/vite-plugin-netlify-cms'

// https://astro.build/config
export default defineConfig({
  site: 'https://lpcreator.caiquedecamargo.dev.br',
  integrations: [vue()],

  output: 'static',

  env: {
    schema: {
      OAUTH_GITHUB_CLIENT_ID: envField.string({ context: 'client', access: 'public' }),
      OAUTH_GITHUB_CLIENT_SECRET: envField.string({ context: 'client', access: 'public' }),
      FORM_APIKEY: envField.string({ context: 'client', access: 'public' }),
      FORM_URL: envField.string({ context: 'client', access: 'public' }),
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        scale: 2,
        customCollections: {
          local: FileSystemIconLoader('./src/assets/icons'),
        },
      }),
      cmsPlugin({
        title: '',
        iconUrl: '/logo.svg',
        createIndexHTML: true,
        type: 'sveltia',
        oauth: false,
      }),
    ]
  },
});
