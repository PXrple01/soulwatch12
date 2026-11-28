// Cloud-Abgleich: nachgebautes Supabase-Backend, zwei Geräte ändern gleichzeitig – nichts darf verloren gehen
const L = require('./lib.js');
const CLOUD = 'https://inqhfkoxmftyellmrxop.supabase.co';   // öffentliche Projekt-Adresse (steht auch in der App); Anfragen werden hier abgefangen
const rows = {}; let tick = Date.parse('2026-11-19T10:00:00Z'); const log = [];
const backend = async (route) => {
  const u = route.request().url(), fn = u.split('/rpc/')[1], a = JSON.parse(route.request().postData() || '{}');
  const json = (st, b) => route.fulfill({ status: st, contentType: 'application/json', body: JSON.stringify(b) });
  if (a.p_code !== 'test') return json(400, { message: 'invalid_code' });
  if (fn === 'wl_get') return json(200, Object.entries(rows).map(([section, r]) => ({ section, data: r.data, updated_at: r.ts })));
  if (fn === 'wl_put') { const cur = rows[a.p_section]; if (cur && a.p_expected !== cur.ts) { log.push('Konflikt ' + a.p_section); return json(409, { message: 'conflict' }) }
    const ts = new Date(tick += 1000).toISOString(); rows[a.p_section] = { data: a.p_data, ts }; log.push('put ' + a.p_section); return json(200, ts) }
  if (fn === 'wl_get_vote') return json(200, []); return json(200, null);
};
async function device(b, t, user) {
  const { c, page } = await L.ctx(b, L.M_VP, { 'wl-user': user, 'wl-code': 'test', 'wl-cloud-proj': CLOUD, 'wl-howto-hide': '1' });
  await page.route(CLOUD + '/rest/v1/rpc/*', backend); t.watch(page, user);
  await page.goto(L.BASE); await page.waitForTimeout(2500);
  await page.evaluate(() => { chShow = () => {}; if (chOn) { chOn = false; chRender() } mvLevel = () => {}; mvBadge = () => {} });
  return { c, page };
}
const CHK = ([i]) => { const s = ST.film; return { X_joh: ((s.w[i.X] || {}).r || {}).joh, Z_jos: ((s.w[i.Z] || {}).r || {}).jos, Y_inJos: s.lists.jos.list.includes(i.Y), V_inBoth: s.lists.both.list.includes(i.V), W_gone: !s.lists.both.list.includes(i.W), reaktion: !!(xData().re || {})['film:' + i.X + ':jos'] } };
const GOOD = { X_joh: 7.5, Z_jos: 9.1, Y_inJos: true, V_inBoth: true, W_gone: true, reaktion: true };
L.run('10 Cloud-Abgleich führt zusammen', async (b, t) => {
  const A = await device(b, t, 'joh'); await A.page.waitForTimeout(2500);
  t.ok(['anime', 'film', 'serie'].every(k => rows[k]), 'A lädt alle drei Bereiche hoch', Object.keys(rows)); log.splice(0);
  const B = await device(b, t, 'jos'); await B.page.waitForTimeout(1500);
  t.ok(await B.page.evaluate(() => ['anime', 'film', 'serie'].every(k => !!localStorage.getItem('wl-cloud-base-' + k))), 'B merkt sich den gemeinsamen Stand');
  const ids = await A.page.evaluate(() => { const f = Object.values(M).filter(m => m.sec === 'film' && !m.old).map(m => m.id); const used = new Set([].concat(...LISTS.map(l => ST.film.lists[l].list))); const free = f.filter(i => !used.has(i)); return { X: free[0], Y: free[1], Z: free[2], V: free[3], W: ST.film.lists.both.list.find(i => i !== '@') } });
  await A.page.evaluate(({ X, V }) => { clearTimeout(cTimer); const s = ST.film; (s.w[X] = s.w[X] || {}).r = { joh: 7.5 }; s.w[X].rt = { joh: Date.now() };
    const x = xData(); (x.re = x.re || {})['film:' + X + ':jos'] = { e: '❤️', by: 'joh', t: Date.now() };
    const bl = s.lists.both.list, j = bl.indexOf('@'); if (j > -1) bl[j] = V; else bl[bl.length - 1] = V; localStorage.setItem(SEC.film.key, JSON.stringify(s)); clearTimeout(cTimer) }, ids);
  await B.page.evaluate(({ Y, Z, W }) => { clearTimeout(cTimer); const s = ST.film; const jl = s.lists.jos.list, j = jl.indexOf('@'); if (j > -1) jl[j] = Y; else jl.push(Y);
    (s.w[Z] = s.w[Z] || {}).r = { jos: 9.1 }; s.w[Z].rt = { jos: Date.now() };
    const bl = s.lists.both.list, k = bl.indexOf(W); if (k > -1) bl[k] = '@'; localStorage.setItem(SEC.film.key, JSON.stringify(s)); clearTimeout(cTimer) }, ids);
  await A.page.evaluate(() => cloudPush()); await A.page.waitForTimeout(500);
  await B.page.evaluate(() => cloudPush()); await B.page.waitForTimeout(1500);
  t.ok(log.includes('Konflikt film'), 'B stößt auf einen Konflikt', log.join(' · '));
  await A.page.evaluate(() => cloudPull()); await A.page.waitForTimeout(1200);
  const s = rows.film.data;
  const cloud = { X_joh: ((s.w[ids.X] || {}).r || {}).joh, Z_jos: ((s.w[ids.Z] || {}).r || {}).jos, Y_inJos: s.lists.jos.list.includes(ids.Y), V_inBoth: s.lists.both.list.includes(ids.V), W_gone: !s.lists.both.list.includes(ids.W), reaktion: !!((s.x || {}).re || {})['film:' + ids.X + ':jos'] };
  t.eq(cloud, GOOD, 'Cloud enthält die Änderungen beider Geräte');
  t.eq(await A.page.evaluate(CHK, [ids]), GOOD, 'Gerät A hat alles');
  t.eq(await B.page.evaluate(CHK, [ids]), GOOD, 'Gerät B hat alles');
  await A.c.close(); await B.c.close();
});
