// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages usa una raíz para los repositorios usuario.github.io y una
 * subruta para los demás. Se puede sobrescribir localmente con
 * PUBLIC_SITE_URL y PUBLIC_BASE_PATH.
 */
const normalizeBase = (value) => {
  const clean = value.trim().replace(/^\/+/g, '').replace(/\/+$/g, '');
  return clean ? '/' + clean : '/';
};

const [repositoryOwner, repositoryName] =
  (process.env.GITHUB_REPOSITORY || '').split('/');
const owner =
  process.env.GITHUB_REPOSITORY_OWNER || repositoryOwner || 'andr3s010607';
const isUserSite =
  repositoryName?.toLowerCase() === (owner + '.github.io').toLowerCase();
const inferredBase = repositoryName && !isUserSite ? '/' + repositoryName : '/';
const site = (process.env.PUBLIC_SITE_URL || 'https://' + owner + '.github.io')
  .replace(/\/+$/g, '');
const base = normalizeBase(process.env.PUBLIC_BASE_PATH || inferredBase);

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
