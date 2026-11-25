const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { spawnSync } = require('node:child_process');

const backend = path.join(__dirname, 'Backend');
process.chdir(backend);
require('./Backend/node_modules/dotenv').config();
process.env.ND_LOCAL_MODE = 'sqlite';

const express = require('./Backend/node_modules/express');
const multer = require('./Backend/node_modules/multer');

const app = express();
app.disable('x-powered-by');

const port = Number(process.env.ND_LOCAL_PORT || 4000);
const hits = new Map();

app.use((q, r, next) => {
  if (!q.path.startsWith('/local/')) return next();
  if (q.headers.origin && !['http://localhost:', 'http://127.0.0.1:'].some(p => q.headers.origin === p + port)) {
    return r.status(403).json({ error: 'Use the local site.' });
  }
  const key = q.ip + ':' + Math.floor(Date.now() / 60000);
  if (hits.size > 500) hits.clear();
  const count = (hits.get(key) || 0) + 1;
  hits.set(key, count);
  if (count > 300) return r.status(429).json({ error: 'Please wait a minute.' });
  next();
});

app.use(express.json({ limit: '2mb' }));

const local = require('./Backend/local-services');
local.mount(app, process.env.JWT_SECRET_KEY || require('node:crypto').randomBytes(48).toString('hex'));

app.get('/health', (q, r) =>
  r.json({
    status: 'ok',
    database: local.db.prepare('SELECT 1 AS ok').get().ok,
    aiConfigured: Boolean(process.env.AI_API_KEY && !process.env.AI_API_KEY.includes('enter ai api key')),
    localAiEngine: true,
    offlineDemo: process.env.DEMO_FALLBACK === 'true'
  })
);

app.post('/local/ai', async (q, r, next) => {
  try {
    const { kind, text, language } = q.body;
    if (!['analyze', 'simulate'].includes(kind) || typeof text !== 'string' || text.trim().length < 12 || text.length > 120000) {
      return r.status(400).json({ error: 'Enter between 12 and 120,000 characters.' });
    }
    r.json(await require('./Backend/ai').run(kind, text, language === 'Hindi' ? 'Hindi' : 'English'));
  } catch (e) {
    next(e);
  }
});

function office(mode, input) {
  const bin = process.platform === 'win32' ? 'python' : 'python3';
  const p = spawnSync(bin, [path.join(backend, 'office.py'), mode], { input, timeout: 10000, maxBuffer: 8000000 });
  if (p.status !== 0) throw Object.assign(Error('Could not process DOCX. Check Python and the document.'), { status: 400 });
  return p.stdout;
}

app.post('/local/docx', (q, r) => {
  if (typeof q.body.text !== 'string' || !q.body.text.trim()) return r.status(400).json({ error: 'Generate a draft first.' });
  r.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document').send(office('write', Buffer.from(q.body.text)));
});

app.post('/local/extract', multer({ limits: { fileSize: 10 * 1024 * 1024, files: 1 } }).single('file'), async (q, r) => {
  try {
    if (!q.file) throw Error();
    let text;
    if (/\.pdf$/i.test(q.file.originalname)) {
      text = (await require('./Backend/node_modules/pdf-parse/lib/pdf-parse')(q.file.buffer)).text;
    } else if (/\.docx$/i.test(q.file.originalname)) {
      text = office('extract', q.file.buffer).toString();
    } else if (/\.(txt|md|rtf)$/i.test(q.file.originalname)) {
      text = q.file.buffer.toString('utf8');
    } else {
      throw Error();
    }
    if (!text.trim()) throw Error();
    r.json({ text });
  } catch {
    r.status(422).json({ error: 'No text layer found. Use OCR or paste the document text.' });
  }
});

app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

for (const file of fs.readdirSync(__dirname).filter(f => /\.(html|css)$/.test(f) || f === 'scanner.js')) {
  app.get('/' + file, (q, r) => r.sendFile(path.join(__dirname, file)));
}
app.get('/', (q, r) => r.sendFile(path.join(__dirname, 'index.html')));

app.use(require('./Backend/app'));

app.use((e, q, r, next) => {
  r.status(e.code === 'LIMIT_FILE_SIZE' ? 413 : e.errcode === 2067 ? 409 : e.status || 500).json({
    error:
      e.code === 'LIMIT_FILE_SIZE'
        ? 'Maximum file size is 10 MB.'
        : e.errcode === 2067
          ? 'That slot is already booked. Choose another time.'
          : e.status
            ? e.message
            : 'Request could not be completed.'
  });
});

http.createServer(app).listen(port, '127.0.0.1', () => {
  console.log('NyayaDheesh running at http://localhost:' + port + ' (http://127.0.0.1:' + port + ')');
});
http.createServer(app).listen(port, '::1').on('error', e => {
  if (e.code !== 'EAFNOSUPPORT' && e.code !== 'EADDRNOTAVAIL') throw e;
});
