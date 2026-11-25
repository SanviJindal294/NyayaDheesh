const input = document.getElementById('file');
const paste = document.getElementById('pasteText');
const lang = document.getElementById('langSelect');
const scan = document.getElementById('scan-button');
const notice = document.getElementById('notice');
const result = document.getElementById('printable');

const SAMPLES = {
  rent: `RESIDENTIAL RENT AGREEMENT

This Rent Agreement is made on 15/11/2026 between Mr. Rajesh Malhotra (Landlord) and Mr. Saiyam Rajput (Tenant) for Flat B-402, Saket, New Delhi.
1. Monthly Rent: ₹28,000 payable on or before the 5th of every month.
2. Security Deposit: Tenant has paid ₹84,000 as security deposit. Landlord reserves the right to forfeit the security deposit at sole discretion if the premises are vacated before the 11 months lock-in period.
3. Termination: Landlord may terminate the agreement without notice or without assigning any reason.
4. Auto-renew: Agreement will automatically renew with 15% escalation unless terminated 60 days prior.`,
  employment: `EMPLOYMENT AGREEMENT

Executed on 01/10/2026 between M/s Zenith Digital Pvt. Ltd. (Employer) and Ms. Kavita Rao (Employee), appointed as Senior Software Engineer at an annual CTC of ₹16,50,000.
1. Probation: 6 months. Employer may terminate employment at sole discretion without notice during probation.
2. Non-Compete: Employee agrees not to join any competitor in India for 24 months after resignation or termination.
3. Penalty: Leaving before 18 months attracts a non-refundable training penalty of ₹2,50,000.
4. Confidentiality: Employee shall maintain strict confidentiality over proprietary software and client lists.`,
  cheque: `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

Date: 20/11/2026
From: Adv. Ananya Sharma on behalf of Mr. Sanjay Gupta (Complainant)
To: M/s Apex Hardware Traders (Drawer / Accused), Karol Bagh, New Delhi

1. Against invoice dated 12/09/2026 for supply of goods worth ₹4,50,000, you issued Cheque No. 482910 dated 05/11/2026 drawn on HDFC Bank.
2. Upon presentation, the cheque was returned unpaid via bank return memo dated 08/11/2026 with remark "Funds Insufficient".
3. You are hereby called upon to pay ₹4,50,000 within 15 days of receipt of this notice, failing which criminal prosecution under Section 138 NI Act shall be filed before the jurisdictional Magistrate in New Delhi.`
};

document.querySelectorAll('.chip[data-sample]').forEach(btn => {
  btn.addEventListener('click', () => {
    paste.value = SAMPLES[btn.dataset.sample] || '';
    showToast('Sample document loaded — click Simplify & Analyze!');
  });
});

input.addEventListener('change', (e) => {
  const uploadLabel = document.getElementById('upload-label');
  const fileSelected = document.getElementById('file-selected');
  const fileName = document.getElementById('file-name');
  if (e.target.files.length > 0) {
    const f = e.target.files[0];
    fileName.textContent = f.name;
    const ext = f.name.split('.').pop().toLowerCase();
    fileSelected.querySelector('.file-icon').textContent = ext === 'pdf' ? '📕' : ['jpg', 'jpeg', 'png'].includes(ext) ? '🖼️' : '📄';
    uploadLabel.querySelector('.icon').style.display = 'none';
    uploadLabel.querySelector('.text').style.display = 'none';
    fileSelected.style.display = 'flex';
  }
});

document.querySelector('.change-file').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  input.click();
});

const loadScript = (url) => new Promise((resolve, reject) => {
  const s = document.createElement('script');
  s.src = url;
  s.onload = resolve;
  s.onerror = () => reject(Error('OCR assets unavailable offline. Paste the document text or upload a text-based PDF/DOCX/TXT.'));
  document.head.append(s);
});

async function ocr(file) {
  if (!window.Tesseract) await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
  const worker = await Tesseract.createWorker(lang.value === 'Hindi' ? 'hin+eng' : 'eng');
  try {
    if (file.type !== 'application/pdf') return (await worker.recognize(file)).data.text;
    if (!window.pdfjsLib) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      notice.textContent = 'Running OCR on page ' + i + ' of ' + pdf.numPages + '...';
      const p = await pdf.getPage(i), v = p.getViewport({ scale: 1.5 }), canvas = document.createElement('canvas');
      canvas.width = v.width; canvas.height = v.height;
      await p.render({ canvasContext: canvas.getContext('2d'), viewport: v }).promise;
      text += '\n' + (await worker.recognize(canvas)).data.text;
    }
    return text;
  } finally {
    await worker.terminate();
  }
}

scan.addEventListener('click', async () => {
  scan.disabled = true;
  result.innerHTML = '';
  notice.textContent = 'Reading document...';
  try {
    let text = paste.value.trim();
    const f = input.files[0];
    if (!text && f) {
      if (f.size > 10485760) throw Error('Choose a file under 10 MB.');
      if (f.type.startsWith('image/')) {
        text = await ocr(f);
      } else {
        const fd = new FormData();
        fd.append('file', f);
        const r = await fetch('/local/extract', { method: 'POST', body: fd });
        const j = await r.json();
        if (!r.ok && f.type === 'application/pdf') text = await ocr(f);
        else if (!r.ok) throw Error(j.error);
        else text = j.text;
      }
      paste.value = text;
    }
    if (text.length < 12) throw Error('Upload a readable file, click a Demo Sample above, or paste at least 12 characters.');

    notice.textContent = 'Analyzing clauses, risks, monetary terms, and Indian statutory safeguards...';
    const a = await api('/local/ai', { kind: 'analyze', text, language: lang.value });
    notice.textContent = '';

    const risk = a.riskLevel || 'Moderate Risk';
    const riskCls = risk.includes('High') ? 'risk-high' : risk.includes('Low') ? 'risk-low' : 'risk-med';

    const reportText = Object.entries(a.result).map(([k, v]) => `${k.toUpperCase()}\n${v}`).join('\n\n');

    result.innerHTML = `
      <div class="result-header">
        <div>
          <strong style="font-size:1.15rem;color:#D4A373;">Analysis Complete</strong>
          <span class="risk-badge ${riskCls}" style="margin-left:10px;">${escapeHtml(risk)}</span>
        </div>
        <div class="result-actions">
          <button class="btn-sm" id="btnCopy"><i class="fas fa-copy"></i> Copy Report</button>
          <button class="btn-sm" id="btnSave"><i class="fas fa-bookmark"></i> Save to Dashboard</button>
          <button class="btn-sm" id="btnPrint"><i class="fas fa-print"></i> Print / PDF</button>
        </div>
      </div>
      <div class="analysis-grid">
        ${Object.entries(a.result).map(([k, v]) => `
          <div class="analysis-card ${k.toLowerCase().includes('red flag') ? 'danger' : ''}">
            <h3>${escapeHtml(k)}</h3>
            <p>${escapeHtml(v)}</p>
          </div>
        `).join('')}
      </div>
      <p style="margin-top:16px;font-size:12px;color:#888;text-align:center;">
        Informational legal breakdown generated by NyayaDheesh. Consult a verified advocate before executing legally binding deeds.
      </p>
    `;

    document.getElementById('btnCopy').onclick = () => {
      navigator.clipboard.writeText(reportText).then(() => showToast('Analysis report copied to clipboard!'));
    };
    document.getElementById('btnPrint').onclick = () => window.print();
    document.getElementById('btnSave').onclick = async () => {
      try {
        const docTitle = 'AI Analysis: ' + (a.result['Document type'] || 'Legal Document').split('(')[0].trim();
        await api('/local/documents', {
          title: docTitle,
          category: 'AI Analysis Report',
          content: reportText,
          status: risk.includes('High') ? 'Action Needed' : 'Verified'
        });
        showToast('Saved to your Dashboard documents!');
      } catch (e) {
        showToast(e.message, 'error');
      }
    };
  } catch (e) {
    notice.textContent = e.message;
    showToast(e.message, 'error');
  } finally {
    scan.disabled = false;
  }
});
