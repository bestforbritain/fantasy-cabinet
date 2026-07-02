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
  '-45': { name: 'Molly-Mae Hague',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Molly_Mae_Hague_at_the_National_Television_Awards_%28cropped%29.jpg' },
  '-46': { name: 'Carol Vorderman',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Carol_Vorderman_%28cropped%29.png/330px-Carol_Vorderman_%28cropped%29.png' },
  '-47': { name: 'Gordon Brown',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Gordon_Brown_%282008%29.jpg/330px-Gordon_Brown_%282008%29.jpg' },
  '-48': { name: 'Tony Blair',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Tony_Blair_%282010%29_%283x4_cropped%29.jpg/330px-Tony_Blair_%282010%29_%283x4_cropped%29.jpg' },
  '-49': { name: 'John Major',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/John_Major_1993_%283%29.jpg/330px-John_Major_1993_%283%29.jpg' },
  '-50': { name: 'Jamie Laing',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Jaime_Laing_at_SXSW_London_2025.jpg/330px-Jaime_Laing_at_SXSW_London_2025.jpg' },
  '-51': { name: 'Judge Rinder',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/6/66/Judge_rinder.jpg' },
  '-52': { name: 'Danny Dyer',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Danny_Dyer_at_BAFTAs_2026_02.jpg/330px-Danny_Dyer_at_BAFTAs_2026_02.jpg' },
  '-54': { name: 'Princess Diana',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diana%2C_Princess_of_Wales_1997_%282%29.jpg/330px-Diana%2C_Princess_of_Wales_1997_%282%29.jpg' },
  '-55': { name: 'George Orwell',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/George_Orwell_press_photo.jpg/330px-George_Orwell_press_photo.jpg' },
  '-56': { name: 'Sir Isaac Newton',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/330px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg' },
  '-57': { name: 'Jedward',               thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jedward-original.jpg/330px-Jedward-original.jpg' },
  '-58': { name: 'Liam Gallagher',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/OasisCardiff040725-88_-_54640244776_%28landscape_crop%29_%28cropped%29.jpg/330px-OasisCardiff040725-88_-_54640244776_%28landscape_crop%29_%28cropped%29.jpg' },
  '-59': { name: 'Noel Gallagher',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Noel_Gallagher_Glastonbury_2022_%28cropped%29.jpg/330px-Noel_Gallagher_Glastonbury_2022_%28cropped%29.jpg' },
  '-60': { name: 'Michael Sheen',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Michael_Sheen_at_PaleyFest_2014.jpg/330px-Michael_Sheen_at_PaleyFest_2014.jpg' },
  '-61': { name: 'Tom Jones',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sir_Tom_Jones_at_The_Queen%27s_Birthday_Party_%28cropped-2%29.jpg' },
  '-62': { name: 'Catherine Zeta-Jones',   thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Catherine_Zeta-Jones_2025.png/330px-Catherine_Zeta-Jones_2025.png' },
  '-63': { name: 'Charlotte Church',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Charlotte_Church_Focus_Wales_2013.jpg/330px-Charlotte_Church_Focus_Wales_2013.jpg' },
  '-64': { name: 'Rob Brydon',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Rob_Brydon_at_BAFTAs_2026_02.jpg/330px-Rob_Brydon_at_BAFTAs_2026_02.jpg' },
  '-65': { name: 'Liam Neeson',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Liam_Neeson_Deauville_2012_2.jpg/330px-Liam_Neeson_Deauville_2012_2.jpg' },
  '-66': { name: 'Kenneth Branagh',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Kenneth_Branagh_at_diff_2015.jpg/330px-Kenneth_Branagh_at_diff_2015.jpg' },
  '-67': { name: 'Jamie Dornan',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jamie_Dornan_January_2013.jpg/330px-Jamie_Dornan_January_2013.jpg' },
  '-68': { name: 'Rory McIlroy',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Rory_McIlroy_Ryder_Cup_2025-195_%28cropped%29.jpg/330px-Rory_McIlroy_Ryder_Cup_2025-195_%28cropped%29.jpg' },
  '-69': { name: 'James Nesbitt',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/James_Nesbitt_2013.jpg' },
  '-70': { name: 'David Tennant',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/David_Tennant_-_Los_Angeles_Comic_Con_2025.jpg/330px-David_Tennant_-_Los_Angeles_Comic_Con_2025.jpg' },
  '-71': { name: 'Lewis Capaldi',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Glasto2025-41_%28cropped%29.jpg/330px-Glasto2025-41_%28cropped%29.jpg' },
  '-73': { name: 'Lorraine Kelly',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lorraine_Kelly_at_BAFTAs_2026_02.jpg/330px-Lorraine_Kelly_at_BAFTAs_2026_02.jpg' },
  '-74': { name: 'Ewan McGregor',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ewan_McGregor_-_Los_Angeles_Comic_Con_2024.jpg/330px-Ewan_McGregor_-_Los_Angeles_Comic_Con_2024.jpg' },
  '-75': { name: 'Maro Itoje',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/USO_-_Saracens_-_20151213_-_Maro_Itoje.jpg/330px-USO_-_Saracens_-_20151213_-_Maro_Itoje.jpg' },
  '-76': { name: 'Bruno Tonioli',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Bruno_Tonioli_in_2015.jpg/330px-Bruno_Tonioli_in_2015.jpg' },
  '-77': { name: 'Robert Peston',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Robert_Peston%2C_2016_Labour_Party_Conference.jpg/330px-Robert_Peston%2C_2016_Labour_Party_Conference.jpg' },
  '-78': { name: 'Piers Morgan',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/The_Prime_Minister_is_interviewed_by_Piers_Morgan_%28cropped3%29.jpg/330px-The_Prime_Minister_is_interviewed_by_Piers_Morgan_%28cropped3%29.jpg' },
  '-79': { name: 'Liz Truss',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Official_portrait_of_Liz_Truss_%283x4_cropped_b%29.jpg/330px-Official_portrait_of_Liz_Truss_%283x4_cropped_b%29.jpg' },
  '-80': { name: 'Marina Hyde',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Marina_Hyde_at_the_British_Library.jpg/330px-Marina_Hyde_at_the_British_Library.jpg' },
  '-81': { name: 'Laura Kuenssberg',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Laura_Kuenssberg_Cicero_2012.jpg/330px-Laura_Kuenssberg_Cicero_2012.jpg' },
  '-82': { name: 'Pierce Brosnan',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/PierceBrosnan-byPhilipRomano.jpg/330px-PierceBrosnan-byPhilipRomano.jpg' },
  '-83': { name: 'Emily Maitlis',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Emily_Maitlis_Reporting_from_Leadership_Debate_Bristol_2010.jpg/330px-Emily_Maitlis_Reporting_from_Leadership_Debate_Bristol_2010.jpg' },
  '-84':  { name: 'Idris Elba',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Idris_Elba_A_House_of_Dynamite-21_%28cropped%29.jpg/330px-Idris_Elba_A_House_of_Dynamite-21_%28cropped%29.jpg' },
  '-85':  { name: 'Lewis Hamilton',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/330px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg' },
  '-86':  { name: 'Stormzy',               thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/StormzyO2270322_%2834_of_77%29_%28cropped%29.jpg/330px-StormzyO2270322_%2834_of_77%29_%28cropped%29.jpg' },
  '-87':  { name: 'Dev Patel',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Dev_Patel_%2829870651654%29.jpg/330px-Dev_Patel_%2829870651654%29.jpg' },
  '-88':  { name: 'Naomie Harris',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Naomie_Harris_2014.jpg/330px-Naomie_Harris_2014.jpg' },
  '-89':  { name: 'Riz Ahmed',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Riz_Ahmed-7658_%28cropped%29.jpg/330px-Riz_Ahmed-7658_%28cropped%29.jpg' },
  '-90':  { name: 'Sir Lenny Henry',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Sir_Lenny_Henry_signing_books_%282%29_-_Copy.jpg/330px-Sir_Lenny_Henry_signing_books_%282%29_-_Copy.jpg' },
  '-91':  { name: 'Nadiya Hussain',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Nadiya_Hussain_2019.jpeg/330px-Nadiya_Hussain_2019.jpeg' },
  '-92':  { name: 'Anthony Joshua',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Anthony_Joshua_2017.png/330px-Anthony_Joshua_2017.png' },
  '-93':  { name: 'Leona Lewis',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Leona_Lewis_2014.jpg/330px-Leona_Lewis_2014.jpg' },
  '-94':  { name: 'Thandiwe Newton',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Thandiwe_Newton_Peabody_Awards%2C_June_2021.png/330px-Thandiwe_Newton_Peabody_Awards%2C_June_2021.png' },
  '-95':  { name: 'Daniel Kaluuya',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Daniel_Kaluuya_%282017%29.jpg/330px-Daniel_Kaluuya_%282017%29.jpg' },
  '-96':  { name: 'June Sarpong',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/June_Sarpong_at_2025_SXSW_London.jpg/330px-June_Sarpong_at_2025_SXSW_London.jpg' },
  '-97':  { name: 'Jorja Smith',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jorja_Smith_11_26_2018_-5_%2845772599074%29.jpg/330px-Jorja_Smith_11_26_2018_-5_%2845772599074%29.jpg' },
  '-98':  { name: 'Kelly Macdonald',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Kelly_Macdonald_at_Brave_premiere_%287399126166%29_%28cropped%29.jpg' },
  '-99':  { name: 'Andy Murray',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/2015_Australian_Open_-_Andy_Murray_12_%28cropped%29.jpg/330px-2015_Australian_Open_-_Andy_Murray_12_%28cropped%29.jpg' },
  '-100': { name: 'Ncuti Gatwa',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Ncuti_Gatwa-65764.jpg/330px-Ncuti_Gatwa-65764.jpg' },
  '-101': { name: 'Munya Chawawa',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Munya_Chawawa_in_2020.png/330px-Munya_Chawawa_in_2020.png' },
  '-102': { name: 'Andi Oliver',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Andi_Oliver_20231129.jpg/330px-Andi_Oliver_20231129.jpg' },
  '-103': { name: 'Lord Simon Woolley',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Official_portrait_of_Lord_Woolley_of_Woodford_crop_2.jpg/330px-Official_portrait_of_Lord_Woolley_of_Woodford_crop_2.jpg' },
  '-104': { name: 'Michaela Coel',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Michaela_Coel_Peabody_Awards%2C_June_2021.png/330px-Michaela_Coel_Peabody_Awards%2C_June_2021.png' },
  '-105': { name: 'Phoebe Waller-Bridge',  thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Nicola_Benedetti_Humza_Yousaf_Phoebe_Waller-Bridge_-_All_Festivals_Reception_%28Waller-Bridge_cropped%29_%28cropped%29.jpg/330px-Nicola_Benedetti_Humza_Yousaf_Phoebe_Waller-Bridge_-_All_Festivals_Reception_%28Waller-Bridge_cropped%29_%28cropped%29.jpg' },
  '-106': { name: 'Katarina Johnson-Thompson', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/WK2B0124_katarina_jt_%28cropped-1%29.jpg/330px-WK2B0124_katarina_jt_%28cropped-1%29.jpg' },
  '-107': { name: 'William Shakespeare',   thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/William_Shakespeare_by_John_Taylor%2C_edited.jpg/330px-William_Shakespeare_by_John_Taylor%2C_edited.jpg' },
  '-108': { name: 'Charles Darwin',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/330px-Charles_Darwin_seated_crop.jpg' },
  '-109': { name: 'Jane Austen',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/330px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg' },
  '-111': { name: 'Queen Elizabeth I',     thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Darnley_stage_3.jpg/330px-Darnley_stage_3.jpg' },
  '-112': { name: 'Queen Victoria',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Queen_Victoria_by_Bassano.jpg/330px-Queen_Victoria_by_Bassano.jpg' },
  '-113': { name: 'Alan Turing',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Alan_turing_header.jpg/330px-Alan_turing_header.jpg' },
  '-114': { name: 'Ada Lovelace',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ada_Lovelace_daguerreotype_by_Antoine_Claudet_1843_-_cropped.png/330px-Ada_Lovelace_daguerreotype_by_Antoine_Claudet_1843_-_cropped.png' },
  '-116': { name: 'Florence Nightingale',  thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg/330px-Florence_Nightingale_%28H_Hering_NPG_x82368%29.jpg' },
  '-117': { name: 'Emmeline Pankhurst',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Emmeline_Pankhurst%2C_seated_%281913%29.jpg/330px-Emmeline_Pankhurst%2C_seated_%281913%29.jpg' },
  '-118': { name: 'Isambard Kingdom Brunel', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Robert_Howlett_%28Isambard_Kingdom_Brunel_Standing_Before_the_Launching_Chains_of_the_Great_Eastern%29%2C_The_Metropolitan_Museum_of_Art_-_restoration1.jpg/330px-Robert_Howlett_%28Isambard_Kingdom_Brunel_Standing_Before_the_Launching_Chains_of_the_Great_Eastern%29%2C_The_Metropolitan_Museum_of_Art_-_restoration1.jpg' },
  '-119': { name: 'Sir Winston Churchill', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg/330px-Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg' },
  '-120': { name: 'Admiral Lord Nelson',   thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/HoratioNelson1.jpg/330px-HoratioNelson1.jpg' },
  '-121': { name: 'David Bowie',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/330px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg' },
  '-122': { name: 'Freddie Mercury',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/330px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg' },
  '-123': { name: 'Queen Elizabeth II',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Queen_Elizabeth_II_official_portrait_for_1959_tour_%28retouched%29_%28cropped%29_%283-to-4_aspect_ratio%29.jpg/330px-Queen_Elizabeth_II_official_portrait_for_1959_tour_%28retouched%29_%28cropped%29_%283-to-4_aspect_ratio%29.jpg' },
  '-124': { name: 'Dame Judi Dench',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Judi_Dench_2023.jpg/330px-Judi_Dench_2023.jpg' },
  '-125': { name: 'Dame Helen Mirren',     thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/MKr24712_Helen_Mirren_%28Golda%2C_Berlinale_2023%29_cropped.png/330px-MKr24712_Helen_Mirren_%28Golda%2C_Berlinale_2023%29_cropped.png' },
  '-126': { name: 'Kate Winslet',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/KateWinslet_%28cropped%29.jpg/330px-KateWinslet_%28cropped%29.jpg' },
  '-127': { name: 'Olivia Colman',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Olivia_Colman_2022_%28cropped_%29.jpg/330px-Olivia_Colman_2022_%28cropped_%29.jpg' },
  '-128': { name: 'Jodie Comer',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Jodie_Comer%2C_The_Bikeriders_premiere.jpg/330px-Jodie_Comer%2C_The_Bikeriders_premiere.jpg' },
  '-129': { name: 'Adele',                 thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_2016.jpg/330px-Adele_2016.jpg' },
  '-130': { name: 'Emma Raducanu',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Transylvania_Open_2026_-_Emma_Raducanu_vs_Greet_Minnen_6-0%2C_6-4_-_01.02.2026_%2855076013277%29_%28cropped%29.jpg/330px-Transylvania_Open_2026_-_Emma_Raducanu_vs_Greet_Minnen_6-0%2C_6-4_-_01.02.2026_%2855076013277%29_%28cropped%29.jpg' },
  '-131': { name: 'Dina Asher-Smith',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Dina_Asher-Smith_2_Oregon_2022_%28cropped%29.jpg/330px-Dina_Asher-Smith_2_Oregon_2022_%28cropped%29.jpg' },
  '-132': { name: 'Mary Earps',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mary_Earps_Man_Utd.jpg/330px-Mary_Earps_Man_Utd.jpg' },
  '-133': { name: 'Dawn French',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Dawn_French_1.jpg/330px-Dawn_French_1.jpg' },
  '-134': { name: 'Dame Mary Berry',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Mary_Berry_at_Chelsea_Flower_Show_-_2017_-_%2834039048853%29_%28cropped%29.jpg/330px-Mary_Berry_at_Chelsea_Flower_Show_-_2017_-_%2834039048853%29_%28cropped%29.jpg' },
  '-135': { name: 'King Charles I',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/King_Charles_I_after_original_by_van_Dyck.jpg/330px-King_Charles_I_after_original_by_van_Dyck.jpg' },
  '-136': { name: 'William Pitt the Younger', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/OlderPittThe_Younger.jpg/330px-OlderPittThe_Younger.jpg' },
  '-137': { name: 'Bob Mortimer',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bob_Mortimer_in_2017.jpg/330px-Bob_Mortimer_in_2017.jpg' },
  '-138': { name: 'Johnny Vegas',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Johnny_Vegas_2021.png/330px-Johnny_Vegas_2021.png' },
  '-139': { name: 'Rylan',                  thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Rylan_Clark_2024_%28cropped%29.jpg/330px-Rylan_Clark_2024_%28cropped%29.jpg' },
  '-140': { name: 'Bez',                    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Bez-2007.jpg/330px-Bez-2007.jpg' },
  '-141': { name: 'Timmy Mallett',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Timmymallettcropped.jpg/330px-Timmymallettcropped.jpg' },
  '-142': { name: 'Su Pollard',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Supollard1.jpg' },
  '-144': { name: 'Jenny Eclair',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Jennyeclair.jpg/330px-Jennyeclair.jpg' },
  '-145': { name: 'Iain Stirling',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ian_Stirling_at_BAFTA_2026_01.jpg/330px-Ian_Stirling_at_BAFTA_2026_01.jpg' },
  '-146': { name: 'Ainsley Harriott',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Ainsley_Harriott.jpg/330px-Ainsley_Harriott.jpg' },
  '-147': { name: 'Tim Key',                thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/2025_01_25_Sundance_Film_Festival-41_Full_%28cropped%29.jpg/330px-2025_01_25_Sundance_Film_Festival-41_Full_%28cropped%29.jpg' },
  '-148': { name: 'Judi Love',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Judi_Love_at_BAFTAs_2026_02.jpg/330px-Judi_Love_at_BAFTAs_2026_02.jpg' },
  '-149': { name: 'Alan Partridge',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Alan_Partridge_booksigning_%28cropped%29.png' },
  '-150': { name: 'David Brent',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/David_Brent_111.jpg/330px-David_Brent_111.jpg' },
  '-152': { name: 'Katherine Ryan',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Katherine_Ryan.png/330px-Katherine_Ryan.png' },
  '-153': { name: 'Diane Morgan',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Diane_Morgan_x_Candid_Portraits_Ltd.jpg/330px-Diane_Morgan_x_Candid_Portraits_Ltd.jpg' },
  '-154': { name: 'Lolly Adefope',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/LollyAdefope-byPhilipRomano.jpg/330px-LollyAdefope-byPhilipRomano.jpg' },
  '-155': { name: 'David Hockney',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/David_Hockney_in_Washington_Square_Park_%281977%29.jpg/330px-David_Hockney_in_Washington_Square_Park_%281977%29.jpg' },
  '-156': { name: 'Candice Carty-Williams',  thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Candice_Carty-Williams.jpg/330px-Candice_Carty-Williams.jpg' },
  '-157': { name: 'Zadie Smith',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Zadie_Smith_NBCC_2011_Shankbone.jpg/330px-Zadie_Smith_NBCC_2011_Shankbone.jpg' },
  '-158': { name: 'Sarah Waters',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Sarah_Waters.jpg/330px-Sarah_Waters.jpg' },
  '-159': { name: 'Kazuo Ishiguro',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/MKr377543_Kazuo_Ishiguro_%28A_Pale_View_of_Hills%2C_Cannes_2025%29.jpg/330px-MKr377543_Kazuo_Ishiguro_%28A_Pale_View_of_Hills%2C_Cannes_2025%29.jpg' },
  '-160': { name: 'Ian McEwan',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/IanMcEwan_EIBF2025_i481.jpg/330px-IanMcEwan_EIBF2025_i481.jpg' },
  '-161': { name: 'Anish Kapoor',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Anish_Kapoor_2017.jpg/330px-Anish_Kapoor_2017.jpg' },
  '-162': { name: 'Banksy',                 thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3f/Banksy-ps2.jpg' },
  '-163': { name: 'Dr. Helen Sharman',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Dr._Helen_Sharman_%28cropped%29.jpg/330px-Dr._Helen_Sharman_%28cropped%29.jpg' },
  '-164': { name: 'Tim Peake',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Timothy_Peake%2C_official_portrait.jpg/330px-Timothy_Peake%2C_official_portrait.jpg' },
  '-165': { name: 'Thomas Tuchel',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Thomas_Tuchel_England_v_Ghana_23_June_2026-081.jpg/330px-Thomas_Tuchel_England_v_Ghana_23_June_2026-081.jpg' },
  '-166': { name: 'Jeremy Clarkson',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Jeremy_Clarkson%2C_Top_Gear_Live_2012_%284x5_cropped%29.jpg/330px-Jeremy_Clarkson%2C_Top_Gear_Live_2012_%284x5_cropped%29.jpg' },
  '-167': { name: 'Kaleb Cooper',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Rishi_Sunak_speaks_with_Kaleb_Cooper_%28cropped%29.jpg/330px-Rishi_Sunak_speaks_with_Kaleb_Cooper_%28cropped%29.jpg' },
  '-168': { name: 'Eddie Izzard',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Eddie_Izzard_comes_to_Crouch_End.jpg/330px-Eddie_Izzard_comes_to_Crouch_End.jpg' },
  '-169': { name: 'Abigail Thorn',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Portrait_of_Abigail_Thorn.jpg/330px-Portrait_of_Abigail_Thorn.jpg' },
  '-170': { name: 'Mo Mowlam',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Mo_Mowlam_official_portrait.jpg/330px-Mo_Mowlam_official_portrait.jpg' },
  '-171': { name: 'Barbara Castle',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/1657543218962_NP0238_Barbara_CASTLE_001_MOBILE_%28cropped%29.jpg/330px-1657543218962_NP0238_Barbara_CASTLE_001_MOBILE_%28cropped%29.jpg' },
  '-172': { name: 'Shirley Williams',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Regius_Professorship_Lecture_%2815648721150%29.jpg/330px-Regius_Professorship_Lecture_%2815648721150%29.jpg' },
  '-173': { name: 'Betty Boothroyd',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Official_portrait_of_Baroness_Boothroyd_%28cropped%29.jpg/330px-Official_portrait_of_Baroness_Boothroyd_%28cropped%29.jpg' },
  '-174': { name: 'Baroness Doreen Lawrence', thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Official_portrait_of_Baroness_Lawrence_of_Clarendon_crop_2%2C_2025.jpg/330px-Official_portrait_of_Baroness_Lawrence_of_Clarendon_crop_2%2C_2025.jpg' },
  '-175': { name: 'Keely Hodgkinson',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Keely_Hodgkinson_at_2023_European_Indoor_Championships2_%28cropped%29.jpg/330px-Keely_Hodgkinson_at_2023_European_Indoor_Championships2_%28cropped%29.jpg' },
  '-176': { name: 'Beth Mead',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Eng_Women_0_Czech_Rep_0_11_10_2022-225_%2852426070932%29_%28cropped%29.jpg/330px-Eng_Women_0_Czech_Rep_0_11_10_2022-225_%2852426070932%29_%28cropped%29.jpg' },
  '-177': { name: 'Leah Williamson',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lionesses_Victory_Parade_2025_%2854687088710%29_%28cropped_-_Williamson%29.jpg/330px-Lionesses_Victory_Parade_2025_%2854687088710%29_%28cropped_-_Williamson%29.jpg' },
  '-178': { name: 'Jessica Ennis-Hill',     thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jessica_Ennis-Hill_-_240422_175644_%28cropped%29.jpg/330px-25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jessica_Ennis-Hill_-_240422_175644_%28cropped%29.jpg' },
  '-179': { name: 'Dame Kelly Holmes',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Kelly_Holmes_at_Athens_2004_cropped.jpg' },
  '-180': { name: 'Marie Curie',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/330px-Marie_Curie_c._1920s.jpg' },
  '-181': { name: 'Rosalind Franklin',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Rosalind_Franklin_%28retouched%29.jpg/330px-Rosalind_Franklin_%28retouched%29.jpg' },
  '-182': { name: 'Mary Anning',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mary_Anning_painting.jpg/330px-Mary_Anning_painting.jpg' },
  '-183': { name: 'Jane Goodall',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Deputy_Secretary_Higginbottom_Poses_for_a_Photo_With_Dr._Jane_Goodall_and_the_State_Department%27s_Global_Health_Diplomacy_Director_Jordan_in_Washington_%2822365513310%29_%282%29_%28cropped_2%29.jpg/330px-thumbnail.jpg' },
  '-184': { name: 'Malorie Blackman',       thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Maloriesmall.jpg/330px-Maloriesmall.jpg' },
  '-185': { name: 'Hilary Mantel',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Hilary_Mantel.jpg' },
  '-186': { name: 'Yayoi Kusama',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Yayoi_Kusama_wax_model_at_Louis_Vitton.jpg/330px-Yayoi_Kusama_wax_model_at_Louis_Vitton.jpg' },
  '-187': { name: 'Jennifer Saunders',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Jennifer_Saunders_2014.jpg/330px-Jennifer_Saunders_2014.jpg' },
  '-188': { name: 'Sandi Toksvig',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Sandi_Toksvig_-_Secret_Comedy_Podcast_-_2013_%289468814916%29_%28cropped%29.jpg/330px-Sandi_Toksvig_-_Secret_Comedy_Podcast_-_2013_%289468814916%29_%28cropped%29.jpg' },
  '-189': { name: 'Sue Perkins',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Sue_Perkins_January_2024_on_podcast_%28cropped%29.jpg/330px-Sue_Perkins_January_2024_on_podcast_%28cropped%29.jpg' },
  '-190': { name: 'Victoria Wood',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Victoria_Wood.jpg/330px-Victoria_Wood.jpg' },
  '-191': { name: 'Kate Bush',              thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Kate_Bush_Hounds_of_Love_%281985_EMI_publicity_photo%29_02_%28cropped%29.jpg/330px-Kate_Bush_Hounds_of_Love_%281985_EMI_publicity_photo%29_02_%28cropped%29.jpg' },
  '-192': { name: 'Annie Lennox',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Annie_Lennox_March_2023.jpg/330px-Annie_Lennox_March_2023.jpg' },
  '-193': { name: 'Raye',                   thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Raye8888.jpg/330px-Raye8888.jpg' },
  '-194': { name: 'Theresa May',            thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Official_portrait_of_Baroness_May_of_Maidenhead_crop_2.jpg/330px-Official_portrait_of_Baroness_May_of_Maidenhead_crop_2.jpg' },
  '-195': { name: 'Caroline Lucas',         thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Official_portrait_of_Caroline_Lucas_MP_crop_2.jpg/330px-Official_portrait_of_Caroline_Lucas_MP_crop_2.jpg' },
  '-196': { name: 'Ruth Bader Ginsburg',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ruth_Bader_Ginsburg_2016_portrait.jpg/330px-Ruth_Bader_Ginsburg_2016_portrait.jpg' },
  '-197': { name: 'Angela Merkel',          thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Angela_Merkel_2019_cropped.jpg/330px-Angela_Merkel_2019_cropped.jpg' },
  '-198': { name: 'Eleanor Roosevelt',      thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Eleanor_Roosevelt_at_the_United_Nations%2C_circa_1946-1947_%283x4_cropped%29.jpg/330px-Eleanor_Roosevelt_at_the_United_Nations%2C_circa_1946-1947_%283x4_cropped%29.jpg' },
  '-199': { name: 'Boudicca',               thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Queen_Boudica_by_John_Opie.jpg/330px-Queen_Boudica_by_John_Opie.jpg' },
  '-200': { name: 'Mary Shelley',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Mary_Wollstonecraft_Shelley_Rothwell.tif/lossy-page1-330px-Mary_Wollstonecraft_Shelley_Rothwell.tif.jpg' },
  '-201': { name: 'Mary Wollstonecraft',    thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mary_Wollstonecraft_Portrait.jpg/330px-Mary_Wollstonecraft_Portrait.jpg' },
  '-202': { name: 'Agatha Christie',        thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Agatha_Christie_in_Nederland_%28detectiveschrijfster%29%2C_bij_aankomst_op_Schiphol_me%2C_Bestanddeelnr_916-8898_%28cropped%29.jpg/330px-Agatha_Christie_in_Nederland_%28detectiveschrijfster%29%2C_bij_aankomst_op_Schiphol_me%2C_Bestanddeelnr_916-8898_%28cropped%29.jpg' },
  '-203': { name: 'Mary Beard',             thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mary_Beard_UC3M_2017_%28cropped%29.JPG/330px-Mary_Beard_UC3M_2017_%28cropped%29.JPG' },
  '-204': { name: 'Lucy Worsley',           thumbUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Lucy_Worsley_2019.jpg/330px-Lucy_Worsley_2019.jpg' }
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
