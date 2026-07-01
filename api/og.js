import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// Best for Britain brand colours
var BRAND = {
  bg: '#0f382a',
  yellow: '#ecfc96',
  white: '#ffffff',
  lightgreen: '#5fb887',
  vlight: '#c2ebd7',
  deep: '#041a13'
};

// Role id -> short label, in seating order (must match the builder)
var ROLES = [
  ['pm', 'PM'], ['dpm', 'Dep. PM'], ['chx', 'Chancellor'], ['fco', 'Foreign'], ['home', 'Home'],
  ['jus', 'Justice'], ['def', 'Defence'], ['hsc', 'Health'], ['edu', 'Education'], ['dwp', 'Work & Pensions'],
  ['dbt', 'Business & Trade'], ['net', 'Energy'], ['sci', 'Science & Tech'], ['hou', 'Housing'], ['tra', 'Transport'],
  ['env', 'Environment'], ['cms', 'Culture'], ['ni', 'N. Ireland'], ['sco', 'Scotland'], ['wal', 'Wales']
];

// Minimal element helper so we can avoid JSX (keeps this a plain .js file)
function h(type, props, children) {
  props = props || {};
  if (children !== undefined) props.children = children;
  return { type: type, props: props };
}

function stripHonorific(name) {
  return String(name).replace(/^(the\s+)?(rt\s+hon\s+)?(sir|dame|dr|mr|mrs|ms|miss|lord|lady)\.?\s+/i, '').trim();
}
function initialsOf(name) {
  var n = stripHonorific(name).split(/\s+/).filter(Boolean);
  if (!n.length) return '?';
  return ((n[0][0] || '') + (n.length > 1 ? n[n.length - 1][0] : '')).toUpperCase();
}
function truncate(name, max) {
  var s = stripHonorific(name);
  return s.length > max ? s.slice(0, max - 1) + '\u2026' : s;
}

async function fetchMP(id) {
  var name = 'MP ' + id;
  var thumbUrl = 'https://members-api.parliament.uk/api/Members/' + id + '/Thumbnail';
  try {
    var r = await fetch('https://members-api.parliament.uk/api/Members/' + id, { headers: { Accept: 'application/json' } });
    if (r.ok) {
      var j = await r.json();
      if (j && j.value) name = j.value.nameDisplayAs || j.value.nameFullTitle || name;
    }
  } catch (e) {}
  return { name: name, thumbUrl: thumbUrl };
}

export default async function handler(req) {
  try {
    var url = new URL(req.url);
    var c = url.searchParams.get('c') || '';

    var picks = {};
    c.split(',').forEach(function (p) {
      var kv = p.split(':');
      if (kv.length === 2 && /^[a-z]+$/.test(kv[0]) && /^[0-9]+$/.test(kv[1])) picks[kv[0]] = kv[1];
    });

    var uniqueIds = [];
    ROLES.forEach(function (r) {
      var id = picks[r[0]];
      if (id && uniqueIds.indexOf(id) === -1) uniqueIds.push(id);
    });

    var dataById = {};
    await Promise.all(uniqueIds.map(async function (id) { dataById[id] = await fetchMP(id); }));

    var cells = ROLES.map(function (entry) {
      var rid = entry[0], label = entry[1];
      var id = picks[rid];
      var mp = id ? dataById[id] : null;

      var avatar;
      if (mp) {
        avatar = h('img', { src: mp.thumbUrl, width: 62, height: 62, style: { width: '62px', height: '62px', borderRadius: '31px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)' } });
      } else {
        avatar = h('div', { style: { width: '62px', height: '62px', borderRadius: '31px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.22)', color: 'rgba(255,255,255,0.4)', fontSize: '26px' } }, '+');
      }

      var text = h('div', { style: { display: 'flex', flexDirection: 'column', marginLeft: '13px' } }, [
        h('div', { style: { display: 'flex', color: BRAND.vlight, fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' } }, label),
        h('div', { style: { display: 'flex', color: BRAND.white, fontSize: '20px', fontWeight: 700, marginTop: '3px' } }, mp ? truncate(mp.name, 16) : 'Vacant')
      ]);

      return h('div', { style: { display: 'flex', alignItems: 'center', width: '214px', height: '94px' } }, [avatar, text]);
    });

    var rows = [];
    for (var i = 0; i < cells.length; i += 5) {
      rows.push(h('div', { style: { display: 'flex', flexDirection: 'row' } }, cells.slice(i, i + 5)));
    }

    var filled = Object.keys(picks).length;

    var tree = h('div', { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: BRAND.bg, padding: '40px 44px' } }, [
      h('div', { style: { display: 'flex', height: '12px', background: BRAND.yellow, width: '120px', marginBottom: '14px' } }, ''),
      h('div', { style: { display: 'flex', flexDirection: 'column', marginBottom: '16px' } }, [
        h('div', { style: { display: 'flex', color: BRAND.yellow, fontSize: '20px', fontWeight: 700, letterSpacing: '4px' } }, 'BEST FOR BRITAIN'),
        h('div', { style: { display: 'flex', color: BRAND.white, fontSize: '50px', fontWeight: 800, marginTop: '2px' } }, 'My Fantasy Cabinet')
      ]),
      h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } }, rows),
      h('div', { style: { display: 'flex', color: BRAND.vlight, fontSize: '17px', fontWeight: 600, marginTop: '6px' } }, filled + ' of 20 seats filled \u00b7 build yours with Best for Britain')
    ]);

    return new ImageResponse(tree, {
      width: 1200,
      height: 630,
      headers: { 'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' }
    });
  } catch (e) {
    return new Response('Failed to generate image: ' + (e && e.message), { status: 500 });
  }
}
