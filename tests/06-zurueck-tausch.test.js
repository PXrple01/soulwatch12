// „Zurück in die Watchlist“ bei voller Liste: Tausch, Rückgängig, freier Platz
const L = require('./lib.js');
L.run('06 Zurück in die Watchlist mit Tausch', async (b, t) => {
  const { c, page } = await L.ctx(b, L.M_VP, { 'wl-user': 'joh', 'wl-code': 'x', 'anime-theme-v1': 'light', 'wl-howto-hide': '1' }); t.watch(page);
  await page.goto(L.BASE); await page.waitForTimeout(1500); await page.evaluate(L.MAKE_DATA); await page.evaluate(L.QUIET);
  await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'joh'; render() }); await page.addStyleTag({ content: L.HIDE });
  const did = await page.evaluate(() => C().done[0].id);
  await page.evaluate(id => act({ info: id }), did); await page.waitForTimeout(700);
  await page.click('#modal [data-back]'); await page.waitForTimeout(800);
  const s1 = await page.evaluate(() => ({ swap: swapId, titel: (document.querySelector('#modal h3') || {}).textContent, n: C().list.length }));
  t.ok(s1.swap && /voll/.test(s1.titel || ''), 'volle Liste fragt, welcher Titel weichen soll', s1);
  const out = await page.evaluate(() => C().list[3]);
  await page.click(`#modal [data-swap="${out}"]`); await page.waitForTimeout(900);
  const s2 = await page.evaluate(([id, out]) => ({ inList: C().list.includes(id), inDone: C().done.some(d => d.id === id), outGone: !C().list.includes(out), len: C().list.length, modal: !document.getElementById('modal').hidden }), [did, out]);
  t.ok(s2.inList && !s2.inDone && s2.outGone && s2.len === 10 && !s2.modal, 'Tausch: Titel zurück, anderer raus, Liste bleibt bei 10', s2);
  await page.evaluate(() => undo()); await page.waitForTimeout(500);
  const s3 = await page.evaluate(([id, out]) => ({ inList: C().list.includes(id), inDone: C().done.some(d => d.id === id), outBack: C().list.includes(out) }), [did, out]);
  t.ok(!s3.inList && s3.inDone && s3.outBack, 'Rückgängig stellt alles wieder her', s3);
  await page.evaluate(() => { const c = C(); c.list[9] = '@'; save(); render() });
  const d2 = await page.evaluate(() => C().done[1].id);
  await page.evaluate(id => act({ info: id }), d2); await page.waitForTimeout(600); await page.click('#modal [data-back]'); await page.waitForTimeout(800);
  const s4 = await page.evaluate(id => ({ inList: C().list.includes(id), inDone: C().done.some(d => d.id === id), modal: !document.getElementById('modal').hidden }), d2);
  t.ok(s4.inList && !s4.inDone && !s4.modal, 'mit freiem Platz direkt zurück', s4);
  await c.close();
});
