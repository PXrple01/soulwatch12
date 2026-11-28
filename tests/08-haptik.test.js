// Haptik: Vibration (Android/Desktop) bzw. Schalter-Trick (iPhone) bei Haken, Würfeln, Nehmen; Schalter im Menü
const L = require('./lib.js');
const IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
L.run('08 Haptik', async (b, t) => {
  for (const ios of [false, true]) {
    const name = ios ? 'iPhone' : 'Android/Desktop';
    const { c, page } = await L.ctx(b, L.M_VP, { 'wl-user': 'joh', 'wl-code': 'x', 'anime-theme-v1': 'light', 'wl-howto-hide': '1' }, ios ? { userAgent: IOS } : null);
    await c.addInitScript(() => { window.__vib = 0; window.__sw = 0; try { navigator.vibrate = () => { window.__vib++; return true } } catch (e) {}
      const oc = HTMLElement.prototype.click; HTMLElement.prototype.click = function () { if (this.tagName === 'LABEL' && this.querySelector && this.querySelector('input[switch]')) window.__sw++; return oc.apply(this, arguments) } });
    t.watch(page, name);
    await page.goto(L.BASE); await page.waitForTimeout(1500); await page.evaluate(L.QUIET);
    await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'joh'; render() }); await page.addStyleTag({ content: L.HIDE });
    await page.click('#grid .card .ck'); await page.waitForTimeout(900); await page.evaluate(() => { rateId = null; render() });
    await page.click('#fabtn'); await page.waitForTimeout(800); await page.click('[data-fastep="2"]'); await page.waitForTimeout(1200);
    await page.click('[data-fadice]'); await page.waitForTimeout(4200); await page.click('[data-fapick]'); await page.waitForTimeout(1500); await page.evaluate(() => xoClose());
    const n = await page.evaluate(() => ({ vib: window.__vib, sw: window.__sw }));
    if (ios) t.ok(n.vib === 0 && n.sw >= 3, `${name}: drei Ticks über den Schalter-Trick`, n);
    else t.ok(n.vib >= 3 && n.sw === 0, `${name}: drei Ticks über Vibration`, n);
    await page.evaluate(() => { menu = true; render() }); await page.waitForTimeout(300);
    await page.click('[data-mvhap]'); await page.waitForTimeout(200);
    t.eq(await page.evaluate(() => localStorage.getItem('wl-hap')), '0', `${name}: Schalter schaltet Haptik aus`);
    await page.click('[data-mvhap]'); await page.waitForTimeout(200);
    t.ok(await page.evaluate(() => menu && !document.getElementById('menu').hidden), `${name}: Menü bleibt beim Umschalten offen`);
    await c.close();
  }
});
