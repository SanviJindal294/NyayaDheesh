const params = new URLSearchParams(location.search);
const view = params.get('view') || 'directory';
const work = document.querySelector('#work');
const output = document.querySelector('#output');
const notice = document.querySelector('#notice');
const authStrip = document.querySelector('#authStrip');

const activeNav = document.getElementById('nav-' + view);
if (activeNav) activeNav.classList.add('active');

// Legacy dashboard link redirects cleanly to full Citizen / Advocate dashboard
if (view === 'dashboard') {
  const s = getSession();
  location.replace(s?.role === 'lawyer' ? 'lawyerdash.html' : 'Dashboard.html');
}

function modal(title) {
  const d = el('dialog');
  const h = el('h2', title);
  h.style.marginTop = '0';
  d.append(h);
  document.body.append(d);
  d.showModal();
  return d;
}

function renderAuthBar() {
  authStrip.innerHTML = '';
  const s = getSession();
  if (s) {
    const info = el('span', `${s.name || s.email} (${s.role})`);
    info.style.cssText = 'color:#CCD5AE;font-size:13px;margin-right:10px;font-weight:600;';
    authStrip.append(info);
    const dash = el('a', 'Open Dashboard');
    dash.href = s.role === 'lawyer' ? 'lawyerdash.html' : 'Dashboard.html';
    dash.className = 'action secondary';
    authStrip.append(dash);
    const out = button(authStrip, 'Sign Out', () => { clearSession(); renderAuthBar(); showToast('Signed out'); });
    out.className = 'secondary';
  } else {
    const b1 = button(authStrip, 'Demo Citizen Sign In', async () => { await demoLogin('user'); renderAuthBar(); showToast('Signed in as Saiyam Rajput'); });
    const b2 = button(authStrip, 'Sign In / Sign Up', openAuthModal);
    b2.className = 'secondary';
    void b1;
  }
}

function openAuthModal(onSuccess) {
  const d = modal('Sign In to Book');
  const action = field(d, 'Action', ['sign in', 'sign up']);
  const role = field(d, 'Account type', ['user', 'lawyer']);
  const email = field(d, 'Email', 'email');
  const pass = field(d, 'Password (8+ characters)', 'password');
  const msg = el('p');
  msg.style.color = '#ff8a80';
  d.append(msg);

  const row = el('div');
  row.style.marginTop = '12px';
  button(row, 'Continue', async () => {
    try {
      const a = await api('/local/auth', { action: action.value, role: role.value, email: email.value, password: pass.value });
      setSession(a);
      d.close();
      renderAuthBar();
      showToast('Signed in as ' + a.name);
      if (onSuccess) onSuccess();
    } catch (e) { msg.textContent = e.message; }
  });
  const demoBtn = button(row, '1-Click Demo Citizen', async () => {
    await demoLogin('user');
    d.close();
    renderAuthBar();
    showToast('Signed in as Saiyam Rajput (Demo)');
    if (onSuccess) onSuccess();
  });
  demoBtn.className = 'secondary';
  const closeBtn = button(row, 'Close', () => d.close());
  closeBtn.className = 'secondary';
  d.append(row);
}

function calendar(b) {
  const compact = b.day.replaceAll('-', '') + 'T' + b.slot.replace(':', '') + '00';
  download('consultation-' + b.id + '.ics', [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NyayaDheesh//IN', 'BEGIN:VEVENT',
    'UID:' + b.id + '@nyayadheesh.local',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
    'DTSTART;TZID=Asia/Kolkata:' + compact, 'DURATION:PT1H',
    'SUMMARY:Legal consultation with ' + (b.lawyerName || 'Advocate'),
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n'), 'text/calendar');
  showToast('Calendar invite downloaded!');
}

function openBookingModal(lawyer) {
  const s = getSession();
  if (!s) {
    openAuthModal(() => openBookingModal(lawyer));
    return;
  }
  if (s.role !== 'user') {
    demoLogin('user').then(() => {
      renderAuthBar();
      showToast('Switched to Citizen Demo account for booking');
      openBookingModal(lawyer);
    });
    return;
  }

  const d = modal('Book Consultation with ' + lawyer.name);
  const meta = el('p', `${lawyer.city} · ${lawyer.area} · ₹${lawyer.fee} · ${lawyer.languages}`);
  meta.style.cssText = 'color:#CCD5AE;font-size:13px;margin-top:0;';
  d.append(meta);

  const day = field(d, 'Consultation Date', 'date');
  day.value = futureDateISO(2);
  day.min = futureDateISO(1);
  const slot = field(d, 'Available Time Slot (IST)', lawyer.slots.split(',').map(x => x.trim()));
  const mode = field(d, 'Consultation Mode', ['video', 'phone', 'in person']);
  const preMode = params.get('mode');
  if (preMode && ['video', 'phone', 'in person'].includes(preMode)) mode.value = preMode;
  const summary = field(d, 'Brief Case Summary', 'textarea');
  summary.placeholder = 'e.g. Need advice on rental deposit recovery and sending a formal legal notice...';
  const msg = el('p');
  msg.style.color = '#ff8a80';
  d.append(msg);

  const row = el('div');
  row.style.marginTop = '12px';
  button(row, 'Confirm Booking', async () => {
    try {
      if (summary.value.trim().length < 5) throw Error('Please add a brief case summary (at least 5 characters).');
      const b = { lawyer: lawyer.id, day: day.value, slot: slot.value, mode: mode.value, summary: summary.value.trim() };
      const { id } = await api('/local/bookings', b);
      showToast('Consultation booked! Reference #' + id);
      d.replaceChildren(
        el('h2', 'Consultation Requested!'),
        el('p', `Booking ID: ${id} · ${lawyer.name} on ${b.day} at ${b.slot} IST (${b.mode}).`),
        el('p', 'You can track or reschedule it in Citizen Dashboard, and confirm it live in Advocate Portal!')
      );
      const btns = el('div');
      button(btns, 'Add to Calendar (.ics)', () => calendar({ ...b, id, lawyerName: lawyer.name }));
      const a1 = el('a', 'View in Citizen Dashboard');
      a1.href = 'Dashboard.html'; a1.className = 'action secondary';
      const a2 = el('a', 'Approve in Advocate Portal');
      a2.href = 'lawyerdash.html'; a2.className = 'action secondary';
      const cl = button(btns, 'Close', () => d.close());
      cl.className = 'secondary';
      btns.append(a1, a2);
      d.append(btns);
    } catch (e) { msg.textContent = e.message; }
  });
  const closeBtn = button(row, 'Cancel', () => d.close());
  closeBtn.className = 'secondary';
  d.append(row);
}

async function renderDirectory(autoBook) {
  document.getElementById('subtitle').textContent = 'Filter 32 verified demo advocates across 8 Indian cities by practice area, fee, rating, and distance.';
  const lawyers = await api('/local/lawyers');

  const grid = el('div');
  grid.className = 'filter-grid';
  work.append(grid);

  const city = field(grid, 'City', ['All', ...new Set(lawyers.map(l => l.city))]);
  const area = field(grid, 'Practice Area', ['All', ...new Set(lawyers.map(l => l.area))]);
  const search = field(grid, 'Search Name / Bio');
  search.placeholder = 'e.g. Ananya, Property, RERA...';
  const fee = field(grid, 'Max Fee (₹)', 'number');
  fee.placeholder = 'e.g. 1000';
  const rating = field(grid, 'Min Rating', ['Any', '4.0', '4.3', '4.5', '4.7']);
  const sort = field(grid, 'Sort By', ['Rating', 'Fee (Low to High)', 'Name', 'Distance']);

  let coords = null;
  function distance(l) {
    if (!coords) return Infinity;
    const rad = Math.PI / 180;
    const a = Math.sin((l.lat - coords[0]) * rad / 2) ** 2 + Math.cos(l.lat * rad) * Math.cos(coords[0] * rad) * Math.sin((l.lon - coords[1]) * rad / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  const tools = el('div');
  const locBtn = button(tools, 'Sort by My Location', () => {
    navigator.geolocation.getCurrentPosition(p => {
      coords = [p.coords.latitude, p.coords.longitude];
      sort.value = 'Distance';
      render();
      showToast('Sorted by distance from your location!');
    }, () => showToast('Location access blocked — filter by city instead.', 'error'));
  });
  locBtn.className = 'secondary';
  const resetBtn = button(tools, 'Reset Filters', () => {
    city.value = 'All'; area.value = 'All'; search.value = ''; fee.value = ''; rating.value = 'Any'; sort.value = 'Rating';
    render();
  });
  resetBtn.className = 'secondary';
  work.append(tools);

  function render() {
    output.innerHTML = '';
    const q = search.value.trim().toLowerCase();
    const minR = rating.value === 'Any' ? 0 : Number(rating.value);
    const list = lawyers
      .filter(l =>
        (city.value === 'All' || l.city === city.value) &&
        (area.value === 'All' || l.area === area.value) &&
        (!q || (l.name + ' ' + l.bio + ' ' + l.languages + ' ' + l.area + ' ' + l.city).toLowerCase().includes(q)) &&
        (!fee.value || l.fee <= Number(fee.value)) &&
        (Number(l.rating || 4.5) >= minR)
      )
      .sort((a, b) =>
        sort.value === 'Rating' ? (b.rating || 0) - (a.rating || 0)
          : sort.value === 'Fee (Low to High)' ? a.fee - b.fee
          : sort.value === 'Distance' ? distance(a) - distance(b)
          : a.name.localeCompare(b.name)
      );

    notice.textContent = `Showing ${list.length} of ${lawyers.length} verified advocates`;
    if (!list.length) {
      output.append(el('p', 'No advocates match these filters. Click Reset Filters to see all.'));
      return;
    }

    const wrap = el('div');
    wrap.className = 'lawyer-grid';
    for (const l of list) {
      const card = el('article');
      card.className = 'lawyer-card';
      card.innerHTML = `
        <div>
          <div class="lawyer-head">
            <h3>${escapeHtml(l.name)}</h3>
            <span class="rating-chip">★ ${escapeHtml(l.rating || 4.6)}</span>
          </div>
          <div class="meta-row" style="margin-top:6px;">
            <strong style="color:#f0f0e0;">${escapeHtml(l.area)} Law</strong> · ${escapeHtml(l.city)} · ₹${escapeHtml(l.fee)}/session
            ${coords ? ` · ${distance(l).toFixed(1)} km away` : ''}
          </div>
          <div class="meta-row" style="margin-top:4px;">Languages: ${escapeHtml(l.languages)}</div>
          <p style="font-size:13.5px;color:#ccc;margin:10px 0;">${escapeHtml(l.bio)}</p>
          <div class="slot-chips">
            ${l.slots.split(',').map(s => `<span class="slot-chip">${escapeHtml(s.trim())} IST</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button type="button" class="book-btn">Book Consultation</button>
          <a class="action secondary" target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=${l.lat}&mlon=${l.lon}#map=14/${l.lat}/${l.lon}">View Map</a>
        </div>
      `;
      card.querySelector('.book-btn').onclick = () => openBookingModal(l);
      wrap.append(card);
    }
    output.append(wrap);
  }

  for (const f of [city, area, search, fee, rating, sort]) f.oninput = render;
  render();

  const preLawyer = lawyers.find(l => String(l.id) === params.get('lawyer')) || (autoBook ? lawyers[0] : null);
  if (autoBook && preLawyer) openBookingModal(preLawyer);
}

const SIM_SAMPLES = [
  {
    label: 'Cheque Bounce (₹4.5 Lakh)',
    area: 'cheque',
    court: 'Trial',
    facts: 'I supplied industrial materials worth ₹4,50,000 against a signed tax invoice. The buyer issued Cheque No. 482910 dated 05/11/2026 which bounced with bank return memo "Funds Insufficient". I dispatched a formal statutory legal notice within 15 days via Speed Post AD demanding payment, and the buyer has still not paid.'
  },
  {
    label: 'Builder Flat Delay (Consumer)',
    area: 'consumer',
    court: 'High Court',
    facts: 'I paid ₹68 lakh to a housing developer under a registered Builder-Buyer Agreement promising flat possession in December 2023. Over 2.5 years have passed with incomplete construction. The agreement contains an arbitration clause, and the builder is refusing refund with interest.'
  },
  {
    label: 'Wrongful Termination & Unpaid Dues',
    area: 'employment',
    court: 'Trial',
    facts: 'After working 4 years as a full-time engineer with monthly payslips and PF contributions, my employer terminated me orally without notice or show-cause inquiry and withheld my last 2 months salary of ₹2,40,000 and accrued leave encashment.'
  },
  {
    label: 'Ancestral Property Coparcenary Share',
    area: 'property',
    court: 'High Court',
    facts: 'My late father left ancestral residential property in Pune without a will. My brothers are refusing to recognise my equal coparcenary share as a daughter, claiming an unregistered oral family arrangement made years ago.'
  }
];

async function renderSimulator() {
  document.getElementById('subtitle').textContent = 'Analyze your legal facts against Indian statutes and matched Supreme Court precedents to evaluate strengths, weaknesses, and courtroom arguments.';

  const row = el('div');
  row.className = 'filter-grid';
  work.append(row);

  const area = field(row, 'Legal Area', ['cheque', 'consumer', 'property', 'family', 'police', 'employment', 'workplace harassment', 'rti', 'cyber']);
  const court = field(row, 'Court Level', ['Trial', 'High Court', 'Supreme Court']);
  const facts = field(work, 'Describe Your Case Facts', 'textarea');
  facts.placeholder = 'Include timeline, documents/receipts/notices available, monetary amount involved, and relief sought...';

  const chipBar = el('div');
  chipBar.className = 'sim-chips';
  const chipLbl = el('span', 'Instant demo cases:');
  chipLbl.style.cssText = 'font-size:13px;color:#b0b0a0;';
  chipBar.append(chipLbl);

  for (const s of SIM_SAMPLES) {
    const b = button(chipBar, s.label, () => {
      area.value = s.area;
      court.value = s.court;
      facts.value = s.facts;
      showToast('Demo case loaded — click Run Simulation!');
    });
    b.className = 'secondary';
  }
  work.append(chipBar);

  const runBtn = button(work, 'Run Case Simulation', async () => {
    if (facts.value.trim().length < 12) throw Error('Describe your case in at least 12 characters (or click a demo case above).');
    notice.textContent = 'Retrieving Indian Supreme Court precedents & running legal simulation...';
    output.innerHTML = '';

    const payload = [area.value, court.value, facts.value.trim()].join('\n');
    const a = await api('/local/ai', { kind: 'simulate', text: payload });
    notice.textContent = '';

    const briefLines = [
      `NYAYADHEESH CASE SIMULATION BRIEF (${area.value.toUpperCase()} · ${court.value})`,
      ...Object.entries(a.result).map(([k, v]) => `\n${k.toUpperCase()}\n${v}`),
      '\nMATCHED SUPREME COURT PRECEDENTS',
      ...a.refs.map(c => `- ${c.name} ${c.citation} (${c.court}): ${c.holding}`)
    ].join('\n');

    const head = el('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin:18px 0 14px;';
    const h2 = el('h2', `Simulation Result · ${area.value.toUpperCase()} (${court.value})`);
    h2.style.margin = '0';
    head.append(h2);

    const actions = el('div');
    button(actions, 'Download Case Brief', () => {
      download('nyayadheesh-case-brief.txt', briefLines, 'text/plain');
      showToast('Case brief downloaded!');
    });
    const saveB = button(actions, 'Save to My Dashboard', async () => {
      await api('/local/documents', {
        title: `Case Simulation — ${area.value.toUpperCase()} (${court.value})`,
        category: 'Case Simulation Brief',
        content: briefLines,
        status: 'Verified'
      });
      showToast('Simulation brief saved to My Dashboard!');
    });
    saveB.className = 'secondary';
    head.append(actions);
    output.append(head);

    for (const [k, v] of Object.entries(a.result)) {
      const card = el('div');
      card.className = 'sim-card';
      card.innerHTML = `<h3>${escapeHtml(k)}</h3><p>${escapeHtml(v)}</p>`;
      output.append(card);
    }

    if (a.refs?.length) {
      const refSec = el('section');
      refSec.className = 'panel';
      refSec.innerHTML = `<h3 style="margin-top:0;">Matched Landmark Precedents (${a.refs.length})</h3>` + a.refs.map(c => `
        <div class="case-ref">
          <a target="_blank" rel="noopener" href="https://indiankanoon.org/search/?formInput=${encodeURIComponent(c.name)}" style="font-weight:700;">
            ${escapeHtml(c.name)} · ${escapeHtml(c.citation)} ↗
          </a>
          <div style="font-size:12px;color:#CCD5AE;margin:3px 0;">${escapeHtml(c.court)} (${escapeHtml(c.year)}) · Area: ${escapeHtml(c.area)}</div>
          <div style="font-size:13.5px;color:#ddd;">${escapeHtml(c.holding)}</div>
        </div>
      `).join('');
      output.append(refSec);
    }

    const foot = el('p', 'Informational legal simulation only — consult a verified NyayaDheesh advocate for formal court representation.');
    foot.style.cssText = 'font-size:12.5px;color:#999;text-align:center;margin-top:16px;';
    output.append(foot);
  });
  void runBtn;

  // Pre-fill first demo case so teacher sees rich example immediately
  area.value = SIM_SAMPLES[0].area;
  court.value = SIM_SAMPLES[0].court;
  facts.value = SIM_SAMPLES[0].facts;
}

document.querySelector('#title').textContent = ({
  directory: 'Find Verified Lawyers Near You',
  booking: 'Book Your Legal Consultation',
  simulator: 'AI Case & Judgement Simulator'
})[view] || 'NyayaDheesh Services';

renderAuthBar();
(async () => {
  if (view === 'simulator') await renderSimulator();
  else await renderDirectory(view === 'booking');
})().catch(e => {
  notice.textContent = e.message;
  showToast(e.message, 'error');
});
