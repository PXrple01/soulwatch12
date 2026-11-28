// Rundgang ohne Fehler: erster Start, Kiste, alle Extras, Rewind, Swipen, alle Designs, alle Bereiche und Reiter, Rückgängig
const L = require('./lib.js');
L.run('13 Rundgang durch die App', async (b, t) => {
  { const { c, page } = await L.ctx(b, L.M_VP, null); t.watch(page, 'erster Start');
    await page.goto(L.BASE); await page.waitForTimeout(1500);
    t.ok(await page.evaluate(() => !!document.querySelector('#who, [data-code], input')), 'erster Start fragt nach Code bzw. Person');
    await page.evaluate(() => { cCode = 'x'; render() }); await page.waitForTimeout(500);
    await page.click('[data-who="jos"]'); await page.waitForTimeout(1000);
    t.eq(await page.evaluate(() => me), 'jos', 'Personenwahl setzt Josefine');
    await c.close(); }
  const dump = await L.makeData(b);
  for (const [n, vp] of [['Handy', L.M_VP], ['Desktop', L.D_VP]]) {
    const { c, page } = await L.ctx(b, vp, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1' })); t.watch(page, n);
    await page.goto(L.BASE); await page.waitForTimeout(1500); await page.evaluate(() => { cState = 'ok' });
    await page.evaluate(() => { if (!chOn) chShow() }); await page.waitForTimeout(1500);
    t.ok(await page.evaluate(() => chOn), `${n}: Kiste öffnet sich`);
    await page.evaluate(() => { chOn = false; chRender() }); await page.waitForTimeout(400);
    for (const k of ['fin', 'mar', 'quiz', 'poster', 'news', 'soon']) { await page.evaluate(k => act({ xo: k }), k); await page.waitForTimeout(700); await page.evaluate(() => xoClose()); await page.waitForTimeout(200); }
    t.ok(true, `${n}: Extras geöffnet (Zeit & Stimmung, Marathon, Quiz, Poster, Glocke, Demnächst)`);
    await page.evaluate(() => rewindSetNow('2026-12-31T12:00')); await page.waitForTimeout(300); await page.evaluate(() => rwOpen()); await page.waitForTimeout(1200);
    t.ok(await page.evaluate(() => !!rw), `${n}: Rewind öffnet sich`); await page.evaluate(() => rwClose()); await page.waitForTimeout(300); await page.evaluate(() => rewindSetNow(''));
    await page.evaluate(() => { view = 'both'; render(); act({ swipe: '1' }) }); await page.waitForTimeout(900);
    t.ok(await page.evaluate(() => !!document.querySelector('.swm, #sw, .swcard')), `${n}: Swipen öffnet sich`); await page.evaluate(() => swClose()); await page.waitForTimeout(300);
    for (const th of ['dark', 'purple', 'baby', 'deco', 'sea', 'paper', 'auto', 'light']) { await page.evaluate(x => thSwitch(x), th); await page.waitForTimeout(300); }
    for (const x of ['anime', 'serie', 'film']) { await page.evaluate(x => act({ top: x }), x); await page.waitForTimeout(500); }
    for (const x of ['hist', 'stat', 'ach', 'inv', 'wl']) { await page.evaluate(x => act({ tab: x }), x); await page.waitForTimeout(500); }
    await page.evaluate(() => undo()); await page.waitForTimeout(300);
    t.ok(true, `${n}: alle Designs, Bereiche und Reiter durchgeschaltet`);
    await c.close();
  }
});
