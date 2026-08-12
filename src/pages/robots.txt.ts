import type { APIRoute } from 'astro';
import { absoluteUrl } from '../utils/navigation';

export const GET: APIRoute = () => {
  const sitemapURL = absoluteUrl('/sitemap.xml');

  return new Response(
    'User-agent: *\n' +
      'Allow: /\n' +
      'Sitemap: ' + sitemapURL + '\n',
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  );
};
