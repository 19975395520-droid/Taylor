// Standalone, loopback-only prototype preview. No Codex or npm process is required.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.pdf':'application/pdf','.json':'application/json'};
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (pathname === '/__prototype_health') { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify({service:'sky-shield-preview',pid:process.pid})); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control','no-cache');
    fs.createReadStream(file).pipe(res);
  });
});
server.on('error', err => { console.error(err.message); process.exit(1); });
server.listen(5173, '127.0.0.1', () => console.log('Prototype ready: http://127.0.0.1:5173/'));
