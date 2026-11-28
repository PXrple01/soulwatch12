// Startet die App auf einem eigenen lokalen Server und führt alle *.test.js nacheinander aus.
// Aufruf: node run.js            → alle Tests
//         node run.js 03 07      → nur Tests, deren Dateiname eine der Angaben enthält
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css' };
const server = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end('nicht gefunden'); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(r);
});
server.listen(0, '127.0.0.1', () => {
  const port = server.address().port, base = `http://localhost:${port}/index.html`;
  const want = process.argv.slice(2);
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort().filter(f => !want.length || want.some(w => f.includes(w)));
  console.log(`Watchlist-Tests: ${files.length} Dateien gegen ${base}\n`);
  const res = []; const t0 = Date.now();
  // Die Tests laufen nacheinander: parallele Browser führen zu Zeitüberschreitungen.
  (function next(i) {
    if (i >= files.length) {
      console.log('\n──────── Ergebnis ────────');
      for (const r of res) console.log(`${r.ok ? '✓' : '✗'} ${r.f}  (${r.s} s)`);
      const bad = res.filter(r => !r.ok).length;
      console.log(bad ? `\n${bad} von ${res.length} Testdateien fehlgeschlagen (${Math.round((Date.now() - t0) / 1000)} s)` : `\nAlle ${res.length} Testdateien bestanden (${Math.round((Date.now() - t0) / 1000)} s)`);
      server.close(); process.exit(bad ? 1 : 0);
    }
    const f = files[i], s0 = Date.now();
    // spawnSync würde den Server in diesem Prozess blockieren → Test als eigener Prozess, asynchron
    const { spawn } = require('child_process');
    const ch = spawn(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit', env: Object.assign({}, process.env, { BASE: base }) });
    const kill = setTimeout(() => { console.log(`✗ ${f}: Zeitüberschreitung`); ch.kill('SIGKILL'); }, 8 * 60e3);
    ch.on('exit', code => { clearTimeout(kill); res.push({ f, ok: code === 0, s: Math.round((Date.now() - s0) / 1000) }); console.log(''); next(i + 1); });
  })(0);
});
