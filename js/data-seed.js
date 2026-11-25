(function () {
  function isoDay(offsetDays) {
    return new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);
  }

  const CITIES = [
    { name: 'New Delhi', pincodeBase: 110001, lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', pincodeBase: 400001, lat: 19.0760, lon: 72.8777 },
    { name: 'Bengaluru', pincodeBase: 560001, lat: 12.9716, lon: 77.5946 },
    { name: 'Chennai', pincodeBase: 600001, lat: 13.0827, lon: 80.2707 },
    { name: 'Kolkata', pincodeBase: 700001, lat: 22.5726, lon: 88.3639 },
    { name: 'Hyderabad', pincodeBase: 500001, lat: 17.3850, lon: 78.4867 },
    { name: 'Pune', pincodeBase: 411001, lat: 18.5204, lon: 73.8567 },
    { name: 'Ahmedabad', pincodeBase: 380001, lat: 23.0225, lon: 72.5714 },
    { name: 'Jaipur', pincodeBase: 302001, lat: 26.9124, lon: 75.7873 },
    { name: 'Lucknow', pincodeBase: 226001, lat: 26.8467, lon: 80.9462 },
    { name: 'Chandigarh', pincodeBase: 160001, lat: 30.7333, lon: 76.7794 },
    { name: 'Kochi', pincodeBase: 682001, lat: 9.9312, lon: 76.2673 }
  ];

  const FIRST_NAMES = [
    'Aarav', 'Aditi', 'Akshay', 'Alok', 'Amrita', 'Ananya', 'Anirudh', 'Anjali', 'Arjun', 'Arpita',
    'Bhavna', 'Chaitanya', 'Deepak', 'Devika', 'Dhruv', 'Divya', 'Esha', 'Gaurav', 'Harshita', 'Ishaan',
    'Janhvi', 'Kabir', 'Kalyani', 'Karan', 'Kavita', 'Kunal', 'Lavanya', 'Madhav', 'Malini', 'Manish',
    'Meera', 'Mihir', 'Nandini', 'Nikhil', 'Nisha', 'Pallavi', 'Parth', 'Pooja', 'Pranav', 'Preeti',
    'Raghav', 'Rajeshwari', 'Rakesh', 'Rhea', 'Rishabh', 'Rohini', 'Rohan', 'Sakshi', 'Samarth', 'Sanjana',
    'Shreya', 'Siddharth', 'Smriti', 'Soham', 'Sonal', 'Suhani', 'Suresh', 'Tanvi', 'Tarun', 'Uday',
    'Vaishali', 'Varun', 'Vedant', 'Vidya', 'Vikram', 'Vinita', 'Vivek', 'Yash', 'Zoya', 'Prakash',
    'Shalini', 'Arvind', 'Bhargav', 'Charu', 'Dinesh', 'Farhan', 'Gayatri', 'Hemant', 'Indira', 'Jayant',
    'Kirti', 'Lalit', 'Meghna', 'Navneet', 'Ojas', 'Pankaj', 'Radhika', 'Sandeep', 'Tanya', 'Utkarsh',
    'Vandana', 'Yogesh', 'Abhishek', 'Chitra', 'Devesh', 'Gauri', 'Hitesh', 'Ira', 'Keshav', 'Mansi',
    'Neeraj', 'Pratibha', 'Ritika', 'Sameer', 'Shruti', 'Sujata', 'Tejas', 'Vikas'
  ];

  const LAST_NAMES = [
    'Deshmukh', 'Kulkarni', 'Sharma', 'Iyer', 'Nair', 'Chatterjee', 'Banerjee', 'Menon', 'Reddy', 'Rao',
    'Patel', 'Mehta', 'Kapoor', 'Malhotra', 'Khanna', 'Bhatia', 'Verma', 'Srivastava', 'Tiwari', 'Joshi',
    'Bhatt', 'Sen', 'Bose', 'Ghosh', 'Pillai', 'Subramanian', 'Krishnan', 'Rajan', 'Shetty', 'Hegde',
    'Desai', 'Shah', 'Parekh', 'Trivedi', 'Saxena', 'Agarwal', 'Singhal', 'Bansal', 'Goyal', 'Mittal',
    'Chauhan', 'Rathore', 'Solanki', 'Kaur', 'Gill', 'Sandhu', 'Dutta', 'Mukherjee', 'Bhattacharya', 'Dasgupta',
    'Chawla', 'Sethi', 'Tandon', 'Bhargava', 'Kamat', 'Sawant', 'Gokhale', 'Pande', 'Mishra', 'Dubey'
  ];

  const PRACTICE_AREAS = [
    'Property & Real Estate',
    'Family & Matrimonial',
    'Consumer Protection',
    'Employment & Labour',
    'Corporate & Commercial',
    'Contract & Civil Disputes',
    'Cyber & Technology Law',
    'Banking & Debt Recovery',
    'Intellectual Property',
    'Tax & Regulatory Advisory'
  ];

  const REGIONAL_LANGS = {
    'New Delhi': ['English', 'Hindi', 'Punjabi'],
    Mumbai: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    Bengaluru: ['English', 'Kannada', 'Hindi', 'Tamil'],
    Chennai: ['English', 'Tamil', 'Telugu'],
    Kolkata: ['English', 'Bengali', 'Hindi'],
    Hyderabad: ['English', 'Telugu', 'Hindi', 'Urdu'],
    Pune: ['English', 'Marathi', 'Hindi'],
    Ahmedabad: ['English', 'Gujarati', 'Hindi'],
    Jaipur: ['English', 'Hindi'],
    Lucknow: ['English', 'Hindi', 'Urdu'],
    Chandigarh: ['English', 'Hindi', 'Punjabi'],
    Kochi: ['English', 'Malayalam', 'Hindi']
  };

  const EDU_TEMPLATES = [
    'LL.B. (Hons.), National Law Institute',
    'B.A. LL.B., Metropolitan Law College',
    'LL.M. in Commercial & Civil Law',
    'B.B.A. LL.B., Institute of Legal Studies',
    'LL.B., State University Faculty of Law'
  ];

  const AVAILABILITY_TAGS = ['Today', 'Tomorrow', 'This Week'];
  const SLOT_SETS = [
    ['10:00', '11:30', '14:00', '16:00'],
    ['09:30', '11:00', '15:00', '17:30'],
    ['10:30', '12:00', '14:30', '16:30'],
    ['11:00', '13:00', '15:30', '18:00']
  ];
  const MODE_SETS = [
    ['Video', 'Phone', 'In-Person'],
    ['Video', 'Phone'],
    ['Video', 'In-Person'],
    ['Phone', 'In-Person']
  ];

  function buildLawyers() {
    const list = [];
    for (let i = 0; i < 108; i++) {
      const city = CITIES[i % CITIES.length];
      const first = FIRST_NAMES[i % FIRST_NAMES.length];
      const last = LAST_NAMES[(i * 7 + Math.floor(i / 6)) % LAST_NAMES.length];
      const primaryArea = PRACTICE_AREAS[i % PRACTICE_AREAS.length];
      const secondaryArea = PRACTICE_AREAS[(i + 3) % PRACTICE_AREAS.length];
      const experience = 3 + ((i * 5) % 21);
      const fee = 600 + ((i * 3) % 14) * 200;
      const cityLangs = REGIONAL_LANGS[city.name] || ['English', 'Hindi'];
      const langs = cityLangs.slice(0, 2 + (i % Math.min(2, cityLangs.length - 1)));
      const modes = MODE_SETS[i % MODE_SETS.length];
      const availability = AVAILABILITY_TAGS[i % AVAILABILITY_TAGS.length];
      const slots = SLOT_SETS[i % SLOT_SETS.length];
      const pincode = String(city.pincodeBase + ((i * 11) % 85));
      const lat = Number((city.lat + (((i % 9) - 4) * 0.014)).toFixed(4));
      const lon = Number((city.lon + ((((i * 3) % 9) - 4) * 0.014)).toFixed(4));

      list.push({
        id: 'LAW-' + String(i + 1).padStart(3, '0'),
        name: `${first} ${last}`,
        initials: (first[0] + last[0]).toUpperCase(),
        primaryArea,
        practiceAreas: [primaryArea, secondaryArea],
        city: city.name,
        pincode,
        lat,
        lon,
        experience,
        languages: langs,
        fee,
        modes,
        availability,
        slots,
        weeklySchedule: [
          { day: 'Monday – Friday', hours: `${slots[0]} – ${slots[slots.length - 1]} IST` },
          { day: 'Saturday', hours: i % 2 === 0 ? '10:30 – 14:00 IST' : 'By Appointment Only' },
          { day: 'Sunday', hours: 'Unavailable' }
        ],
        education: EDU_TEMPLATES[i % EDU_TEMPLATES.length],
        bio: `Legal practitioner based in ${city.name} with ${experience} years of experience in ${primaryArea.toLowerCase()} and ${secondaryArea.toLowerCase()}. Assists clients with document reviews, structured pre-litigation guidance, and practical dispute resolution planning.`,
        demo: true
      });
    }
    return list;
  }

  function buildMediators() {
    const categories = [
      'Family & Matrimonial',
      'Property & Tenancy',
      'Commercial & Business',
      'Employment & Workplace',
      'Consumer & Housing',
      'Partnership & Equity',
      'Contract & Vendor',
      'Civil & Community'
    ];
    const medFirst = [
      'Ramesh', 'Priya', 'Rajesh', 'Ananya', 'Arun', 'Sneha', 'Mahesh', 'Kavya', 'Nitin', 'Shobha',
      'Sandeep', 'Rekha', 'Gopal', 'Sunita', 'Pradeep', 'Meenakshi', 'Ashok', 'Neha', 'Harish', 'Swati',
      'Subhash', 'Leela', 'Mohan', 'Ritu', 'Vinod'
    ];
    const medLast = [
      'Kumar', 'Sharma', 'Verma', 'Desai', 'Khanna', 'Reddy', 'Joshi', 'Patel', 'Nair', 'Menon',
      'Banerjee', 'Kulkarni', 'Chauhan', 'Iyer', 'Gupta', 'Sen', 'Rao', 'Tiwari', 'Bhatia', 'Kapoor',
      'Pillai', 'Malhotra', 'Mehta', 'Srivastava', 'Saxena'
    ];
    const photos = [
      'Images/Mediators (5).png',
      'Images/Mediators (2).png',
      'Images/Mediators (1).png',
      'Images/Mediators (3).png',
      'Images/Mediators (4).png',
      'Images/Mediators (6).png'
    ];

    return medFirst.map((f, i) => {
      const city = CITIES[i % CITIES.length];
      const primary = categories[i % categories.length];
      const secondary = categories[(i + 2) % categories.length];
      const exp = 5 + ((i * 3) % 16);
      const langs = (REGIONAL_LANGS[city.name] || ['English', 'Hindi']).slice(0, 2);
      return {
        id: 'MED-' + String(i + 1).padStart(3, '0'),
        name: `${f} ${medLast[i]}`,
        initials: (f[0] + medLast[i][0]).toUpperCase(),
        photo: i < 6 ? photos[i] : '',
        city: city.name,
        specialty: primary,
        categories: [primary, secondary],
        experience: exp,
        languages: langs,
        modes: i % 3 === 0 ? ['Online Video', 'In-Person'] : ['Online Video', 'Phone', 'In-Person'],
        availability: AVAILABILITY_TAGS[i % AVAILABILITY_TAGS.length],
        bio: `Certified mediator in ${city.name} focusing on structured, voluntary dialogue in ${primary.toLowerCase()} and ${secondary.toLowerCase()} disagreements. Helps parties clarify priorities and draft mutually acceptable settlement frameworks.`,
        demo: true
      };
    });
  }

  const SAMPLE_DOCUMENTS = [
    {
      id: 'SDOC-01',
      title: 'Residential Rental Agreement (11-Month Term)',
      category: 'Property & Tenancy',
      fileType: 'DOCX',
      text: `RESIDENTIAL RENT AGREEMENT\nExecuted on 15 November 2026 at New Delhi between Mr. Rajesh Malhotra (Landlord) and Mr. Aarav Mehta (Tenant) for Flat B-402, Saket Enclave, New Delhi.\n1. Term: 11 months commencing 01 December 2026.\n2. Monthly Rent: ₹28,000 payable on or before the 5th of each calendar month.\n3. Security Deposit: ₹56,000 refundable after handover; Landlord may deduct unpaid utility dues or damages beyond normal wear and tear. Refund timeline is not specified.\n4. Lock-In: 6-month lock-in period applies to Tenant only; Landlord may terminate with 15 days written notice.\n5. Maintenance: Tenant pays monthly society maintenance charges of ₹3,200 directly to RWA.`,
      analysis: {
        docType: 'Residential Rental / Leave & License Agreement',
        summary: 'An 11-month residential tenancy draft setting rent at ₹28,000/month with a ₹56,000 security deposit and ₹3,200 monthly society maintenance. While basic commercial terms are clear, termination notice and lock-in obligations are uneven between landlord and tenant, and no security deposit refund deadline is stated.',
        importantClauses: [
          'Rent & Due Date: ₹28,000 due by the 5th of each month.',
          'Security Deposit: ₹56,000 held against unpaid dues and damages beyond normal wear and tear.',
          'Asymmetric Lock-In & Termination: 6-month lock-in binds only the tenant while the landlord retains a 15-day exit clause.',
          'Society Maintenance: ₹3,200/month payable separately by the tenant.'
        ],
        importantDates: [
          'Execution Date: 15 November 2026',
          'Commencement Date: 01 December 2026',
          'Lease Duration: 11 Months (ends 31 October 2027)',
          'Monthly Rent Due Date: 5th of every month'
        ],
        obligations: [
          'Tenant: Timely monthly rent and RWA maintenance payment; maintain premises excluding normal wear and tear.',
          'Landlord: Deliver peaceful possession and account for any deductions from the ₹56,000 deposit.'
        ],
        potentialIssues: [
          'High Priority: No explicit timeline (e.g., 15–30 days post-handover) for refunding the ₹56,000 security deposit.',
          'High Priority: One-sided lock-in and short 15-day landlord termination notice expose the tenant to sudden relocation risk.',
          'Moderate Priority: No itemised inventory list of fixtures/appliances attached to prevent exit-time deduction disputes.'
        ],
        lawyerQuestions: [
          'Should lock-in and 30-day termination notice periods be made mutual for both landlord and tenant?',
          'What specific refund timeframe and itemised receipt clause should protect the security deposit?',
          'Are local stamp duty and police verification formalities completed for this city?'
        ]
      }
    },
    {
      id: 'SDOC-02',
      title: 'Software Engineer Employment Agreement',
      category: 'Employment',
      fileType: 'PDF',
      text: `EMPLOYMENT AGREEMENT\nDated 01 October 2026 between M/s Zenith Digital Systems Pvt. Ltd. (Employer, Bengaluru) and Ms. Kavita Rao (Employee).\n1. Role & Compensation: Senior Product Engineer; Annual CTC ₹16,50,000 payable monthly.\n2. Probation: 6 months; either party may terminate with 15 days notice during probation, and 60 days post-confirmation.\n3. Post-Employment Non-Compete: Employee shall not join any direct competitor anywhere in India for 24 months post-exit.\n4. Training Bond: Resignation within 18 months requires repayment of ₹2,50,000 as training cost.\n5. IP Assignment: All inventions created during employment—including personal weekend projects—belong exclusively to Employer.`,
      analysis: {
        docType: 'Employment Agreement / Appointment Contract',
        summary: 'A full-time technology employment agreement with a ₹16,50,000 CTC and standard probation/notice structure, paired with broad restrictive covenants covering a 24-month non-compete, ₹2,50,000 early-exit bond, and an expansive IP assignment clause that captures personal off-hours work.',
        importantClauses: [
          'Compensation: ₹16,50,000 annual CTC (component split should be verified in annexure).',
          'Notice Period: 15 days during 6-month probation; 60 days after confirmation.',
          'Post-Exit Non-Compete: 24-month restriction across India.',
          'Early-Exit Repayment: ₹2,50,000 bond if leaving before 18 months.',
          'IP Assignment: Captures inventions including personal non-work projects.'
        ],
        importantDates: [
          'Agreement Date: 01 October 2026',
          'Probation Review: 6 months from joining',
          'Bond Period: 18 months from joining',
          'Post-Exit Restriction Window: 24 months'
        ],
        obligations: [
          'Employee: Serve 60-day notice post-confirmation, maintain confidentiality, assign work product IP.',
          'Employer: Pay monthly compensation and honour agreed probation/confirmation terms.'
        ],
        potentialIssues: [
          'High Priority: Broad IP assignment claims ownership over unrelated personal weekend projects.',
          'High Priority: ₹2,50,000 lump-sum training bond lacks proof of actual training expenditure.',
          'Moderate Priority: 24-month post-employment non-compete is unusually broad and often faces enforceability scrutiny.',
          'Moderate Priority: Full-and-final settlement timeline after resignation is omitted.'
        ],
        lawyerQuestions: [
          'Can the IP clause be narrowed to work created using company resources or related to company business?',
          'How enforceable are the 24-month non-compete and ₹2,50,000 training bond under applicable law?',
          'Should we request a written full-and-final settlement timeline (e.g., 30 days) and CTC breakup annexure?'
        ]
      }
    },
    {
      id: 'SDOC-03',
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      category: 'Commercial',
      fileType: 'PDF',
      text: `MUTUAL NON-DISCLOSURE AGREEMENT\nEntered on 10 November 2026 between Vertex Analytics Pvt. Ltd. and Horizon Retail Partners LLP.\n1. Purpose: Evaluating a prospective supply-chain analytics partnership.\n2. Confidential Information: Technical architecture, pricing schedules, customer data, and commercial forecasts.\n3. Term: Confidentiality obligations continue in perpetuity without expiry.\n4. Remedies: Disclosing party may seek injunctive relief and liquidated damages of ₹10,00,000 per breach.`,
      analysis: {
        docType: 'Mutual Non-Disclosure Agreement (NDA)',
        summary: 'A mutual confidentiality contract covering commercial partnership evaluation. While mutual in scope, it imposes perpetual confidentiality with no standard exceptions (such as publicly available information or legally mandated disclosures) and pairs this with a high liquidated damages figure.',
        importantClauses: [
          'Purpose Limitation: Use restricted strictly to evaluating the proposed analytics partnership.',
          'Perpetual Confidentiality: Obligations have no end date.',
          'Remedies: Injunctive relief plus ₹10,00,000 per breach.'
        ],
        importantDates: ['Execution Date: 10 November 2026', 'Confidentiality Expiry: Perpetual (no sunset date)'],
        obligations: ['Both Parties: Protect shared business/technical data and limit internal access to need-to-know staff.'],
        potentialIssues: [
          'High Priority: Standard NDA carve-outs (public domain, prior knowledge, independent development, court order) are missing.',
          'Moderate Priority: Perpetual duration creates long-term compliance burden for non-trade-secret commercial data.',
          'Moderate Priority: No clear governing law, jurisdiction, or return/destruction process upon ending talks.'
        ],
        lawyerQuestions: [
          'Should confidentiality be capped at 3–5 years (except genuine trade secrets)?',
          'Can standard legal exclusions and a clear return-or-destroy clause be added before signing?',
          'Is a ₹10,00,000 liquidated damages figure proportionate for exploratory discussions?'
        ]
      }
    },
    {
      id: 'SDOC-04',
      title: 'Freelance Web Development Service Agreement',
      category: 'Business',
      fileType: 'DOCX',
      text: `INDEPENDENT SERVICE AGREEMENT\nDated 04 November 2026 between BrightLeaf Foods Pvt. Ltd. (Client) and Mr. Rohan Kulkarni (Consultant).\n1. Scope: Design and develop an e-commerce storefront within 8 weeks.\n2. Fees: ₹3,20,000 total — 30% upfront, 70% upon final client satisfaction.\n3. Revisions: Unlimited design revisions at no additional cost.\n4. IP Transfer: All code transfers immediately upon creation regardless of payment status.`,
      analysis: {
        docType: 'Service / Freelancer Consulting Agreement',
        summary: 'A fixed-fee ₹3,20,000 development agreement with a tight 8-week schedule. Several clauses heavily favour the client—specifically unlimited free revisions, subjective final acceptance ("satisfaction"), and IP transfer before final payment.',
        importantClauses: [
          'Milestones: 30% upfront (₹96,000) and 70% (₹2,24,000) tied to final satisfaction.',
          'Revisions: Unlimited revisions included at no extra fee.',
          'Immediate IP Transfer: Ownership passes on creation even if final invoice is unpaid.'
        ],
        importantDates: ['Start Date: 04 November 2026', 'Delivery Timeline: 8 weeks'],
        obligations: ['Consultant: Deliver storefront within 8 weeks.', 'Client: Pay milestone fees.'],
        potentialIssues: [
          'High Priority: IP transfers before full payment—removes consultant leverage if invoices are delayed.',
          'High Priority: "Unlimited revisions" and subjective "satisfaction" trigger risk scope creep and payment holds.',
          'Moderate Priority: No late-payment interest, deemed acceptance window (e.g., 7 business days), or liability cap.'
        ],
        lawyerQuestions: [
          'Can IP assignment be conditioned strictly upon receipt of full final payment?',
          'How should we cap revision rounds (e.g., 2 rounds per milestone) and define objective acceptance criteria?',
          'Should we add a limitation of liability capped at total fees received?'
        ]
      }
    },
    {
      id: 'SDOC-05',
      title: 'Payment Demand Legal Notice (Unpaid Commercial Invoices)',
      category: 'Dispute & Recovery',
      fileType: 'TXT',
      text: `DEMAND NOTICE FOR OVERDUE COMMERCIAL INVOICES\nDate: 18 November 2026\nFrom: M/s Orion Packaging Supplies\nTo: M/s Metro Mart Distributors\n1. Goods worth ₹4,50,000 were supplied against Invoices #INV-211 and #INV-219 in August 2026 with 30-day credit terms.\n2. Despite written reminders on 25 September and 15 October 2026, payment remains outstanding.\n3. Demand: Clear ₹4,50,000 plus applicable delayed-payment interest within 15 days of receipt, failing which formal recovery proceedings or mediation may be initiated.`,
      analysis: {
        docType: 'Commercial Payment Demand Notice',
        summary: 'A pre-litigation commercial demand notice seeking ₹4,50,000 against two overdue August 2026 invoices with a 15-day cure window. The core debt and reminder trail are clear, though interest rate basis and delivery-challan references should be explicitly stated.',
        importantClauses: [
          'Principal Claim: ₹4,50,000 across Invoices #INV-211 and #INV-219.',
          'Cure Window: 15 days from receipt to settle.',
          'Escalation Path: Mentions formal recovery proceedings or mediation.'
        ],
        importantDates: ['Notice Date: 18 November 2026', 'Invoice Period: August 2026 (30-day credit)', 'Prior Reminders: 25 Sep & 15 Oct 2026', 'Response Deadline: 15 days from receipt'],
        obligations: ['Recipient: Pay ₹4,50,000 or submit documented reconciliation within 15 days.'],
        potentialIssues: [
          'Moderate Priority: Exact interest rate percentage and contractual/statutory basis are not specified.',
          'Moderate Priority: Does not list signed delivery receipts/e-way bills confirming defect-free receipt of goods.',
          'Low Priority: Dispatch method (Registered Post AD / Speed Post / official email) should be recorded on the notice.'
        ],
        lawyerQuestions: [
          'Should we attach copies of invoices, ledger statement, and signed delivery proofs?',
          'Is MSME / commercial mediation available as a faster recovery route before civil litigation?'
        ]
      }
    }
  ];

  // Programmatically expand to 20 rich, distinct pre-seeded sample legal documents
  const EXTRA_SAMPLES = [
    ['SDOC-06', 'Commercial Office Lease Deed (3-Year Term)', 'Property & Tenancy', 'PDF', '₹1,45,000/month office lease in Pune with 5% annual escalation and 6-month deposit.', 'Commercial Lease Agreement'],
    ['SDOC-07', 'Co-Founder Partnership Deed', 'Business', 'DOCX', 'Equal 50-50 partnership deed for an architecture studio with ₹15,00,000 initial capital.', 'Partnership Agreement'],
    ['SDOC-08', 'Personal Loan Agreement Between Individuals', 'Finance', 'PDF', '₹3,00,000 friendly loan repayable in 12 monthly instalments at 10% simple annual interest.', 'Loan Agreement'],
    ['SDOC-09', 'Memorandum of Understanding (Joint Event)', 'Commercial', 'DOCX', 'Non-binding MoU outlining co-hosting responsibilities and sponsorship split for a tech summit.', 'Memorandum of Understanding (MoU)'],
    ['SDOC-10', 'Builder-Buyer Apartment Allotment Summary', 'Property & Tenancy', 'PDF', '₹72,00,000 residential flat allotment with construction-linked payment schedule and 36-month possession window.', 'Property Allotment / Sale Agreement'],
    ['SDOC-11', 'Software SaaS Subscription Terms', 'Commercial', 'TXT', 'Annual B2B SaaS licence at ₹2,40,000/year with auto-renewal and 99.5% uptime target.', 'SaaS Subscription Agreement'],
    ['SDOC-12', 'Vendor Supply & Distribution Contract', 'Business', 'DOCX', 'Regional supply contract for packaged goods with 45-day payment cycle and minimum order quantities.', 'Vendor Supply Agreement'],
    ['SDOC-13', 'General Name Change Affidavit Draft', 'Personal & Affidavits', 'TXT', 'Sworn personal affidavit declaring adoption of updated surname for official identity records.', 'Affidavit / Sworn Declaration'],
    ['SDOC-14', 'Vehicle Sale & Transfer Agreement', 'Property & Tenancy', 'PDF', 'Private sale of a used sedan for ₹5,40,000 covering RC transfer responsibility and traffic challan indemnity.', 'Sale Agreement'],
    ['SDOC-15', 'Consultancy Retainer Agreement', 'Employment', 'DOCX', 'Monthly advisory retainer of ₹75,000/month with 30-day termination notice and confidentiality duties.', 'Consultancy Retainer'],
    ['SDOC-16', 'Consumer Complaint Draft (Defective Appliance)', 'Consumer', 'TXT', 'Draft complaint seeking replacement or ₹64,000 refund for a laptop failing repeatedly within warranty.', 'Consumer Complaint Draft'],
    ['SDOC-17', 'Home Renovation Contractor Agreement', 'Property & Tenancy', 'PDF', '₹8,50,000 interior renovation contract split into 4 milestones with a 12-week completion target.', 'Construction / Renovation Contract'],
    ['SDOC-18', 'Simple Family Will & Asset Distribution Draft', 'Family & Estate', 'DOCX', 'Structured testamentary draft naming an executor and allocating bank savings and residential flat.', 'Will / Testamentary Draft'],
    ['SDOC-19', 'Limited Power of Attorney (Property Management)', 'Property & Tenancy', 'PDF', 'Authorising a family member to collect rent and attend society meetings during overseas stay.', 'Power of Attorney Draft'],
    ['SDOC-20', 'Workplace Grievance & Formal Representation', 'Employment', 'TXT', 'Structured internal HR grievance documenting unpaid overtime and requesting formal review.', 'Employment Grievance Representation']
  ];

  EXTRA_SAMPLES.forEach(([id, title, category, fileType, blurb, docType], idx) => {
    const day = isoDay(-10 - idx);
    SAMPLE_DOCUMENTS.push({
      id,
      title,
      category,
      fileType,
      text: `${title.toUpperCase()}\nPrepared on ${day}\n\nOverview: ${blurb}\n\n1. Parties & Scope: Identifies primary obligations, performance standards, and communication channels.\n2. Commercial & Financial Terms: States consideration, payment timing, and documentation duties.\n3. Term & Termination: Specifies duration, renewal conditions, and written notice protocol.\n4. Dispute Resolution: Recommends good-faith negotiation and mediation prior to formal proceedings.`,
      analysis: {
        docType,
        summary: `Structured analysis of "${title}". ${blurb} Core commercial terms are outlined clearly, while execution formalities, dispute forum details, and edge-case remedies warrant review with a qualified lawyer.`,
        importantClauses: [
          'Scope & Core Obligations: Defines deliverables and counterparty performance expectations.',
          'Payment / Financial Schedule: Outlines consideration and billing or transfer conditions.',
          'Termination & Notice: Sets out exit procedure and post-termination handover duties.',
          'Dispute Resolution: Encourages negotiation/mediation before formal escalation.'
        ],
        importantDates: [
          `Reference / Draft Date: ${day}`,
          'Review milestone, renewal, and notice deadlines specified within the agreement text.'
        ],
        obligations: [
          'First Party: Fulfil core delivery, disclosure, or payment duties on schedule and maintain written receipts.',
          'Second Party: Honour reciprocal commitments, notice timelines, and handover formalities.'
        ],
        potentialIssues: [
          'Moderate Priority: Verify whether stamp duty, witness attestation, or registration applies in your state.',
          'Moderate Priority: Clarify cure periods for accidental delays and specify governing city jurisdiction.',
          'Low Priority: Ensure full legal names, addresses, and supporting annexures are attached before signing.'
        ],
        lawyerQuestions: [
          `Are there state-specific stamp duty or registration requirements for this ${docType.toLowerCase()}?`,
          'Are default remedies, liability limits, and exit notice periods balanced for both sides?',
          'Which supporting annexures or identity proofs should be signed alongside this document?'
        ]
      }
    });
  });

  // 10 Guided Legal Document Templates
  const DOCUMENT_TEMPLATES = [
    {
      id: 'rent-agreement',
      name: 'Rent Agreement',
      category: 'Property',
      summary: 'Standard 11-month residential tenancy draft with deposit, maintenance, and mutual notice terms.',
      fields: [
        { key: 'landlordName', label: 'Landlord Full Name', type: 'text', required: true, demo: 'Rajesh Malhotra' },
        { key: 'tenantName', label: 'Tenant Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'propertyAddress', label: 'Premises Address', type: 'textarea', required: true, demo: 'Flat B-402, Saket Enclave, New Delhi - 110017' },
        { key: 'monthlyRent', label: 'Monthly Rent (₹)', type: 'number', required: true, demo: '28000' },
        { key: 'securityDeposit', label: 'Refundable Security Deposit (₹)', type: 'number', required: true, demo: '56000' },
        { key: 'startDate', label: 'Commencement Date', type: 'date', required: true, demo: isoDay(5) },
        { key: 'durationMonths', label: 'Duration (Months)', type: 'number', required: true, demo: '11' },
        { key: 'noticeDays', label: 'Mutual Notice Period (Days)', type: 'number', required: true, demo: '30' }
      ],
      build: d => `RESIDENTIAL RENT AGREEMENT\n\nThis Rent Agreement is made on ${d.startDate} between ${d.landlordName} ("Landlord") and ${d.tenantName} ("Tenant").\n\n1. PREMISES\nThe Landlord agrees to let out the residential premises located at ${d.propertyAddress} to the Tenant strictly for residential use.\n\n2. TERM\nThis tenancy shall remain in effect for ${d.durationMonths} months commencing from ${d.startDate}.\n\n3. MONTHLY RENT\nThe Tenant shall pay a monthly rent of ₹${Number(d.monthlyRent).toLocaleString('en-IN')} on or before the 5th day of each calendar month via bank transfer or UPI.\n\n4. SECURITY DEPOSIT\nThe Tenant has paid an interest-free refundable security deposit of ₹${Number(d.securityDeposit).toLocaleString('en-IN')}, which shall be refunded by the Landlord within 15 days of peaceful handover after adjusting documented unpaid dues.\n\n5. NOTICE & TERMINATION\nEither party may terminate this Agreement by providing ${d.noticeDays} days prior written notice to the other party.\n\n6. DISPUTE RESOLUTION\nParties agree to attempt amicable resolution or mediation prior to initiating formal legal proceedings.\n\nLandlord Signature: _______________________ (${d.landlordName})\nTenant Signature:   _______________________ (${d.tenantName})\nWitness 1: _______________________   Witness 2: _______________________`
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement (NDA)',
      category: 'Commercial',
      summary: 'Mutual confidentiality agreement with clear purpose limits, exclusions, and fixed term.',
      fields: [
        { key: 'partyA', label: 'First Party Name / Entity', type: 'text', required: true, demo: 'Aarav Mehta Ventures' },
        { key: 'partyB', label: 'Second Party Name / Entity', type: 'text', required: true, demo: 'Vertex Analytics Pvt. Ltd.' },
        { key: 'city', label: 'City / Jurisdiction', type: 'text', required: true, demo: 'Bengaluru' },
        { key: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true, demo: 'Evaluating a proposed software product partnership and commercial pilot.' },
        { key: 'termYears', label: 'Confidentiality Duration (Years)', type: 'number', required: true, demo: '3' },
        { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, demo: isoDay(1) }
      ],
      build: d => `MUTUAL NON-DISCLOSURE AGREEMENT\n\nEffective Date: ${d.effectiveDate} | Place: ${d.city}\nBetween: ${d.partyA} ("First Party") and ${d.partyB} ("Second Party").\n\n1. PURPOSE\nThe parties wish to exchange certain non-public business and technical information solely for: ${d.purpose}\n\n2. CONFIDENTIALITY OBLIGATIONS\nEach receiving party shall protect Confidential Information using at least reasonable care and restrict access to personnel with a strict need to know.\n\n3. EXCLUSIONS\nObligations exclude information that is already public without breach, independently developed, lawfully received from a third party, or required to be disclosed by law.\n\n4. TERM\nConfidentiality duties shall remain valid for ${d.termYears} years from the Effective Date.\n\n5. RETURN OR DESTRUCTION\nUpon written request, the receiving party shall return or securely destroy all confidential records.\n\n6. GOVERNING LAW\nThis draft contemplates jurisdiction of competent courts at ${d.city}.\n\nFirst Party:  _______________________ (${d.partyA})\nSecond Party: _______________________ (${d.partyB})`
    },
    {
      id: 'employment-agreement',
      name: 'Employment Agreement',
      category: 'Employment',
      summary: 'Balanced full-time employment contract covering role, CTC, probation, notice, and confidentiality.',
      fields: [
        { key: 'employer', label: 'Employer / Company Name', type: 'text', required: true, demo: 'Horizon Digital Labs Pvt. Ltd.' },
        { key: 'employee', label: 'Employee Full Name', type: 'text', required: true, demo: 'Kavita Rao' },
        { key: 'role', label: 'Job Title / Designation', type: 'text', required: true, demo: 'Senior Product Manager' },
        { key: 'annualCtc', label: 'Annual Compensation / CTC (₹)', type: 'number', required: true, demo: '1500000' },
        { key: 'location', label: 'Work Location', type: 'text', required: true, demo: 'Bengaluru (Hybrid)' },
        { key: 'joiningDate', label: 'Joining Date', type: 'date', required: true, demo: isoDay(10) },
        { key: 'noticeDays', label: 'Notice Period (Days)', type: 'number', required: true, demo: '30' }
      ],
      build: d => `EMPLOYMENT AGREEMENT\n\nDate: ${d.joiningDate} | Location: ${d.location}\nEmployer: ${d.employer}\nEmployee: ${d.employee}\n\n1. APPOINTMENT\nThe Employer appoints ${d.employee} as ${d.role} effective ${d.joiningDate}, stationed at ${d.location}.\n\n2. COMPENSATION\nAnnual gross compensation shall be ₹${Number(d.annualCtc).toLocaleString('en-IN')}, payable monthly subject to applicable statutory deductions.\n\n3. PROBATION & NOTICE\nFollowing successful completion of probation, either party may terminate employment by giving ${d.noticeDays} days written notice or mutually agreed salary in lieu thereof.\n\n4. CONFIDENTIALITY & WORK PRODUCT\nThe Employee shall safeguard proprietary company information. Intellectual property created within the scope of employment duties shall vest in the Employer.\n\n5. FULL & FINAL SETTLEMENT\nEarned salary and statutory dues shall be reconciled promptly upon separation.\n\nFor ${d.employer}: _______________________\nAccepted by Employee: _______________________ (${d.employee})`
    },
    {
      id: 'service-agreement',
      name: 'Service Agreement',
      category: 'Business',
      summary: 'Client–consultant service contract with clear deliverables, milestone payments, and acceptance window.',
      fields: [
        { key: 'client', label: 'Client Name / Entity', type: 'text', required: true, demo: 'BrightLeaf Retail Pvt. Ltd.' },
        { key: 'provider', label: 'Service Provider Name', type: 'text', required: true, demo: 'Aarav Mehta Consulting' },
        { key: 'scope', label: 'Scope of Services & Deliverables', type: 'textarea', required: true, demo: 'UI/UX design, web application implementation, and QA testing over two milestones.' },
        { key: 'totalFee', label: 'Total Service Fee (₹)', type: 'number', required: true, demo: '250000' },
        { key: 'timeline', label: 'Expected Delivery Timeline', type: 'text', required: true, demo: '6 weeks from kickoff' },
        { key: 'date', label: 'Agreement Date', type: 'date', required: true, demo: isoDay(1) }
      ],
      build: d => `SERVICE AGREEMENT\n\nDate: ${d.date}\nClient: ${d.client}\nService Provider: ${d.provider}\n\n1. SCOPE OF SERVICES\n${d.provider} shall perform the following services: ${d.scope}\n\n2. TIMELINE\nEstimated delivery schedule: ${d.timeline}.\n\n3. FEES & PAYMENT\nTotal fee: ₹${Number(d.totalFee).toLocaleString('en-IN')} (40% advance, 30% on mid-point milestone, 30% within 10 business days of final delivery).\n\n4. ACCEPTANCE & REVISIONS\nClient shall review each deliverable within 7 business days and provide consolidated feedback (up to 2 revision cycles included).\n\n5. INTELLECTUAL PROPERTY\nUpon receipt of full payment, rights in custom deliverables transfer to the Client.\n\nClient: _______________________ (${d.client})\nProvider: _____________________ (${d.provider})`
    },
    {
      id: 'legal-notice',
      name: 'Legal Notice',
      category: 'Dispute & Recovery',
      summary: 'Formal pre-litigation demand notice documenting grievance, amount/remedy sought, and response window.',
      fields: [
        { key: 'sender', label: 'Sender Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'recipient', label: 'Recipient Name & Address', type: 'textarea', required: true, demo: 'M/s Apex Traders, 14 Commercial Street, New Delhi' },
        { key: 'subject', label: 'Subject / Matter', type: 'text', required: true, demo: 'Demand for Settlement of Unpaid Dues' },
        { key: 'facts', label: 'Key Facts & Chronology', type: 'textarea', required: true, demo: 'Despite delivery of agreed services on 15 October 2026 against Invoice #408, payment remains unpaid after written reminders.' },
        { key: 'remedy', label: 'Relief / Payment Demanded', type: 'text', required: true, demo: 'Immediate payment of ₹1,45,000 via bank transfer' },
        { key: 'days', label: 'Response Period (Days)', type: 'number', required: true, demo: '15' }
      ],
      build: d => `FORMAL LEGAL NOTICE\n\nDate: ${isoDay(0)}\nFrom: ${d.sender}\nTo: ${d.recipient}\n\nSUBJECT: ${d.subject}\n\nSir / Madam,\n\n1. FACTUAL BACKGROUND\n${d.facts}\n\n2. DEMAND FOR REDRESSAL\nYou are hereby requested to comply with the following demand within ${d.days} days from receipt of this notice: ${d.remedy}.\n\n3. FURTHER ACTION\nIn the event of non-compliance or failure to engage in amicable settlement/mediation within ${d.days} days, the sender reserves all rights to pursue appropriate legal remedies at your risk as to costs.\n\nIssued by: _______________________ (${d.sender})`
    },
    {
      id: 'affidavit',
      name: 'Affidavit',
      category: 'Personal',
      summary: 'Structured sworn declaration draft suitable for address, identity, or general factual verification.',
      fields: [
        { key: 'deponent', label: 'Deponent Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'parentName', label: 'Father / Mother / Spouse Name', type: 'text', required: true, demo: 'Suresh Mehta' },
        { key: 'address', label: 'Residential Address', type: 'textarea', required: true, demo: 'House 24, Sector 18, New Delhi' },
        { key: 'purpose', label: 'Subject of Affidavit', type: 'text', required: true, demo: 'Confirmation of Residential Address' },
        { key: 'statement', label: 'Sworn Statement of Facts', type: 'textarea', required: true, demo: 'I have continuously resided at the above address since January 2023 and the details furnished in my application are true and accurate.' },
        { key: 'place', label: 'Place of Execution', type: 'text', required: true, demo: 'New Delhi' }
      ],
      build: d => `AFFIDAVIT / SWORN DECLARATION\n\nSubject: ${d.purpose}\n\nI, ${d.deponent}, son/daughter/spouse of ${d.parentName}, residing at ${d.address}, do hereby solemnly affirm and state on oath as follows:\n\n1. That I am competent to swear this affidavit.\n2. ${d.statement}\n3. That the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed.\n\nVERIFICATION\nVerified at ${d.place} on ${isoDay(0)} that the contents above are true and correct.\n\nDeponent Signature: _______________________ (${d.deponent})\n(To be notarised / attested before a Notary Public or Oath Commissioner as required)`
    },
    {
      id: 'partnership-agreement',
      name: 'Partnership Agreement',
      category: 'Business',
      summary: 'Founding deed specifying partners, firm name, capital contribution, profit share, and exit terms.',
      fields: [
        { key: 'firmName', label: 'Partnership Firm Name', type: 'text', required: true, demo: 'Studio Navya Design Associates' },
        { key: 'partner1', label: 'Partner 1 Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'partner2', label: 'Partner 2 Full Name', type: 'text', required: true, demo: 'Meera Joshi' },
        { key: 'capital', label: 'Combined Initial Capital (₹)', type: 'number', required: true, demo: '1000000' },
        { key: 'split', label: 'Profit & Loss Ratio', type: 'text', required: true, demo: '50% : 50%' },
        { key: 'city', label: 'Principal Office City', type: 'text', required: true, demo: 'Mumbai' }
      ],
      build: d => `DEED OF PARTNERSHIP\n\nExecuted at ${d.city} on ${isoDay(0)} between ${d.partner1} and ${d.partner2}.\n\n1. FIRM NAME & OFFICE\nThe partners agree to carry on business under the name "${d.firmName}" with principal office at ${d.city}.\n\n2. CAPITAL CONTRIBUTION\nCombined initial capital is ₹${Number(d.capital).toLocaleString('en-IN')}, maintained in proper books of account.\n\n3. PROFIT & LOSS SHARING\nNet profits and losses shall be shared in the ratio: ${d.split}.\n\n4. BANKING & DECISION-MAKING\nMajor borrowings, asset pledges, and admission of new partners require unanimous written consent.\n\n5. RETIREMENT & DISPUTE RESOLUTION\nA retiring partner shall provide 60 days written notice; disputes shall first be referred to mediation.\n\nPartner 1: _______________________ (${d.partner1})\nPartner 2: _______________________ (${d.partner2})`
    },
    {
      id: 'mou',
      name: 'Memorandum of Understanding (MoU)',
      category: 'Commercial',
      summary: 'Framework outlining mutual collaboration objectives, roles, and governance prior to definitive contracts.',
      fields: [
        { key: 'orgA', label: 'First Organisation / Party', type: 'text', required: true, demo: 'NyayaTech Education Initiative' },
        { key: 'orgB', label: 'Second Organisation / Party', type: 'text', required: true, demo: 'Civic Legal Aid Clinic' },
        { key: 'objective', label: 'Shared Objective', type: 'textarea', required: true, demo: 'Conduct joint citizen legal-literacy workshops and plain-language template awareness camps.' },
        { key: 'responsibilities', label: 'Key Responsibilities', type: 'textarea', required: true, demo: 'First Party provides digital materials; Second Party coordinates community venues and scheduling.' },
        { key: 'validity', label: 'Validity Period', type: 'text', required: true, demo: '12 months from signing' }
      ],
      build: d => `MEMORANDUM OF UNDERSTANDING\n\nDate: ${isoDay(0)}\nBetween: ${d.orgA} and ${d.orgB}.\n\n1. SHARED OBJECTIVE\n${d.objective}\n\n2. ROLES & RESPONSIBILITIES\n${d.responsibilities}\n\n3. VALIDITY\nThis MoU remains effective for ${d.validity} unless extended in writing or terminated with 30 days notice.\n\n4. NATURE OF UNDERSTANDING\nExcept for confidentiality provisions, this MoU records good-faith collaboration intent pending definitive agreements where required.\n\nFor ${d.orgA}: _______________________\nFor ${d.orgB}: _______________________`
    },
    {
      id: 'loan-agreement',
      name: 'Loan Agreement',
      category: 'Finance',
      summary: 'Structured principal, interest, repayment schedule, and prepayment draft between lender and borrower.',
      fields: [
        { key: 'lender', label: 'Lender Full Name', type: 'text', required: true, demo: 'Vikram Kapoor' },
        { key: 'borrower', label: 'Borrower Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'principal', label: 'Principal Loan Amount (₹)', type: 'number', required: true, demo: '200000' },
        { key: 'interest', label: 'Annual Simple Interest Rate (%)', type: 'number', required: true, demo: '9' },
        { key: 'tenureMonths', label: 'Repayment Tenure (Months)', type: 'number', required: true, demo: '12' },
        { key: 'disbursalDate', label: 'Disbursal Date', type: 'date', required: true, demo: isoDay(1) }
      ],
      build: d => `LOAN AGREEMENT\n\nDate: ${d.disbursalDate}\nLender: ${d.lender} | Borrower: ${d.borrower}\n\n1. PRINCIPAL AMOUNT\nThe Lender agrees to advance ₹${Number(d.principal).toLocaleString('en-IN')} via verifiable banking channel on ${d.disbursalDate}.\n\n2. INTEREST & REPAYMENT\nThe loan carries simple interest at ${d.interest}% per annum and shall be repaid over ${d.tenureMonths} monthly instalments.\n\n3. PREPAYMENT\nThe Borrower may prepay the outstanding principal in whole or part without prepayment penalty.\n\n4. DEFAULT & CURE\nIn case of missed payment, the Lender shall issue a 15-day written cure notice before initiating formal remedies.\n\nLender:   _______________________ (${d.lender})\nBorrower: _______________________ (${d.borrower})`
    },
    {
      id: 'sale-agreement',
      name: 'Sale Agreement',
      category: 'Property',
      summary: 'Agreement for sale of movable or immovable asset detailing consideration, title warranty, and handover.',
      fields: [
        { key: 'seller', label: 'Seller Full Name', type: 'text', required: true, demo: 'Sandeep Joshi' },
        { key: 'buyer', label: 'Buyer Full Name', type: 'text', required: true, demo: 'Aarav Mehta' },
        { key: 'asset', label: 'Asset / Property Description', type: 'textarea', required: true, demo: 'Residential Apartment Unit 504, Green Park Residency, Pune (1,150 sq. ft. carpet area).' },
        { key: 'price', label: 'Total Sale Consideration (₹)', type: 'number', required: true, demo: '5500000' },
        { key: 'advance', label: 'Advance / Earnest Money Paid (₹)', type: 'number', required: true, demo: '500000' },
        { key: 'completionDate', label: 'Target Handover / Registration Date', type: 'date', required: true, demo: isoDay(45) }
      ],
      build: d => `AGREEMENT TO SELL\n\nDate: ${isoDay(0)}\nSeller: ${d.seller} | Buyer: ${d.buyer}\n\n1. SUBJECT ASSET\n${d.asset}\n\n2. CONSIDERATION\nTotal agreed sale price is ₹${Number(d.price).toLocaleString('en-IN')}. Buyer has paid ₹${Number(d.advance).toLocaleString('en-IN')} as advance; balance ₹${Math.max(0, Number(d.price) - Number(d.advance)).toLocaleString('en-IN')} is payable upon execution of final transfer/registration by ${d.completionDate}.\n\n3. TITLE REPRESENTATION\nSeller confirms clear, marketable title free from undisclosed encumbrances, liens, or pending litigation.\n\n4. HANDOVER & TAXES\nPossession and all title originals shall be delivered upon full settlement. Verify applicable stamp duty and registration formalities.\n\nSeller: _______________________ (${d.seller})\nBuyer:  _______________________ (${d.buyer})`
    }
  ];

  // 10 Interactive Legal Guidance Workflows
  const GUIDANCE_WORKFLOWS = [
    {
      id: 'property-disputes',
      title: 'Property Disputes',
      category: 'Property',
      summary: 'Guidance on title disagreements, boundary issues, possession delays, or co-ownership disputes.',
      questions: [
        { id: 'q1', label: 'What is the primary nature of the property matter?', options: ['Title or Ownership Claim', 'Ancestral / Family Partition', 'Builder Possession Delay', 'Boundary or Encroachment'] },
        { id: 'q2', label: 'Do you hold registered ownership or allotment papers?', options: ['Yes, registered deed / allotment letter', 'Only informal or unregistered papers', 'Copies need to be obtained from records'] },
        { id: 'q3', label: 'Have you communicated your concern in writing yet?', options: ['Yes, written notice / email sent', 'Only verbal discussions so far', 'Not yet communicated'] }
      ],
      procedure: [
        'Gather and verify the complete title chain, allotment agreement, tax receipts, and possession records.',
        'Obtain certified copies from the local sub-registrar or municipal revenue office if any document is missing.',
        'Consider sending a structured written notice or exploring voluntary mediation if the dispute involves family co-owners.',
        'Consult a property law practitioner to confirm appropriate civil court, RERA, or revenue forum jurisdiction and limitation timelines.'
      ],
      documents: ['Sale deed / title chain or allotment letter', 'Property tax & utility receipts', 'Encumbrance / municipal record extracts', 'Written correspondence or notices exchanged', 'Survey map or photographs (if boundary/possession issue)'],
      supportOptions: ['Property Law Consultation', 'Family / Property Mediation', 'Draft Legal Notice for Property Matter'],
      lawyerQuestions: [
        'Which forum (Civil Court, RERA, or Revenue Authority) has jurisdiction over this matter?',
        'What limitation timelines apply to filing a claim or seeking interim protection?',
        'Is pre-litigation mediation viable to resolve co-ownership shares faster?'
      ],
      templateId: 'legal-notice'
    },
    {
      id: 'family-matters',
      title: 'Family Matters',
      category: 'Family',
      summary: 'Structured overview for matrimonial separation, maintenance, child custody, or family settlement concerns.',
      questions: [
        { id: 'q1', label: 'Which family topic best describes your situation?', options: ['Mutual Consent Separation', 'Contested Matrimonial Issue', 'Maintenance / Financial Support', 'Child Custody & Visitation'] },
        { id: 'q2', label: 'Are both parties open to structured mediation?', options: ['Yes, open to dialogue', 'Uncertain — need guidance first', 'No, communication has broken down'] },
        { id: 'q3', label: 'Do you have key marriage and financial records ready?', options: ['Yes, mostly ready', 'Partially available', 'Need a checklist to collect them'] }
      ],
      procedure: [
        'Compile foundational records including proof of marriage, identity documents, and transparent income/expense statements.',
        'Explore whether court-annexed or private family mediation can help reach a written settlement covering parenting and finances.',
        'Consult a family law advocate to understand applicable personal-law procedures and interim support options.'
      ],
      documents: ['Marriage registration certificate or proof', 'Income tax returns, salary slips, and bank statements', 'Monthly household & dependent expense list', 'Children’s birth certificates & school records (if applicable)', 'Any prior written agreements or communications'],
      supportOptions: ['Family Law Consultation', 'Certified Family Mediation', 'Affidavit / Self-Declaration Draft'],
      lawyerQuestions: [
        'What financial disclosure documents are typically required before a Family Court?',
        'How does mutual consent settlement differ in timeline and cost from contested proceedings?',
        'How can child welfare and visitation schedules be structured constructively?'
      ],
      templateId: 'affidavit'
    },
    {
      id: 'consumer-complaints',
      title: 'Consumer Complaints',
      category: 'Consumer',
      summary: 'Steps for defective products, deficient services, warranty refusals, or unfair trade practices.',
      questions: [
        { id: 'q1', label: 'What issue did you experience?', options: ['Defective Product / Refused Warranty', 'Deficient Service / Overcharging', 'E-commerce Non-Delivery / Refund Delay', 'Housing / Builder Service Deficiency'] },
        { id: 'q2', label: 'Approximate value of goods or services paid?', options: ['Under ₹50,000', '₹50,000 – ₹10 Lakh', 'Above ₹10 Lakh'] },
        { id: 'q3', label: 'Have you raised a written complaint with the seller/provider?', options: ['Yes, ticket/email sent with no resolution', 'Requested refund verbally', 'Not yet raised'] }
      ],
      procedure: [
        'Consolidate tax invoices, payment proofs, warranty cards, and written customer-support ticket trails.',
        'Send a clear formal written demand notice specifying the defect/deficiency and relief sought (refund, replacement, or compensation) with a 15-day response window.',
        'If unresolved, explore consumer helpline mediation or filing before the appropriate Consumer Disputes Redressal Commission within applicable timelines.'
      ],
      documents: ['Original invoice / bill and payment receipt', 'Warranty card or service agreement', 'Photographs or inspection reports showing defect', 'Customer support emails, chat transcripts, and ticket IDs', 'Copy of formal demand notice and delivery proof'],
      supportOptions: ['Consumer Protection Lawyer Consultation', 'Draft Formal Demand Notice', 'Consumer Dispute Mediation'],
      lawyerQuestions: [
        'Which Consumer Commission tier applies based on the value of consideration paid?',
        'What specific compensation items should be documented and claimed?',
        'Does an arbitration clause in the seller’s terms affect my consumer forum option?'
      ],
      templateId: 'legal-notice'
    },
    {
      id: 'employment-disputes',
      title: 'Employment Disputes',
      category: 'Employment',
      summary: 'Organising records and options for unpaid salary, termination disputes, notice issues, or workplace grievances.',
      questions: [
        { id: 'q1', label: 'What is the core workplace issue?', options: ['Unpaid Salary / Full & Final Dues', 'Sudden Termination / Layoff', 'Notice Period or Bond Dispute', 'Workplace Grievance / Policy Violation'] },
        { id: 'q2', label: 'Do you have your appointment letter and payslips?', options: ['Yes, complete copies', 'Partial records (bank credits / emails)', 'No written contract'] },
        { id: 'q3', label: 'Have you escalated internally to HR or management in writing?', options: ['Yes, written email sent', 'Informal discussion only', 'Not yet raised'] }
      ],
      procedure: [
        'Preserve copies of your appointment letter, salary slips, bank credit statements, appraisal notes, and HR email correspondence on personal storage.',
        'Send a polite, factual written representation to HR/Payroll listing exact pending dues or procedural concerns with a reasonable response timeline.',
        'Review whether labour-authority conciliation, mediation, or a formal legal notice through an employment lawyer is the most effective next step.'
      ],
      documents: ['Offer / appointment letter and employment contract', 'Last 6–12 months payslips & Form 16 / PF statements', 'Bank statements showing salary credits', 'Resignation, termination, or HR correspondence', 'Attendance or handover acknowledgement'],
      supportOptions: ['Employment Law Consultation', 'Workplace Mediation', 'Draft Payment Demand Notice'],
      lawyerQuestions: [
        'How does my role classification affect whether labour authority or civil remedies apply?',
        'Are early-exit training bonds or broad non-compete clauses enforceable in my circumstances?',
        'What is the best phrasing for a formal demand notice without burning references unnecessarily?'
      ],
      templateId: 'legal-notice'
    },
    {
      id: 'business-disputes',
      title: 'Business Disputes',
      category: 'Business',
      summary: 'Navigating partner deadlocks, vendor non-performance, B2B receivables, or commercial exit disagreements.',
      questions: [
        { id: 'q1', label: 'What type of business issue is involved?', options: ['Partner / Co-Founder Disagreement', 'Unpaid B2B Invoices', 'Vendor / Supplier Non-Delivery', 'IP or Brand Usage Conflict'] },
        { id: 'q2', label: 'Is there a signed written contract or deed?', options: ['Yes, signed agreement with dispute clause', 'Purchase orders / emails only', 'Informal arrangement'] },
        { id: 'q3', label: 'Is preserving the business relationship a priority?', options: ['Yes, prefer negotiated settlement', 'Neutral — focused on fair recovery', 'No, preparing formal exit/claim'] }
      ],
      procedure: [
        'Audit signed agreements, purchase orders, invoices, ledger reconciliations, and dispute-resolution clauses (mediation/arbitration).',
        'Quantify direct losses and prepare a concise commercial chronology supported by accounting records.',
        'Evaluate structured commercial mediation first to preserve capital and avoid lengthy litigation.'
      ],
      documents: ['Partnership deed / commercial agreement', 'Invoices, purchase orders & delivery proofs', 'Ledger statement & tax filings', 'Formal emails / board minutes / reminders'],
      supportOptions: ['Corporate & Commercial Lawyer Consultation', 'Commercial Mediation', 'Draft Service or Partnership Document'],
      lawyerQuestions: [
        'Does our contract require mandatory negotiation, mediation, or arbitration before court filing?',
        'What interim safeguards can protect company bank accounts or intellectual property during a deadlock?',
        'How can we structure a clean settlement or buyout deed?'
      ],
      templateId: 'partnership-agreement'
    },
    {
      id: 'contract-disputes',
      title: 'Contract Disputes',
      category: 'Contract',
      summary: 'Assessing breach of contract, delayed obligations, cancellation fees, or interpretation disagreements.',
      questions: [
        { id: 'q1', label: 'What triggered the contract issue?', options: ['Non-Payment / Delayed Payment', 'Incomplete or Delayed Deliverables', 'Unilateral Cancellation', 'Disputed Penalty or Scope Clause'] },
        { id: 'q2', label: 'Does the contract include a notice-and-cure clause?', options: ['Yes', 'No / Not sure', 'No formal written contract'] },
        { id: 'q3', label: 'Have you analysed the contract clauses yet?', options: ['Yes, reviewed key terms', 'Not yet — need document review'] }
      ],
      procedure: [
        'Review exact performance milestones, cure periods, force majeure, termination, and jurisdiction clauses.',
        'Document your own performance compliance and any quantified losses resulting from the breach.',
        'Issue a written notice providing the contractually agreed cure period and proposing mediation if appropriate.'
      ],
      documents: ['Executed contract & any amendments', 'Milestone delivery logs & communications', 'Payment receipts or unpaid invoices', 'Loss calculation & mitigation records'],
      supportOptions: ['Analyze Contract in Document Analyzer', 'Contract Law Consultation', 'Draft Legal Notice'],
      lawyerQuestions: [
        'Which specific contract clauses establish breach and limit or cap recoverable damages?',
        'Should I pause my remaining obligations or continue performing to avoid counter-breach claims?',
        'What settlement leverage does a formal legal notice create here?'
      ],
      templateId: 'legal-notice'
    },
    {
      id: 'civil-matters',
      title: 'Civil Matters',
      category: 'Civil',
      summary: 'General civil grievances including private loans, defamation concerns, injunctions, or personal declarations.',
      questions: [
        { id: 'q1', label: 'Which civil category fits best?', options: ['Private Money / Loan Recovery', 'Neighbourhood / Easement Issue', 'Documentation / Affidavit Correction', 'Other Civil Remedy'] },
        { id: 'q2', label: 'Do you have written or banking evidence?', options: ['Yes, bank transfers / signed note', 'Messages / witnesses only', 'Need help organising proof'] },
        { id: 'q3', label: 'Urgency level?', options: ['Urgent — risk of immediate harm', 'Standard — seeking structured resolution', 'Exploratory — gathering information'] }
      ],
      procedure: [
        'Organise a chronological summary with supporting bank proofs, written acknowledgements, and witness details.',
        'Assess whether amicable mediation or a pre-litigation demand notice can resolve the matter promptly.',
        'Consult a civil lawyer to verify limitation periods, court fee structures, and territorial jurisdiction.'
      ],
      documents: ['Written agreements, receipts, or promissory notes', 'Bank transfer records (NEFT/RTGS/UPI)', 'Messages or correspondence acknowledging liability', 'Identity & address proof'],
      supportOptions: ['Civil Dispute Consultation', 'Civil Mediation', 'Draft Affidavit or Loan Document'],
      lawyerQuestions: [
        'What is the statutory limitation window for pursuing this civil claim?',
        'Is a summary recovery process or negotiated mediation better suited to the amount involved?'
      ],
      templateId: 'loan-agreement'
    },
    {
      id: 'cybercrime-concerns',
      title: 'Cybercrime-Related Concerns',
      category: 'Cyber',
      summary: 'Immediate evidence-preservation steps for unauthorised digital transactions, online impersonation, or data misuse.',
      questions: [
        { id: 'q1', label: 'What type of online incident occurred?', options: ['Unauthorised Bank / UPI Debit', 'Phishing / Online Shopping Fraud', 'Account Hacking / Impersonation', 'Online Harassment or Data Misuse'] },
        { id: 'q2', label: 'When did the incident occur?', options: ['Within the last 24 hours', 'Within the last week', 'More than a week ago'] },
        { id: 'q3', label: 'Have you alerted your bank or platform yet?', options: ['Yes, bank/platform notified', 'Not yet — need immediate steps'] }
      ],
      procedure: [
        'For financial fraud, notify your bank immediately to block compromised cards/UPI and note the transaction UTR/reference numbers.',
        'Preserve unedited screenshots, URLs, SMS alerts, email headers, and chat logs without altering timestamps.',
        'Report promptly through official national cyber reporting channels and consult a cyber law practitioner for follow-up documentation.'
      ],
      documents: ['Bank statement & UTR / transaction IDs', 'SMS/email transaction alerts', 'Full-screen screenshots of fraud profiles, URLs, or chats', 'Bank dispute ticket & acknowledgement reference'],
      supportOptions: ['Cyber & Technology Law Consultation', 'Draft Formal Written Representation'],
      lawyerQuestions: [
        'How should digital screenshots and logs be preserved so they remain admissible as electronic evidence?',
        'What bank liability protections apply for unauthorised electronic banking transactions?',
        'What follow-up steps help coordinate between bank dispute teams and investigating authorities?'
      ],
      templateId: 'legal-notice'
    },
    {
      id: 'tenancy-rent',
      title: 'Tenancy & Security Deposit',
      category: 'Property',
      summary: 'Practical roadmap for deposit refund delays, eviction notices, repair obligations, or lease renewal disputes.',
      questions: [
        { id: 'q1', label: 'What is your role in the tenancy?', options: ['Tenant', 'Landlord / Property Owner'] },
        { id: 'q2', label: 'Main issue faced?', options: ['Security Deposit Withheld', 'Unpaid Rent / Overstay', 'Sudden Eviction Notice', 'Maintenance / Repair Disagreement'] },
        { id: 'q3', label: 'Do you have a signed rent agreement & payment proof?', options: ['Yes, both signed agreement & digital receipts', 'Payments recorded, informal agreement', 'Need assistance documenting terms'] }
      ],
      procedure: [
        'Review notice, lock-in, deduction, and handover clauses in your rent agreement (you can test it in our Document Analyzer).',
        'Document handover condition with date-stamped photos, utility clearance bills, and key-return acknowledgement.',
        'Propose mediation or send a polite written settlement notice itemising agreed deductions and net payable balance.'
      ],
      documents: ['Signed rent / leave-and-license agreement', 'Rent & deposit bank transfer receipts', 'Move-in / move-out photos & utility bills', 'Written notice and WhatsApp/email history'],
      supportOptions: ['Property & Tenancy Mediation', 'Analyze Rent Agreement', 'Draft Rent Agreement or Notice'],
      lawyerQuestions: [
        'Which deductions qualify as normal wear and tear versus chargeable tenant damage?',
        'Does our city follow a Rent Authority process or Civil Court procedure for tenancy disputes?'
      ],
      templateId: 'rent-agreement'
    },
    {
      id: 'payment-recovery',
      title: 'Debt & Payment Recovery',
      category: 'Finance',
      summary: 'Structured process for recovering unpaid personal loans, freelance invoices, or dishonoured instruments.',
      questions: [
        { id: 'q1', label: 'Nature of the unpaid amount?', options: ['Dishonoured Cheque', 'Unpaid Freelance / Business Invoice', 'Personal Friendly Loan'] },
        { id: 'q2', label: 'Is there written proof acknowledging the debt?', options: ['Yes, invoice / cheque / signed note', 'Bank transfer + chat acknowledgement', 'Verbal commitment only'] },
        { id: 'q3', label: 'Have you issued a formal written demand notice?', options: ['Yes, notice sent', 'Not yet'] }
      ],
      procedure: [
        'Gather original payment proofs, invoices, bank memos, and written acknowledgements of liability.',
        'Check strict statutory timelines immediately if a dishonoured cheque is involved.',
        'Send a formal written demand notice specifying exact principal, deadline to pay, and openness to swift settlement.'
      ],
      documents: ['Invoices, loan agreement, or dishonoured cheque + bank return memo', 'Bank transfer proof', 'Written reminders and acknowledgement messages', 'Postal/email delivery proof of demand notice'],
      supportOptions: ['Banking & Debt Recovery Consultation', 'Draft Payment Demand Notice', 'Commercial Mediation'],
      lawyerQuestions: [
        'What exact statutory deadlines apply from the date of bank intimation or invoice due date?',
        'Is mediation or summary civil recovery more cost-effective for this amount?'
      ],
      templateId: 'legal-notice'
    }
  ];

  // 15 Fictional Case Analysis Examples (strictly illustrative, zero fabricated real citations)
  const CASE_SAMPLES = [
    {
      id: 'CASE-S01',
      title: 'Withheld Residential Security Deposit',
      category: 'Property & Tenancy',
      situation: 'A tenant vacated a rented apartment in New Delhi after completing an 11-month term and serving 30 days written notice. The landlord withheld ₹65,000 from a ₹70,000 security deposit citing routine wall painting without invoices.',
      facts: 'Signed 11-month agreement, UPI rent receipts for all months, move-out photographs showing intact fixtures, written handover email, no itemized repair bills provided by landlord.',
      documents: 'Rent Agreement, UPI Payment History, Handover Email, Move-out Photos',
      report: {
        overview: 'Residential tenancy deposit dispute turning on the distinction between normal wear-and-tear and documented tenant-caused damage under the written tenancy terms.',
        legalQuestions: [
          'Does the rent agreement expressly authorise deducting painting charges upon normal wear-and-tear?',
          'Did the landlord provide itemised, reasonable expenditure proofs for the ₹65,000 withholding?',
          'Were notice and key-handover conditions properly fulfilled by the tenant?'
        ],
        possibleArguments: {
          claimant: [
            'Full compliance with 30-day written notice and timely rent payments throughout the term.',
            'Move-out photographs corroborate normal wear-and-tear rather than actionable property damage.',
            'Blanket withholding without supporting invoices or contractual basis is disproportionate.'
          ],
          respondent: [
            'May assert specific cleaning, repainting, or utility arrears obligations under tenancy clauses.',
            'May point to pre-existing handover checklist stipulations if move-in condition was newly painted.'
          ]
        },
        missingInfo: [
          'Exact wording of the security deposit and painting/restoration clause in the agreement.',
          'Move-in condition photographs for before-and-after comparison.',
          'Confirmation that final electricity, water, and society maintenance bills were cleared.'
        ],
        researchAreas: [
          'Applicable State Rent Control / Tenancy framework in the property’s jurisdiction',
          'Contract principles governing reasonable compensation vs forfeiture of deposits',
          'Pre-litigation mediation and summary civil recovery procedures'
        ],
        considerations: [
          'A structured written settlement notice proposing mediation frequently resolves deposit disputes faster than formal litigation.',
          'Preserve original bank proofs and dated photos before initiating formal action.'
        ],
        consultationQuestions: [
          'Does my agreement’s restoration clause allow automatic painting deductions?',
          'Should I send a formal 15-day demand notice or initiate local mediation first?',
          'Which local forum is most practical for recovering ₹65,000?'
        ]
      }
    },
    {
      id: 'CASE-S02',
      title: 'Delayed Residential Flat Handover',
      category: 'Consumer Complaints',
      situation: 'A homebuyer paid ₹62,00,000 under a builder-buyer agreement promising possession within 36 months. After 54 months, construction remains incomplete and the developer offers no delay compensation.',
      facts: 'Registered allotment agreement, payment receipts totalling ₹62 lakh, promised possession date passed 18 months ago, developer cited general supply delays without formal extension notice.',
      documents: 'Allotment Agreement, Payment Ledger, Site Progress Photos, Emails to Developer',
      report: {
        overview: 'Real-estate consumer delay matter involving prolonged non-delivery of possession despite substantial milestone payments.',
        legalQuestions: [
          'Does the delay exceed any contractual grace period and trigger statutory delay-interest or refund remedies?',
          'Are the developer’s claimed delay reasons legally valid force majeure events?',
          'Which forum (Consumer Commission vs Real Estate Regulatory Authority) best aligns with the buyer’s preferred remedy?'
        ],
        possibleArguments: {
          claimant: [
            'Substantial payment made on schedule while possession was delayed by 18+ months beyond commitment.',
            'One-sided allotment terms penalising buyer delays steeply while offering nominal developer compensation may be scrutinised.',
            'Buyer may seek either refund with reasonable interest or possession with delay compensation.'
          ],
          respondent: [
            'May rely on contractual grace periods, regulatory approval timelines, or force majeure clauses.',
            'May argue buyer consented to revised timelines or missed an interim demand instalment.'
          ]
        },
        missingInfo: [
          'Project registration status and revised completion date filed with the state real-estate regulator.',
          'Whether the buyer prefers continuing with possession or exiting via refund.',
          'Exact wording of the grace-period and delay-compensation clause.'
        ],
        researchAreas: [
          'Consumer protection remedies for deficiency in housing construction services',
          'State Real Estate Regulatory Authority (RERA) refund & delay-interest mechanisms',
          'Election of remedies between regulatory and consumer forums'
        ],
        considerations: [
          'Avoid filing parallel claims for identical relief across two forums simultaneously without legal advice.',
          'Calculate total payments and interest transparently with supporting bank statements.'
        ],
        consultationQuestions: [
          'In my state, is RERA or the Consumer Commission faster and more effective for a refund claim?',
          'Does an arbitration clause in the allotment letter restrict my consumer forum option?',
          'What documentary annexures strengthen a delay-compensation calculation?'
        ]
      }
    },
    {
      id: 'CASE-S03',
      title: 'Unpaid Freelance Milestone Invoices',
      category: 'Contract Disputes',
      situation: 'An independent designer delivered a complete mobile app UI system per a signed service agreement. After approving designs over email, the client refused to pay the final ₹1,80,000 invoice citing internal budget cuts.',
      facts: 'Signed scope document, milestone approval email from product lead, submitted Figma source files, invoice overdue by 65 days.',
      documents: 'Service Agreement, Approval Email, Overdue Invoice #INV-88, Follow-up Trail',
      report: {
        overview: 'Commercial breach-of-contract matter involving accepted deliverables and non-payment of agreed consideration.',
        legalQuestions: [
          'Do email approvals establish satisfactory completion of the contractual milestone?',
          'Does the contract condition IP transfer on receipt of full payment?',
          'What pre-litigation notice and mediation steps are stipulated before formal recovery?'
        ],
        possibleArguments: {
          claimant: [
            'Written acceptance of deliverables proves full performance under the contract.',
            'Internal budget restructuring is not a valid legal excuse for non-payment of earned fees.',
            'Written invoice and reminder trail establishes a clear liquidated debt.'
          ],
          respondent: [
            'May retrospectively raise quality or minor revision objections to justify withholding.',
            'May contest whether the approving employee had signing authority.'
          ]
        },
        missingInfo: [
          'Whether the service provider is registered as a micro/small enterprise (for statutory payment-delay remedies).',
          'Contractual jurisdiction and dispute-resolution clause.'
        ],
        researchAreas: [
          'Commercial contract recovery and documentary proof of acceptance',
          'Statutory delayed-payment protections for small service enterprises (if applicable)',
          'Pre-litigation commercial mediation and demand notices'
        ],
        considerations: [
          'A formal demand notice paired with an offer for quick structured settlement often unlocks commercial payables.',
          'Preserve original email headers and file-transfer logs.'
        ],
        consultationQuestions: [
          'Can I restrict commercial use of my designs until final payment clears?',
          'Should we issue a formal 15-day demand notice or initiate commercial mediation first?'
        ]
      }
    }
  ];

  const EXTRA_CASE_TEMPLATES = [
    ['CASE-S04', 'Sudden Termination Without Notice Pay', 'Employment Disputes', 'Employee confirmed after probation was asked to resign immediately without 60-day notice pay or full-and-final settlement.', 'Appointment letter, confirmation email, 24 months payslips, exit email.'],
    ['CASE-S05', 'Dishonoured Commercial Cheque', 'Business Disputes', 'Supplier received a ₹3,40,000 cheque for delivered machinery parts that returned unpaid for insufficient funds.', 'Tax invoice, signed delivery challan, cheque copy, bank return memo.'],
    ['CASE-S06', 'Ancestral Residential Partition Disagreement', 'Property Disputes', 'Siblings disagree on equal division of an intestate ancestral residence currently occupied by one co-heir.', 'Municipal property records, family tree affidavit, tax receipts.'],
    ['CASE-S07', 'Defective Electronics Refused Replacement', 'Consumer Complaints', 'Premium laptop suffered three motherboard failures within 7 months of purchase; brand refuses refund or replacement.', 'Purchase invoice, 3 service job sheets, support emails.'],
    ['CASE-S08', 'Co-Founder Equity & Decision Deadlock', 'Business Disputes', 'Two co-founders with 50-50 shareholding disagree on raising external funding versus shutting down operations.', 'Shareholders draft, bank statements, board emails.'],
    ['CASE-S09', 'Unauthorised UPI Account Debits', 'Cybercrime Concerns', 'Account holder noticed four unauthorised UPI transfers totalling ₹48,000 after receiving a deceptive delivery link.', 'Bank SMS alerts, UTR numbers, bank complaint reference.'],
    ['CASE-S10', 'Mutual Consent Separation & Parenting Plan', 'Family Matters', 'Spouses living separately for 14 months seek clarity on drafting a balanced parenting and financial settlement.', 'Marriage proof, income disclosures, draft parenting schedule.'],
    ['CASE-S11', 'Commercial Shop Eviction & Rent Arrears', 'Property Disputes', 'Commercial landlord faces 5 months of unpaid rent from a retail tenant whose 3-year lease recently expired.', 'Registered lease deed, rent ledger, written reminders.'],
    ['CASE-S12', 'Friendly Personal Loan Default', 'Civil Matters', 'Lender transferred ₹2,50,000 via NEFT to an acquaintance under a written repayment promise now 8 months overdue.', 'NEFT transaction proof, WhatsApp repayment acknowledgements.'],
    ['CASE-S13', 'Vendor Raw-Material Quality Breach', 'Contract Disputes', 'Manufacturing buyer rejected a ₹6,00,000 batch of substandard packaging material causing production halt.', 'Purchase order, quality inspection report, rejection email.'],
    ['CASE-S14', 'Post-Exit Non-Compete Restriction Notice', 'Employment Disputes', 'Former sales manager received a warning letter from ex-employer objecting to joining a broader technology company.', 'Employment agreement, relieving letter, warning notice.'],
    ['CASE-S15', 'Home Renovation Delay & Cost Overrun', 'Consumer Complaints', 'Interior contractor abandoned residential renovation at 60% completion after collecting 85% of the ₹9,00,000 contract fee.', 'Renovation contract, stage-wise receipts, site photos.']
  ];

  EXTRA_CASE_TEMPLATES.forEach(([id, title, category, situation, facts]) => {
    CASE_SAMPLES.push({
      id,
      title,
      category,
      situation,
      facts,
      documents: facts,
      report: {
        overview: `Structured case analysis of "${title}" (${category}). Highlights core factual elements, evidentiary considerations, and structured discussion points for professional legal consultation.`,
        legalQuestions: [
          `What primary contractual or statutory duties govern this ${category.toLowerCase()} scenario?`,
          'Is the documentary trail sufficient to establish chronology, breach, and measurable loss?',
          'Are there mandatory pre-filing notices, internal remedies, or limitation timelines to verify first?'
        ],
        possibleArguments: {
          claimant: [
            'Contemporaneous written records and payment/delivery trails support the core factual narrative.',
            'Demonstrated good-faith attempts to notify and resolve the issue prior to escalation.',
            'Clear articulation of measurable financial or practical relief sought.'
          ],
          respondent: [
            'May dispute technical compliance with notice clauses, timelines, or contractual exclusions.',
            'May raise counter-allegations regarding shared responsibility or valuation of claimed relief.'
          ]
        },
        missingInfo: [
          'Complete signed copies of all governing contracts, receipts, and delivery proofs.',
          'Exact dates establishing statutory limitation compliance.',
          'Confirmation of jurisdiction and whether mediation/arbitration clauses apply.'
        ],
        researchAreas: [
          `Core Indian statutory framework applicable to ${category}`,
          'Documentary & electronic evidence preservation requirements',
          'Pre-litigation mediation and structured settlement pathways'
        ],
        considerations: [
          'This structured analysis does not predict judicial outcomes or replace formal legal counsel.',
          'Organising a dated chronology with numbered annexures significantly reduces consultation time.'
        ],
        consultationQuestions: [
          'Which legal forum and initial notice strategy is most proportional to this matter?',
          'What gaps in my current documents should be addressed before taking formal steps?',
          'Could structured mediation resolve this faster than contested proceedings?'
        ]
      }
    });
  });

  // 25 Comprehensive FAQs
  const FAQS = [
    { id: 'FAQ-01', category: 'Getting Started', q: 'What is NyayaDheesh?', a: 'NyayaDheesh is a LegalTech platform designed to help everyday users understand legal documents, explore general legal procedures, draft structured templates, and access lawyer discovery and mediation workflows in one place.' },
    { id: 'FAQ-02', category: 'Getting Started', q: 'How does NyayaDheesh assist with legal preparation?', a: 'NyayaDheesh provides plain-language document breakdowns, guided draft generation, procedural roadmaps, and structured appointment scheduling with advocates and mediators. Informational tools complement—and never replace—formal advice from your chosen counsel.' },
    { id: 'FAQ-03', category: 'Getting Started', q: 'Do I need an account to explore the platform?', a: 'You can browse the homepage, lawyer directory, mediators, document tools, and FAQs without signing in. Signing in unlocks your persistent Client Dashboard, saved lawyers, bookings, and saved history.' },
    { id: 'FAQ-04', category: 'Getting Started', q: 'How do I access the Client or Lawyer portal quickly?', a: 'Use the Citizen Login or Lawyer Login options on the Sign In page or header bar to enter your workspace with appointments, saved documents, analyses, and mediation requests.' },
    { id: 'FAQ-05', category: 'Getting Started', q: 'Will my bookings and documents stay saved after refreshing?', a: 'Yes. All bookings, saved lawyers, generated drafts, analyses, mediation requests, and profile edits persist across page refreshes and navigation.' },
    { id: 'FAQ-06', category: 'Legal Tools', q: 'How does the Legal Document Analyzer work?', a: 'You can select any of the 20 reference legal documents for structured clause breakdowns, or upload a PDF, DOCX, or TXT file for local text extraction and privacy-preserving structural analysis without sending files to external third-party AI servers.' },
    { id: 'FAQ-07', category: 'Legal Tools', q: 'Are documents created by the Document Generator ready to sign immediately?', a: 'Generated drafts are structured starting templates. Before executing any legal instrument, have it reviewed by a qualified advocate and check state stamp duty and registration rules.' },
    { id: 'FAQ-08', category: 'Legal Tools', q: 'Which formats can I download generated documents in?', a: 'You can export drafts as printable PDF documents via your browser’s Print/Save as PDF workflow, download Microsoft Word (.docx) files, or copy/save plain text.' },
    { id: 'FAQ-09', category: 'Legal Tools', q: 'What does Legal Next Steps provide?', a: 'It walks you through short situation-specific questions across 10 legal areas and generates a procedural overview, documents checklist, support options, and questions to prepare for a lawyer.' },
    { id: 'FAQ-10', category: 'Legal Tools', q: 'Does the Case and Judgment Simulator predict real court verdicts?', a: 'No. It provides a structured framework of legal questions, possible arguments on both sides, missing facts, and consultation topics—it never predicts outcomes or fabricates court citations.' },
    { id: 'FAQ-11', category: 'Legal Tools', q: 'Can I save results from the Analyzer, Generator, Next Steps, and Simulator?', a: 'Yes. Every tool includes a "Save" action that stores the output inside your Client Dashboard so you can revisit, download, or delete items later.' },
    { id: 'FAQ-12', category: 'Lawyer Directory', q: 'How are lawyers organised in the directory?', a: 'The directory features 108 advocate profiles across 12 major Indian cities with verified practice areas, languages, fee schedules, and real-time slot availability.' },
    { id: 'FAQ-13', category: 'Lawyer Directory', q: 'How can I filter the Lawyer Directory?', a: 'You can combine search by name, city, or pincode with filters for practice area, minimum experience, language, maximum consultation fee, consultation mode (Video, Phone, In-Person), availability, and optional distance.' },
    { id: 'FAQ-14', category: 'Lawyer Directory', q: 'How does distance sorting work?', a: 'Distance sorting activates only when you explicitly share your location or pick a reference city—otherwise results sort cleanly by experience, fee, availability, or name.' },
    { id: 'FAQ-15', category: 'Lawyer Directory', q: 'Can I bookmark lawyers to compare later?', a: 'Yes. Click the Save/Bookmark button on any lawyer card or profile page to store them in the "Saved Lawyers" section of your Client Dashboard.' },
    { id: 'FAQ-16', category: 'Booking', q: 'How are consultation fees handled during booking?', a: 'The booking workflow displays the advocate’s consultation fee schedule upfront prior to confirming your slot, with instant confirmation and calendar (.ics) export.' },
    { id: 'FAQ-17', category: 'Booking', q: 'Can I reschedule or cancel an appointment?', a: 'Yes. Open "My Appointments" in your Client Dashboard to reschedule to a different available date/slot or cancel an appointment with immediate status updates.' },
    { id: 'FAQ-18', category: 'Booking', q: 'Does the booking system prevent double-booking the same time slot?', a: 'Yes. If a time slot is already booked for a given lawyer and date, that slot is marked unavailable and duplicate bookings are blocked.' },
    { id: 'FAQ-19', category: 'Mediation', q: 'What is mediation and when is it useful?', a: 'Mediation is a voluntary, confidential process in which a neutral facilitator helps disputing parties explore mutually acceptable settlements outside formal courtroom litigation—often suited for tenancy, family, commercial, and employment disagreements.' },
    { id: 'FAQ-20', category: 'Mediation', q: 'How does mediation status tracking work?', a: 'Every submitted mediation request starts at "Submitted" and tracks across seven stages: Submitted, Under Review, Mediator Assigned, Session Scheduled, In Progress, Resolved, and Closed.' },
    { id: 'FAQ-21', category: 'Mediation', q: 'Can I choose a preferred mediator when submitting a request?', a: 'Yes. You can browse all 25 mediators by dispute category, city, and language, and select a preferred mediator inside the multi-step Mediation Request form.' },
    { id: 'FAQ-22', category: 'Privacy & Security', q: 'How is my uploaded document privacy protected?', a: 'Document text extraction and structural analysis run locally on the platform without transmitting uploaded files to external third-party AI servers.' },
    { id: 'FAQ-23', category: 'Privacy & Security', q: 'Are my uploaded documents sent to external AI servers?', a: 'No. Document extraction and structural analysis run locally and do not transmit uploaded files to third-party AI APIs.' },
    { id: 'FAQ-24', category: 'Privacy & Security', q: 'How do I reset my workspace data back to its initial state?', a: 'Open your Client Dashboard, go to Settings, and click "Reset Workspace Data". After confirmation, all records restore cleanly to their initial state.' },
    { id: 'FAQ-25', category: 'Privacy & Security', q: 'Is this architecture ready for production backend integration?', a: 'Yes. All data access is isolated inside modular service objects (AuthService, LawyerService, AppointmentService, DocumentService, MediationService, etc.), allowing REST/database APIs to plug in cleanly without rebuilding the UI.' }
  ];

  function createInitialState() {
    const lawyers = buildLawyers();
    const mediators = buildMediators();

    const demoUser = {
      id: 'USR-01',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@nyayadheesh.in',
      phone: '+91 98000 00000',
      city: 'New Delhi',
      preferredLanguage: 'English',
      role: 'client',
      isDemo: false
    };

    const demoLawyerAccount = {
      id: 'USR-LAWYER-01',
      lawyerId: lawyers[0].id,
      name: lawyers[0].name,
      email: 'advocate@nyayadheesh.in',
      phone: '+91 98000 00001',
      city: lawyers[0].city,
      preferredLanguage: 'English',
      role: 'lawyer',
      isDemo: false
    };

    const advocateCases = [
      { id: 'MAT-401', clientName: 'Aarav Mehta', title: 'Residential Rent Deposit & Notice Review', category: 'Property & Real Estate', status: 'Active', nextDate: isoDay(2), notes: 'Reviewed 11-month agreement; prepared mutual notice and deposit refund checklist.' },
      { id: 'MAT-402', clientName: 'Priya Malhotra', title: 'SaaS Vendor Service Agreement Review', category: 'Corporate & Commercial', status: 'In Review', nextDate: isoDay(4), notes: 'Evaluating milestone acceptance criteria and IP transfer timing clauses.' },
      { id: 'MAT-403', clientName: 'Sanjay Gupta', title: 'Delayed Apartment Handover Consultation', category: 'Consumer Protection', status: 'Active', nextDate: isoDay(6), notes: 'Compiled allotment agreement, payment ledger, and written correspondence timeline.' },
      { id: 'MAT-404', clientName: 'Neha Verma', title: 'Family Co-Ownership Mediation Preparation', category: 'Property & Real Estate', status: 'Scheduled', nextDate: isoDay(8), notes: 'Joint structured dialogue scheduled to clarify maintenance sharing terms.' }
    ];

    const appointments = [
      { id: 'APT-2026-101', lawyerId: lawyers[0].id, lawyerName: lawyers[0].name, practiceArea: lawyers[0].primaryArea, city: lawyers[0].city, mode: 'Video', date: isoDay(2), slot: '10:00', fee: lawyers[0].fee, status: 'Confirmed', caseSummary: 'Review of residential rent agreement clauses and deposit refund timeline.', createdAt: isoDay(-2) },
      { id: 'APT-2026-102', lawyerId: lawyers[1].id, lawyerName: lawyers[1].name, practiceArea: lawyers[1].primaryArea, city: lawyers[1].city, mode: 'Phone', date: isoDay(4), slot: '11:00', fee: lawyers[1].fee, status: 'Confirmed', caseSummary: 'Initial discussion on structured family mediation and documentation checklist.', createdAt: isoDay(-1) },
      { id: 'APT-2026-103', lawyerId: lawyers[2].id, lawyerName: lawyers[2].name, practiceArea: lawyers[2].primaryArea, city: lawyers[2].city, mode: 'Video', date: isoDay(6), slot: '14:30', fee: lawyers[2].fee, status: 'Pending', caseSummary: 'Consumer forum options for delayed apartment handover and compensation.', createdAt: isoDay(-1) },
      { id: 'APT-2026-104', lawyerId: lawyers[3].id, lawyerName: lawyers[3].name, practiceArea: lawyers[3].primaryArea, city: lawyers[3].city, mode: 'Video', date: isoDay(9), slot: '15:30', fee: lawyers[3].fee, status: 'Rescheduled', caseSummary: 'Review of employment contract IP assignment and notice period clauses.', createdAt: isoDay(-4) },
      { id: 'APT-2026-105', lawyerId: lawyers[4].id, lawyerName: lawyers[4].name, practiceArea: lawyers[4].primaryArea, city: lawyers[4].city, mode: 'In-Person', date: isoDay(12), slot: '11:30', fee: lawyers[4].fee, status: 'Confirmed', caseSummary: 'Co-founder partnership deed review prior to firm registration.', createdAt: isoDay(-3) },
      { id: 'APT-2026-106', lawyerId: lawyers[5].id, lawyerName: lawyers[5].name, practiceArea: lawyers[5].primaryArea, city: lawyers[5].city, mode: 'Phone', date: isoDay(-3), slot: '15:00', fee: lawyers[5].fee, status: 'Completed', caseSummary: 'Contract breach assessment for unpaid freelance milestone invoice.', createdAt: isoDay(-10) },
      { id: 'APT-2026-107', lawyerId: lawyers[6].id, lawyerName: lawyers[6].name, practiceArea: lawyers[6].primaryArea, city: lawyers[6].city, mode: 'Video', date: isoDay(-7), slot: '10:30', fee: lawyers[6].fee, status: 'Completed', caseSummary: 'Cybercrime evidence preservation and bank dispute escalation checklist.', createdAt: isoDay(-14) },
      { id: 'APT-2026-108', lawyerId: lawyers[7].id, lawyerName: lawyers[7].name, practiceArea: lawyers[7].primaryArea, city: lawyers[7].city, mode: 'Video', date: isoDay(-12), slot: '13:00', fee: lawyers[7].fee, status: 'Completed', caseSummary: 'Personal loan repayment documentation and written notice options.', createdAt: isoDay(-20) },
      { id: 'APT-2026-109', lawyerId: lawyers[8].id, lawyerName: lawyers[8].name, practiceArea: lawyers[8].primaryArea, city: lawyers[8].city, mode: 'Phone', date: isoDay(-16), slot: '16:00', fee: lawyers[8].fee, status: 'Cancelled', caseSummary: 'Trademark usage inquiry — resolved informally prior to call.', createdAt: isoDay(-22) },
      { id: 'APT-2026-110', lawyerId: lawyers[9].id, lawyerName: lawyers[9].name, practiceArea: lawyers[9].primaryArea, city: lawyers[9].city, mode: 'Video', date: isoDay(-21), slot: '11:00', fee: lawyers[9].fee, status: 'Completed', caseSummary: 'Startup compliance and vendor contract review session.', createdAt: isoDay(-28) },
      { id: 'APT-2026-111', lawyerId: lawyers[12].id, lawyerName: lawyers[12].name, practiceArea: lawyers[12].primaryArea, city: lawyers[12].city, mode: 'In-Person', date: isoDay(15), slot: '14:00', fee: lawyers[12].fee, status: 'Pending', caseSummary: 'Ancestral property mutation and title verification questions.', createdAt: isoDay(0) },
      { id: 'APT-2026-112', lawyerId: lawyers[15].id, lawyerName: lawyers[15].name, practiceArea: lawyers[15].primaryArea, city: lawyers[15].city, mode: 'Video', date: isoDay(-26), slot: '15:30', fee: lawyers[15].fee, status: 'Completed', caseSummary: 'Mutual NDA clause consultation for software evaluation.', createdAt: isoDay(-32) }
    ];

    const mediationRequests = [
      { id: 'MREQ-301', category: 'Property & Tenancy', title: 'Security Deposit Reconciliation with Landlord', description: 'Seeking neutral facilitation to agree on fair wear-and-tear accounting and refund of ₹56,000 deposit.', otherParty: 'Rajesh Malhotra (Landlord)', mediatorId: mediators[1].id, mediatorName: mediators[1].name, preferredDate: isoDay(3), preferredSlot: '11:00', mode: 'Online Video', status: 'Session Scheduled', createdAt: isoDay(-4) },
      { id: 'MREQ-302', category: 'Commercial & Business', title: 'Vendor Invoice Payment Schedule Settlement', description: 'Resolving delayed payment of ₹2,10,000 through a mutually agreed two-part settlement plan.', otherParty: 'Metro Retail Distributors', mediatorId: mediators[2].id, mediatorName: mediators[2].name, preferredDate: isoDay(6), preferredSlot: '15:00', mode: 'Online Video', status: 'Mediator Assigned', createdAt: isoDay(-3) },
      { id: 'MREQ-303', category: 'Employment & Workplace', title: 'Full & Final Settlement Clarification', description: 'Facilitating constructive closure on accrued leave encashment and relieving documentation.', otherParty: 'Zenith Digital HR', mediatorId: mediators[3].id, mediatorName: mediators[3].name, preferredDate: isoDay(9), preferredSlot: '14:00', mode: 'Online Video', status: 'Under Review', createdAt: isoDay(-2) },
      { id: 'MREQ-304', category: 'Consumer & Housing', title: 'Interior Renovation Milestone Reconciliation', description: 'Agreeing on completion deliverables and remaining balance with residential contractor.', otherParty: 'Prime Interiors Studio', mediatorId: mediators[4].id, mediatorName: mediators[4].name, preferredDate: isoDay(11), preferredSlot: '16:00', mode: 'In-Person', status: 'Submitted', createdAt: isoDay(-1) },
      { id: 'MREQ-305', category: 'Family & Matrimonial', title: 'Co-Ownership Ancestral Flat Usage Arrangement', description: 'Collaborative discussion among siblings on maintenance sharing and rental distribution.', otherParty: 'Extended Family Co-Owners', mediatorId: mediators[0].id, mediatorName: mediators[0].name, preferredDate: isoDay(1), preferredSlot: '10:30', mode: 'Online Video', status: 'In Progress', createdAt: isoDay(-9) },
      { id: 'MREQ-306', category: 'Contract & Vendor', title: 'Freelance Scope & Revision Settlement', description: 'Clarifying final handoff deliverables and closing invoice for website redesign project.', otherParty: 'BrightLeaf Foods', mediatorId: mediators[6].id, mediatorName: mediators[6].name, preferredDate: isoDay(-8), preferredSlot: '11:30', mode: 'Online Video', status: 'Resolved', createdAt: isoDay(-18) },
      { id: 'MREQ-307', category: 'Partnership & Equity', title: 'Partner Exit Accounting & Goodwill Valuation', description: 'Structured settlement terms for amicable partner retirement from consulting firm.', otherParty: 'Co-Partner (Consulting LLP)', mediatorId: mediators[5].id, mediatorName: mediators[5].name, preferredDate: isoDay(-15), preferredSlot: '14:30', mode: 'In-Person', status: 'Closed', createdAt: isoDay(-30) },
      { id: 'MREQ-308', category: 'Civil & Community', title: 'Shared Driveway Access & Parking Understanding', description: 'Reaching a clear written parking schedule between neighbouring residential units.', otherParty: 'Block B Residents', mediatorId: mediators[7].id, mediatorName: mediators[7].name, preferredDate: isoDay(-22), preferredSlot: '16:00', mode: 'In-Person', status: 'Resolved', createdAt: isoDay(-35) }
    ];

    const generatedDocs = [
      { id: 'GDOC-501', templateId: 'rent-agreement', templateName: 'Rent Agreement', title: 'Residential Rent Agreement — Saket Enclave', content: DOCUMENT_TEMPLATES[0].build({ landlordName: 'Rajesh Malhotra', tenantName: 'Aarav Mehta', propertyAddress: 'Flat B-402, Saket Enclave, New Delhi - 110017', monthlyRent: '28000', securityDeposit: '56000', startDate: isoDay(5), durationMonths: '11', noticeDays: '30' }), status: 'Saved Draft', createdAt: isoDay(-3) },
      { id: 'GDOC-502', templateId: 'nda', templateName: 'Non-Disclosure Agreement (NDA)', title: 'Mutual NDA — Vertex Analytics Pilot', content: DOCUMENT_TEMPLATES[1].build({ partyA: 'Aarav Mehta Ventures', partyB: 'Vertex Analytics Pvt. Ltd.', city: 'Bengaluru', purpose: 'Evaluating a proposed software product partnership and commercial pilot.', termYears: '3', effectiveDate: isoDay(-6) }), status: 'Saved Draft', createdAt: isoDay(-6) },
      { id: 'GDOC-503', templateId: 'legal-notice', templateName: 'Legal Notice', title: 'Payment Demand Notice — Invoice #408', content: DOCUMENT_TEMPLATES[4].build({ sender: 'Aarav Mehta', recipient: 'M/s Apex Traders, Commercial Street, New Delhi', subject: 'Demand for Settlement of Unpaid Dues', facts: 'Agreed consulting deliverables were completed on 15 October 2026 against Invoice #408; payment remains overdue.', remedy: 'Bank transfer of ₹1,45,000', days: '15' }), status: 'Reviewed Draft', createdAt: isoDay(-9) }
    ];

    const savedAnalyses = [
      { id: 'ANL-601', sourceName: SAMPLE_DOCUMENTS[0].title, sourceType: 'Sample Document', isSimulated: true, createdAt: isoDay(-2), previewText: SAMPLE_DOCUMENTS[0].text, analysis: SAMPLE_DOCUMENTS[0].analysis },
      { id: 'ANL-602', sourceName: SAMPLE_DOCUMENTS[1].title, sourceType: 'Sample Document', isSimulated: true, createdAt: isoDay(-5), previewText: SAMPLE_DOCUMENTS[1].text, analysis: SAMPLE_DOCUMENTS[1].analysis }
    ];

    const savedGuidance = [
      { id: 'GDE-701', workflowId: 'tenancy-rent', title: 'Tenancy & Security Deposit', answers: { q1: 'Tenant', q2: 'Security Deposit Withheld', q3: 'Yes, both signed agreement & digital receipts' }, summary: 'Prepared guidance checklist for a Tenant handling a withheld security deposit backed by a signed agreement and digital receipts.', workflow: GUIDANCE_WORKFLOWS[8], createdAt: isoDay(-4) },
      { id: 'GDE-702', workflowId: 'consumer-complaints', title: 'Consumer Complaints', answers: { q1: 'Housing / Builder Service Deficiency', q2: 'Above ₹10 Lakh', q3: 'Yes, ticket/email sent with no resolution' }, summary: 'Guidance summary for escalating a housing service deficiency claim after prior written outreach.', workflow: GUIDANCE_WORKFLOWS[2], createdAt: isoDay(-8) }
    ];

    const savedCases = [
      { id: 'CSIM-801', title: CASE_SAMPLES[0].title, category: CASE_SAMPLES[0].category, situation: CASE_SAMPLES[0].situation, facts: CASE_SAMPLES[0].facts, documents: CASE_SAMPLES[0].documents, report: CASE_SAMPLES[0].report, isFictionalDemo: true, createdAt: isoDay(-3) },
      { id: 'CSIM-802', title: CASE_SAMPLES[1].title, category: CASE_SAMPLES[1].category, situation: CASE_SAMPLES[1].situation, facts: CASE_SAMPLES[1].facts, documents: CASE_SAMPLES[1].documents, report: CASE_SAMPLES[1].report, isFictionalDemo: true, createdAt: isoDay(-7) }
    ];

    const notifications = [
      { id: 'NTF-01', title: 'Consultation Confirmed', message: `Your video appointment with ${lawyers[0].name} is scheduled for ${isoDay(2)} at 10:00 IST.`, time: '2 hours ago', read: false, link: 'Dashboard.html#appointments' },
      { id: 'NTF-02', title: 'Mediation Session Scheduled', message: `Mediation request MREQ-301 with ${mediators[1].name} is scheduled for ${isoDay(3)} at 11:00 IST.`, time: '5 hours ago', read: false, link: 'Dashboard.html#mediations' },
      { id: 'NTF-03', title: 'Document Analysis Saved', message: 'Analysis for Residential Rental Agreement was added to your history.', time: 'Yesterday', read: false, link: 'Dashboard.html#analyses' },
      { id: 'NTF-04', title: 'Appointment Rescheduled', message: `Consultation APT-2026-104 with ${lawyers[3].name} moved to ${isoDay(9)} at 15:30 IST.`, time: '2 days ago', read: false, link: 'Dashboard.html#appointments' },
      { id: 'NTF-05', title: 'Mediator Assigned', message: `${mediators[2].name} was assigned to Commercial Request MREQ-302.`, time: '3 days ago', read: true, link: 'Dashboard.html#mediations' },
      { id: 'NTF-06', title: 'Draft Saved to Vault', message: 'Residential Rent Agreement — Saket Enclave was saved in Generated Documents.', time: '3 days ago', read: true, link: 'Dashboard.html#generated' },
      { id: 'NTF-07', title: 'Case Exploration Saved', message: 'Report for Withheld Residential Security Deposit saved to Case History.', time: '3 days ago', read: true, link: 'Dashboard.html#cases' },
      { id: 'NTF-08', title: 'Legal Guidance Recorded', message: 'Tenancy & Security Deposit procedural checklist saved to Guidance History.', time: '4 days ago', read: true, link: 'Dashboard.html#guidance' },
      { id: 'NTF-09', title: 'Employment Contract Analyzed', message: 'Flagged 3 discussion items in Software Engineer Employment Agreement.', time: '5 days ago', read: true, link: 'Dashboard.html#analyses' },
      { id: 'NTF-10', title: 'NDA Template Generated', message: 'Mutual NDA — Vertex Analytics Pilot exported and stored in your documents.', time: '6 days ago', read: true, link: 'Dashboard.html#generated' },
      { id: 'NTF-11', title: 'Consultation Completed', message: `Consultation APT-2026-106 with ${lawyers[5].name} marked completed.`, time: '1 week ago', read: true, link: 'Dashboard.html#appointments' },
      { id: 'NTF-12', title: 'Mediation Resolved', message: 'Freelance Scope & Revision Settlement (MREQ-306) reached Resolved status.', time: '1 week ago', read: true, link: 'Dashboard.html#mediations' },
      { id: 'NTF-13', title: 'Lawyer Profile Bookmarked', message: `Saved ${lawyers[0].name} and 3 other profiles to Saved Lawyers.`, time: '10 days ago', read: true, link: 'Dashboard.html#saved' },
      { id: 'NTF-14', title: 'Welcome to NyayaDheesh', message: 'Explore all NyayaDheesh LegalTech workflows, document tools, and consultations.', time: '2 weeks ago', read: true, link: 'Dashboard.html#overview' },
      { id: 'NTF-15', title: 'Legal Guidance Reminder', message: 'Generated drafts and analyses are informational and should be reviewed by a qualified advocate.', time: '2 weeks ago', read: true, link: 'about.html' }
    ];

    return {
      version: 4,
      demoUser,
      demoLawyerAccount,
      registeredUsers: [
        { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: 'client', city: demoUser.city, phone: demoUser.phone, preferredLanguage: demoUser.preferredLanguage },
        { id: demoLawyerAccount.id, lawyerId: demoLawyerAccount.lawyerId, name: demoLawyerAccount.name, email: demoLawyerAccount.email, role: 'lawyer', city: demoLawyerAccount.city, phone: demoLawyerAccount.phone, preferredLanguage: 'English' }
      ],
      lawyers,
      mediators,
      appointments,
      mediationRequests,
      advocateCases,
      generatedDocs,
      savedAnalyses,
      savedGuidance,
      savedCases,
      savedLawyerIds: [lawyers[0].id, lawyers[2].id, lawyers[4].id, lawyers[10].id],
      notifications,
      contacts: [],
      preferences: {
        emailAlerts: true,
        appointmentReminders: true,
        mediationUpdates: true,
        compactTables: false
      }
    };
  }

  window.NDSeed = {
    CITIES,
    PRACTICE_AREAS,
    SAMPLE_DOCUMENTS,
    DOCUMENT_TEMPLATES,
    GUIDANCE_WORKFLOWS,
    CASE_SAMPLES,
    FAQS,
    MEDIATION_STAGES: ['Submitted', 'Under Review', 'Mediator Assigned', 'Session Scheduled', 'In Progress', 'Resolved', 'Closed'],
    createInitialState,
    isoDay
  };
})();
