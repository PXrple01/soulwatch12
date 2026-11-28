// „Eure Abos“: Auswahl im Menü, Hinweis auf Karten, Filmabend „In euren Abos“, „Wo läuft's?“ hebt eure Dienste hervor,
// „Jetzt im Abo“ in der Glocke; Regie & Besetzung im Info-Fenster mit „Mehr mit …“ (TMDB nachgebildet)
const L = require('./lib.js');
L.run('14 Eure Abos, Regie und Besetzung', async (b, t) => {
  const dump = await L.makeData(b);
  const { c, page } = await L.ctx(b, L.M_VP, Object.assign({}, dump, { 'anime-theme-v1': 'light', 'wl-howto-hide': '1', 'wl-ach-seen-joh': '[]' })); t.watch(page);
  await page.goto(L.BASE); await page.waitForTimeout(1500); await page.evaluate(L.QUIET);
  await page.evaluate(() => { topTab = 'film'; S = ST.film; view = 'both'; render() }); await page.addStyleTag({ content: L.HIDE });
  // Ohne Abos: Hinweis im Info-Fenster
  const fid = await page.evaluate(() => C().list.find(x => x !== '@'));
  await page.evaluate(id => act({ info: id }), fid); await page.waitForFunction(() => { const w = document.querySelector('#modal .mvwp'); return w && !w.hasAttribute('aria-busy') }, null, { timeout: 15000 }).catch(() => {});
  t.ok(await page.evaluate(() => !!document.querySelector('#modal .mvwpa0 [data-xo="abo"]')), 'ohne Abos: „Eure Abos festlegen“ im Info-Fenster');
  await page.evaluate(() => { openId = null; render() });
  // Abos im Menü auswählen
  await page.evaluate(() => { menu = true; render() }); await page.waitForTimeout(400);
  t.ok(await page.evaluate(() => /Noch keine Abos/.test(document.getElementById('abobox').textContent)), 'Menü zeigt den Bereich „Streaming“');
  await page.click('#abobox [data-xo="abo"]'); await page.waitForTimeout(800);
  t.ok(await page.evaluate(() => xo && xo.k === 'abo' && document.querySelectorAll('#xo .mvabc').length >= 10 && /Eure Abos/.test(document.querySelector('#xo h2').textContent)), 'Abo-Auswahl öffnet sich mit allen Diensten');
  await page.click('#xo [data-mvabo="netflix"]'); await page.waitForTimeout(500);
  t.ok(await page.evaluate(() => (xData().abo || {}).netflix === 1 && document.querySelector('#xo [data-mvabo="netflix"]').getAttribute('aria-pressed') === 'true'), 'Netflix ist ausgewählt und gespeichert');
  await page.evaluate(() => xoClose());
  // Hintergrund-Abgleich bringt Hinweise auf die Karten
  const ok = await page.waitForFunction(() => document.querySelectorAll('#grid .card .mvab').length > 0, null, { timeout: 40000 }).then(() => true, () => false);
  t.ok(ok, 'Karten zeigen „Im Abo“ für Netflix-Titel');
  t.ok(await page.evaluate(() => [...document.querySelectorAll('#grid .card .mvab')].every(x => /Netflix/.test(x.textContent))), 'nur der gewählte Dienst erscheint');
  // Filmabend: Quelle „In euren Abos“
  await page.evaluate(() => scrollTo(0, 0)); await page.click('#fabtn'); await page.waitForTimeout(800);
  t.ok(await page.evaluate(() => !!document.querySelector('[data-fasrc="abo"]')), 'Filmabend bietet „In euren Abos“ an');
  await page.click('[data-fasrc="abo"]'); await page.waitForTimeout(500); await page.click('[data-fastep="2"]'); await page.waitForTimeout(1400);
  const cands = await page.evaluate(() => [...document.querySelectorAll('#xo .mvcand')].map(x => (x.querySelector('.mvabt') || {}).textContent || ''));
  t.ok(cands.length >= 1 && cands.every(s => /Netflix/.test(s)), 'Kandidaten laufen alle in eurem Abo', cands);
  await page.evaluate(() => xoClose());
  // Info: eure Dienste hervorgehoben, Regie & Besetzung
  const nid = await page.evaluate(() => [...document.querySelectorAll('#grid .card .mvab')].map(x => x.closest('.card').dataset.k)[0]);
  await page.evaluate(id => act({ info: id }), nid);
  await page.waitForFunction(() => document.querySelector('#modal .mvcrw .mvpc'), null, { timeout: 15000 }).catch(() => {});
  const info = await page.evaluate(() => ({ a: (document.querySelector('#modal .mvwpa') || {}).textContent || '', on: document.querySelectorAll('#modal .mvwpon').length, cr: [...document.querySelectorAll('#modal .mvcrw .mvpc b')].map(x => x.textContent) }));
  t.ok(/In eurem Abo bei Netflix/.test(info.a) && info.on >= 1, '„Wo läuft’s?“ hebt Netflix hervor', info);
  t.ok(info.cr.includes('Regie Test') && info.cr.includes('Darstellerin A'), 'Regie und Besetzung werden angezeigt', info.cr);
  // „Mehr mit …“
  await page.click('#modal .mvcrw .mvpc >> nth=1'); await page.waitForTimeout(600);
  await page.waitForFunction(() => xo && xo.k === 'pers' && document.querySelector('#xo .xolead'), null, { timeout: 15000 }).catch(() => {});
  const pers = await page.evaluate(() => ({ h: document.querySelector('#xo h2').textContent, lead: (document.querySelector('#xo .xolead') || {}).textContent, rows: [...document.querySelectorAll('#xo .mvpr b')].map(x => x.textContent) }));
  t.ok(/Mehr mit Darstellerin A/.test(pers.h), '„Mehr mit …“ öffnet sich für die Person', pers.h);
  t.ok(pers.rows.length === 2 && /2 von 3/.test(pers.lead), 'findet die zwei Werke aus eurem Katalog', pers);
  await page.click('#xo .mvpr >> nth=0'); await page.waitForTimeout(800);
  t.ok(await page.evaluate(() => !!openId), 'Tipp auf ein Werk öffnet dessen Info');
  await page.evaluate(() => { openId = null; xoClose(); render() });
  // „Jetzt im Abo“: Titel war vorher nicht im Abo, jetzt schon → Meldung in der Glocke
  await page.evaluate(id => { const kn = JSON.parse(localStorage.getItem('wl-abo-known') || '{}'); kn[id] = ''; localStorage.setItem('wl-abo-known', JSON.stringify(kn)); return mvWpLoad(id) }, nid);
  await page.waitForTimeout(500);
  const news = await page.evaluate(() => newsList().filter(n => /läuft jetzt in eurem Abo/.test(n.h)).map(n => n.h.replace(/<[^>]+>/g, '')));
  t.ok(news.length === 1 && /Netflix/.test(news[0]), 'Glocke meldet „läuft jetzt in eurem Abo bei Netflix“', news);
  await page.evaluate(id => mvWpLoad(id), nid); await page.waitForTimeout(400);
  t.eq(await page.evaluate(() => newsList().filter(n => /läuft jetzt in eurem Abo/.test(n.h)).length), 1, 'keine doppelte Meldung beim nächsten Abgleich');
  await c.close();
});
