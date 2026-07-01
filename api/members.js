export const config = { runtime: 'edge' };

export default async function handler(req) {
  var incoming = new URL(req.url);
  var qs = incoming.search; // preserves all params (House, PartyId, skip, take, etc.)
  var upstream = "https://members-api.parliament.uk/api/Members/Search" + qs;

  try {
    var r = await fetch(upstream, { headers: { Accept: "application/json" } });
    var body = await r.text();
    return new Response(body, {
      status: r.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
