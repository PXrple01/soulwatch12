// Kontrast (WCAG AA) der neueren Texte und kein Überlauf bei 340 px in allen Designs:
// Banner, Spiel-Ecke, Glocke, Verlauf-Menü, Karten mit „Passt“, Info mit „Wo läuft's?“, Tipp-Ergebnis, Demnächst, Stöbern
const L = require('./lib.js');
const CHECK = (sel) => {
  const parse = s => { const m = s.match(/[\d.]+/g); if (!m) return [0, 0, 0, 0]; const n = m.map(Number); if (/^color\(srgb/.test(s)) { const r = n.slice(0, 3).map(v => v * 255); return n.length > 3 ? [...r, n[3]] : r } return n };
  const lum = ([r, g, b]) => { const f = v => (v /= 255) <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b) };
  const bgOf = e => { const st = []; for (let x = e; x; x = x.parentElement) { const c = parse(getComputedStyle(x).backgroundColor); if ((c[3] ?? 1) > 0 && !(c.length === 4 && c[3] === 0)) st.push(c); if (c.length === 3 || c[3] === 1) break } let base = [255, 255, 255]; if (!st.length) return base; const top = st.pop(); base = top.slice(0, 3); for (const c of st.reverse()) { const a = c[3] ?? 1; base = base.map((v, i) => v * (1 - a) + c[i] * a) } return base };
  const grad = e => { for (let x = e; x; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.backgroundImage !== 'none' && !/url\(/.test(cs.backgroundImage) && !['BODY', 'HTML'].includes(x.tagName) && !['xo', 'brw', 'sheet'].includes(x.id)) return true; const c = parse(cs.backgroundColor); if (c.length === 3 || c[3] === 1) return false } return false };
  const out = []; for (const k in sel) { const e = [...document.querySelectorAll(sel[k])].find(e => e.getClientRects().length); if (!e) continue; const cs = getComputedStyle(e); const fg = parse(cs.color); const bg = bgOf(e); const a = fg[3] ?? 1; const f2 = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a)); const L1 = lum(f2), L2 = lum(bg); const cr = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); const px = parseFloat(cs.fontSize), big = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700); out.push({ k, cr: +cr.toFixed(2), px, ok: cr >= (big ? 3 : 4.5) || grad(e) }) } return out };
const OV = () => { const o = []; document.querySelectorAll('#sheet *, #xo *, #brw *, #modal *, #mvtn *, #hist *').forEach(e => { const r = e.getBoundingClientRect(); if (!r.width || !e.getClientRects().length) return; if (r.right > innerWidth + 1 || r.left < -1) o.push((typeof e.className === 'string' && e.className) || e.tagName) }); return [...new Set(o)].slice(0, 5) };
L.run('09 Kontrast und Überlauf', async (b, t) => {
  let dump; { const { c, page } = await L.ctx(b, L.D_VP, { 'wl-user': 'joh', 'wl-code': 'x' }); await page.goto(L.BASE); await page.waitForTimeout(1300); await page.evaluate(L.QUIET); await page.evaluate(L.MAKE_DATA);
    await page.evaluate(() => { const id = Object.keys(seaRel())[0]; if (id) { NEXT[id] = { status: 'soon', date: dPlus(3), label: 'Staffel 2', name: 'Testfolge' }; lsS('anime-seasons-next-v1', NEXT) }
      const x = xData(); x.re = {}; const d = ST.film.lists.joh.done.find(d => (ST.film.w[d.id] || {}).r && ST.film.w[d.id].r.joh && ST.film.w[d.id].r.jos); if (d) x.re['film:' + d.id + ':joh'] = { e: '❤️', by: 'jos', t: Date.now() - 6e5 };
      const f = ST.film.lists.joh.list.find(i => i !== '@'); x.tonight = { id: f, sec: 'film', t: Date.now(), by: 'jos' }; x.inv = { id: f, sec: 'film', at: Date.now() + 3 * 3600e3, by: 'jos', t: Date.now(), ans: null }; xSave() });
    dump = await L.dumpLS(page); await c.close(); }
  for (const th of ['light', 'dark', 'purple', 'baby', 'paper', 'deco', 'sea']) {
    const { c, page } = await L.ctx(b, { width: 340, height: 720 }, Object.assign({}, dump, { 'anime-theme-v1': th, 'wl-th-intro': L.today() + th, 'wl-howto-hide': '1', 'wl-ach-seen-joh': '[]' }));
    t.watch(page, th);
    await page.goto(L.BASE); await page.waitForTimeout(1500);
    await page.evaluate(() => { chShow = () => {}; if (chOn) { chOn = false; chRender() } cState = 'ok'; mvLevel = () => {}; mvBadge = () => {}; toastMsg = ''; topTab = 'film'; S = ST.film; view = 'joh'; render() });
    await page.addStyleTag({ content: '#chest,#mvcel{display:none!important}' });
    const R = [], ov = {};
    await page.waitForTimeout(500); ov.banner = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Einladung Zeile': '#mvtn .mvtnt .gn', 'Einladung Kicker': '#mvtn .mvtnt small' }));
    await page.evaluate(() => { sheet = true; render() }); await page.waitForTimeout(700); ov.hub = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Spiel-Ecke Chip': '.mvgk small', 'Spiel-Ecke Titel': '.mvgk b' })); await page.evaluate(() => { sheet = false; render() });
    await page.evaluate(() => act({ xo: 'news' })); await page.waitForTimeout(800); ov.bell = await page.evaluate(OV); await page.evaluate(() => xoClose());
    await page.evaluate(() => { tab = 'hist'; render() }); await page.waitForTimeout(600); ov.hist = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Verlauf-Chip Name': '.mvhc .rn', 'Verlauf-Chip Zahl': '.mvhc b' }));
    await page.evaluate(() => { const d = C().done.find(d => rt(d.id, 'jos') && rt(d.id, 'joh')); mvHM = d.id; render() }); await page.waitForTimeout(600); ov.menu = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Menü Eintrag': '.mvml button', 'Menü Reagieren': '.mvrxl', 'Menü Löschen': '.mvml .warn' }));
    await page.evaluate(() => { mvHM = null; tab = 'wl'; render() });
    await page.evaluate(() => { view = 'both'; render() }); await page.waitForTimeout(1800); ov.cards = await page.evaluate(OV);
    R.push(...await page.evaluate(CHECK, { 'Passt-Pille': '#grid .cvw>.mvmt' }));
    await page.evaluate(() => act({ info: 'tt0114814' })); await page.waitForFunction(() => { const w = document.querySelector('#modal .mvwp'); return w && !w.hasAttribute('aria-busy') }, null, { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(500);
    ov.info = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Passt-Zeile': '#modal .mvmti', 'Anbieter-Label': '#modal .mvwpl', 'Anbieter-Chip': '#modal .mvwpb', 'JustWatch-Hinweis': '#modal .mvwpf' }));
    await page.evaluate(() => { openId = null; render() });
    await page.evaluate(() => { const id = C().list.find(x => x !== '@'); mvBlindOpen(id, 'film'); blind.step = 'result'; blind.v = { jos: 7.4, joh: 8.1 }; blind.g = { jos: 8, joh: 6.9 }; render() }); await page.waitForTimeout(700);
    ov.result = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Tipp-Zeile': '#modal .mvgu li', 'Kennt-Zeile': '#modal .mvkn' }));
    await page.evaluate(() => { blind = null; view = 'joh'; render() });
    await page.evaluate(() => act({ xo: 'soon' })); await page.waitForTimeout(800); ov.soon = await page.evaluate(OV); R.push(...await page.evaluate(CHECK, { 'Demnächst Zeile': '.mvsrt .gn', 'Demnächst Tag': '.mvsoonh' })); await page.evaluate(() => xoClose());
    await page.evaluate(() => brwOpen()); await page.waitForTimeout(800); ov.brw = await page.evaluate(OV); await page.evaluate(() => brwClose());
    const bad = R.filter(x => !x.ok), ovb = Object.entries(ov).filter(([k, v]) => v.length);
    t.ok(R.length >= 15 && !bad.length, `${th}: Kontrast ≥ AA bei ${R.length} Texten`, bad.map(x => `${x.k} ${x.cr}:1@${x.px}px`).join(' · '));
    t.ok(!ovb.length, `${th}: kein Überlauf bei 340 px`, ovb.map(([k, v]) => k + ':' + v.join(',')).join(' '));
    await c.close();
  }
});
