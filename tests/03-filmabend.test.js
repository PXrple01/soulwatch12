// Zurück in die Watchlist, Gesehen → Bewerten, Filmabend bis „Heute Abend“, „Auf drei!“ mit einem Handy
const L = require('./lib.js');
L.run('03 Filmabend und Auf drei (ein Handy)', async (b, t) => {
  const dump = await L.makeData(b);
  const { c, page } = await L.ctx(b, L.M_VP, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1', 'wl-ach-seen-joh': '[]', 'wl-ach-seen-jos': '[]' }));
  t.watch(page);
  await page.goto(L.BASE); await page.waitForTimeout(1600); await page.evaluate(L.QUIET);
  await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'joh'; render() }); await page.addStyleTag({ content: L.HIDE }); await page.waitForTimeout(500);
  // Zurück in die Watchlist (mit freiem Platz)
  const did = await page.evaluate(() => C().done[0].id);
  await page.evaluate(id => { if (C().list.filter(x => x !== '@').length >= 10) { C().list[9] = '@'; save() } act({ info: id }) }, did); await page.waitForTimeout(800);
  await page.click('#modal [data-back]'); await page.waitForTimeout(900);
  const z = await page.evaluate(id => ({ inList: C().list.includes(id), inDone: C().done.some(d => d.id === id), modal: !document.getElementById('modal').hidden }), did);
  t.ok(z.inList && !z.inDone && !z.modal, '„Zurück in die Watchlist“ holt den Titel zurück', z);
  // Info eines Listentitels → Gesehen – jetzt bewerten
  const lid = await page.evaluate(() => C().list.find(x => x !== '@'));
  await page.evaluate(id => act({ info: id }), lid); await page.waitForTimeout(700);
  await page.click('#modal [data-ck]'); await page.waitForTimeout(1200);
  t.ok(await page.evaluate(id => rateId === id && !openId, lid), '„Gesehen – jetzt bewerten“ öffnet das Bewertungs-Blatt');
  await page.evaluate(() => { rateId = null; render() });
  // Filmabend
  await page.evaluate(() => scrollTo(0, 0)); await page.click('#fabtn'); await page.waitForTimeout(800);
  await page.click('[data-famood="spann"]'); await page.waitForTimeout(300);
  await page.click('[data-fastep="2"]'); await page.waitForTimeout(1100);
  const n = await page.evaluate(() => xo && xo.cands && xo.cands.length);
  t.ok(n >= 2, 'Filmabend schlägt Kandidaten vor', n);
  await page.click('[data-fadice]'); await page.waitForTimeout(3500);
  await page.click('[data-fapick]'); await page.waitForTimeout(2000);
  await page.click('[data-fastart]'); await page.waitForTimeout(900);
  const tn = await page.evaluate(() => { const n = mvTonight(); return n && { id: n.id, name: M[n.id].name } });
  t.ok(!!tn, '„Heute Abend“ ist gesetzt', tn);
  // Auf drei! (ein Handy)
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  await page.click('[data-mvhow]'); await page.waitForTimeout(700);
  await page.click('[data-bl="one"]'); await page.waitForTimeout(500);
  await L.rate(page, '#modal .rate[data-rate^="bl:"]', .82); await page.click('[data-bl="save"]'); await page.waitForTimeout(350); await page.click('[data-bl="gskip"]'); await page.waitForTimeout(500);
  await page.click('[data-bl="iam"]'); await page.waitForTimeout(500); await L.rate(page, '#modal .rate[data-rate^="bl:"]', .9); await page.click('[data-bl="save"]'); await page.waitForTimeout(350); await page.click('[data-bl="gskip"]'); await page.waitForTimeout(600);
  await page.click('[data-bl="go"]'); await page.waitForTimeout(4000);
  const vals = await page.evaluate(() => blind && blind.v);
  t.ok(vals && vals.jos > 0 && vals.joh > 0, 'beide Zahlen aufgedeckt', vals);
  await page.click('[data-bl="done"]'); await page.waitForTimeout(1200);
  const e = await page.evaluate(id => ({ both: ST[M[id].sec].lists.both.done.some(d => d.id === id), r: (ST[M[id].sec].w[id] || {}).r, tonight: !!mvTonight() }), tn.id);
  t.ok(e.both && e.r && e.r.jos && e.r.joh && !e.tonight, 'gemeinsam abgeschlossen mit beiden Bewertungen, „Heute Abend“ erledigt', e);
  await c.close();
});
