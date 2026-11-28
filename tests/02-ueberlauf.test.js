// Kein seitliches Scrollen in allen Designs bei 340 und 390 px Breite
const L = require('./lib.js');
L.run('02 Kein Überlauf', async (b, t) => {
  for (const th of ['light', 'dark', 'purple', 'baby', 'deco', 'sea', 'paper']) for (const w of [340, 390]) {
    const { c, page } = await L.ctx(b, { width: w, height: 760 }, { 'wl-user': 'joh', 'wl-code': 'x', 'anime-theme-v1': th, 'wl-th-intro': L.today() + th, 'wl-howto-hide': '1' });
    t.watch(page, th + ' ' + w);
    await page.goto(L.BASE); await page.waitForTimeout(1400);
    await page.evaluate(() => { chShow = () => {}; if (chOn) { chOn = false; chRender() } cState = 'ok'; for (const k of ['anime', 'film', 'serie']) { const l = ST[k].lists.joh.list; l[8] = '@'; l[9] = '@' } topTab = 'serie'; S = ST.serie; view = 'joh'; render() });
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => { const W = document.documentElement.clientWidth; const bad = [...document.querySelectorAll('#main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width && b.right > W + 1 && getComputedStyle(e).position !== 'fixed' }).slice(0, 3).map(e => e.className + ':' + Math.round(e.getBoundingClientRect().right)); return { sw: document.documentElement.scrollWidth, W, bad } });
    t.ok(r.sw <= r.W, `${th} ${w} px: kein seitliches Scrollen`, r);
    await c.close();
  }
});
