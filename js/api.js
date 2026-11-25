const el = (tag, text) => {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  return n;
};

function field(parent, label, options) {
  const wrap = el('label', label);
  wrap.className = 'field';
  const n = el(Array.isArray(options) ? 'select' : options === 'textarea' ? 'textarea' : 'input');
  if (Array.isArray(options)) {
    for (const v of options) n.add(new Option(v, v));
  } else if (n.tagName === 'INPUT') {
    n.type = options || 'text';
  }
  wrap.append(n);
  parent.append(wrap);
  return n;
}

function button(parent, label, fn) {
  const n = el('button', label);
  n.type = 'button';
  n.onclick = async () => {
    n.disabled = true;
    try {
      await fn();
    } catch (e) {
      const box = document.querySelector('#notice');
      if (box) {
        box.textContent = e.message;
        button(box, 'Retry', () => n.click());
      } else {
        showToast(e.message, 'error');
      }
    } finally {
      n.disabled = false;
    }
  };
  parent.append(n);
  return n;
}

function getSession() {
  const token = localStorage.getItem('ndToken') || sessionStorage.getItem('ndToken') || '';
  const role = localStorage.getItem('ndRole') || sessionStorage.getItem('ndRole') || '';
  const name = localStorage.getItem('ndName') || sessionStorage.getItem('ndName') || '';
  const email = localStorage.getItem('ndEmail') || sessionStorage.getItem('ndEmail') || '';
  if (token) {
    sessionStorage.ndToken = token;
    sessionStorage.ndRole = role;
  }
  return token ? { token, role, name, email } : null;
}

function setSession(data) {
  localStorage.setItem('ndToken', data.token);
  localStorage.setItem('ndRole', data.role);
  localStorage.setItem('ndName', data.name || '');
  localStorage.setItem('ndEmail', data.email || '');
  sessionStorage.ndToken = data.token;
  sessionStorage.ndRole = data.role;
  sessionStorage.ndName = data.name || '';
  sessionStorage.ndEmail = data.email || '';
}

function clearSession() {
  for (const k of ['ndToken', 'ndRole', 'ndName', 'ndEmail', 'token', 'user']) {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  }
}

async function api(path, data) {
  const s = getSession();
  const r = await fetch(path, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(s?.token ? { Authorization: 'Bearer ' + s.token } : {})
    },
    body: data ? JSON.stringify(data) : undefined
  });
  const j = await r.json();
  if (!r.ok) throw Error(j.error || 'Request failed');
  return j;
}

async function demoLogin(role = 'user') {
  const res = await api('/local/demo-login', { role });
  setSession(res);
  return res;
}

function download(name, text, type) {
  const blob = text instanceof Blob ? text : new Blob([text], { type });
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function showToast(msg, kind = 'success') {
  let host = document.getElementById('nd-toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'nd-toast-host';
    host.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:360px';
    document.body.appendChild(host);
  }
  const t = document.createElement('div');
  const bg = kind === 'error' ? '#3a1b1b' : '#1e241b';
  const border = kind === 'error' ? '#e74c3c' : '#D4A373';
  t.style.cssText = `background:${bg};color:#f5f5ef;border:1px solid ${border};border-left:4px solid ${border};padding:12px 16px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.45);font-family:Arial,sans-serif;font-size:14px;line-height:1.4;transition:opacity .3s`;
  t.textContent = msg;
  host.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 320);
  }, 3400);
}

function futureDateISO(daysAhead = 2) {
  return new Date(Date.now() + 86400000 * daysAhead).toISOString().slice(0, 10);
}
