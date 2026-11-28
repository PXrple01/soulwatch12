// Verlauf-Menü, Reaktionen, Einladung über zwei Geräte, Kalender-Datei, Demnächst, Blatt wegziehen, Scrim, Haptik-Schalter
const L = require('./lib.js');
const Q = v => { chShow = () => {}; if (chOn) { chOn = false; chRender() } cState = 'ok'; mvLevel = () => {}; mvBadge = () => {}; toastMsg = ''; topTab = 'film'; S = ST.film; view = v; render() };
const banner = p => p.evaluate(() => document.getElementById('mvtn').textContent.replace(/\s+/g, ' ').trim());
L.run('07 Verlauf, Reaktionen, Einladung', async (b, t) => {
  const dump = await L.makeData(b);
  // Gerät A (Johann)
  const A = await L.ctx(b, L.M_VP, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1', 'wl-ach-seen-joh': '[]' })); t.watch(A.page, 'A');
  const p = A.page; await p.goto(L.BASE); await p.waitForTimeout(1500); await p.evaluate(Q, 'joh'); await p.addStyleTag({ content: L.HIDE });
  await p.evaluate(() => { tab = 'hist'; render() }); await p.waitForTimeout(400);
  const both = await p.evaluate(() => { const d = C().done.find(d => rt(d.id, 'jos') && rt(d.id, 'joh')); return d && d.id });
  t.ok(!!both, 'Verlauf hat einen Titel mit beiden Bewertungen');
  await p.click(`#hist .mvdots[data-mvhm="${both}"]`); await p.waitForTimeout(500);
  const menu = await p.evaluate(() => [...document.querySelectorAll('#modal .mvml button')].map(x => x.textContent.trim()).join(' | '));
  t.ok(/Bewertung ändern/.test(menu) && /Zurück in die Watchlist/.test(menu), '⋯-Menü mit „Bewertung ändern“ und „Zurück in die Watchlist“', menu);
  t.ok(await p.evaluate(() => document.querySelectorAll('#modal .mvreb').length) >= 4, 'Reaktionen im Menü');
  await p.click('#modal .mvreb >> nth=0'); await p.waitForTimeout(600);
  t.ok(await p.evaluate(id => !!xData().re['film:' + id + ':jos'] && !!mvHM, both), 'Reaktion gespeichert, Menü bleibt offen');
  await p.click('#modal .mvreb >> nth=0'); await p.waitForTimeout(400);
  t.ok(await p.evaluate(id => !xData().re['film:' + id + ':jos'], both), 'zweiter Tipp nimmt die Reaktion zurück');
  await p.click('#modal .mvreb >> nth=4'); await p.waitForTimeout(400);
  await p.click('#modal .mvml [data-rate1]'); await p.waitForTimeout(600);
  t.ok(await p.evaluate(() => !!rateId && !mvHM), '„Bewertung ändern“ öffnet das Blatt');
  await p.evaluate(() => { rateId = null; render() });
  await p.click(`#hist .mvdots[data-mvhm="${both}"]`); await p.waitForTimeout(300); await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  t.ok(await p.evaluate(() => !mvHM && document.getElementById('modal').hidden), 'Escape schließt das Menü');
  await p.click(`#hist [data-rate1="${both}"].mvhc`); await p.waitForTimeout(500);
  t.ok(await p.evaluate(() => !!rateId), 'Bewertungs-Chip öffnet das Blatt');
  await p.evaluate(() => { rateId = null; tab = 'wl'; render() });
  // Einladung
  await p.click('#fabtn'); await p.waitForTimeout(800); await p.click('[data-fastep="2"]'); await p.waitForTimeout(1200);
  await p.evaluate(() => document.querySelector('#xo .mvcand').click()); await p.click('[data-fapick]'); await p.waitForTimeout(2300);
  await p.click('[data-fainv]'); await p.waitForTimeout(1100);
  const chips = await p.evaluate(() => [...document.querySelectorAll('#xo [data-fainvt]')].map(x => x.textContent));
  t.ok(chips.length >= 3, 'Uhrzeiten zur Auswahl', chips.join(' | '));
  await p.evaluate(() => { const c = [...document.querySelectorAll('#xo [data-fainvt]')]; c[c.length - 1].click() }); await p.waitForTimeout(700);
  await p.click('[data-fainvgo]'); await p.waitForTimeout(1200);
  const inv = await p.evaluate(() => { const v = mvInv(); return v && { by: v.by, tonight: !!mvTonight() } });
  t.ok(inv && inv.by === 'joh' && inv.tonight, 'Einladung gesendet und „Heute Abend“ gesetzt', inv);
  await p.evaluate(() => { toastMsg = ''; scrollTo(0, 0); render() }); await p.waitForTimeout(500);
  t.ok(/wartet auf Josefine/.test(await banner(p)), 'A: Banner „wartet auf Josefine“', await banner(p));
  const storeA = await L.dumpLS(p); await A.c.close();
  // Gerät B (Josefine)
  const B = await L.ctx(b, L.M_VP, Object.assign({}, storeA, { 'wl-user': 'jos', 'anime-theme-v1': 'baby', 'wl-th-intro': L.today() + 'baby', 'wl-howto-hide': '1', 'wl-ach-seen-jos': '[]' })); t.watch(B.page, 'B');
  const q = B.page; await q.goto(L.BASE); await q.waitForTimeout(1500); await q.evaluate(Q, 'jos'); await q.addStyleTag({ content: L.HIDE }); await q.waitForTimeout(500);
  t.ok(/lädt dich ein/.test(await banner(q)), 'B: Banner zeigt die Einladung', await banner(q));
  t.ok(await q.evaluate(() => newsList().some(n => n.inv)), 'B: Glocke meldet die Einladung');
  await q.click('#mvtn [data-mvinv="1"]'); await q.waitForTimeout(900);
  t.ok(await q.evaluate(() => !!(mvInv().ans && mvInv().ans.ok)), 'B: Zusage gespeichert');
  t.ok(/du bist dabei/.test(await banner(q)), 'B: Banner „du bist dabei“', await banner(q));
  await q.click('#bell'); await q.waitForTimeout(800);
  const rb = await q.$('#xo .mvreb'); if (rb) { await rb.click(); await q.waitForTimeout(500) }
  t.ok(await q.evaluate(() => Object.values(xData().re || {}).some(r => r.by === 'jos')), 'B: Reaktion aus der Glocke');
  await q.evaluate(() => xoClose());
  const storeB = await L.dumpLS(q); await B.c.close();
  // Gerät A wieder
  const A2 = await L.ctx(b, L.M_VP, Object.assign({}, storeB, { 'wl-user': 'joh', 'anime-theme-v1': 'light' })); t.watch(A2.page, 'A2');
  const r = A2.page; await r.goto(L.BASE); await r.waitForTimeout(1500); await r.evaluate(Q, 'joh'); await r.addStyleTag({ content: L.HIDE }); await r.waitForTimeout(400);
  t.ok(/Josefine ist dabei/.test(await banner(r)), 'A: Banner „Josefine ist dabei“', await banner(r));
  const [dl] = await Promise.all([r.waitForEvent('download', { timeout: 5000 }).catch(() => null), r.click('#mvtn [data-mvics="inv"]')]);
  let ics = ''; if (dl) ics = require('fs').readFileSync(await dl.path(), 'utf8');
  t.ok(dl && /\.ics$/.test(dl.suggestedFilename()) && /BEGIN:VEVENT/.test(ics) && /TRIGGER:-PT30M/.test(ics), 'Kalender-Datei mit Termin und Erinnerung', dl ? dl.suggestedFilename() : 'kein Download');
  await r.evaluate(() => act({ xo: 'soon' })); await r.waitForTimeout(800);
  t.ok(await r.evaluate(() => document.querySelectorAll('#xo .mvsr').length) >= 1, '„Demnächst“ zeigt den Termin');
  const cdp = await r.context().newCDPSession(r);
  const tp = async (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  const hb = await (await r.$('#xo .mvwh')).boundingBox();
  await tp('touchStart', 195, hb.y + 20); for (let i = 1; i <= 10; i++) { await tp('touchMove', 195, hb.y + 20 + i * 26); await r.waitForTimeout(16) } await tp('touchEnd'); await r.waitForTimeout(800);
  t.ok(await r.evaluate(() => !xo && document.getElementById('xo').hidden), 'Blatt lässt sich nach unten wegziehen');
  await r.evaluate(() => brwOpen()); await r.waitForTimeout(700); await r.mouse.click(195, 4); await r.waitForTimeout(500);
  t.ok(await r.evaluate(() => !brw), 'Tipp neben das Blatt schließt Stöbern');
  await A2.c.close();
});
