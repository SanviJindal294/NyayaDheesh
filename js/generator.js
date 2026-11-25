function openCategory(e, id) {
  for (const n of document.querySelectorAll('.tabcontent')) n.style.display = n.id === id ? 'block' : 'none';
  for (const n of document.querySelectorAll('.tablinks')) n.classList.toggle('active', n === e.currentTarget);
  document.querySelector('#draft')?.remove();
}

function numberToWords(n) {
  n = Math.floor(Math.abs(Number(n) || 0));
  const low = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  const tens = 'zero ten twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');
  if (n < 20) return low[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + low[n % 10] : '');
  for (const [v, name] of [[10000000, 'crore'], [100000, 'lakh'], [1000, 'thousand'], [100, 'hundred']]) {
    if (n >= v) return numberToWords(Math.floor(n / v)) + ' ' + name + (n % v ? ' ' + numberToWords(n % v) : '');
  }
  return String(n);
}

const DEMO_VALUES = {
  'Full name / first party': 'Saiyam Rajput',
  'Place': 'New Delhi',
  'Property address': 'Flat B-402, Saket Residential Enclave, New Delhi - 110017',
  'Monthly rent': '28000',
  'Deposit': '₹56,000 (refundable within 15 days of peaceful handover)',
  'Tenancy period': '11 months commencing from 01/12/2026 with 1-month mutual notice period',
  'Confidential information': 'Software source code, pricing sheets, business roadmaps, and client lists shared during evaluation',
  'Permitted disclosures': 'Internal employees and legal counsel bound by written confidentiality duties',
  'Duration': '3 years from the date of execution',
  'Cheque number and amount': 'Cheque No. 482910 dated 05/11/2026 for ₹1,85,000 drawn on HDFC Bank, Saket Branch',
  'Bank return memo and date': 'Return Memo dated 08/11/2026 stating "Funds Insufficient"',
  'Payment demand': 'Demand for full payment of ₹1,85,000 within 15 days of receipt under Section 138 NI Act',
  'Annual income': '1200000',
  'Loan amount': '250000'
};

function sampleValueFor(fieldName, docTitle) {
  if (fieldName === 'Date') return new Date().toISOString().slice(0, 10);
  if (DEMO_VALUES[fieldName]) return DEMO_VALUES[fieldName];
  if (/amount|salary|fee|rent|income|sum/i.test(fieldName)) return '₹50,000';
  if (/date|period|duration|expiry|year/i.test(fieldName)) return '12 months from date of execution';
  if (/address|premises/i.test(fieldName)) return '123 Legal Avenue, New Delhi - 110001';
  return `Detailed particulars for ${fieldName.toLowerCase()} under this ${docTitle} as mutually agreed by the parties.`;
}

const CATEGORY_NAMES = {
  agreementType: 'Agreements & Contracts',
  affidavitType: 'Affidavits & Declarations',
  complaintType: 'Complaints & Legal Notices',
  willType: 'Wills & Deeds',
  businessDocType: 'Business & Financial',
  miscDocType: 'Miscellaneous'
};

async function init() {
  const configs = await (await fetch('/js/documents.json')).json();
  const pre = new URLSearchParams(location.search).get('type');

  for (const select of document.querySelectorAll('.tabcontent select')) {
    const section = select.closest('.tabcontent');
    const container = select.parentElement;
    section.replaceChildren(container);
    const form = el('form');
    section.append(form);

    select.onchange = () => {
      form.replaceChildren();
      document.querySelector('#draft')?.remove();
      const c = configs[select.value];
      if (!c) return;

      const info = {};
      for (const k of ['Full name / first party', 'Place', 'Date', ...c.fields]) {
        const type = k === 'Date' ? 'date' : /^(Monthly rent|Annual income|Loan amount)$/.test(k) ? 'number' : (['Place', 'Full name / first party'].includes(k) ? 'text' : 'textarea');
        info[k] = field(form, k, type);
        info[k].required = true;
        if (k === 'Date') info[k].value = new Date().toISOString().slice(0, 10);
        if (info[k].type === 'number') {
          info[k].min = 0; info[k].max = 999999999; info[k].step = 1;
        }
      }

      const actions = el('div');
      actions.className = 'form-actions';

      const fillBtn = el('button', 'Fill Demo Sample');
      fillBtn.type = 'button';
      fillBtn.className = 'btn btn-outline';
      fillBtn.onclick = () => {
        for (const [k, inputEl] of Object.entries(info)) {
          inputEl.value = sampleValueFor(k, c.title);
        }
        showToast('Demo data filled! Click Generate Document.');
      };

      const submit = el('button', 'Generate Legal Draft');
      submit.type = 'submit';
      submit.className = 'btn';

      actions.append(submit, fillBtn);
      form.append(actions);

      form.onsubmit = (e) => {
        e.preventDefault();
        document.querySelector('#draft')?.remove();
        const d = el('section');
        d.id = 'draft';
        const p = el('pre');
        p.id = 'printable';

        const author = info['Full name / first party'].value.trim();
        const place = info['Place'].value.trim();
        const date = info['Date'].value;
        const head = ({
          affidavitType: `I, ${author}, residing/operating at ${place}, do hereby solemnly affirm, declare, and state on oath as follows:`,
          agreementType: `THIS ${c.title.toUpperCase()} is executed at ${place} on ${date} by and between ${author} (First Party) and the counterparty named herein, recording the mutually binding terms below:`,
          complaintType: `FORMAL ${c.title.toUpperCase()}\nPlace: ${place} | Date: ${date}\nSubmitted by: ${author}\n\nTake notice of the following material facts and statutory demand for timely redressal:`,
          willType: `I, ${author}, of sound mind and understanding, execute this ${c.title} at ${place} on ${date} of my own free will without coercion:`,
          businessDocType: `THIS ${c.title.toUpperCase()} is entered into at ${place} on ${date} by ${author} and the undersigned commercial party upon the covenants below:`,
          miscDocType: `To Whomsoever It May Concern,\n\nI, ${author}, at ${place} on ${date}, submit this formal ${c.title} with the particulars below:`
        })[c.group];

        const clauses = Object.entries(info)
          .filter(([k]) => !['Place', 'Date', 'Full name / first party'].includes(k))
          .map(([k, n], idx) => {
            const val = n.type === 'number'
              ? `₹${Number(n.value).toLocaleString('en-IN')} (Rupees ${numberToWords(n.value)} only)`
              : n.value.trim();
            return `${idx + 1}. ${k.toUpperCase()}:\n   ${val}`;
          });

        const draftText = [
          '====================================================================',
          c.title.toUpperCase(),
          `Executed at: ${place}   |   Date: ${date}`,
          '====================================================================',
          head,
          ...clauses,
          `${clauses.length + 1}. DISPUTE RESOLUTION & GOVERNING LAW:\n   This instrument shall be governed by the applicable laws of India. Parties agree to attempt amicable mediation (including under Section 89 CPC) before initiating court litigation at ${place}.`,
          'IN WITNESS WHEREOF, the executant(s) have set their hands on the date and place written above.\n\nSignature (First Party): ________________________    Name: ' + author + '\n\nWitness 1: ________________________                 Witness 2: ________________________',
          'Note: Verify applicable State Stamp Duty, notarisation, or compulsory registration before execution.'
        ].join('\n\n');

        p.textContent = draftText;
        d.append(p);

        const bar = el('div');
        bar.className = 'form-actions draft-actions';

        const docxBtn = el('button', 'Download DOCX (Word)');
        docxBtn.type = 'button';
        docxBtn.className = 'btn';
        docxBtn.onclick = async () => {
          const r = await fetch('/local/docx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: draftText })
          });
          if (!r.ok) { showToast('DOCX export failed', 'error'); return; }
          download(c.title.replace(/[^\w\s-]/g, '') + '.docx', await r.blob(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          showToast('Microsoft Word (.docx) downloaded!');
        };

        const saveBtn = el('button', 'Save to My Dashboard');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-outline';
        saveBtn.onclick = async () => {
          try {
            await api('/local/documents', {
              title: `${c.title} — ${author}`,
              category: CATEGORY_NAMES[c.group] || 'Legal Draft',
              content: draftText,
              status: 'Draft Saved'
            });
            showToast('Saved to your Dashboard! View it anytime in My Documents.');
          } catch (err) {
            showToast(err.message, 'error');
          }
        };

        const printBtn = el('button', 'Print / Save PDF');
        printBtn.type = 'button';
        printBtn.className = 'btn btn-outline';
        printBtn.onclick = () => window.print();

        const copyBtn = el('button', 'Copy Draft');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-outline';
        copyBtn.onclick = () => navigator.clipboard.writeText(draftText).then(() => showToast('Draft copied to clipboard!'));

        bar.append(docxBtn, saveBtn, printBtn, copyBtn);
        d.append(bar);
        section.append(d);
        d.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    };

    if (configs[pre]?.group === select.id) {
      document.querySelector('.tablinks[onclick*="' + section.id + '"]')?.click();
      select.value = pre;
      select.onchange();
    }
  }

  // Default to Rent Agreement selected if none specified so the page feels immediately alive
  if (!pre) {
    const firstSel = document.getElementById('agreementType');
    if (firstSel) {
      firstSel.value = 'rent';
      firstSel.onchange();
    }
  }
}

init().catch(e => {
  document.querySelector('#notice').textContent = e.message;
});
