(function () {
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  const SERVICES_MENU = [
    { href: 'scanner.html', icon: 'file-search', title: 'Legal Document Analyzer', desc: 'Review clauses, obligations, dates & discussion points' },
    { href: 'docgen.html', icon: 'file-plus', title: 'Legal Document Generator', desc: 'Guided multi-step drafts for 10 common templates' },
    { href: 'gen.html', icon: 'compass', title: 'Legal Next Steps', desc: 'Interactive procedural guidance & document checklists' },
    { href: 'simulator.html', icon: 'briefcase', title: 'Case & Judgment Simulator', desc: 'Structured issue & argument exploration' },
    { href: 'lawyers.html', icon: 'users', title: 'Find Lawyers', desc: 'Browse 108 advocate profiles across Indian cities' },
    { href: 'booking.html', icon: 'calendar', title: 'Book Legal Consultation', desc: 'Schedule video, phone, or in-person slots' }
  ];

  function toast(message, type = 'info') {
    let host = document.getElementById('nd-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'nd-toast-host';
      host.className = 'toast-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    const item = document.createElement('div');
    item.className = 'toast ' + type;
    const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-triangle' : 'info';
    item.innerHTML = `${ndIcon(iconName, 18)}<span>${esc(message)}</span>`;
    host.appendChild(item);
    setTimeout(() => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      setTimeout(() => item.remove(), 260);
    }, 3400);
  }

  function closeModal() {
    const bd = document.getElementById('nd-modal-backdrop');
    if (bd) bd.classList.remove('open');
  }

  function openModal({ title, bodyHtml, footerHtml = '', size = '' }) {
    let bd = document.getElementById('nd-modal-backdrop');
    if (!bd) {
      bd = document.createElement('div');
      bd.id = 'nd-modal-backdrop';
      bd.className = 'modal-backdrop';
      bd.addEventListener('click', (e) => { if (e.target === bd) closeModal(); });
      document.body.appendChild(bd);
    }
    bd.innerHTML = `
      <div class="modal ${size}" role="dialog" aria-modal="true" aria-labelledby="nd-modal-title">
        <div class="modal-header">
          <h3 id="nd-modal-title">${esc(title)}</h3>
          <button type="button" class="icon-btn" id="nd-modal-close" aria-label="Close dialog">${ndIcon('x', 18)}</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    bd.querySelector('#nd-modal-close').onclick = closeModal;
    bd.classList.add('open');
    return bd;
  }

  function confirmDialog({ title = 'Confirm Action', message, confirmText = 'Confirm', cancelText = 'Cancel', destructive = false }) {
    return new Promise((resolve) => {
      const bd = openModal({
        title,
        size: 'modal-sm',
        bodyHtml: `<p style="margin:0;color:var(--text-primary);">${esc(message)}</p>`,
        footerHtml: `
          <button type="button" class="btn btn-outline" id="nd-cf-cancel">${esc(cancelText)}</button>
          <button type="button" class="btn ${destructive ? 'btn-danger' : 'btn-primary'}" id="nd-cf-ok">${esc(confirmText)}</button>
        `
      });
      const finish = (val) => { closeModal(); resolve(val); };
      bd.querySelector('#nd-cf-cancel').onclick = () => finish(false);
      bd.querySelector('#nd-modal-close').onclick = () => finish(false);
      bd.querySelector('#nd-cf-ok').onclick = () => finish(true);
    });
  }

  function statusBadge(status) {
    const s = String(status || '').toLowerCase();
    let cls = 'badge-navy';
    if (['confirmed', 'completed', 'resolved', 'saved draft', 'reviewed draft'].some(k => s.includes(k))) cls = 'badge-success';
    else if (['pending', 'under review', 'rescheduled', 'in progress', 'submitted'].some(k => s.includes(k))) cls = 'badge-warning';
    else if (['cancelled', 'declined', 'closed'].some(k => s.includes(k))) cls = 'badge-error';
    else if (['assigned', 'scheduled'].some(k => s.includes(k))) cls = 'badge-info';
    return `<span class="badge ${cls}">${esc(status)}</span>`;
  }

  function renderStepper(steps, activeIndex) {
    return `<div class="stepper" role="list">${steps.map((label, i) => {
      const state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : '';
      return `
        <div class="step-item ${state}" role="listitem">
          <span class="step-circle">${i < activeIndex ? ndIcon('check', 15) : (i + 1)}</span>
          <span class="step-label">${esc(label)}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="step-line ${i < activeIndex ? 'done' : ''}"></div>` : ''}
      `;
    }).join('')}</div>`;
  }

  function renderBreadcrumbs(items) {
    return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item, idx) => {
      const last = idx === items.length - 1;
      const part = last ? `<span aria-current="page">${esc(item.label)}</span>` : `<a href="${esc(item.href)}">${esc(item.label)}</a>`;
      return part + (last ? '' : `<span aria-hidden="true">${ndIcon('chevron-right', 14)}</span>`);
    }).join('')}</nav>`;
  }

  function renderEmptyState({ icon = 'info', title, description, actionHtml = '' }) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${ndIcon(icon, 24)}</div>
        <h3 style="margin-bottom:6px;">${esc(title)}</h3>
        <p style="max-width:440px;margin:0 auto 16px;">${esc(description)}</p>
        ${actionHtml}
      </div>
    `;
  }

  function renderSkeletonCards(count = 3) {
    return Array.from({ length: count }).map(() => `
      <div class="card">
        <div class="skeleton" style="height:18px;width:60%;margin-bottom:12px;"></div>
        <div class="skeleton" style="height:13px;width:90%;margin-bottom:8px;"></div>
        <div class="skeleton" style="height:13px;width:75%;margin-bottom:18px;"></div>
        <div class="skeleton" style="height:34px;width:45%;"></div>
      </div>
    `).join('');
  }

  function renderPagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return '';
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
      else if (pages[pages.length - 1] !== '...') pages.push('...');
    }
    return `
      <nav class="pagination" aria-label="Pagination">
        <button type="button" class="page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>Prev</button>
        ${pages.map(p => p === '...'
          ? `<span class="text-muted" style="padding:0 6px;">…</span>`
          : `<button type="button" class="page-btn ${p === page ? 'active' : ''}" data-page="${p}" ${p === page ? 'aria-current="page"' : ''}>${p}</button>`
        ).join('')}
        <button type="button" class="page-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>Next</button>
      </nav>
    `;
  }

  function downloadTextFile(filename, text, mime = 'text/plain;charset=utf-8') {
    const blob = text instanceof Blob ? text : new Blob([text], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  async function downloadDocxOrTxt(baseName, text) {
    const clean = baseName.replace(/[^\w\s-]/g, '').trim() || 'nyayadheesh-document';
    try {
      const r = await fetch('/local/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (r.ok) {
        downloadTextFile(clean + '.docx', await r.blob(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        toast('Word document (.docx) downloaded.', 'success');
        return;
      }
    } catch {}
    downloadTextFile(clean + '.txt', text);
    toast('Plain text copy (.txt) downloaded.', 'success');
  }

  function printDocument(title, bodyTextOrHtml, isHtml = false) {
    const w = window.open('', '_blank', 'width=860,height=740');
    if (!w) { window.print(); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>${esc(title)}</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; color: #182434; margin: 40px; line-height: 1.7; }
        .hdr { border-bottom: 2px solid #142437; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: baseline; }
        .hdr h1 { margin: 0; font-size: 20px; color: #142437; }
        .hdr span { font-family: Arial, sans-serif; font-size: 11px; color: #64748B; }
        .notice { font-family: Arial, sans-serif; font-size: 11.5px; background: #F6F0E4; border-left: 3px solid #C5A46D; padding: 10px 14px; margin-bottom: 22px; }
        pre { white-space: pre-wrap; font-family: Georgia, serif; font-size: 13.5px; line-height: 1.75; }
      </style></head><body>
      <div class="hdr"><h1>${esc(title)}</h1><span>NyayaDheesh · Document Export</span></div>
      <div class="notice"><strong>Legal Notice:</strong> This document is generated for informational purposes and requires review by a qualified legal practitioner before execution.</div>
      ${isHtml ? bodyTextOrHtml : `<pre>${esc(bodyTextOrHtml)}</pre>`}
      </body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 250);
  }

  function downloadIcs(appt) {
    const compact = appt.date.replaceAll('-', '') + 'T' + appt.slot.replace(':', '') + '00';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NyayaDheesh//Calendar//EN', 'BEGIN:VEVENT',
      'UID:' + appt.id + '@nyayadheesh.in',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
      'DTSTART;TZID=Asia/Kolkata:' + compact, 'DURATION:PT1H',
      'SUMMARY:NyayaDheesh Consultation — ' + appt.lawyerName,
      'DESCRIPTION:Mode: ' + appt.mode + ' | Ref: ' + appt.id,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    downloadTextFile(`consultation-${appt.id}.ics`, ics, 'text/calendar');
    toast('Calendar invite (.ics) downloaded.', 'success');
  }

  function renderNavbar(activeKey = '') {
    const session = window.NDStore.AuthService.getSession();
    const unread = session ? window.NDStore.NotificationService.unreadCount() : 0;
    const recentNotifs = session ? window.NDStore.NotificationService.list().slice(0, 5) : [];
    const initials = session ? session.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() : '';

    const navHtml = `
      <header class="site-nav">
        <div class="nav-inner">
          <a href="index.html" class="brand-link" aria-label="NyayaDheesh Home">
            <span class="brand-mark">${ndIcon('scale', 19)}</span>
            <span>NyayaDheesh</span>
          </a>

          <nav class="nav-links" aria-label="Primary navigation">
            <a href="index.html" class="nav-link ${activeKey === 'home' ? 'active' : ''}">Home</a>
            <div class="nav-item" id="nd-services-item">
              <button type="button" class="nav-link ${activeKey === 'services' ? 'active' : ''}" id="nd-services-toggle" aria-expanded="false" aria-haspopup="true">
                Legal Services ${ndIcon('chevron-down', 15)}
              </button>
              <div class="nav-dropdown" role="menu">
                ${SERVICES_MENU.map(s => `
                  <a href="${s.href}" class="dropdown-link" role="menuitem">
                    <span class="dl-icon">${ndIcon(s.icon, 17)}</span>
                    <span><strong>${esc(s.title)}</strong><span>${esc(s.desc)}</span></span>
                  </a>
                `).join('')}
              </div>
            </div>
            <a href="lawyers.html" class="nav-link ${activeKey === 'lawyers' ? 'active' : ''}">Find Lawyers</a>
            <a href="Mediators.html" class="nav-link ${activeKey === 'mediation' ? 'active' : ''}">Mediation</a>
            <a href="about.html" class="nav-link ${activeKey === 'about' ? 'active' : ''}">About Us</a>
          </nav>

          <div class="nav-actions">
            ${session ? `
              <div style="position:relative;">
                <button type="button" class="icon-btn" id="nd-notif-btn" aria-label="Notifications">
                  ${ndIcon('bell', 18)}
                  ${unread > 0 ? `<span class="notif-dot" id="nd-nav-unread">${unread}</span>` : ''}
                </button>
                <div class="popover-panel" id="nd-notif-popover">
                  <div class="popover-head">
                    <span>Notifications (${unread} unread)</span>
                    <button type="button" class="btn btn-ghost btn-sm" id="nd-pop-markread">Mark all read</button>
                  </div>
                  <div class="popover-list">
                    ${recentNotifs.map(n => `
                      <a href="${esc(n.link)}" class="popover-item ${n.read ? '' : 'unread'}" style="display:block;">
                        <div style="font-weight:600;color:var(--navy);">${esc(n.title)}</div>
                        <div class="text-xs text-muted">${esc(n.message)}</div>
                        <div class="text-xs text-muted" style="margin-top:3px;">${esc(n.time)}</div>
                      </a>
                    `).join('')}
                  </div>
                  <div style="padding:10px 16px;border-top:1px solid var(--border);text-align:center;">
                    <a href="Dashboard.html#notifications" class="text-sm" style="font-weight:600;">View all in Dashboard</a>
                  </div>
                </div>
              </div>

              <div style="position:relative;" class="nav-desktop-cta">
                <button type="button" class="avatar-btn" id="nd-user-btn" aria-expanded="false">
                  <span class="avatar-circle">${esc(initials)}</span>
                  <span>${esc(session.name.split(' ')[0])}</span>
                  <span class="badge badge-demo" style="font-size:10.5px;padding:2px 7px;">${session.role === 'lawyer' ? 'Lawyer' : 'Citizen'}</span>
                  ${ndIcon('chevron-down', 14)}
                </button>
                <div class="popover-panel" id="nd-user-popover" style="width:248px;">
                  <div class="popover-head" style="flex-direction:column;align-items:flex-start;gap:2px;">
                    <span>${esc(session.name)}</span>
                    <span class="text-xs text-muted" style="font-weight:400;">${esc(session.email)}</span>
                  </div>
                  <div style="padding:8px;">
                    <a href="${session.role === 'lawyer' ? 'lawyerdash.html' : 'Dashboard.html'}" class="dropdown-link" style="padding:8px 10px;">${ndIcon('layout-grid', 16)}<span><strong>${session.role === 'lawyer' ? 'Lawyer Dashboard' : 'Client Dashboard'}</strong></span></a>
                    <button type="button" class="dropdown-link" id="nd-switch-role" data-role="${session.role === 'lawyer' ? 'client' : 'lawyer'}" style="width:100%;background:none;border:0;cursor:pointer;padding:8px 10px;">
                      ${ndIcon('refresh', 16)}<span><strong>Switch to ${session.role === 'lawyer' ? 'Citizen' : 'Lawyer'} Portal</strong></span>
                    </button>
                    <a href="Dashboard.html#appointments" class="dropdown-link" style="padding:8px 10px;">${ndIcon('calendar', 16)}<span><strong>Appointments</strong></span></a>
                    <a href="Dashboard.html#settings" class="dropdown-link" style="padding:8px 10px;">${ndIcon('settings', 16)}<span><strong>Settings</strong></span></a>
                    <button type="button" class="dropdown-link" id="nd-nav-logout" style="width:100%;background:none;border:0;cursor:pointer;padding:8px 10px;color:var(--error);">
                      ${ndIcon('log-out', 16)}<span><strong style="color:var(--error);">Sign Out</strong></span>
                    </button>
                  </div>
                </div>
              </div>
            ` : `
              <button type="button" class="btn btn-outline btn-sm nav-desktop-cta" id="nd-quick-citizen" title="Citizen Portal Login">${ndIcon('user', 14)} Citizen Login</button>
              <button type="button" class="btn btn-gold btn-sm nav-desktop-cta" id="nd-quick-lawyer" title="Lawyer Portal Login">${ndIcon('briefcase', 14)} Lawyer Login</button>
              <a href="auth.html?mode=login" class="btn btn-ghost btn-sm nav-desktop-cta">Login</a>
              <a href="auth.html?mode=register" class="btn btn-primary btn-sm nav-desktop-cta">Get Started</a>
            `}
            <button type="button" class="icon-btn mobile-menu-btn" id="nd-mobile-open" aria-label="Open menu">${ndIcon('menu', 20)}</button>
          </div>
        </div>
      </header>

      <div class="drawer-backdrop" id="nd-drawer-backdrop"></div>
      <aside class="drawer" id="nd-mobile-drawer" aria-label="Mobile menu">
        <div class="drawer-header">
          <a href="index.html" class="brand-link" style="font-size:18px;">
            <span class="brand-mark" style="width:28px;height:28px;">${ndIcon('scale', 16)}</span>
            <span>NyayaDheesh</span>
          </a>
          <button type="button" class="icon-btn" id="nd-mobile-close" aria-label="Close menu">${ndIcon('x', 18)}</button>
        </div>
        <div class="drawer-body">
          <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:18px;">
            <a href="index.html" class="nav-link ${activeKey === 'home' ? 'active' : ''}">Home</a>
            <a href="lawyers.html" class="nav-link ${activeKey === 'lawyers' ? 'active' : ''}">Find Lawyers</a>
            <a href="booking.html" class="nav-link">Book Consultation</a>
            <a href="Mediators.html" class="nav-link ${activeKey === 'mediation' ? 'active' : ''}">Mediation</a>
            <a href="about.html" class="nav-link ${activeKey === 'about' ? 'active' : ''}">About Us</a>
            <a href="contact.html" class="nav-link ${activeKey === 'contact' ? 'active' : ''}">Contact</a>
          </div>
          <div style="border-top:1px solid var(--border);padding-top:14px;margin-bottom:18px;">
            <div class="eyebrow" style="margin-bottom:8px;">Legal Services</div>
            ${SERVICES_MENU.slice(0, 4).map(s => `
              <a href="${s.href}" class="dropdown-link" style="padding:8px 6px;">
                <span class="dl-icon" style="width:30px;height:30px;">${ndIcon(s.icon, 15)}</span>
                <span><strong>${esc(s.title)}</strong></span>
              </a>
            `).join('')}
          </div>
          <div style="border-top:1px solid var(--border);padding-top:16px;display:flex;flex-direction:column;gap:10px;">
            ${session ? `
              <a href="${session.role === 'lawyer' ? 'lawyerdash.html' : 'Dashboard.html'}" class="btn btn-primary btn-block">Open ${session.role === 'lawyer' ? 'Lawyer' : 'Client'} Dashboard</a>
              <button type="button" class="btn btn-gold btn-block" id="nd-mobile-switch" data-role="${session.role === 'lawyer' ? 'client' : 'lawyer'}">Switch to ${session.role === 'lawyer' ? 'Citizen' : 'Lawyer'} Portal</button>
              <button type="button" class="btn btn-danger-outline btn-block" id="nd-mobile-logout">Sign Out (${esc(session.name.split(' ')[0])})</button>
            ` : `
              <button type="button" class="btn btn-outline btn-block" id="nd-mobile-citizen">${ndIcon('user', 15)} Citizen Login</button>
              <button type="button" class="btn btn-gold btn-block" id="nd-mobile-lawyer">${ndIcon('briefcase', 15)} Lawyer Login</button>
              <a href="auth.html?mode=login" class="btn btn-ghost btn-block">Login</a>
              <a href="auth.html?mode=register" class="btn btn-primary btn-block">Get Started</a>
            `}
          </div>
        </div>
      </aside>
    `;

    const headerMount = document.getElementById('site-header');
    if (headerMount) headerMount.innerHTML = navHtml;
    else document.body.insertAdjacentHTML('afterbegin', navHtml);

    // Wire dropdowns & drawer
    const svcItem = document.getElementById('nd-services-item');
    const svcBtn = document.getElementById('nd-services-toggle');
    if (svcBtn && svcItem) {
      svcBtn.onclick = (e) => {
        e.stopPropagation();
        const open = svcItem.classList.toggle('open');
        svcBtn.setAttribute('aria-expanded', String(open));
      };
    }

    const notifBtn = document.getElementById('nd-notif-btn');
    const notifPop = document.getElementById('nd-notif-popover');
    if (notifBtn && notifPop) {
      notifBtn.onclick = (e) => {
        e.stopPropagation();
        document.getElementById('nd-user-popover')?.classList.remove('open');
        notifPop.classList.toggle('open');
      };
      const markBtn = document.getElementById('nd-pop-markread');
      if (markBtn) {
        markBtn.onclick = (e) => {
          e.stopPropagation();
          window.NDStore.NotificationService.markAllRead();
          document.getElementById('nd-nav-unread')?.remove();
          notifPop.querySelectorAll('.popover-item.unread').forEach(el => el.classList.remove('unread'));
          toast('All notifications marked as read.', 'success');
        };
      }
    }

    const userBtn = document.getElementById('nd-user-btn');
    const userPop = document.getElementById('nd-user-popover');
    if (userBtn && userPop) {
      userBtn.onclick = (e) => {
        e.stopPropagation();
        notifPop?.classList.remove('open');
        const open = userPop.classList.toggle('open');
        userBtn.setAttribute('aria-expanded', String(open));
      };
    }

    document.addEventListener('click', () => {
      svcItem?.classList.remove('open');
      notifPop?.classList.remove('open');
      userPop?.classList.remove('open');
    });

    const handleLogout = () => {
      window.NDStore.AuthService.logout();
      toast('Signed out successfully.', 'info');
      setTimeout(() => { location.href = 'index.html'; }, 350);
    };
    document.getElementById('nd-nav-logout')?.addEventListener('click', handleLogout);
    document.getElementById('nd-mobile-logout')?.addEventListener('click', handleLogout);

    const quickDemoGo = (role) => {
      const s = window.NDStore.AuthService.demoLogin(role);
      toast(`Signed in as ${s.name} (${role === 'lawyer' ? 'Lawyer' : 'Citizen'} Portal).`, 'success');
      setTimeout(() => { location.href = role === 'lawyer' ? 'lawyerdash.html' : 'Dashboard.html'; }, 240);
    };
    document.getElementById('nd-quick-citizen')?.addEventListener('click', () => quickDemoGo('client'));
    document.getElementById('nd-quick-lawyer')?.addEventListener('click', () => quickDemoGo('lawyer'));
    document.getElementById('nd-mobile-citizen')?.addEventListener('click', () => quickDemoGo('client'));
    document.getElementById('nd-mobile-lawyer')?.addEventListener('click', () => quickDemoGo('lawyer'));
    document.getElementById('nd-switch-role')?.addEventListener('click', (e) => quickDemoGo(e.currentTarget.dataset.role));
    document.getElementById('nd-mobile-switch')?.addEventListener('click', (e) => quickDemoGo(e.currentTarget.dataset.role));

    const drawer = document.getElementById('nd-mobile-drawer');
    const backdrop = document.getElementById('nd-drawer-backdrop');
    const toggleDrawer = (open) => {
      drawer?.classList.toggle('open', open);
      backdrop?.classList.toggle('open', open);
    };
    document.getElementById('nd-mobile-open')?.addEventListener('click', () => toggleDrawer(true));
    document.getElementById('nd-mobile-close')?.addEventListener('click', () => toggleDrawer(false));
    backdrop?.addEventListener('click', () => toggleDrawer(false));
  }

  function renderFooter() {
    const html = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a href="index.html" class="brand-link" style="color:#FFFFFF;margin-bottom:12px;">
                <span class="brand-mark" style="background:rgba(197,164,109,0.16);border:1px solid rgba(197,164,109,0.35);">${ndIcon('scale', 18)}</span>
                <span>NyayaDheesh</span>
              </a>
              <p class="text-sm" style="color:#94A3B8;max-width:340px;margin-top:10px;">
                A simplified LegalTech platform helping citizens understand documents, explore procedural steps, and access legal consultation and mediation workflows.
              </p>
            </div>
            <div>
              <h4>Legal Services</h4>
              <ul class="footer-links">
                <li><a href="scanner.html">Legal Document Analyzer</a></li>
                <li><a href="docgen.html">Legal Document Generator</a></li>
                <li><a href="gen.html">Legal Next Steps</a></li>
                <li><a href="simulator.html">Case &amp; Judgment Simulator</a></li>
              </ul>
            </div>
            <div>
              <h4>Professionals</h4>
              <ul class="footer-links">
                <li><a href="lawyers.html">Find Lawyers</a></li>
                <li><a href="booking.html">Book Consultation</a></li>
                <li><a href="Mediators.html">Mediation Services</a></li>
                <li><a href="Dashboard.html">Client Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4>Platform &amp; Safety</h4>
              <ul class="footer-links">
                <li><a href="about.html">About NyayaDheesh</a></li>
                <li><a href="contact.html">Contact &amp; Enquiries</a></li>
                <li><a href="index.html#faq">Frequently Asked Questions</a></li>
                <li><a href="auth.html?mode=login">Sign In</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>&copy; ${new Date().getFullYear()} NyayaDheesh · LegalTech Platform.</span>
            <span>Informational guidance only — not a substitute for formal legal counsel.</span>
          </div>
        </div>
      </footer>
    `;
    const mount = document.getElementById('site-footer');
    if (mount) mount.innerHTML = html;
    else document.body.insertAdjacentHTML('beforeend', html);
  }

  function initShell(activeKey = '', { skipFooter = false } = {}) {
    renderNavbar(activeKey);
    if (!skipFooter) renderFooter();
  }

  window.NDUI = {
    esc,
    SERVICES_MENU,
    initShell,
    renderNavbar,
    renderFooter,
    toast,
    openModal,
    closeModal,
    confirmDialog,
    statusBadge,
    renderStepper,
    renderBreadcrumbs,
    renderEmptyState,
    renderSkeletonCards,
    renderPagination,
    downloadTextFile,
    downloadDocxOrTxt,
    printDocument,
    downloadIcs
  };
})();
