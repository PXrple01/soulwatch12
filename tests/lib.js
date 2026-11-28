// Gemeinsame Helfer für die Browser-Tests der Watchlist (Playwright).
// Keine echten Daten, keine Cloud: Testdaten entstehen per MAKE_DATA, fremde Bilder werden durch Platzhalter ersetzt,
// TMDB und Supabase werden nachgebildet. Der echte Haushalts-Code gehört nie hierher.
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:5178/index.html';
const SLOW = +(process.env.TEST_SLOW || (process.env.CI ? 1.6 : 1));   // auf langsamen Rechnern länger warten
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const IMG_HOSTS = /(wikimedia|media-amazon|tvmaze|anilist|kitsu|myanimelist|anili\.st|imdb|ytimg|tmdb)/i;

function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
function poster(url) {
  const h = hash(url), hue = h % 360, hue2 = (hue + 40 + (h >> 8) % 80) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="hsl(${hue},55%,42%)"/><stop offset="1" stop-color="hsl(${hue2},60%,14%)"/></linearGradient></defs><rect width="300" height="450" fill="url(#g)"/><circle cx="${80 + h % 140}" cy="${120 + (h >> 4) % 160}" r="${50 + (h >> 6) % 60}" fill="hsl(${hue2},70%,65%)" opacity=".35"/></svg>`;
}

// TMDB-Nachbildung: feste Antworten, damit Tests nicht vom echten Dienst abhängen.
// Titel, deren Suchname „Lain“ enthält, gibt es bei keinem Anbieter.
const TMDB = {
  find: id => ({ movie_results: [{ id: 1000 + hash(id) % 9000 }], tv_results: [{ id: 1000 + hash(id) % 9000 }] }),
  search: q => /lain/i.test(q) ? { results: [] } : { results: [{ id: 1000 + hash(q) % 9000 }] },
  providers: id => {
    const fl = id % 2 ? [{ provider_id: 8, provider_name: 'Netflix', logo_path: '/netflix.png', display_priority: 1 }] : [{ provider_id: 337, provider_name: 'Disney Plus', logo_path: '/disney.png', display_priority: 2 }];
    const shop = [{ provider_id: 2, provider_name: 'Apple TV', logo_path: '/apple.png', display_priority: 3 }, { provider_id: 10, provider_name: 'Amazon Video', logo_path: '/amazon.png', display_priority: 4 }];
    return { id, results: { DE: { link: 'https://www.themoviedb.org/movie/' + id + '/watch?locale=DE', flatrate: fl, rent: shop, buy: shop } } };
  },
  movieCredits: id => ({ id, crew: [{ id: 701, name: 'Regie Test', job: 'Director' }, { id: 702, name: 'Kamera Test', job: 'Director of Photography' }], cast: [{ id: 801, name: 'Darstellerin A', character: 'Detektivin' }, { id: 802, name: 'Darsteller B', character: 'Partner' }] }),
  tv: id => ({ id, name: 'Serie ' + id, created_by: [{ id: 501, name: 'Idee Test' }], aggregate_credits: { cast: [{ id: 601, name: 'Sprecherin A', roles: [{ character: 'Hauptfigur' }] }], crew: [] } }),
  // „Mehr mit …“: zwei Werke, die es im Katalog gibt (Originaltitel + Jahr), und eines, das fehlt
  person: id => ({ id, cast: [{ title: 'Sieben', original_title: 'Se7en', release_date: '1995-09-22', character: 'Detektivin' }, { title: 'Die üblichen Verdächtigen', original_title: 'The Usual Suspects', release_date: '1995-07-19', character: 'Zeugin' }, { title: 'Gibt es nicht', original_title: 'Gibt es nicht', release_date: '2001-01-01', character: 'Gast' }], crew: [] }),
};
async function tmdbRoute(route) {
  const u = new URL(route.request().url()); const p = u.pathname.replace(/^\/3/, '');
  const json = b => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(b) });
  let m;
  if ((m = p.match(/^\/find\/(.+)$/))) return json(TMDB.find(m[1]));
  if (/^\/search\/(tv|movie)$/.test(p)) return json(TMDB.search(u.searchParams.get('query') || ''));
  if ((m = p.match(/^\/(movie|tv)\/(\d+)\/watch\/providers$/))) return json(TMDB.providers(+m[2]));
  if ((m = p.match(/^\/movie\/(\d+)\/credits$/))) return json(TMDB.movieCredits(+m[1]));
  if ((m = p.match(/^\/tv\/(\d+)$/))) return json(TMDB.tv(+m[1]));
  if ((m = p.match(/^\/person\/(\d+)\/combined_credits$/))) return json(TMDB.person(+m[1]));
  if (TMDB.extra) { const r = TMDB.extra(p, u); if (r) return json(r); }
  return route.fulfill({ status: 404, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"status_message":"nicht nachgebildet"}' });
}

async function route(page) {
  await page.route('**/*', r => {
    const u = r.request().url();
    if (u.startsWith('http://localhost') || u.startsWith('http://127.0.0.1')) return r.continue();
    if (/fonts\.(googleapis|gstatic)\.com/.test(u)) return r.continue();
    if (/api\.themoviedb\.org/.test(u)) return tmdbRoute(r);
    if (r.request().resourceType() === 'image' || IMG_HOSTS.test(u) && /\.(jpe?g|png|webp|gif|svg)/i.test(u))
      return r.fulfill({ status: 200, contentType: 'image/svg+xml', headers: { 'Access-Control-Allow-Origin': '*' }, body: poster(u) });
    return r.abort();
  });
}

// Testdaten: Verlauf mit Bewertungen beider Personen über die letzten Monate (läuft im Browser).
const MAKE_DATA = () => {
  const now = Date.now(), day = 864e5; let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const r1 = (a, b) => Math.round((a + rnd() * (b - a)) * 10) / 10;
  for (const k in SEC) {
    const st = ST[k];
    const used = new Set([].concat(...LISTS.map(l => st.lists[l].list)));
    const pool = Object.values(M).filter(m => m.sec === k && !m.old && m.cov && !used.has(m.id)).map(m => m.id).sort(() => rnd() - .5);
    let p = 0;
    const plan = { jos: 7, joh: 9, both: 11 };
    for (const u of ['jos', 'joh', 'both']) {
      for (let i = 0; i < plan[u]; i++) {
        const id = pool[p++]; const t = now - Math.floor(rnd() * 200) * day - 3600e3 * 3;
        st.lists[u].done.push({ id, t });
        const r = u === 'both' ? { jos: r1(4, 10), joh: r1(4, 10) } : { [u]: r1(3, 10) };
        if (i === 0) for (const x in r) r[x] = 10;
        st.w[id] = { r, rt: Object.fromEntries(Object.keys(r).map(x => [x, t])) };
      }
    }
    const L = st.lists.joh.list.filter(i => i !== '@');
    if (L[1]) st.lists.joh.seen[L[1]] = true;
    syncBoth(k);
    localStorage.setItem(SEC[k].key, JSON.stringify(st));
  }
  return true;
};

// Ruhe für Tests: keine Geschenk-Kiste, keine Level-/Abzeichen-Einblendungen, Cloud „ok“.
const QUIET = () => { try { chShow = () => {}; if (chOn) { chOn = false; chRender() } } catch (e) {} try { mvLevel = () => {}; mvBadge = () => {} } catch (e) {} try { cState = 'ok'; cLast = Date.now(); toastMsg = ''; render() } catch (e) {} };
const HIDE = '#chest,#mvcel{display:none!important}';

async function ctx(browser, vp, ls, opts) {
  const c = await browser.newContext(Object.assign({ viewport: vp, deviceScaleFactor: 1 }, opts || {}));
  if (ls) await c.addInitScript(o => { if (!sessionStorage.getItem('init')) { for (const k in o) localStorage.setItem(k, o[k]); sessionStorage.setItem('init', '1') } }, ls);
  const page = await c.newPage();
  const wt = page.waitForTimeout.bind(page); page.waitForTimeout = ms => wt(Math.round(ms * SLOW));
  await route(page);
  return { c, page };
}
const dumpLS = page => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));
// Einmal Testdaten erzeugen und den localStorage-Stand zurückgeben
async function makeData(browser) {
  const { c, page } = await ctx(browser, D_VP, { 'wl-user': 'joh', 'wl-code': 'x' });
  await page.goto(BASE); await page.waitForTimeout(1300); await page.evaluate(QUIET); await page.evaluate(MAKE_DATA);
  const d = await dumpLS(page); await c.close(); return d;
}
const M_VP = { width: 390, height: 844 }, D_VP = { width: 1440, height: 900 };
const today = () => new Date().toDateString();
// Regler an einer Stelle (0–1) antippen
async function rate(page, sel, frac) { const sl = await page.$(sel); const bb = await sl.boundingBox(); await page.mouse.click(bb.x + bb.width * frac, bb.y + bb.height / 2); await page.waitForTimeout(350); }
const txt = s => String(s || '').replace(/\s0123456789/g, '').replace(/\s+/g, ' ').trim();   // rollende Ziffern aus Texten entfernen

// Prüf-Sammler: t.ok(bedingung, text, info) – am Ende t.end() setzt den Exit-Code.
function suite(name) {
  const fails = [], errs = []; let n = 0;
  const t = {
    ok(cond, msg, info) { n++; if (cond) console.log('  ✓ ' + msg); else { fails.push(msg); console.log('  ✗ ' + msg + (info !== undefined ? '  → ' + (typeof info === 'string' ? info : JSON.stringify(info)) : '')); } return !!cond; },
    eq(a, b, msg) { return t.ok(JSON.stringify(a) === JSON.stringify(b), msg, { ist: a, soll: b }); },
    watch(page, tag) {
      page.on('pageerror', e => errs.push((tag ? tag + ': ' : '') + e.message));
      page.on('console', m => { const s = m.text(); if (m.type() === 'error' && !/Failed to load resource|net::ERR|Fetch API|Content Security Policy/.test(s)) errs.push((tag ? tag + ' ' : '') + 'Konsole: ' + s.slice(0, 200)); });
      return page;
    },
    async shot(page, nm) { try { await page.screenshot({ path: path.join(OUT, name.replace(/\W+/g, '-') + '-' + nm + '.png') }); } catch (e) {} },
    end() {
      t.ok(errs.length === 0, 'keine Seitenfehler', errs.slice(0, 5));
      console.log(fails.length ? `✗ ${name}: ${fails.length} von ${n} Prüfungen fehlgeschlagen` : `✓ ${name}: alle ${n} Prüfungen bestanden`);
      if (fails.length) process.exitCode = 1;
    },
  };
  console.log('▶ ' + name);
  return t;
}
// Test starten: fängt Abstürze ab, damit der Lauf rot wird statt hängen zu bleiben
function run(name, fn) {
  const { chromium } = require('playwright');
  const t = suite(name);
  (async () => {
    const b = await chromium.launch();
    try { await fn(b, t); } catch (e) { t.ok(false, 'Test lief ohne Absturz durch', e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : String(e)); }
    finally { await b.close().catch(() => {}); t.end(); }
  })();
}

module.exports = { BASE, OUT, SLOW, route, TMDB, MAKE_DATA, QUIET, HIDE, ctx, dumpLS, makeData, M_VP, D_VP, today, rate, txt, suite, run };
