import { error } from '@sveltejs/kit';

export async function GET() {
    if (import.meta.env.VITE_ALLOW_SEARCH_INDEXING != 'true') {
        throw error(404, 'not found');
    }

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
    const vod_resp = await fetch(`${BACKEND_URL}/vods/?limit=-1`);
    const vods = await vod_resp.json();
    const clip_resp = await fetch(`${BACKEND_URL}/clips/?limit=-1`);
    const clips = await clip_resp.json();
    const stats_resp = await fetch(`${BACKEND_URL}/stats/short`);
    const stats = await stats_resp.json();

    const head = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
    <url>
        <loc>${FRONTEND_URL}</loc>
        <lastmod>${stats.result.last_vod_sync}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/vods/all</loc>
        <lastmod>${stats.result.last_vod_sync}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.99</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/vods/popular</loc>
        <lastmod>${stats.result.last_vod_sync}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.99</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/vods/years</loc>
        <lastmod>${stats.result.last_vod_sync}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.98</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/clips</loc>
        <lastmod>${stats.result.last_vod_sync}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.98</priority>
    </url>`;
    let body = '';

    let vod_priority = 97;
    vods.result.forEach((vod) => {
        vod_priority -= 1;
        vod_priority = vod_priority > 0 ? vod_priority : 0.0;
        body =
            body +
            `
        <url>
            <loc>${FRONTEND_URL}/vods/watch/${vod.uuid}</loc>
            <lastmod>${vod.date}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>${vod_priority / 100}</priority>
        </url>
        `;
    });

    let clip_priority = 97;
    clips.result.forEach((vod) => {
        clip_priority -= 1;
        clip_priority = clip_priority > 0 ? clip_priority : 0.0;
        body =
            body +
            `
        <url>
            <loc>${FRONTEND_URL}/clips/watch/${vod.uuid}</loc>
            <lastmod>${vod.date}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>${clip_priority / 100}</priority>
        </url>
        `;
    });
    body = body + `</urlset>`;

    return new Response(head.trim() + body.trim(), {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}
