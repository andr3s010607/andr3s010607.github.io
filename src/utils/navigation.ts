const EXTERNAL_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

function basePath() {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : base + '/';
}

/**
 * Agrega el base path de Astro a rutas internas. Así los enlaces también
 * funcionan si el portafolio se publica en /nombre-del-repositorio/.
 */
export function resolvePath(path: string) {
  if (EXTERNAL_URL.test(path) || path.startsWith('#')) {
    return path;
  }

  const base = basePath();
  const baseWithoutTrailingSlash = base === '/' ? '' : base.slice(0, -1);

  if (path.startsWith('/')) {
    return baseWithoutTrailingSlash + path;
  }

  return base + path;
}

/**
 * Convierte una ruta interna, incluida una que ya contiene el base path, en
 * una URL absoluta para canonical, sitemap y robots.
 */
export function absoluteUrl(path: string) {
  if (EXTERNAL_URL.test(path)) {
    return path;
  }

  const base = basePath();
  const baseWithoutTrailingSlash = base === '/' ? '' : base.slice(0, -1);
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  const alreadyHasBase =
    baseWithoutTrailingSlash &&
    (normalizedPath === baseWithoutTrailingSlash ||
      normalizedPath.startsWith(baseWithoutTrailingSlash + '/'));
  const relativePath = alreadyHasBase ? normalizedPath : resolvePath(normalizedPath);
  const origin = import.meta.env.SITE || 'https://andr3s010607.github.io';

  return new URL(relativePath, origin).href;
}
