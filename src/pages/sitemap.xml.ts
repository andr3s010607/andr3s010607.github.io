import type { APIRoute } from 'astro';
import { absoluteUrl } from '../utils/navigation';

export const GET: APIRoute = () => {
  const home = absoluteUrl('/');

  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      '  <url>\n' +
      '    <loc>' + home + '</loc>\n' +
      '  </url>\n' +
      '</urlset>\n',
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
  );
};
