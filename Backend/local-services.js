const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = new DatabaseSync(process.env.ND_SERVICES_DB || path.join(__dirname, 'services.sqlite'));

db.exec(`PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS accounts(
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  hash TEXT,
  role TEXT,
  name TEXT
);
CREATE TABLE IF NOT EXISTS lawyers(
  id INTEGER PRIMARY KEY,
  owner INTEGER UNIQUE REFERENCES accounts(id),
  name TEXT,
  city TEXT,
  area TEXT,
  languages TEXT,
  fee INTEGER,
  lat REAL,
  lon REAL,
  bio TEXT,
  slots TEXT,
  demo INTEGER,
  rating REAL
);
CREATE TABLE IF NOT EXISTS bookings(
  id TEXT PRIMARY KEY,
  user INTEGER REFERENCES accounts(id),
  lawyer INTEGER REFERENCES lawyers(id),
  day TEXT,
  slot TEXT,
  mode TEXT,
  summary TEXT,
  status TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS occupied ON bookings(lawyer,day,slot) WHERE status IN ('pending','confirmed');

CREATE TABLE IF NOT EXISTS documents(
  id TEXT PRIMARY KEY,
  owner INTEGER REFERENCES accounts(id),
  title TEXT,
  category TEXT,
  content TEXT,
  status TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS mediators(
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE,
  specialty TEXT,
  cases_resolved TEXT,
  experience_years INTEGER,
  success_rate TEXT,
  bio TEXT,
  photo TEXT,
  city TEXT,
  fee INTEGER
);

CREATE TABLE IF NOT EXISTS mediation_requests(
  id TEXT PRIMARY KEY,
  user INTEGER REFERENCES accounts(id),
  mediator_id INTEGER REFERENCES mediators(id),
  mediator_name TEXT,
  party_name TEXT,
  email TEXT,
  day TEXT,
  slot TEXT,
  mode TEXT,
  summary TEXT,
  status TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS lawyer_cases(
  id TEXT PRIMARY KEY,
  lawyer_owner INTEGER REFERENCES accounts(id),
  client_name TEXT,
  case_type TEXT,
  title TEXT,
  status TEXT,
  next_date TEXT,
  notes TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS ai_reviews(
  id TEXT PRIMARY KEY,
  case_code TEXT,
  title TEXT,
  details TEXT,
  prediction TEXT,
  confidence INTEGER,
  status TEXT,
  feedback TEXT,
  impact TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS discussions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT,
  initials TEXT,
  message TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS contacts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TEXT
);
`);

// Add name column to existing accounts table if upgrading an older database
try { db.exec('ALTER TABLE accounts ADD COLUMN name TEXT'); } catch {}

const cities = [
  ['Delhi', 28.61, 77.21],
  ['Mumbai', 19.08, 72.88],
  ['Bengaluru', 12.97, 77.59],
  ['Chennai', 13.08, 80.27],
  ['Kolkata', 22.57, 88.36],
  ['Hyderabad', 17.39, 78.49],
  ['Pune', 18.52, 73.86],
  ['Lucknow', 26.85, 80.95]
];
const slots = '10:00,11:00,14:00,16:00';

function addDays(n) {
  return new Date(Date.now() + 86400000 * n).toISOString().slice(0, 10);
}

function seed() {
  const account = db.prepare('INSERT OR IGNORE INTO accounts(email,hash,role,name) VALUES(?,?,?,?)');
  account.run('user@demo.invalid', bcrypt.hashSync('DemoLocal2026!', 10), 'user', 'Saiyam Rajput');
  account.run('lawyer@demo.invalid', bcrypt.hashSync('DemoLocal2026!', 10), 'lawyer', 'Adv. Ananya Sharma');
  db.prepare("UPDATE accounts SET name='Saiyam Rajput' WHERE email='user@demo.invalid' AND (name IS NULL OR name='')").run();
  db.prepare("UPDATE accounts SET name='Adv. Ananya Sharma' WHERE email='lawyer@demo.invalid' AND (name IS NULL OR name='')").run();

  const get = role => db.prepare('SELECT id FROM accounts WHERE email=?').get(role + '@demo.invalid').id;
  const userId = get('user');
  const lawyerId = get('lawyer');

  const insertLawyer = db.prepare('INSERT OR IGNORE INTO lawyers VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)');
  const surnames = ['Sharma', 'Samar', 'Kiran', 'Aviral', 'Manav', 'Tarun', 'Dev', 'Neel'];
  const firstNames = ['Ananya', 'Kabir', 'Meher', 'Vihaan'];
  const areas = ['Property', 'Family', 'Consumer', 'Employment'];
  const bios = [
    'High Court & Mediation advocate specialising in property titles, tenancy agreements, and civil settlements.',
    'Practising family & matrimonial law counsel with 10+ years resolving custody and maintenance disputes.',
    'Consumer protection & RERA litigator representing homebuyers and citizens before consumer commissions.',
    'Corporate & employment law advisor handling wrongful termination, contracts, and POSH compliance.'
  ];
  cities.forEach(([city, lat, lon], i) => {
    firstNames.forEach((name, j) => {
      const id = 1 + i * 4 + j;
      const fullName = 'Adv. ' + name + ' ' + surnames[i];
      insertLawyer.run(
        id,
        i + j === 0 ? lawyerId : null,
        fullName,
        city,
        areas[j],
        'English, Hindi',
        500 + j * 250,
        lat + j * 0.012,
        lon - j * 0.012,
        bios[j],
        slots,
        1,
        Number((4.2 + ((i + j) % 7) * 0.1).toFixed(1))
      );
    });
  });

  // Update first lawyer to match Adv. Ananya Sharma nicely
  db.prepare("UPDATE lawyers SET name='Adv. Ananya Sharma', bio='Senior High Court Advocate & Certified Mediation Specialist in Delhi NCR with 12+ years of experience.' WHERE id=1").run();

  // Seed bookings
  const insBooking = db.prepare('INSERT OR IGNORE INTO bookings VALUES(?,?,?,?,?,?,?,?)');
  insBooking.run('DEMO-001', userId, 1, addDays(2), '10:00', 'video', 'Residential tenancy deposit dispute & legal notice review', 'confirmed');
  insBooking.run('DEMO-002', userId, 1, addDays(4), '14:00', 'phone', 'Ancestral property partition & family settlement guidance', 'pending');
  insBooking.run('DEMO-003', userId, 3, addDays(6), '11:00', 'in person', 'Consumer commission complaint for delayed flat possession', 'pending');

  // Seed documents
  const insDoc = db.prepare('INSERT OR IGNORE INTO documents VALUES(?,?,?,?,?,?,?,?)');
  insDoc.run(
    'DOC-101',
    userId,
    'Residential Rent Agreement — Saket, New Delhi',
    'Agreements & Contracts',
    `RESIDENTIAL RENT AGREEMENT\n\nNew Delhi · ${addDays(-5)}\n\nTHIS RENT AGREEMENT is executed between Mr. Rajesh Malhotra (Landlord) and Saiyam Rajput (Tenant) for residential premises at Flat B-402, Saket, New Delhi.\n\n1. Monthly Rent: ₹28,000 (Twenty-Eight Thousand Rupees Only) payable by the 5th of each month.\n2. Security Deposit: ₹56,000 refundable within 15 days of peaceful handover.\n3. Tenancy Period: 11 months commencing from 01/12/2026.\n4. Notice Period: 1 month written notice by either party.\n\nSignature (Landlord): __________________    Signature (Tenant): __________________`,
    'Verified',
    addDays(-5),
    'Today'
  );
  insDoc.run(
    'DOC-102',
    userId,
    'Mutual Non-Disclosure Agreement (NDA)',
    'Agreements & Contracts',
    `MUTUAL NON-DISCLOSURE AGREEMENT\n\nBengaluru · ${addDays(-12)}\n\nBetween Saiyam Rajput and Vertex Tech Solutions Pvt. Ltd.\n\n1. Confidential Information: Product designs, source code, customer lists, and commercial proposals.\n2. Duration: 3 years from date of disclosure.\n3. Remedies: Equitable relief and mediation prior to court action.\n\nSignature: __________________`,
    'Active',
    addDays(-12),
    '2 days ago'
  );
  insDoc.run(
    'DOC-103',
    userId,
    'Legal Notice — Cheque Bounce (Sec. 138 NI Act)',
    'Complaints & Legal Notices',
    `STATUTORY LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881\n\nNew Delhi · ${addDays(-3)}\n\nTo: M/s Apex Traders, Karol Bagh, New Delhi\nFrom: Saiyam Rajput\n\n1. Cheque No. 482910 dated ${addDays(-18)} for ₹1,85,000 drawn on HDFC Bank was returned unpaid with memo "Funds Insufficient".\n2. Demand: You are called upon to pay ₹1,85,000 within 15 days of receipt of this notice, failing which criminal proceedings under Section 138 NI Act shall be initiated.\n\nSignature: __________________`,
    'Action Needed',
    addDays(-3),
    'Yesterday'
  );
  insDoc.run(
    'DOC-104',
    userId,
    'Employment Offer & Service Contract',
    'Business & Financial',
    `EMPLOYMENT CONTRACT\n\nGurugram · ${addDays(-20)}\n\nBetween Innovate Legal Labs Pvt. Ltd. and Saiyam Rajput.\n\n1. Role: Senior Product Engineer\n2. Compensation: ₹18,00,000 per annum (payable monthly).\n3. Notice Period: 30 days mutual written notice.\n4. Governing Law: Laws of India; Jurisdiction: Gurugram/Delhi.\n\nSignature: __________________`,
    'Signed',
    addDays(-20),
    '1 week ago'
  );

  // Seed Mediators (preserving original 6 with real Images!)
  const insMed = db.prepare('INSERT OR IGNORE INTO mediators(id,name,specialty,cases_resolved,experience_years,success_rate,bio,photo,city,fee) VALUES(?,?,?,?,?,?,?,?,?,?)');
  const defaultMediators = [
    [1, 'Advocate Ramesh Kumar', 'Family Dispute Resolution and Property Mediation', '250+', 12, '92%', 'Former district court advocate with specialization in amicable dispute resolution.', 'Images/Mediators (5).png', 'New Delhi', 1500],
    [2, 'Dr. Priya Sharma', 'Medical Negligence and Healthcare Disputes', '180+', 8, '88%', 'MBBS with LLB, brings unique medical-legal perspective to mediation. Trained at International Mediation Institute.', 'Images/Mediators (2).png', 'Mumbai', 2000],
    [3, 'Col. Rajesh Verma (Retd.)', 'Defense and Government Contract Disputes', '320+', 15, '95%', '30 years defense service experience brings discipline and structure to mediation process.', 'Images/Mediators (1).png', 'Bengaluru', 2200],
    [4, 'Ms. Ananya Desai', 'Corporate and Commercial Disputes', '400+', 10, '90%', 'Harvard-trained negotiator with experience in multinational corporations. Focuses on preserving business relationships.', 'Images/Mediators (3).png', 'Mumbai', 2500],
    [5, 'Prof. Arun Khanna', 'Educational Institution Disputes', '150+', 7, '85%', 'Former university dean with deep understanding of academic disputes and student-faculty conflicts.', 'Images/Mediators (4).png', 'Pune', 1200],
    [6, 'Advocate Sneha Reddy', 'Labor and Employment Disputes', '275+', 9, '91%', 'Worked with both management and unions to find balanced solutions. Certified by International Labour Organization.', 'Images/Mediators (6).png', 'Hyderabad', 1600]
  ];
  for (const m of defaultMediators) insMed.run(...m);

  // Seed Mediation Requests
  const insMedReq = db.prepare('INSERT OR IGNORE INTO mediation_requests VALUES(?,?,?,?,?,?,?,?,?,?,?,?)');
  insMedReq.run('MED-201', userId, 1, 'Advocate Ramesh Kumar', 'Saiyam Rajput', 'user@demo.invalid', addDays(3), '11:00', 'video', 'Security deposit settlement with landlord without court litigation', 'scheduled', addDays(-2));
  insMedReq.run('MED-202', userId, 4, 'Ms. Ananya Desai', 'Saiyam Rajput', 'user@demo.invalid', addDays(8), '15:00', 'video', 'Commercial vendor invoice recovery & settlement mediation', 'pending', addDays(-1));

  // Seed Lawyer Cases
  const insCase = db.prepare('INSERT OR IGNORE INTO lawyer_cases VALUES(?,?,?,?,?,?,?,?,?)');
  insCase.run('CASE-301', lawyerId, 'Saiyam Rajput', 'Mediation', 'Saket Residential Deposit Settlement', 'Active', addDays(2), 'Drafted settlement memorandum; landlord agreed in principle to refund ₹56,000.', addDays(-10));
  insCase.run('CASE-302', lawyerId, 'Priya Malhotra', 'Contract', 'SaaS Vendor Master Service Agreement Review', 'Pending', addDays(3), 'Reviewing indemnity cap and IP ownership clauses prior to execution.', addDays(-6));
  insCase.run('CASE-303', lawyerId, 'Sanjay Gupta', 'Litigation', 'Consumer Commission — Delayed Flat Possession', 'Active', addDays(5), 'Filed consumer complaint with RERA delay calculation and interest claim at 9% p.a.', addDays(-14));
  insCase.run('CASE-304', lawyerId, 'Ananya Desai', 'Mediation', 'Family Property Partition Settlement', 'Scheduled', addDays(7), 'Joint mediation session fixed with both co-parceners under Sec. 89 CPC.', addDays(-4));

  // Seed AI Reviews for Lawyer Dashboard
  const insRev = db.prepare('INSERT OR IGNORE INTO ai_reviews VALUES(?,?,?,?,?,?,?,?,?,?)');
  insRev.run(
    'REV-1',
    'JD-2026-1456',
    'Property Dispute — Sharma vs. Patel',
    'Dispute over partition of ancestral property in Mumbai. Plaintiff claims 50% share based on inheritance rights under amended Hindu Succession Act, while defendant relies on an unregistered 2015 family settlement.',
    'Based on Vineeta Sharma v Rakesh Sharma and Kale v DDC, the AI assesses a strong coparcenary claim for the plaintiff while noting that a bona fide acted-upon family arrangement can narrow share allocation if proved.',
    78,
    'pending',
    '',
    '',
    '2 days ago'
  );
  insRev.run(
    'REV-2',
    'JD-2026-1892',
    'Employment Wrongful Termination Claim',
    'Former employee claims wrongful termination and seeks 6 months salary as compensation. Employer argues termination was for cause due to performance warnings documented over 8 months.',
    'The AI highlights moderate compensation exposure (2–3 months notice/severance equivalent) noting that while performance records exist, progressive show-cause procedure was skipped in two instances.',
    84,
    'pending',
    '',
    '',
    '1 day ago'
  );
  insRev.run(
    'REV-3',
    'JD-2026-1904',
    'Cheque Dishonour — M/s Verma Supplies',
    'Drawer issued ₹4.5 lakh cheque against textile supply invoices; dishonoured for insufficient funds. Statutory notice sent within 18 days via Speed Post.',
    'Strong prima facie presumption under Sections 138 & 139 NI Act (Rangappa v Sri Mohan). Recommended verifying signed delivery challans to counter any quality-dispute defence.',
    91,
    'pending',
    '',
    '',
    '5 hours ago'
  );
  insRev.run(
    'REV-4',
    'JD-2026-1120',
    'Commercial Lease Eviction & Counterclaim',
    'Landlord sought eviction for rent arrears; tenant raised counterclaim for structural roof repairs.',
    'Assessed landlord right to possession alongside potential set-off for documented repair invoices.',
    74,
    'approved',
    'Accurate application of Transfer of Property Act notice principles; properly flagged the tenant set-off counterclaim.',
    'Incorporated into local precedent scoring (+8% accuracy on commercial lease disputes).',
    '3 days ago'
  );
  insRev.run(
    'REV-5',
    'JD-2026-1088',
    'Matrimonial Maintenance Assessment',
    'Maintenance application under BNSS Sec. 144 where respondent had undeclared consulting income alongside salaried ITR.',
    'Initially estimated ₹42,000/month strictly from 3-year salary ITR without consulting cash-flow adjustment.',
    66,
    'rejected',
    'Underestimated real disposable income; Rajnesh v Neha mandates complete bank statement and lifestyle disclosure.',
    'Updated maintenance checklist to prompt bank-statement disclosure verification.',
    '1 week ago'
  );

  // Seed Community Discussions
  const discCount = db.prepare('SELECT COUNT(*) AS c FROM discussions').get().c;
  if (discCount === 0) {
    const insDisc = db.prepare('INSERT INTO discussions(author,initials,message,created_at) VALUES(?,?,?,?)');
    insDisc.run('Adv. Vikram Patel', 'VP', 'Has anyone noticed clients frequently forget to attach bank return memos in Sec. 138 cheque bounce packets? Adding the mandatory checklist on NyayaDheesh really cut back-and-forth.', '2 hours ago');
    insDisc.run('Adv. Ritu Mehra', 'RM', '@Vikram agreed! In POSH and employment matters too, referencing Vishaka & Aureliano Fernandes upfront gives HR and employees much clearer expectations.', '1 hour ago');
    insDisc.run('Adv. Ananya Sharma', 'AS', 'Pre-litigation mediation via the platform resolved 4 of my property deposit matters this month in under 3 weeks — clients love the speed and transparency.', '45 minutes ago');
  }
}

function fail(message, status = 400) {
  throw Object.assign(Error(message), { status });
}

function str(v, min = 1, max = 12000) {
  if (typeof v !== 'string' || v.trim().length < min || v.length > max) fail('Please check the required fields.');
  return v.trim();
}

function mount(app, secret) {
  // Always ensure demo data is seeded on startup so the demo works out of the box
  seed();

  const auth = (req) => {
    try {
      return jwt.verify((req.headers.authorization || '').replace(/^Bearer /, ''), secret);
    } catch {
      fail('Please sign in first.', 401);
    }
  };

  const optionalAuth = (req) => {
    try {
      const h = req.headers.authorization || '';
      if (!h.startsWith('Bearer ')) return null;
      return jwt.verify(h.slice(7), secret);
    } catch {
      return null;
    }
  };

  const demoAccountId = (role) => {
    const row = db.prepare('SELECT id FROM accounts WHERE email=?').get((role === 'lawyer' ? 'lawyer' : 'user') + '@demo.invalid');
    return row ? row.id : 1;
  };

  // Auth: sign in / sign up
  app.post('/local/auth', (q, r) => {
    const { action, role, password } = q.body;
    const email = str(q.body.email, 3, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['sign in', 'sign up'].includes(action)) {
      fail('Enter a valid email and action.');
    }
    str(password, 8, 72);
    if (action === 'sign up') {
      if (!['user', 'lawyer'].includes(role)) fail('Choose a role');
      if (db.prepare('SELECT id FROM accounts WHERE email=?').get(email)) fail('Email already registered');
      const displayName = (typeof q.body.name === 'string' && q.body.name.trim()) ? q.body.name.trim().slice(0, 80) : email.split('@')[0];
      db.prepare('INSERT INTO accounts(email,hash,role,name) VALUES(?,?,?,?)').run(email, bcrypt.hashSync(password, 10), role, displayName);
    }
    const a = db.prepare('SELECT * FROM accounts WHERE email=?').get(email);
    if (!a || !bcrypt.compareSync(password, a.hash)) fail('Check your email and password.', 401);
    const name = a.name || a.email.split('@')[0];
    r.json({
      role: a.role,
      name,
      email: a.email,
      token: jwt.sign({ id: a.id, role: a.role, name, email: a.email }, secret, { expiresIn: '24h' })
    });
  });

  // One-click demo auth endpoint for smooth presentation mode
  app.post('/local/demo-login', (q, r) => {
    const role = q.body?.role === 'lawyer' ? 'lawyer' : 'user';
    const email = role + '@demo.invalid';
    const a = db.prepare('SELECT * FROM accounts WHERE email=?').get(email);
    if (!a) fail('Demo account not available', 500);
    const name = a.name || (role === 'lawyer' ? 'Adv. Ananya Sharma' : 'Saiyam Rajput');
    r.json({
      role: a.role,
      name,
      email: a.email,
      token: jwt.sign({ id: a.id, role: a.role, name, email: a.email }, secret, { expiresIn: '24h' })
    });
  });

  app.get('/local/me', (q, r) => {
    const a = auth(q);
    const row = db.prepare('SELECT id,email,role,name FROM accounts WHERE id=?').get(a.id);
    if (!row) fail('Account not found', 404);
    r.json(row);
  });

  // Lawyers directory & profile
  app.get('/local/lawyers', (q, r) => r.json(db.prepare('SELECT * FROM lawyers ORDER BY rating DESC, name ASC').all()));

  app.post('/local/profile', (q, r) => {
    const a = auth(q);
    if (a.role !== 'lawyer') fail('Lawyer account required', 403);
    const b = q.body;
    const vals = ['name', 'city', 'area', 'languages'].map(k => str(b[k], 1, 120));
    const fee = Number(b.fee), lat = Number(b.lat), lon = Number(b.lon);
    if (![fee, lat, lon].every(Number.isFinite) || fee < 0 || Math.abs(lat) > 90 || Math.abs(lon) > 180) fail('Check fee and coordinates.');
    const times = str(b.slots).split(',').map(t => t.trim());
    if (!times.every(t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t))) fail('Use comma-separated HH:MM slots');
    db.prepare('INSERT INTO lawyers(owner,name,city,area,languages,fee,lat,lon,bio,slots,demo,rating) VALUES(?,?,?,?,?,?,?,?,?,?,0,4.8) ON CONFLICT(owner) DO UPDATE SET name=excluded.name,city=excluded.city,area=excluded.area,languages=excluded.languages,fee=excluded.fee,lat=excluded.lat,lon=excluded.lon,bio=excluded.bio,slots=excluded.slots').run(a.id, ...vals, fee, lat, lon, str(b.bio), times.join(','));
    r.json({ ok: true });
  });

  // Bookings
  app.get('/local/bookings', (q, r) => {
    const a = auth(q);
    r.json(db.prepare('SELECT b.*,l.name AS name,l.city AS city,l.area AS area,l.fee AS fee,u.name AS client_name,u.email AS client_email FROM bookings b JOIN lawyers l ON l.id=b.lawyer JOIN accounts u ON u.id=b.user WHERE ' + (a.role === 'lawyer' ? 'l.owner' : 'b.user') + '=? ORDER BY day,slot').all(a.id));
  });

  function validateSlot(b) {
    const l = db.prepare('SELECT slots FROM lawyers WHERE id=?').get(Number(b.lawyer));
    if (!l || !l.slots.split(',').includes(b.slot) || !/^\d{4}-\d{2}-\d{2}$/.test(b.day) || !Number.isFinite(Date.parse(b.day + 'T' + b.slot + ':00+05:30')) || Date.parse(b.day + 'T' + b.slot + ':00+05:30') <= Date.now()) {
      fail('Choose an available future date and time slot.');
    }
  }

  app.post('/local/bookings', (q, r) => {
    const a = auth(q), b = q.body;
    if (a.role !== 'user') fail('Sign in as a citizen/user to book a consultation.', 403);
    validateSlot(b);
    if (!['phone', 'video', 'in person'].includes(b.mode)) fail('Choose a consultation mode');
    const id = 'BK-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    db.prepare("INSERT INTO bookings VALUES(?,?,?,?,?,?,?,'pending')").run(id, a.id, Number(b.lawyer), b.day, b.slot, b.mode, str(b.summary, 3, 1200));
    r.json({ id });
  });

  app.post('/local/change', (q, r) => {
    const a = auth(q), b = q.body;
    const row = db.prepare('SELECT b.*,l.owner FROM bookings b JOIN lawyers l ON l.id=b.lawyer WHERE b.id=?').get(str(b.id));
    if (!row || !['pending', 'confirmed'].includes(row.status)) fail('Booking unavailable');
    if (a.role === 'user' && row.user === a.id && b.status === 'reschedule') {
      validateSlot({ ...b, lawyer: row.lawyer });
      db.prepare("UPDATE bookings SET day=?,slot=?,status='pending' WHERE id=?").run(b.day, b.slot, b.id);
    } else {
      if (!(a.role === 'user' && a.id === row.user && b.status === 'cancelled') && !(a.role === 'lawyer' && row.owner === a.id && ((row.status === 'pending' && ['confirmed', 'declined'].includes(b.status)) || (row.status === 'confirmed' && b.status === 'completed')))) {
        fail('Action unavailable', 403);
      }
      db.prepare('UPDATE bookings SET status=? WHERE id=?').run(b.status, b.id);
    }
    r.json({ ok: true });
  });

  // Documents vault (for Dashboard, DocGen, Scanner)
  app.get('/local/documents', (q, r) => {
    const a = optionalAuth(q);
    const ownerId = a ? a.id : demoAccountId('user');
    r.json(db.prepare('SELECT * FROM documents WHERE owner=? ORDER BY rowid DESC').all(ownerId));
  });

  app.post('/local/documents', (q, r) => {
    const a = optionalAuth(q);
    const ownerId = a ? a.id : demoAccountId('user');
    const title = str(q.body.title, 2, 160);
    const category = str(q.body.category || 'Legal Draft', 2, 80);
    const content = str(q.body.content, 10, 120000);
    const status = str(q.body.status || 'Draft Saved', 2, 40);
    const id = 'DOC-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const today = new Date().toISOString().slice(0, 10);
    db.prepare('INSERT INTO documents VALUES(?,?,?,?,?,?,?,?)').run(id, ownerId, title, category, content, status, today, 'Just now');
    r.json({ id, title, category, status, created_at: today, updated_at: 'Just now' });
  });

  app.post('/local/documents/delete', (q, r) => {
    const a = optionalAuth(q);
    const ownerId = a ? a.id : demoAccountId('user');
    const id = str(q.body.id, 2, 60);
    db.prepare('DELETE FROM documents WHERE id=? AND owner=?').run(id, ownerId);
    r.json({ ok: true });
  });

  // Mediators & Mediation Requests
  app.get('/local/mediators', (q, r) => {
    r.json(db.prepare('SELECT * FROM mediators ORDER BY id ASC').all());
  });

  app.post('/local/mediators', (q, r) => {
    const b = q.body;
    const name = str(b.name, 2, 100);
    const specialty = str(b.specialty, 3, 180);
    const city = str(b.city || 'New Delhi', 2, 80);
    const bio = str(b.bio, 8, 600);
    const exp = Math.max(1, Math.min(60, Number(b.experience_years) || 5));
    const fee = Math.max(0, Math.min(100000, Number(b.fee) || 1500));
    const photos = ['Images/Mediators (1).png', 'Images/Mediators (2).png', 'Images/Mediators (3).png', 'Images/Mediators (4).png', 'Images/Mediators (5).png', 'Images/Mediators (6).png'];
    const photo = photos[Math.floor(Math.random() * photos.length)];
    const info = db.prepare('INSERT INTO mediators(name,specialty,cases_resolved,experience_years,success_rate,bio,photo,city,fee) VALUES(?,?,?,?,?,?,?,?,?)').run(name, specialty, 'New', exp, '90%', bio, photo, city, fee);
    r.json(db.prepare('SELECT * FROM mediators WHERE id=?').get(info.lastInsertRowid));
  });

  app.get('/local/mediations', (q, r) => {
    const a = optionalAuth(q);
    const userId = a ? a.id : demoAccountId('user');
    r.json(db.prepare('SELECT * FROM mediation_requests WHERE user=? ORDER BY rowid DESC').all(userId));
  });

  app.post('/local/mediations', (q, r) => {
    const a = optionalAuth(q);
    const userId = a ? a.id : demoAccountId('user');
    const b = q.body;
    const med = db.prepare('SELECT * FROM mediators WHERE id=?').get(Number(b.mediator_id));
    if (!med) fail('Selected mediator not found.');
    const partyName = str(b.party_name || a?.name || 'Saiyam Rajput', 2, 100);
    const email = str(b.email || a?.email || 'user@demo.invalid', 3, 160);
    const day = str(b.day, 8, 20);
    const slot = str(b.slot, 3, 20);
    const mode = str(b.mode || 'video', 3, 30);
    const summary = str(b.summary, 6, 1200);
    const id = 'MED-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const created = new Date().toISOString().slice(0, 10);
    db.prepare('INSERT INTO mediation_requests VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(id, userId, med.id, med.name, partyName, email, day, slot, mode, summary, 'scheduled', created);
    r.json({ id, mediator_name: med.name, day, slot, mode, status: 'scheduled' });
  });

  // Lawyer Cases (for Lawyer Dashboard)
  app.get('/local/cases', (q, r) => {
    const a = optionalAuth(q);
    const ownerId = (a && a.role === 'lawyer') ? a.id : demoAccountId('lawyer');
    r.json(db.prepare('SELECT * FROM lawyer_cases WHERE lawyer_owner=? ORDER BY rowid DESC').all(ownerId));
  });

  app.post('/local/cases', (q, r) => {
    const a = optionalAuth(q);
    const ownerId = (a && a.role === 'lawyer') ? a.id : demoAccountId('lawyer');
    const b = q.body;
    const id = 'CASE-' + crypto.randomBytes(2).toString('hex').toUpperCase();
    const created = new Date().toISOString().slice(0, 10);
    db.prepare('INSERT INTO lawyer_cases VALUES(?,?,?,?,?,?,?,?,?)').run(
      id,
      ownerId,
      str(b.client_name, 2, 100),
      str(b.case_type || 'Mediation', 2, 40),
      str(b.title, 3, 180),
      str(b.status || 'Active', 2, 30),
      str(b.next_date || addDays(5), 8, 20),
      str(b.notes || 'Initial intake completed.', 2, 2000),
      created
    );
    r.json(db.prepare('SELECT * FROM lawyer_cases WHERE id=?').get(id));
  });

  app.post('/local/cases/update', (q, r) => {
    const b = q.body;
    const id = str(b.id, 2, 40);
    const existing = db.prepare('SELECT * FROM lawyer_cases WHERE id=?').get(id);
    if (!existing) fail('Case not found', 404);
    const status = b.status ? str(b.status, 2, 30) : existing.status;
    const notes = b.notes ? str(b.notes, 1, 4000) : existing.notes;
    const nextDate = b.next_date ? str(b.next_date, 8, 20) : existing.next_date;
    db.prepare('UPDATE lawyer_cases SET status=?, notes=?, next_date=? WHERE id=?').run(status, notes, nextDate, id);
    r.json(db.prepare('SELECT * FROM lawyer_cases WHERE id=?').get(id));
  });

  // AI Model Review & Community Discussions (Lawyer Dashboard)
  app.get('/local/reviews', (q, r) => {
    r.json(db.prepare('SELECT * FROM ai_reviews ORDER BY rowid DESC').all());
  });

  app.post('/local/reviews/decide', (q, r) => {
    const b = q.body;
    const id = str(b.id, 2, 40);
    const status = str(b.status, 3, 20);
    if (!['approved', 'rejected'].includes(status)) fail('Invalid review decision');
    const feedback = typeof b.feedback === 'string' && b.feedback.trim()
      ? b.feedback.trim().slice(0, 1500)
      : (status === 'approved' ? 'Verified precedent alignment and statutory accuracy for Indian jurisdiction.' : 'Flagged for recalibration against recent Supreme Court holdings.');
    const impact = status === 'approved'
      ? 'Your approval strengthened confidence weighting for similar Indian precedents.'
      : 'Your rejection queued this legal pattern for model recalibration.';
    db.prepare('UPDATE ai_reviews SET status=?, feedback=?, impact=?, updated_at=? WHERE id=?').run(status, feedback, impact, 'Just now', id);
    r.json(db.prepare('SELECT * FROM ai_reviews WHERE id=?').get(id));
  });

  app.get('/local/discussions', (q, r) => {
    r.json(db.prepare('SELECT * FROM discussions ORDER BY id ASC').all());
  });

  app.post('/local/discussions', (q, r) => {
    const a = optionalAuth(q);
    const author = str(q.body.author || a?.name || 'Adv. Ananya Sharma', 2, 80);
    const message = str(q.body.message, 2, 1200);
    const initials = author.replace(/^Adv\.\s*/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';
    const info = db.prepare('INSERT INTO discussions(author,initials,message,created_at) VALUES(?,?,?,?)').run(author, initials, message, 'Just now');
    r.json(db.prepare('SELECT * FROM discussions WHERE id=?').get(info.lastInsertRowid));
  });

  // Contact form from index.html
  app.post('/local/contact', (q, r) => {
    const name = str(q.body.name, 2, 100);
    const email = str(q.body.email, 3, 160);
    const phone = typeof q.body.phone === 'string' ? q.body.phone.trim().slice(0, 30) : '';
    const message = str(q.body.message, 4, 2000);
    const created = new Date().toISOString();
    const info = db.prepare('INSERT INTO contacts(name,email,phone,message,created_at) VALUES(?,?,?,?,?)').run(name, email, phone, message, created);
    r.json({ ok: true, id: info.lastInsertRowid, message: 'Thank you, ' + name + '! Your inquiry has been recorded.' });
  });
}

module.exports = { db, seed, mount };
