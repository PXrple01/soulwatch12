// Grundtest: Startseite mit Testdaten, Haken → Bewerten → Abschluss
const L = require('./lib.js');
L.run('01 Start und Bewerten', async (b, t) => {
  const dump = await L.makeData(b);
  const { c, page } = await L.ctx(b, L.M_VP, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1' }));
  t.watch(page);
  await page.goto(L.BASE); await page.waitForTimeout(1800); await page.evaluate(L.QUIET); await page.addStyleTag({ content: L.HIDE });
  await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'joh'; render() }); await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({ katalog: typeof FILMS !== 'undefined' && Object.keys(M).length, cards: document.querySelectorAll('#grid .card[data-k]:not(.ghost)').length, ck: document.querySelectorAll('#grid .ck').length, cnt: document.getElementById('cnt').textContent }));
  t.ok(info.katalog > 5000, 'Katalog geladen', info.katalog);
  t.eq(info.cards, 10, '10 Karten in Johanns Liste');
  t.eq(info.ck, 10, 'jede Karte hat einen Haken');
  t.ok(/^10\b/.test(L.txt(info.cnt)), 'Zähler zeigt 10', info.cnt);
  const first = await page.evaluate(() => document.querySelector('#grid .card[data-k]:not(.ghost)').dataset.k);
  const before = await page.evaluate(() => C().done.length);
  await page.click(`#grid .card[data-k="${first}"] .ck`); await page.waitForTimeout(1200);
  t.ok(await page.evaluate(() => !!rateId), 'Haken öffnet das Bewertungs-Blatt');
  const sl = await page.$('#modal .rate[data-rate="rs"]'); const bb = await sl.boundingBox();
  await page.mouse.move(bb.x + bb.width * .86, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * .62, bb.y + bb.height / 2, { steps: 6 }); await page.mouse.move(bb.x + bb.width * .91, bb.y + bb.height / 2, { steps: 8 }); await page.mouse.up();
  await page.waitForTimeout(500); await page.click('#modal [data-rsave]'); await page.waitForTimeout(1900);
  const after = await page.evaluate(id => ({ inList: C().list.includes(id), r: (S.w[id] || {}).r, done: C().done.length, modal: !document.getElementById('modal').hidden }), first);
  t.ok(!after.inList, 'Titel ist aus der Liste raus', after);
  t.ok(after.r && after.r.joh > 0, 'Bewertung gespeichert', after.r);
  t.eq(after.done, before + 1, 'Verlauf um einen Eintrag länger');
  t.ok(!after.modal, 'Blatt ist zu');
  await c.close();
});
