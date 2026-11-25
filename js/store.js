(function () {
  const DATA_KEY = 'nyayadheesh_demo_state_v3';
  const SESSION_KEY = 'nyayadheesh_demo_session_v3';

  function loadState() {
    try {
      const raw = localStorage.getItem(DATA_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === 4 && Array.isArray(parsed.lawyers) && parsed.lawyers.length >= 100) {
          return parsed;
        }
      }
    } catch {}
    const fresh = window.NDSeed.createInitialState();
    saveState(fresh);
    return fresh;
  }

  function saveState(st) {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(st));
    } catch {}
    return st;
  }

  function uid(prefix) {
    return prefix + '-' + Math.random().toString(36).slice(2, 6).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  const NotificationService = {
    list() {
      return loadState().notifications;
    },
    unreadCount() {
      return loadState().notifications.filter(n => !n.read).length;
    },
    add({ title, message, link = 'Dashboard.html#overview' }) {
      const st = loadState();
      const item = { id: uid('NTF'), title, message, time: 'Just now', read: false, link };
      st.notifications.unshift(item);
      if (st.notifications.length > 40) st.notifications.length = 40;
      saveState(st);
      return item;
    },
    markRead(id) {
      const st = loadState();
      const n = st.notifications.find(x => x.id === id);
      if (n) n.read = true;
      saveState(st);
    },
    markAllRead() {
      const st = loadState();
      st.notifications.forEach(n => { n.read = true; });
      saveState(st);
    }
  };

  // Demo-only auth — never stores real passwords in localStorage
  const AuthService = {
    getSession() {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        if (s && s.email && s.email.endsWith('.demo')) {
          return this.demoLogin(s.role);
        }
        return s;
      } catch {
        return null;
      }
    },
    isAuthenticated() {
      return Boolean(this.getSession());
    },
    demoLogin(role = 'client') {
      const st = loadState();
      const isLawyer = role === 'lawyer';
      const u = isLawyer ? st.demoLawyerAccount : st.demoUser;
      const session = {
        token: 'demo-session-' + Date.now().toString(36),
        userId: u.id,
        lawyerId: u.lawyerId || null,
        name: u.name,
        email: u.email,
        role: isLawyer ? 'lawyer' : 'client',
        isDemo: true
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    },
    login({ email, password }) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.');
      if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.');

      const st = loadState();
      let account = st.registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!account) {
        if (['aarav.mehta@nyayadheesh.in', 'demo@nyayadheesh.demo', 'user@demo.invalid'].includes(cleanEmail)) {
          account = st.demoUser;
        } else if (['advocate@nyayadheesh.in', 'lawyer@nyayadheesh.demo', 'lawyer@demo.invalid'].includes(cleanEmail)) {
          account = st.demoLawyerAccount;
        } else {
          throw new Error('No account matches that email. Use Citizen/Lawyer Login or create a new account.');
        }
      }
      const session = {
        token: 'demo-session-' + Date.now().toString(36),
        userId: account.id,
        lawyerId: account.lawyerId || null,
        name: account.name,
        email: account.email,
        role: account.role || 'client',
        isDemo: true
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return session;
    },
    register({ name, email, password, city = 'New Delhi' }) {
      const cleanName = String(name || '').trim();
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (cleanName.length < 2) throw new Error('Please enter your full name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.');
      if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.');

      const st = loadState();
      if (st.registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists. Please sign in.');
      }
      const newUser = {
        id: uid('USR'),
        name: cleanName,
        email: cleanEmail,
        phone: '',
        city,
        preferredLanguage: 'English',
        role: 'client',
        isDemo: true
      };
      st.registeredUsers.push(newUser);
      st.demoUser = { ...st.demoUser, name: cleanName, email: cleanEmail, city };
      saveState(st);

      const session = {
        token: 'demo-session-' + Date.now().toString(36),
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'client',
        isDemo: true
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      NotificationService.add({
        title: 'Account Created',
        message: `Welcome ${cleanName}. Your NyayaDheesh workspace is ready.`,
        link: 'Dashboard.html#overview'
      });
      return session;
    },
    requestPasswordReset(email) {
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.');
      return { resetToken: 'ND-RST-' + Math.random().toString(36).slice(2, 7).toUpperCase(), email: cleanEmail };
    },
    completePasswordReset({ token, password }) {
      if (!token || token.trim().length < 5) throw new Error('Invalid or missing reset code.');
      if (!password || password.length < 8) throw new Error('New password must be at least 8 characters.');
      return { ok: true };
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
    },
    requireAuth(returnUrl) {
      const s = this.getSession();
      if (!s) {
        const next = encodeURIComponent(returnUrl || (location.pathname.split('/').pop() + location.search + location.hash));
        location.replace('auth.html?mode=login&next=' + next);
        return null;
      }
      return s;
    }
  };

  const LawyerService = {
    listAll() {
      return loadState().lawyers;
    },
    getById(id) {
      return loadState().lawyers.find(l => l.id === id) || null;
    },
    query({
      search = '',
      city = '',
      pincode = '',
      area = '',
      minExp = 0,
      language = '',
      maxFee = 0,
      mode = '',
      availability = '',
      sort = 'experience_desc',
      userCoords = null,
      page = 1,
      pageSize = 12
    } = {}) {
      let items = loadState().lawyers.map(l => ({
        ...l,
        distanceKm: userCoords ? Number(haversineKm(userCoords.lat, userCoords.lon, l.lat, l.lon).toFixed(1)) : null
      }));

      const q = search.trim().toLowerCase();
      const pin = pincode.trim();

      items = items.filter(l => {
        if (q) {
          const hay = `${l.name} ${l.city} ${l.pincode} ${l.primaryArea} ${l.practiceAreas.join(' ')} ${l.languages.join(' ')} ${l.bio}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (city && l.city !== city) return false;
        if (pin && !l.pincode.startsWith(pin)) return false;
        if (area && !l.practiceAreas.includes(area)) return false;
        if (minExp && l.experience < Number(minExp)) return false;
        if (language && !l.languages.includes(language)) return false;
        if (maxFee && l.fee > Number(maxFee)) return false;
        if (mode && !l.modes.includes(mode)) return false;
        if (availability && l.availability !== availability) return false;
        return true;
      });

      const availRank = { Today: 0, Tomorrow: 1, 'This Week': 2 };
      items.sort((a, b) => {
        if (sort === 'distance' && userCoords) return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
        if (sort === 'fee_asc') return a.fee - b.fee;
        if (sort === 'fee_desc') return b.fee - a.fee;
        if (sort === 'availability') return (availRank[a.availability] ?? 9) - (availRank[b.availability] ?? 9) || b.experience - a.experience;
        if (sort === 'name_asc') return a.name.localeCompare(b.name);
        return b.experience - a.experience || a.fee - b.fee;
      });

      const total = items.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * pageSize;

      return {
        items: items.slice(start, start + pageSize),
        total,
        page: safePage,
        totalPages,
        pageSize
      };
    },
    getSavedIds() {
      return loadState().savedLawyerIds || [];
    },
    getSaved() {
      const st = loadState();
      const set = new Set(st.savedLawyerIds || []);
      return st.lawyers.filter(l => set.has(l.id));
    },
    toggleSaved(lawyerId) {
      const st = loadState();
      const idx = st.savedLawyerIds.indexOf(lawyerId);
      let saved;
      if (idx >= 0) {
        st.savedLawyerIds.splice(idx, 1);
        saved = false;
      } else {
        st.savedLawyerIds.unshift(lawyerId);
        saved = true;
      }
      saveState(st);
      return saved;
    }
  };

  const AppointmentService = {
    list() {
      return loadState().appointments;
    },
    getBookedSlots(lawyerId, date) {
      return loadState().appointments
        .filter(a => a.lawyerId === lawyerId && a.date === date && !['Cancelled', 'Completed'].includes(a.status))
        .map(a => a.slot);
    },
    create({ lawyerId, mode, date, slot, caseSummary }) {
      const st = loadState();
      const lawyer = st.lawyers.find(l => l.id === lawyerId);
      if (!lawyer) throw new Error('Selected lawyer profile was not found.');
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Please choose a valid consultation date.');
      if (!slot) throw new Error('Please select an available time slot.');
      if (!['Video', 'Phone', 'In-Person'].includes(mode)) throw new Error('Please choose a consultation mode.');
      const summary = String(caseSummary || '').trim();
      if (summary.length < 10) throw new Error('Please describe your matter in at least 10 characters.');

      const conflict = st.appointments.some(
        a => a.lawyerId === lawyerId && a.date === date && a.slot === slot && !['Cancelled'].includes(a.status)
      );
      if (conflict) throw new Error('This time slot is already booked. Please pick another time.');

      const appt = {
        id: uid('APT'),
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        practiceArea: lawyer.primaryArea,
        city: lawyer.city,
        mode,
        date,
        slot,
        fee: lawyer.fee,
        status: 'Confirmed',
        caseSummary: summary,
        createdAt: window.NDSeed.isoDay(0)
      };
      st.appointments.unshift(appt);
      saveState(st);

      NotificationService.add({
        title: 'Appointment Confirmed',
        message: `${mode} consultation with ${lawyer.name} on ${date} at ${slot} IST (Ref: ${appt.id}).`,
        link: 'Dashboard.html#appointments'
      });
      return appt;
    },
    reschedule(id, { date, slot }) {
      const st = loadState();
      const appt = st.appointments.find(a => a.id === id);
      if (!appt) throw new Error('Appointment not found.');
      if (['Cancelled', 'Completed'].includes(appt.status)) throw new Error('Completed or cancelled appointments cannot be rescheduled.');
      const conflict = st.appointments.some(
        a => a.id !== id && a.lawyerId === appt.lawyerId && a.date === date && a.slot === slot && a.status !== 'Cancelled'
      );
      if (conflict) throw new Error('That slot is already reserved. Please choose another time.');
      appt.date = date;
      appt.slot = slot;
      appt.status = 'Rescheduled';
      saveState(st);

      NotificationService.add({
        title: 'Appointment Rescheduled',
        message: `Ref ${appt.id} with ${appt.lawyerName} moved to ${date} at ${slot} IST.`,
        link: 'Dashboard.html#appointments'
      });
      return appt;
    },
    cancel(id) {
      const st = loadState();
      const appt = st.appointments.find(a => a.id === id);
      if (!appt) throw new Error('Appointment not found.');
      appt.status = 'Cancelled';
      saveState(st);

      NotificationService.add({
        title: 'Appointment Cancelled',
        message: `Consultation ${appt.id} with ${appt.lawyerName} has been cancelled.`,
        link: 'Dashboard.html#appointments'
      });
      return appt;
    }
  };

  const DocumentService = {
    getTemplates() {
      return window.NDSeed.DOCUMENT_TEMPLATES;
    },
    getSampleDocuments() {
      return window.NDSeed.SAMPLE_DOCUMENTS;
    },
    listGenerated() {
      return loadState().generatedDocs;
    },
    saveGenerated({ templateId, templateName, title, content, status = 'Saved Draft' }) {
      const st = loadState();
      const doc = {
        id: uid('GDOC'),
        templateId,
        templateName,
        title: String(title || templateName).trim(),
        content,
        status,
        createdAt: window.NDSeed.isoDay(0)
      };
      st.generatedDocs.unshift(doc);
      saveState(st);
      NotificationService.add({
        title: 'Document Draft Saved',
        message: `"${doc.title}" saved to Generated Documents.`,
        link: 'Dashboard.html#generated'
      });
      return doc;
    },
    deleteGenerated(id) {
      const st = loadState();
      st.generatedDocs = st.generatedDocs.filter(d => d.id !== id);
      saveState(st);
    },
    listAnalyses() {
      return loadState().savedAnalyses;
    },
    saveAnalysis({ sourceName, sourceType, previewText, analysis, isSimulated = true }) {
      const st = loadState();
      const item = {
        id: uid('ANL'),
        sourceName,
        sourceType,
        previewText,
        analysis,
        isSimulated,
        createdAt: window.NDSeed.isoDay(0)
      };
      st.savedAnalyses.unshift(item);
      saveState(st);
      NotificationService.add({
        title: 'Document Analysis Saved',
        message: `Analysis for "${sourceName}" added to your Document Analysis history.`,
        link: 'Dashboard.html#analyses'
      });
      return item;
    },
    deleteAnalysis(id) {
      const st = loadState();
      st.savedAnalyses = st.savedAnalyses.filter(a => a.id !== id);
      saveState(st);
    },
    // Honest simulated local structural extraction for newly uploaded/pasted files (no 3rd party transmission)
    analyzeCustomText(text, fileName = 'Uploaded Document') {
      const clean = String(text || '').trim();
      const lower = clean.toLowerCase();
      const words = (clean.match(/\S+/g) || []).length;

      let docType = 'General Legal / Business Document';
      if (/(rent|landlord|tenant|lease|deposit)/i.test(lower)) docType = 'Tenancy / Lease Document';
      else if (/(employee|employer|salary|ctc|probation|resignation)/i.test(lower)) docType = 'Employment / HR Agreement';
      else if (/(confidential|non-disclosure|nda|proprietary)/i.test(lower)) docType = 'Confidentiality / NDA Document';
      else if (/(loan|lender|borrower|principal|interest|repayment)/i.test(lower)) docType = 'Loan / Financing Document';
      else if (/(notice|demand|overdue|breach|remedy)/i.test(lower)) docType = 'Formal Notice / Demand Letter';
      else if (/(affidavit|solemnly affirm|deponent|oath)/i.test(lower)) docType = 'Sworn Affidavit / Declaration';
      else if (/(service provider|deliverables|milestone|client|invoice)/i.test(lower)) docType = 'Service / Consulting Contract';

      const dates = [...new Set(clean.match(/\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d+\s+(?:day|days|week|weeks|month|months|year|years))\b/gi) || [])].slice(0, 6);
      const amounts = [...new Set(clean.match(/(?:₹|Rs\.?|INR)\s*[\d,]+(?:\.\d{1,2})?|\b\d+(?:\.\d+)?\s*(?:lakh|lakhs|crore|crores)\b/gi) || [])].slice(0, 6);

      const clauses = [];
      if (/terminat|notice|cancel/i.test(lower)) clauses.push('Termination & Notice language detected in uploaded text.');
      if (/deposit|payment|fee|rent|salary|amount|₹|rs\./i.test(lower)) clauses.push(`Financial / payment references found${amounts.length ? ': ' + amounts.join(', ') : ''}.`);
      if (/confidential|privacy|secret/i.test(lower)) clauses.push('Confidentiality or non-disclosure terms detected.');
      if (/indemnif|liabilit|penalty|forfeit/i.test(lower)) clauses.push('Liability, indemnity, or penalty language detected.');
      if (/arbitrat|mediat|jurisdiction|court/i.test(lower)) clauses.push('Dispute resolution or jurisdiction wording detected.');
      if (!clauses.length) clauses.push('No standard contractual clause headings were detected via local keyword scan—review full text directly.');

      const issues = [];
      if (/forfeit|non-refundable|sole discretion|without notice/i.test(lower)) {
        issues.push('Flagged wording ("forfeit", "non-refundable", "sole discretion", or "without notice") — discuss fairness and mutuality with a lawyer.');
      }
      if (/non-compete|restraint/i.test(lower)) {
        issues.push('Restrictive non-compete wording detected — discuss enforceability limits with a qualified advocate.');
      }
      if (!/arbitrat|mediat|jurisdiction|court/i.test(lower)) {
        issues.push('No explicit jurisdiction or mediation/dispute-resolution clause detected in the extracted text.');
      }
      if (!issues.length) {
        issues.push('Automated local scan found no obvious one-sided keywords; a manual legal review is still essential before signing.');
      }

      return {
        docType,
        summary: `Extracted ${words} words locally from "${fileName}" without transmitting content to external servers. Detected category: ${docType}${amounts.length ? `, referencing ${amounts.slice(0, 3).join(', ')}` : ''}. Treat this output as a structured starting review.`,
        importantClauses: clauses,
        importantDates: dates.length ? dates.map(d => 'Referenced date / period: ' + d) : ['No explicit dates or timeframes detected in extracted text.'],
        obligations: [
          'Verify all named parties, signatory authority, and delivery/payment milestones in the uploaded text.',
          'Confirm renewal, notice, and handover responsibilities before execution.'
        ],
        potentialIssues: issues,
        lawyerQuestions: [
          'Do the rights, termination notice periods, and liability caps balance fairly between both sides?',
          'Are any local stamp duty, notarisation, or registration formalities required before execution?',
          'What protective clauses are missing for my specific situation?'
        ]
      };
    },
    listGuidanceWorkflows() {
      return window.NDSeed.GUIDANCE_WORKFLOWS;
    },
    listGuidanceHistory() {
      return loadState().savedGuidance;
    },
    saveGuidance({ workflowId, title, answers, summary, workflow }) {
      const st = loadState();
      const item = { id: uid('GDE'), workflowId, title, answers, summary, workflow, createdAt: window.NDSeed.isoDay(0) };
      st.savedGuidance.unshift(item);
      saveState(st);
      NotificationService.add({
        title: 'Legal Guidance Saved',
        message: `"${title}" procedural checklist saved to Guidance History.`,
        link: 'Dashboard.html#guidance'
      });
      return item;
    },
    deleteGuidance(id) {
      const st = loadState();
      st.savedGuidance = st.savedGuidance.filter(g => g.id !== id);
      saveState(st);
    }
  };

  const CaseService = {
    listSamples() {
      return window.NDSeed.CASE_SAMPLES;
    },
    listHistory() {
      return loadState().savedCases;
    },
    // Strictly illustrative exploration — never fabricates real court judgments or case citations
    exploreCustomCase({ title, category, situation, facts, documents }) {
      const t = String(title || '').trim();
      const s = String(situation || '').trim();
      const f = String(facts || '').trim();
      const docs = String(documents || '').trim();
      if (t.length < 4) throw new Error('Please enter a case title (at least 4 characters).');
      if (s.length < 20) throw new Error('Please describe the situation in at least 20 characters.');

      const combined = (s + ' ' + f + ' ' + docs).toLowerCase();
      const hasDocs = docs.length > 5 || /(agreement|contract|invoice|receipt|email|notice|photo|statement|memo)/i.test(combined);
      const hasNotice = /(notice|email|reminder|complaint|written)/i.test(combined);

      return {
        overview: `Structured overview for "${t}" under ${category}. Based on your summary, the matter involves factual and documentary questions best evaluated with a qualified practitioner. No outcome is predicted or guaranteed.`,
        legalQuestions: [
          `Which specific legal obligations and remedies govern ${category.toLowerCase()} in the relevant state/jurisdiction?`,
          'Is the claim within applicable statutory limitation timelines from the date the dispute arose?',
          'Are there contractual notice, cure, mediation, or arbitration prerequisites before approaching a forum?'
        ],
        possibleArguments: {
          claimant: [
            hasDocs ? 'Supporting documentary records mentioned in your notes help corroborate the timeline and claim.' : 'A clear chronological account can be organised into a written demand and supporting record bundle.',
            hasNotice ? 'Prior written communication demonstrates reasonable effort to resolve the dispute.' : 'Sending a structured written notice or proposing mediation establishes good-faith effort.',
            'Focus on clear, verifiable relief directly connected to documented facts.'
          ],
          respondent: [
            'May question completeness of documentation, contractual compliance, or exact calculation of relief sought.',
            'May raise jurisdictional objections, limitation concerns, or alternative factual interpretations.'
          ]
        },
        missingInfo: [
          !hasDocs ? 'Supporting written agreements, receipts, or dated communications have not yet been listed.' : 'Verify originals and electronic-evidence authentication for listed documents.',
          'Exact dates for all key events to confirm applicable limitation periods.',
          'Counterparty’s complete formal identity, registered address, and any prior written responses.'
        ],
        researchAreas: [
          `Primary Indian legal frameworks governing ${category}`,
          'Appropriate forum selection (Civil Court, Consumer Commission, Regulatory Authority, or Mediation)',
          'Pre-litigation notice requirements and evidentiary standards'
        ],
        considerations: [
          'This structured analysis is for legal preparation and does not substitute for qualified legal advice.',
          'Consider whether voluntary mediation could achieve a faster, lower-cost outcome before litigation.'
        ],
        consultationQuestions: [
          'What is the strongest and weakest factual aspect of my position?',
          'Which specific documents should I gather before issuing a formal notice?',
          'What realistic timelines and cost ranges should I expect for mediation versus formal filing?'
        ]
      };
    },
    saveCase({ title, category, situation, facts, documents, report }) {
      const st = loadState();
      const item = {
        id: uid('CSIM'),
        title,
        category,
        situation,
        facts,
        documents,
        report,
        isFictionalDemo: true,
        createdAt: window.NDSeed.isoDay(0)
      };
      st.savedCases.unshift(item);
      saveState(st);
      NotificationService.add({
        title: 'Case Exploration Saved',
        message: `Report for "${title}" saved to Case Analysis History.`,
        link: 'Dashboard.html#cases'
      });
      return item;
    },
    deleteCase(id) {
      const st = loadState();
      st.savedCases = st.savedCases.filter(c => c.id !== id);
      saveState(st);
    }
  };

  const MediationService = {
    listMediators({ search = '', category = '', city = '' } = {}) {
      const q = search.trim().toLowerCase();
      return loadState().mediators.filter(m => {
        if (category && !m.categories.includes(category)) return false;
        if (city && m.city !== city) return false;
        if (q && !`${m.name} ${m.city} ${m.specialty} ${m.categories.join(' ')} ${m.languages.join(' ')}`.toLowerCase().includes(q)) return false;
        return true;
      });
    },
    listRequests() {
      return loadState().mediationRequests;
    },
    submitRequest({ category, title, description, otherParty, mediatorId, preferredDate, preferredSlot, mode }) {
      const st = loadState();
      if (!category) throw new Error('Please choose a dispute category.');
      if (!title || title.trim().length < 4) throw new Error('Please provide a short title for the dispute.');
      if (!description || description.trim().length < 15) throw new Error('Please describe the dispute in at least 15 characters.');
      if (!preferredDate) throw new Error('Please choose a preferred availability date.');

      const med = st.mediators.find(m => m.id === mediatorId) || st.mediators[0];
      const req = {
        id: uid('MREQ'),
        category,
        title: title.trim(),
        description: description.trim(),
        otherParty: String(otherParty || 'Counterparty').trim(),
        mediatorId: med.id,
        mediatorName: med.name,
        preferredDate,
        preferredSlot: preferredSlot || '11:00',
        mode: mode || 'Online Video',
        status: 'Submitted',
        createdAt: window.NDSeed.isoDay(0)
      };
      st.mediationRequests.unshift(req);
      saveState(st);
      NotificationService.add({
        title: 'Mediation Request Submitted',
        message: `Ref ${req.id} ("${req.title}") submitted with preferred mediator ${med.name}.`,
        link: 'Dashboard.html#mediations'
      });
      return req;
    },
    advanceDemoStatus(id) {
      const stages = window.NDSeed.MEDIATION_STAGES;
      const st = loadState();
      const req = st.mediationRequests.find(r => r.id === id);
      if (!req) throw new Error('Mediation request not found.');
      const idx = stages.indexOf(req.status);
      if (idx < stages.length - 1) {
        req.status = stages[idx + 1];
        saveState(st);
        NotificationService.add({
          title: 'Mediation Status Updated',
          message: `Request ${req.id} moved to "${req.status}".`,
          link: 'Dashboard.html#mediations'
        });
      }
      return req;
    }
  };

  const ProfileService = {
    get() {
      const st = loadState();
      const s = AuthService.getSession();
      return {
        ...st.demoUser,
        ...(s ? { name: st.demoUser.name || s.name, email: st.demoUser.email || s.email } : {}),
        preferences: st.preferences
      };
    },
    update({ name, email, phone, city, preferredLanguage, preferences }) {
      const st = loadState();
      if (name !== undefined) {
        if (String(name).trim().length < 2) throw new Error('Name must be at least 2 characters.');
        st.demoUser.name = String(name).trim();
      }
      if (email !== undefined) {
        const em = String(email).trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('Enter a valid email address.');
        st.demoUser.email = em;
      }
      if (phone !== undefined) st.demoUser.phone = String(phone).trim();
      if (city !== undefined) st.demoUser.city = String(city).trim();
      if (preferredLanguage !== undefined) st.demoUser.preferredLanguage = String(preferredLanguage).trim();
      if (preferences) st.preferences = { ...st.preferences, ...preferences };
      saveState(st);

      const s = AuthService.getSession();
      if (s) {
        s.name = st.demoUser.name;
        s.email = st.demoUser.email;
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      }
      return this.get();
    }
  };

  const ContactService = {
    list() {
      return loadState().contacts || [];
    },
    submit({ name, email, phone, category, message }) {
      if (!name || name.trim().length < 2) throw new Error('Please enter your full name.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Please enter a valid email address.');
      if (!category) throw new Error('Please select an enquiry category.');
      if (!message || message.trim().length < 10) throw new Error('Please enter a message of at least 10 characters.');

      const st = loadState();
      const item = {
        id: uid('ENQ'),
        name: name.trim(),
        email: email.trim(),
        phone: String(phone || '').trim(),
        category,
        message: message.trim(),
        createdAt: new Date().toLocaleString('en-IN')
      };
      st.contacts.unshift(item);
      saveState(st);
      return item;
    }
  };

  const FaqService = {
    list(category = '', search = '') {
      const q = search.trim().toLowerCase();
      return window.NDSeed.FAQS.filter(f => {
        if (category && f.category !== category) return false;
        if (q && !(f.q + ' ' + f.a).toLowerCase().includes(q)) return false;
        return true;
      });
    },
    categories() {
      return [...new Set(window.NDSeed.FAQS.map(f => f.category))];
    }
  };

  const AdvocateService = {
    getProfile() {
      const st = loadState();
      return st.lawyers.find(l => l.id === st.demoLawyerAccount.lawyerId) || st.lawyers[0];
    },
    updateProfile({ name, city, primaryArea, languages, fee, slots, bio }) {
      const st = loadState();
      const l = st.lawyers.find(x => x.id === st.demoLawyerAccount.lawyerId) || st.lawyers[0];
      if (!name || name.trim().length < 2) throw new Error('Please enter a display name.');
      l.name = name.trim();
      l.initials = l.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
      if (city) l.city = city.trim();
      if (primaryArea) {
        l.primaryArea = primaryArea.trim();
        l.practiceAreas[0] = primaryArea.trim();
      }
      if (languages) l.languages = String(languages).split(',').map(x => x.trim()).filter(Boolean);
      if (Number.isFinite(Number(fee)) && Number(fee) >= 0) l.fee = Number(fee);
      if (slots) {
        const parsed = String(slots).split(',').map(x => x.trim()).filter(t => /^([01]\d|2[0-3]):[0-5]\d$/.test(t));
        if (!parsed.length) throw new Error('Provide comma-separated HH:MM time slots (e.g. 10:00, 14:00).');
        l.slots = parsed;
      }
      if (bio) l.bio = bio.trim();
      st.demoLawyerAccount.name = l.name;
      st.demoLawyerAccount.city = l.city;
      saveState(st);
      const s = AuthService.getSession();
      if (s && s.role === 'lawyer') {
        s.name = l.name;
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      }
      return l;
    },
    listCases() {
      return loadState().advocateCases || [];
    },
    addCase({ clientName, title, category, nextDate, notes }) {
      if (!clientName || clientName.trim().length < 2) throw new Error('Please enter client name.');
      if (!title || title.trim().length < 4) throw new Error('Please enter matter title.');
      const st = loadState();
      const item = {
        id: uid('MAT'),
        clientName: clientName.trim(),
        title: title.trim(),
        category: category || 'Property & Real Estate',
        status: 'Active',
        nextDate: nextDate || window.NDSeed.isoDay(5),
        notes: String(notes || 'Intake notes added.').trim()
      };
      st.advocateCases.unshift(item);
      saveState(st);
      return item;
    },
    updateCase(id, { status, nextDate, notes }) {
      const st = loadState();
      const c = st.advocateCases.find(x => x.id === id);
      if (!c) throw new Error('Case not found.');
      if (status) c.status = status;
      if (nextDate) c.nextDate = nextDate;
      if (notes !== undefined) c.notes = notes.trim();
      saveState(st);
      return c;
    },
    updateAppointmentStatus(id, status) {
      const st = loadState();
      const a = st.appointments.find(x => x.id === id);
      if (!a) throw new Error('Appointment not found.');
      a.status = status;
      saveState(st);
      NotificationService.add({
        title: `Appointment ${status}`,
        message: `Consultation ${a.id} with ${a.lawyerName} was marked ${status}.`,
        link: 'Dashboard.html#appointments'
      });
      return a;
    }
  };

  const DemoAdminService = {
    resetAll() {
      const fresh = window.NDSeed.createInitialState();
      saveState(fresh);
      const s = AuthService.getSession();
      if (s) AuthService.demoLogin(s.role);
      return fresh;
    },
    stats() {
      const st = loadState();
      return {
        lawyers: st.lawyers.length,
        mediators: st.mediators.length,
        sampleDocs: window.NDSeed.SAMPLE_DOCUMENTS.length,
        templates: window.NDSeed.DOCUMENT_TEMPLATES.length,
        caseSamples: window.NDSeed.CASE_SAMPLES.length,
        appointments: st.appointments.length,
        mediationRequests: st.mediationRequests.length,
        notifications: st.notifications.length,
        faqs: window.NDSeed.FAQS.length,
        guidanceWorkflows: window.NDSeed.GUIDANCE_WORKFLOWS.length
      };
    }
  };

  window.NDStore = {
    AuthService,
    LawyerService,
    AppointmentService,
    DocumentService,
    CaseService,
    MediationService,
    NotificationService,
    ProfileService,
    ContactService,
    FaqService,
    AdvocateService,
    DemoAdminService
  };
})();
