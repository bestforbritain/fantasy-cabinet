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
  ['env', 'Environment'], ['cms', 'Culture'], ['ni', 'N. Ireland'], ['sco', 'Scotland'], ['wal', 'Wales'],
  ['whip', 'Chief Whip']
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

var SPECIAL = {
  '-1':  { name: 'David Miliband',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/David_Miliband_2.jpg' },
  '-2':  { name: 'David Attenborough',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/David_Attenborough_in_2025.jpg/330px-David_Attenborough_in_2025.jpg' },
  '-3':  { name: 'Stacey Dooley',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Stacey_Dooley_at_War_on_Want_event_%28cropped_2%29.jpg/330px-Stacey_Dooley_at_War_on_Want_event_%28cropped_2%29.jpg' },
  '-4':  { name: 'Gemma Collins',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Gemma_Collins_by_Gemma_Collagen.jpg/330px-Gemma_Collins_by_Gemma_Collagen.jpg' },
  '-5':  { name: 'Wayne Rooney',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Wayne_Rooney_%2850121495731%29_%28cropped%29.jpg/330px-Wayne_Rooney_%2850121495731%29_%28cropped%29.jpg' },
  '-6':  { name: 'Ant & Dec',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Ant_and_Dec_in_Cardiff_Bay.jpg/330px-Ant_and_Dec_in_Cardiff_Bay.jpg' },
  '-7':  { name: 'Joanna Lumley',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Land_Rover_%E2%80%98Defender_2%2C000%2C000%E2%80%99_Sells_for_Record_%C2%A3400%2C000_at_Bonhams_Charity_Auction_%2823776501966%29_%28cropped%29.jpg/330px-Land_Rover_%E2%80%98Defender_2%2C000%2C000%E2%80%99_Sells_for_Record_%C2%A3400%2C000_at_Bonhams_Charity_Auction_%2823776501966%29_%28cropped%29.jpg' },
  '-8':  { name: 'Imelda Staunton',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Imelda_Staunton%2C_October_2019.jpg/330px-Imelda_Staunton%2C_October_2019.jpg' },
  '-9':  { name: 'Miriam Margolyes',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Miriam_Margolyes_2008.jpg/330px-Miriam_Margolyes_2008.jpg' },
  '-10': { name: 'Jamie Oliver',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Jamie_Oliver_%28cropped%29.jpg/330px-Jamie_Oliver_%28cropped%29.jpg' },
  '-11': { name: 'Katie Price',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Katie_Price_on_tour_September_2025.jpg/330px-Katie_Price_on_tour_September_2025.jpg' },
  '-12': { name: 'Kim Woodburn',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ac/Kim_Woodburn.jpg' },
  '-13': { name: 'Rowan Atkinson',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rowan_Atkinson%2C_2011.jpg/330px-Rowan_Atkinson%2C_2011.jpg' },
  '-14': { name: 'Gordon Ramsay',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Gordon_Ramsay_%28cropped%29.jpg/330px-Gordon_Ramsay_%28cropped%29.jpg' },
  '-15': { name: 'Miranda Hart',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Miranda_Hart_in_2011.jpg/330px-Miranda_Hart_in_2011.jpg' },
  '-16': { name: 'Gareth Southgate',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Southgate_2023.jpg/330px-Southgate_2023.jpg' },
  '-17': { name: 'Martin Lewis',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Martin_Lewis_at_BAFTA_2026_02.jpg/330px-Martin_Lewis_at_BAFTA_2026_02.jpg' },
  '-18': { name: 'Alan Carr',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Alan_Carr_at_BAFTA_2026_%28cropped%29.jpg/330px-Alan_Carr_at_BAFTA_2026_%28cropped%29.jpg' },
  '-19': { name: 'Graham Norton',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/GrahamNorton-byPhilipRomano.jpg/330px-GrahamNorton-byPhilipRomano.jpg' },
  '-20': { name: 'Harry Styles',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg/330px-HarryStylesWembley170623_%2865_of_93%29_%2852982678051%29_%28cropped_2%29.jpg' },
  '-21': { name: 'Noel Edmonds',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Noel_Edmonds_2020.png/330px-Noel_Edmonds_2020.png' },
  '-22': { name: 'Louis Theroux',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Louis_Theroux_crop.jpg/330px-Louis_Theroux_crop.jpg' },
  '-23': { name: 'Olivia Rodrigo',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Glasto2025-546_%28cropped%29_%282%29.jpg/330px-Glasto2025-546_%28cropped%29_%282%29.jpg' },
  '-24': { name: 'Charli XCX',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Charli_xcx_at_Berlinale_2026-1.jpg/330px-Charli_xcx_at_Berlinale_2026-1.jpg' },
  '-25': { name: 'Dua Lipa',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Dua_Lipa-69798_%28cropped%29.jpg/330px-Dua_Lipa-69798_%28cropped%29.jpg' },
  '-26': { name: 'Madonna',               thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg/330px-MadonnaO2171023_%2897_of_133%29_%2853269593787%29_%28cropped%29.jpg' },
  '-27': { name: 'Millie Bobby Brown',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Millie_Bobby_Brown_-_MBB_-_4_-_SFM5_-_July_10%2C_2022_at_Stranger_Fan_Meet_5_People_Convention_%28cropped%29.jpg/330px-Millie_Bobby_Brown_-_MBB_-_4_-_SFM5_-_July_10%2C_2022_at_Stranger_Fan_Meet_5_People_Convention_%28cropped%29.jpg' },
  '-28': { name: 'Tracey Emin',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tracey_Emin_1-cropped.jpg/330px-Tracey_Emin_1-cropped.jpg' },
  '-29': { name: 'Emma Watson',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Emma_Watson_2013.jpg/330px-Emma_Watson_2013.jpg' },
  '-30': { name: 'Elton John',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/EltonDocBFILFF101024_%284_of_17%29_%28cropped%29.jpg/330px-EltonDocBFILFF101024_%284_of_17%29_%28cropped%29.jpg' },
  '-31': { name: 'Jude Bellingham',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Jude_Bellingham_England_v_Ghana_23_June_2026-061.jpg/330px-Jude_Bellingham_England_v_Ghana_23_June_2026-061.jpg' },
  '-32': { name: 'Amal Clooney',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Amal_Clooney_2022_%28cropped%29.jpg/330px-Amal_Clooney_2022_%28cropped%29.jpg' },
  '-33': { name: 'Stephen Fry',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stephen_Fry_at_Berlinale_2024_Ausschnitt.jpg/330px-Stephen_Fry_at_Berlinale_2024_Ausschnitt.jpg' },
  '-34': { name: 'Greg Davies',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/GregDavies-byPhilipRomano.jpg/330px-GregDavies-byPhilipRomano.jpg' },
  '-35': { name: 'Romesh Ranganathan',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/RomeshRanganathan-byPhilipRomano.jpg/330px-RomeshRanganathan-byPhilipRomano.jpg' },
  '-36': { name: 'Claudia Winkleman',     thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Claudia_Winkleman_at_BAFTA_2026_01.jpg/330px-Claudia_Winkleman_at_BAFTA_2026_01.jpg' },
  '-37': { name: 'Ian McKellen',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/SDCC13_-_Ian_McKellen.jpg/330px-SDCC13_-_Ian_McKellen.jpg' },
  '-38': { name: 'Celine Dion',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/C%C3%A9line_Dion_2012.jpg/330px-C%C3%A9line_Dion_2012.jpg' },
  '-39': { name: 'Richard Osman',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Richard_Osman_2022.png/330px-Richard_Osman_2022.png' },
  '-40': { name: 'Clare Balding',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Award_of_clare_balding_%28cropped%29.jpg/330px-Award_of_clare_balding_%28cropped%29.jpg' },
  '-41': { name: 'Hannah Fry',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Hannah_Fry_at_the_Data_of_Tomorrow_Conference_2017_%2836638999274%29_%28cropped_3%29.jpg/330px-Hannah_Fry_at_the_Data_of_Tomorrow_Conference_2017_%2836638999274%29_%28cropped_3%29.jpg' },
  '-42': { name: 'Alison Hammond',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Alison_Hammond_on_ITV%27s_%27This_Morning%27_in_2023.jpg/330px-Alison_Hammond_on_ITV%27s_%27This_Morning%27_in_2023.jpg' },
  '-43': { name: 'Victoria Beckham',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/VictoriaBeckham2018-2-Crop.jpg/330px-VictoriaBeckham2018-2-Crop.jpg' },
  '-44': { name: 'Tyson Fury',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Tyson_Fury_at_Place_Bell%2C_Laval_Quebec%2C_Canada_-_Dec_16_2017_%28cropped%29.jpg/330px-Tyson_Fury_at_Place_Bell%2C_Laval_Quebec%2C_Canada_-_Dec_16_2017_%28cropped%29.jpg' },
  '-45': { name: 'Mollie-Mae Hague',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Molly_Mae_Hague_at_the_National_Television_Awards_%28cropped%29.jpg' },
  '-46': { name: 'Carol Vorderman',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Carol_Vorderman_%28cropped%29.png/330px-Carol_Vorderman_%28cropped%29.png' },
  '-47': { name: 'Gordon Brown',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Gordon_Brown_%282008%29.jpg/330px-Gordon_Brown_%282008%29.jpg' },
  '-48': { name: 'Tony Blair',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Tony_Blair_%282010%29_%283x4_cropped%29.jpg/330px-Tony_Blair_%282010%29_%283x4_cropped%29.jpg' },
  '-49': { name: 'John Major',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/John_Major_1993_%283%29.jpg/330px-John_Major_1993_%283%29.jpg' },
  '-50': { name: 'Jamie Laing',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Jaime_Laing_at_SXSW_London_2025.jpg/330px-Jaime_Laing_at_SXSW_London_2025.jpg' },
  '-51': { name: 'Judge Rinder',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/6/66/Judge_rinder.jpg' },
  '-52': { name: 'Danny Dyer',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Danny_Dyer_at_BAFTAs_2026_02.jpg/330px-Danny_Dyer_at_BAFTAs_2026_02.jpg' },
  '-53': { name: 'Brooklyn Beckham',      thumbUrl: null },
  '-54': { name: 'Princess Diana',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/330px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg' },
  '-55': { name: 'George Orwell',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/George_Orwell_press_photo.jpg/330px-George_Orwell_press_photo.jpg' },
  '-56': { name: 'Sir Isaac Newton',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/330px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg' },
  '-57': { name: 'Jedward',               thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jedward-original.jpg/330px-Jedward-original.jpg' },
  '-58': { name: 'Liam Gallagher',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/OasisCardiff040725-88_-_54640244776_%28landscape_crop%29_%28cropped%29.jpg/330px-OasisCardiff040725-88_-_54640244776_%28landscape_crop%29_%28cropped%29.jpg' },
  '-59': { name: 'Noel Gallagher',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Noel_Gallagher_Glastonbury_2022_%28cropped%29.jpg/330px-Noel_Gallagher_Glastonbury_2022_%28cropped%29.jpg' }
};

async function fetchMP(id) {
  if (SPECIAL[id]) return SPECIAL[id];
  var name = 'MP ' + id;
  var thumbUrl = 'https://members-api.parliament.uk/api/Members/' + id + '/Thumbnail';
  try {
    var controller = new AbortController();
    var timer = setTimeout(function(){ controller.abort(); }, 1500);
    var r = await fetch('https://members-api.parliament.uk/api/Members/' + id, { headers: { Accept: 'application/json' }, signal: controller.signal });
    clearTimeout(timer);
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
      if (kv.length === 2 && /^[a-z]+$/.test(kv[0]) && /^-?[0-9]+$/.test(kv[1])) picks[kv[0]] = kv[1];
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
        var avatarChildren = [initialsOf(mp.name)];
        if (mp.thumbUrl) avatarChildren.push(h('img', { src: mp.thumbUrl, width: 62, height: 62, style: { position: 'absolute', inset: '0', width: '62px', height: '62px', objectFit: 'cover' } }));
        avatar = h('div', { style: { position: 'relative', width: '62px', height: '62px', borderRadius: '31px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BRAND.lightgreen, color: BRAND.deep, fontSize: '23px', fontWeight: 700 } }, avatarChildren);
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
