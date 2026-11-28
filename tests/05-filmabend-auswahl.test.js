// Filmabend-Auswahl: Quelle, Knopf mit Titel, Abwählen, Würfeln, Fokus; „Auf drei!“ mit × nach dem Aufdecken speichert trotzdem
const L = require('./lib.js');
L.run('05 Filmabend-Auswahl', async (b, t) => {
  const dump = await L.makeData(b);
  const { c, page } = await L.ctx(b, L.M_VP, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1', 'wl-ach-seen-joh': '[]' })); t.watch(page);
  await page.goto(L.BASE); await page.waitForTimeout(1500); await page.evaluate(L.QUIET);
  await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'joh'; render() }); await page.addStyleTag({ content: L.HIDE });
  await page.click('#fabtn'); await page.waitForTimeout(800);
  const src = await page.evaluate(() => [...document.querySelectorAll('[data-fasrc]')].map(x => x.textContent).join(' | '));
  t.ok(/Listen/.test(src) && /allen/.test(src), 'Quelle wählbar (eure Listen / alle)', src);
  await page.click('[data-fastep="2"]'); await page.waitForTimeout(1200);
  const lbl = () => page.evaluate(() => { const p = document.querySelector('[data-fapick]'); const n = p.querySelector('.mvpkn'); return { on: !p.disabled, t: n ? (n.dataset.rt || n.textContent) : p.textContent } });
  t.ok(await page.evaluate(() => document.activeElement.tagName === 'H3'), 'Fokus springt auf die Überschrift');
  t.ok(!(await lbl()).on, 'Knopf ist aus, solange nichts gewählt ist');
  const cand = i => page.locator('#xo .mvcand').nth(i);   // jedes Mal neu suchen: die Seite kann zwischendurch neu zeichnen
  await cand(0).click(); await page.waitForTimeout(700); const k1 = await lbl();
  t.ok(k1.on && k1.t.length > 1, 'Knopf nennt den gewählten Titel', k1);
  await cand(1).click(); await page.waitForTimeout(800); const k2 = await lbl();
  t.ok(k2.on && k2.t !== k1.t, 'zweite Wahl ersetzt den Titel', k2);
  await cand(1).click(); await page.waitForTimeout(500);
  t.ok(!(await lbl()).on, 'Abwählen schaltet den Knopf aus');
  await page.click('[data-fadice]');
  const rolled = await page.waitForFunction(() => { const p = document.querySelector('[data-fapick]'); return p && !p.disabled }, null, { timeout: 10000 }).then(() => true, () => false);
  t.ok(rolled, 'Würfeln wählt einen Titel'); await page.waitForTimeout(600);
  await page.click('[data-fapick]'); await page.waitForTimeout(800);
  await page.click('[data-fastart]'); await page.waitForTimeout(900);
  const tn = await page.evaluate(() => mvTonight().id);
  await page.evaluate(() => { toastMsg = ''; scrollTo(0, 0); render() }); await page.click('[data-mvhow]'); await page.waitForTimeout(700); await page.click('[data-bl="one"]'); await page.waitForTimeout(400);
  await L.rate(page, '#modal .rate[data-rate^="bl:"]', .6); await page.click('[data-bl="save"]'); await page.waitForTimeout(350); await page.click('[data-bl="gskip"]'); await page.waitForTimeout(400);
  await page.click('[data-bl="iam"]'); await page.waitForTimeout(400); await L.rate(page, '#modal .rate[data-rate^="bl:"]', .75); await page.click('[data-bl="save"]'); await page.waitForTimeout(350); await page.click('[data-bl="gskip"]'); await page.waitForTimeout(500);
  await page.click('[data-bl="go"]'); await page.waitForTimeout(3800);
  await page.click('#modal .mvblind .x'); await page.waitForTimeout(900);
  const r = await page.evaluate(id => ({ done: ST.film.lists.both.done.some(d => d.id === id), r: ST.film.w[id].r, blind: !!blind, modal: !document.getElementById('modal').hidden }), tn);
  t.ok(r.done && r.r.jos && r.r.joh && !r.blind && !r.modal, '× nach dem Aufdecken speichert beide Zahlen', r);
  await c.close();
});
