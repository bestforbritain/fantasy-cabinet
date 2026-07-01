export const config = { runtime: 'edge' };

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
  });
}

export default async function handler(req) {
  var url = new URL(req.url);
  var raw = url.searchParams.get('c') || '';
  // keep only the safe characters our encoding uses
  var c = raw.replace(/[^a-z0-9:,]/gi, '');
  var enc = encodeURIComponent(c);
  var origin = url.origin;

  var img = origin + '/api/og' + (c ? '?c=' + enc : '');
  var builder = origin + '/';
  var shareUrl = origin + '/share' + (c ? '?c=' + enc : '');

  var title = 'My Fantasy Cabinet | Best for Britain';
  var desc = 'See who I would put around the Cabinet table after Keir Starmer. Build your own.';

  var html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + esc(title) + '</title>' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:site_name" content="Best for Britain">' +
    '<meta property="og:title" content="' + esc(title) + '">' +
    '<meta property="og:description" content="' + esc(desc) + '">' +
    '<meta property="og:image" content="' + esc(img) + '">' +
    '<meta property="og:image:width" content="1200">' +
    '<meta property="og:image:height" content="630">' +
    '<meta property="og:url" content="' + esc(shareUrl) + '">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + esc(title) + '">' +
    '<meta name="twitter:description" content="' + esc(desc) + '">' +
    '<meta name="twitter:image" content="' + esc(img) + '">' +
    '<link rel="canonical" href="' + esc(shareUrl) + '">' +
    '<meta http-equiv="refresh" content="0; url=' + esc(builder) + '">' +
    '</head><body style="font-family:system-ui,sans-serif;padding:24px">' +
    '<p>Taking you to the Fantasy Cabinet Builder\u2026 <a href="' + esc(builder) + '">Continue</a>.</p>' +
    '<script>location.replace(' + JSON.stringify(builder) + ');</script>' +
    '</body></html>';

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
