/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { sheetsRead, sheetsAppend, SHEETS_CONFIG } from './sheetsConfig';
import DailyLogGenerator from './DailyLogGenerator';

const STYLE = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@300;400;500&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } :root { --bg:#07090f; --surface:#0d1117; --card:#111820; --border:#1e2d3d; --amber:#f6a623; --green:#22d3a5; --red:#ff4d6a; --blue:#4fa3e0; --purple:#a78bfa; --muted:#4a5568; --text:#cdd9e5; --heading:#e6edf3; } body { background:var(--bg); font-family:'DM Mono',monospace; color:var(--text); } .app { min-height:100vh; display:flex; flex-direction:column; } .topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:0 28px; height:56px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; } .brand-dot { width:10px; height:10px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation:pulse 2s infinite; } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} } .brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:15px; letter-spacing:.08em; color:var(--heading); text-transform:uppercase; } .brand-sub { font-size:10px; color:var(--muted); letter-spacing:.12em; } .topbar-brand { display:flex; align-items:center; gap:10px; } .topbar-status { display:flex; gap:8px; flex-wrap:wrap; } .status-pill { padding:3px 10px; border-radius:20px; border:1px solid var(--border); font-size:10px; letter-spacing:.1em; } .status-pill.green { border-color:var(--green); color:var(--green); } .status-pill.amber { border-color:var(--amber); color:var(--amber); } .status-pill.red   { border-color:var(--red);   color:var(--red); } .nav { background:var(--surface); border-bottom:1px solid var(--border); display:flex; padding:0 28px; overflow-x:auto; } .nav-tab { padding:12px 18px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:all .2s; background:none; border-left:none; border-right:none; border-top:none; } .nav-tab:hover { color:var(--text); } .nav-tab.active { color:var(--amber); border-bottom-color:var(--amber); } .main { padding:28px; flex:1; } .section-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:16px; display:flex; align-items:center; gap:10px; } .section-title::after { content:''; flex:1; height:1px; background:var(--border); } .metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:12px; margin-bottom:28px; } .metric-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; position:relative; overflow:hidden; } .metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; } .metric-card.green::before { background:var(--green); } .metric-card.amber::before { background:var(--amber); } .metric-card.red::before   { background:var(--red); } .metric-card.blue::before  { background:var(--blue); } .metric-card.purple::before{ background:var(--purple); } .metric-label { font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; } .metric-value { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; line-height:1; margin-bottom:4px; } .metric-card.green .metric-value { color:var(--green); } .metric-card.amber .metric-value { color:var(--amber); } .metric-card.red   .metric-value { color:var(--red); } .metric-card.blue  .metric-value { color:var(--blue); } .metric-card.purple .metric-value { color:var(--purple); } .metric-sub { font-size:10px; color:var(--muted); } .table-wrap { background:var(--card); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:24px; } .table-head { padding:12px 16px; background:var(--surface); border-bottom:1px solid var(--border); font-size:11px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; } table { width:100%; border-collapse:collapse; font-size:12px; } thead th { padding:10px 16px; text-align:left; font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; border-bottom:1px solid var(--border); background:var(--surface); } tbody tr { border-bottom:1px solid var(--border); transition:background .15s; } tbody tr:last-child { border-bottom:none; } tbody tr:hover { background:rgba(255,255,255,.02); } td { padding:10px 16px; color:var(--text); vertical-align:middle; } .badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; letter-spacing:.08em; font-weight:500; text-transform:uppercase; } .badge-green  { background:rgba(34,211,165,.12); color:var(--green); border:1px solid rgba(34,211,165,.25); } .badge-amber  { background:rgba(246,166,35,.12);  color:var(--amber); border:1px solid rgba(246,166,35,.25); } .badge-red    { background:rgba(255,77,106,.12);  color:var(--red);   border:1px solid rgba(255,77,106,.25); } .badge-blue   { background:rgba(79,163,224,.12);  color:var(--blue);  border:1px solid rgba(79,163,224,.25); } .badge-purple { background:rgba(167,139,250,.12); color:var(--purple);border:1px solid rgba(167,139,250,.25); } .progress-bar-bg { background:var(--border); border-radius:4px; height:6px; overflow:hidden; width:100%; } .progress-bar-fill { height:100%; border-radius:4px; transition:width .6s ease; } .checklist { display:flex; flex-direction:column; gap:2px; } .check-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:6px; cursor:pointer; transition:background .15s; font-size:12px; } .check-item:hover { background:rgba(255,255,255,.03); } .check-box { width:16px; height:16px; border-radius:3px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; } .check-box.checked { background:var(--green); border-color:var(--green); } .check-box.checked::after { content:'✓'; font-size:10px; color:#07090f; font-weight:700; } .check-wac { font-size:9px; color:var(--blue); letter-spacing:.08em; } .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:16px; } .field-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; } input,select,textarea { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:5px; padding:8px 12px; font-family:'DM Mono',monospace; font-size:12px; color:var(--text); outline:none; transition:border .2s; } input:focus,select:focus,textarea:focus { border-color:var(--amber); } textarea { resize:vertical; min-height:80px; } select option { background:var(--surface); } .btn { padding:9px 20px; border-radius:5px; font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .2s; border:none; } .btn-primary { background:var(--amber); color:#07090f; font-weight:700; } .btn-primary:hover { filter:brightness(1.1); } .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border); } .btn-ghost:hover { color:var(--text); border-color:var(--text); } .btn-sm { padding:5px 12px; font-size:10px; } .alert-banner { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:6px; margin-bottom:10px; font-size:12px; } .alert-banner.red   { background:rgba(255,77,106,.1); border:1px solid rgba(255,77,106,.3); color:#ff8fa3; } .alert-banner.amber { background:rgba(246,166,35,.1); border:1px solid rgba(246,166,35,.3); color:#f6c95a; } .alert-banner.green { background:rgba(34,211,165,.1); border:1px solid rgba(34,211,165,.3); color:var(--green); } .alert-banner.blue  { background:rgba(79,163,224,.1); border:1px solid rgba(79,163,224,.3); color:var(--blue); } .wac-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; transition:border-color .2s; } .wac-card:hover { border-color:var(--blue); } .wac-code { font-size:11px; color:var(--blue); letter-spacing:.1em; margin-bottom:4px; } .wac-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--heading); margin-bottom:6px; } .wac-desc { font-size:11px; color:var(--muted); line-height:1.6; } .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; } .three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; } @media(max-width:1000px) { .three-col { grid-template-columns:1fr 1fr; } } @media(max-width:900px) { .two-col,.three-col { grid-template-columns:1fr; } .form-grid { grid-template-columns:1fr; } } .incident-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; } .incident-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; } .incident-id { font-size:10px; color:var(--muted); letter-spacing:.1em; } .incident-type { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--heading); } .incident-meta { font-size:11px; color:var(--muted); margin-top:4px; } .sync-bar { font-size:10px; color:var(--muted); display:flex; align-items:center; gap:6px; padding:6px 0 14px; } .sync-dot { width:6px; height:6px; border-radius:50%; } .sync-dot.live { background:var(--green); box-shadow:0 0 6px var(--green); } .sync-dot.local { background:var(--amber); } .mar-cell { width:36px; height:36px; border-radius:6px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:all .2s; background:var(--surface); } .mar-cell:hover { border-color:var(--amber); } .mar-cell.given { background:rgba(34,211,165,.15); border-color:var(--green); } .mar-cell.refused { background:rgba(255,77,106,.15); border-color:var(--red); } .mar-cell.held { background:rgba(246,166,35,.15); border-color:var(--amber); } .mar-cell.na { background:rgba(79,163,224,.08); border-color:var(--blue); opacity:.5; } .res-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:14px 16px; margin-bottom:8px; cursor:pointer; transition:all .15s; } .res-card.selected { border-color:var(--amber); background:rgba(246,166,35,.05); } .res-card:hover { border-color:var(--muted); } .mar-legend { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:14px; font-size:11px; } .mar-legend-item { display:flex; align-items:center; gap:5px; } .mar-dot { width:10px; height:10px; border-radius:3px; } ::-webkit-scrollbar { width:6px; height:6px; } ::-webkit-scrollbar-track { background:var(--bg); } ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }`;

// ─── REAL DAIMA AFH DATA ────────────────────────────────────────────────────
const DEFAULT_RESIDENTS = [
  {
    id: 'R-001', name: 'Marion Tenneson', room: 'A', admission: '2023-08-14',
    dob: '1983-11-17', level: 'Level 3', code: 'Full Code',
    physician: 'Dr. Hela Kelsch', pharmacy: 'Ready Meds Pharmacy',
    chartComplete: 88, diet: 'Diabetic, Low Carb',
    allergies: 'Shellfish, Morphine, Bactrim DS',
    diagnosis: 'Type 2 DM, Schizophrenia, Bipolar Disorder, Depression, Anxiety, Nightmare Disorder, Vitamin D Deficiency',
    flags: 'Blood sugar checks daily,POLST on file,Controlled substance (Lorazepam)',
    medications: [
      { name: 'Clozapine 450mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'BINGO protocol' },
      { name: 'Divalproex ER 1500mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'Handle with gloves' },
      { name: 'Sertraline 200mg', freq: 'QD', time: 'Morning', route: 'Oral', special: '' },
      { name: 'Bupropion XL 450mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Two tablets combined' },
      { name: 'Jardiance 25mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Diabetes' },
      { name: 'Atorvastatin 80mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: '' },
      { name: 'Prazosin 4mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'For nightmares' },
      { name: 'Fenofibrate 160mg', freq: 'QD', time: 'Before dinner', route: 'Oral', special: '' },
      { name: 'Lisinopril 2.5mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: '' },
      { name: 'Lubiprostone 8mcg', freq: 'BID', time: 'With meals', route: 'Oral', special: '' },
      { name: 'Vitamin D3 2000IU', freq: 'QD', time: 'With meal', route: 'Oral', special: '' },
      { name: 'Blood Sugar Check', freq: 'QD', time: 'As directed', route: 'Accu-Chek', special: 'Diabetic MAR' },
      { name: 'Lorazepam 1mg', freq: 'PRN', time: 'As needed', route: 'Oral', special: 'PRN anxiety - controlled substance' },
    ],
  },
  {
    id: 'R-002', name: 'Albert Goblick', room: 'C', admission: '2024-12-13',
    dob: '1943-12-29', level: 'Level 2', code: 'DNR',
    physician: 'Dr. Ronald Smith (VA)', pharmacy: 'VA Pharmacy',
    chartComplete: 82, diet: 'Regular',
    allergies: 'None known',
    diagnosis: 'HIV-1, Hypertension, Depression, Insomnia, Skin conditions',
    flags: 'DNR — verify orders,VA medications (family supply),HIV medications',
    medications: [
      { name: 'Cobicistat/Elviteg/Emtric/Tenofov 150/150/200/10mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'HIV treatment — VA supply' },
      { name: 'Darunavir 800mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'MAR only — VA supplies' },
      { name: 'Eliquis 2.5mg', freq: 'BID', time: 'Every 12 hours', route: 'Oral', special: 'HTR — high-risk' },
      { name: 'Lisinopril 5mg (2 tabs)', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Blood pressure; reduce to 1 tab if BP<90/60' },
      { name: 'Mirtazapine 15mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'Depression, weight gain, insomnia' },
      { name: 'Polyethylene Glycol 17g', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Family supply' },
      { name: 'Vitamin D3 4000IU (2 tabs)', freq: 'QD', time: 'With food', route: 'Oral', special: '' },
      { name: 'Mupirocin 2% Ointment', freq: 'TID', time: 'Topical', route: 'Topical', special: 'Poorly healing sores' },
      { name: 'Clobetasol 0.05% Cream', freq: 'BID', time: 'Topical', route: 'Topical', special: 'Skin condition' },
      { name: 'Trazodone 50mg', freq: 'PRN', time: 'Bedtime PRN', route: 'Oral', special: 'PRN insomnia' },
      { name: 'Ensure Liquid', freq: 'BID', time: 'Twice daily', route: 'Oral', special: 'Family supply — nutrition' },
    ],
  },
  {
    id: 'R-003', name: 'Robert Carter', room: 'B', admission: '2024-11-13',
    dob: '1967-07-23', level: 'Level 3', code: 'DNR',
    physician: 'Dr. Haley Key (Seva Medical)', pharmacy: 'Ready Meds Pharmacy',
    chartComplete: 75, diet: 'Diabetic, Low Sodium',
    allergies: 'No known allergies',
    diagnosis: 'Type 2 DM with nephropathy, Hypertension, PTSD, Hyperlipidemia, Neuropathy, Anxiety, Depression, Vitamin D deficiency',
    flags: 'DNR — verify orders,No MAR uploaded yet,POLST pending',
    medications: [
      { name: 'Medications pending upload', freq: '—', time: '—', route: '—', special: 'Contact Dr. Haley Key (888) 637-9669' },
    ],
  },
  {
    id: 'R-004', name: 'Teresa Byrd (Tina)', room: 'B', admission: '2025-08-14',
    dob: '1970-06-30', level: 'Level 3', code: 'Full Code',
    physician: 'Dr. Haley Key (Seva Medical)', pharmacy: 'Ready Meds Pharmacy (Spokane Valley)',
    chartComplete: 79, diet: 'Regular',
    allergies: 'Penicillin',
    diagnosis: 'Essential Tremor, Major Depressive Disorder, Anxiety, COPD, Restless Legs Syndrome, Hepatitis C, Primary Insomnia, Vitamin D Deficiency',
    flags: 'Hepatitis C treatment (Mavyret 8 weeks),Nebulizer treatments PRN,Naloxone on hand',
    medications: [
      { name: 'Doxepin 10mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'Handle with gloves' },
      { name: 'Escitalopram 20mg', freq: 'QD', time: 'Morning', route: 'Oral', special: '' },
      { name: 'Furosemide 40mg (½ tab)', freq: 'BID', time: '8AM / Noon', route: 'Oral', special: 'Replaces prior dose' },
      { name: 'Ropinirole 1mg', freq: 'BID', time: '8AM / 5PM', route: 'Oral', special: 'Restless legs' },
      { name: 'Spironolactone 25mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Handle with gloves' },
      { name: 'Topiramate 50mg', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Handle with gloves' },
      { name: 'Trazodone 100mg', freq: 'QD', time: 'Bedtime', route: 'Oral', special: 'Replaces prior dose' },
      { name: 'Polyethylene Glycol 17g', freq: 'QD', time: 'Morning', route: 'Oral', special: 'Mix in 8oz liquid' },
      { name: 'Mavyret 300mg (3 tabs)', freq: 'QD', time: 'Daily x8 weeks', route: 'Oral', special: 'Hepatitis C treatment' },
      { name: 'Ketoconazole 2% Cream', freq: 'QD', time: 'Morning', route: 'Topical', special: 'Apply to red/dry areas on face' },
      { name: 'Triamcinolone 0.1% Cream', freq: 'BID', time: 'Twice daily x14 days', route: 'Topical', special: 'Lower left extremity' },
      { name: 'Budesonide 0.5mg/2ml', freq: 'PRN BID', time: 'As needed', route: 'Nebulizer', special: 'PRN respiratory' },
      { name: 'Ipratropium-Albuterol 3ml', freq: 'PRN Q6H', time: 'As needed', route: 'Nebulizer', special: 'PRN shortness of breath/wheezing' },
      { name: 'Naloxone 4mg', freq: 'PRN', time: 'Emergency only', route: 'Nasal', special: 'Call 911 — administer 1 spray per nostril' },
    ],
  },
];

const DEFAULT_STAFF = [
  {
    id: 'S-001', name: 'Dakarai Dibi', role: 'Registered Nurse',
    hired: '2024-01-01', cpr: '2026-08-31', hca: '2026-12-31',
    food: '2026-12-31', dementia: '2026-12-31',
    notes: 'RN License #823621 TX Board — Multistate Compact. BLS expires 08/2026.',
  },
  {
    id: 'S-002', name: 'Evelyn Tserayi', role: 'Caregiver',
    hired: '2025-11-14', cpr: '2026-06-01', hca: '2026-11-14',
    food: '2026-06-01', dementia: '2026-11-14',
    notes: 'HCA Application pending — Credential #HMCC.HM.70071137',
  },
  {
    id: 'S-003', name: 'Claret Gatawa', role: 'Nursing Assistant',
    hired: '2025-10-08', cpr: '2026-10-08', hca: '2026-01-08',
    food: '2026-10-08', dementia: '2026-10-08',
    notes: 'NA Cert #NC70019153 — EXPIRED 01/08/2026. Must renew immediately.',
  },
  {
    id: 'S-004', name: 'Beline Mokoro', role: 'Nursing Assistant',
    hired: '2023-08-04', cpr: '2026-08-04', hca: '2025-10-30',
    food: '2026-08-04', dementia: '2026-08-04',
    notes: 'NA Cert #NC61469970 — EXPIRED 10/30/2025. Must renew immediately.',
  },
];

const DEFAULT_INCIDENTS = [
  { id: 'INC-2025-001', type: 'Documentation', resident: 'Robert Carter', date: '2025-03-10', severity: 'minor', dshs: 'No', desc: 'MAR not yet on file for resident. Orders needed from Dr. Haley Key.' },
];

const CHART_CHECKLIST = [
  { id: 'c1',  text: 'Admission Agreement signed',         wac: 'WAC 388-76-10200' },
  { id: 'c2',  text: 'Resident Rights form acknowledged',  wac: 'WAC 388-76-10205' },
  { id: 'c3',  text: 'Initial Resident Assessment (ISP)',  wac: 'WAC 388-76-10300' },
  { id: 'c4',  text: 'Physician orders on file',           wac: 'WAC 388-76-10310' },
  { id: 'c5',  text: 'Current medication list (signed)',   wac: 'WAC 388-76-10315' },
  { id: 'c6',  text: 'Dietary/allergy documentation',      wac: 'WAC 388-76-10320' },
  { id: 'c7',  text: 'Emergency contact info verified',    wac: 'WAC 388-76-10205' },
  { id: 'c8',  text: 'TB test/clearance on file',          wac: 'WAC 388-76-10160' },
  { id: 'c9',  text: 'Annual physical (within 12 months)', wac: 'WAC 388-76-10310' },
  { id: 'c10', text: 'Care plan reviewed & updated',       wac: 'WAC 388-76-10300' },
  { id: 'c11', text: 'Advance Directive / POLST on file',  wac: 'WAC 388-76-10210' },
  { id: 'c12', text: 'Financial agreement documented',     wac: 'WAC 388-76-10200' },
];

const INSPECTION_ITEMS = [
  { category: 'Personnel Files', item: 'All staff credentials verified',       status: 'fail' },
  { category: 'Personnel Files', item: 'Background check records on file',     status: 'pass' },
  { category: 'Personnel Files', item: 'HCA / NA certifications current',      status: 'fail' },
  { category: 'Resident Care',   item: 'ISPs current for all residents',       status: 'warn' },
  { category: 'Resident Care',   item: 'Medication management logs complete',  status: 'warn' },
  { category: 'Resident Care',   item: 'Dignity & rights policies posted',     status: 'pass' },
  { category: 'Home Safety',     item: 'Fire drill log (2x per year)',         status: 'pass' },
  { category: 'Home Safety',     item: 'Carbon monoxide detectors tested',     status: 'pass' },
  { category: 'Home Safety',     item: 'Emergency evacuation plan posted',     status: 'pass' },
  { category: 'Home Safety',     item: 'First aid kit stocked & accessible',   status: 'pass' },
  { category: 'Medications',     item: 'Controlled substance log verified',    status: 'warn' },
  { category: 'Medications',     item: 'Medications stored securely (locked)', status: 'pass' },
  { category: 'Medications',     item: 'MAR documentation complete',           status: 'warn' },
  { category: 'Food Service',    item: 'Food handler cards on file',           status: 'pass' },
  { category: 'Food Service',    item: 'Fridge/freezer temps logged',          status: 'warn' },
  { category: 'Documentation',   item: 'Incident reports filed within 24h',   status: 'pass' },
  { category: 'Documentation',   item: 'Activity log maintained',              status: 'pass' },
  { category: 'Documentation',   item: 'Resident grievance procedure posted',  status: 'pass' },
];

const WAC_REFS = [
  { code: 'WAC 388-76-10100', title: 'Licensing Requirements',        desc: 'AFH must be licensed by DSHS before providing care. License must be posted prominently.', status: 'compliant' },
  { code: 'WAC 388-76-10155', title: 'Provider Qualifications',       desc: 'Provider must complete 75-hour basic training, CPR/First Aid, food handler cert, and dementia training.', status: 'compliant' },
  { code: 'WAC 388-76-10160', title: 'Employee Requirements',         desc: 'All caregivers must meet background check, TB screening, HCA registration, and training requirements.', status: 'warning' },
  { code: 'WAC 388-76-10200', title: 'Admission Agreement',           desc: 'Written admission agreement required prior to or on day of admission.', status: 'compliant' },
  { code: 'WAC 388-76-10300', title: 'Individual Service Plan (ISP)', desc: 'ISP must be developed within 30 days of admission and reviewed annually.', status: 'warning' },
  { code: 'WAC 388-76-10310', title: 'Health Monitoring',             desc: 'Provider must monitor and document residents health conditions.', status: 'compliant' },
  { code: 'WAC 388-76-10315', title: 'Medication Management',         desc: 'Medications must be stored securely and documented on a MAR.', status: 'compliant' },
  { code: 'WAC 388-76-10400', title: 'Physical Environment',          desc: 'Home must meet safety, sanitation, and fire protection standards.', status: 'warning' },
  { code: 'WAC 388-76-10520', title: 'Incident Reporting',            desc: 'Reportable incidents must be reported to DSHS within 24 hours.', status: 'compliant' },
  { code: 'WAC 388-76-10205', title: 'Resident Rights',               desc: 'Provider must ensure residents rights including privacy, dignity, and grievance process.', status: 'compliant' },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function certStatus(d) { const n = daysUntil(d); return n < 0 ? 'expired' : n < 60 ? 'expiring' : 'current'; }
function certBadge(d) {
  const s = certStatus(d);
  return s === 'expired'
    ? <span className='badge badge-red'>⛔ Expired</span>
    : s === 'expiring'
      ? <span className='badge badge-amber'>⚠ Exp Soon</span>
      : <span className='badge badge-green'>✓ Current</span>;
}
function pColor(p) { return p >= 90 ? '#22d3a5' : p >= 70 ? '#f6a623' : '#ff4d6a'; }
function codeBadge(c) {
  return c === 'DNR'
    ? <span className='badge badge-red'>DNR</span>
    : <span className='badge badge-green'>Full Code</span>;
}

function SyncBar({ live }) {
  return (
    <div className='sync-bar'>
      <div className={`sync-dot ${live ? 'live' : 'local'}`} />
      {live
        ? <span>Live — syncing with Google Sheets</span>
        : <span>Local mode — connect Google Sheets to persist data</span>}
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ residents, incidents, staff }) {
  const pass = INSPECTION_ITEMS.filter(i => i.status === 'pass').length;
  const fail = INSPECTION_ITEMS.filter(i => i.status === 'fail').length;
  const warn = INSPECTION_ITEMS.filter(i => i.status === 'warn').length;
  const score = Math.round((pass / INSPECTION_ITEMS.length) * 100);
  const expd = staff.filter(s => certStatus(s.cpr) === 'expired' || certStatus(s.hca) === 'expired').length;
  const expg = staff.filter(s => certStatus(s.cpr) === 'expiring' || certStatus(s.hca) === 'expiring').length;
  const avg = residents.length ? Math.round(residents.reduce((a, r) => a + Number(r.chartComplete), 0) / residents.length) : 0;
  const totalMeds = residents.reduce((a, r) => a + (r.medications?.length || 0), 0);

  return (
    <div>
      {fail > 0 && <div className='alert-banner red'>🚨 <span><strong>{fail} critical item{fail > 1 ? 's' : ''}</strong> require immediate attention — staff certifications expired.</span></div>}
      {expd > 0 && <div className='alert-banner red'>⛔ <span><strong>{expd} staff member{expd > 1 ? 's' : ''}</strong> have expired certifications — Claret Gatawa (NA exp 01/08/26) &amp; Beline Mokoro (NA exp 10/30/25).</span></div>}
      {expg > 0 && <div className='alert-banner amber'>⚠️ <span><strong>{expg} staff member{expg > 1 ? 's' : ''}</strong> have certifications expiring within 60 days.</span></div>}
      <div className='alert-banner amber'>⚠️ <span><strong>Robert Carter</strong> — MAR / medication orders not yet on file. Contact Dr. Haley Key at (888) 637-9669.</span></div>

      <div className='section-title'>Command Overview</div>
      <div className='metrics-grid'>
        <div className={`metric-card ${score >= 90 ? 'green' : score >= 75 ? 'amber' : 'red'}`}>
          <div className='metric-label'>Inspection Score</div>
          <div className='metric-value'>{score}%</div>
          <div className='metric-sub'>{pass}/{INSPECTION_ITEMS.length} passing</div>
        </div>
        <div className='metric-card red'>
          <div className='metric-label'>Critical Fails</div>
          <div className='metric-value'>{fail}</div>
          <div className='metric-sub'>Staff certs expired</div>
        </div>
        <div className='metric-card amber'>
          <div className='metric-label'>Warnings</div>
          <div className='metric-value'>{warn}</div>
          <div className='metric-sub'>Needs attention</div>
        </div>
        <div className='metric-card blue'>
          <div className='metric-label'>Residents</div>
          <div className='metric-value'>{residents.length}</div>
          <div className='metric-sub'>Active / Max 6</div>
        </div>
        <div className={`metric-card ${avg >= 90 ? 'green' : 'amber'}`}>
          <div className='metric-label'>Avg Chart Score</div>
          <div className='metric-value'>{avg}%</div>
          <div className='metric-sub'>Documentation</div>
        </div>
        <div className='metric-card purple'>
          <div className='metric-label'>Active Medications</div>
          <div className='metric-value'>{totalMeds}</div>
          <div className='metric-sub'>Across all residents</div>
        </div>
      </div>

      <div className='two-col'>
        <div>
          <div className='section-title'>Readiness by Category</div>
          {[...new Set(INSPECTION_ITEMS.map(i => i.category))].map(cat => {
            const items = INSPECTION_ITEMS.filter(i => i.category === cat);
            const p = Math.round((items.filter(i => i.status === 'pass').length / items.length) * 100);
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                  <span>{cat}</span><span style={{ color: pColor(p) }}>{p}%</span>
                </div>
                <div className='progress-bar-bg'><div className='progress-bar-fill' style={{ width: p + '%', background: pColor(p) }} /></div>
              </div>
            );
          })}
        </div>
        <div>
          <div className='section-title'>Resident Snapshot</div>
          {residents.map(r => (
            <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--heading)' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Room {r.room} · {r.diet}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {codeBadge(r.code)}
                  <span style={{ fontSize: 14, fontWeight: 800, color: pColor(r.chartComplete), fontFamily: 'Syne,sans-serif' }}>{r.chartComplete}%</span>
                </div>
              </div>
              <div className='progress-bar-bg'><div className='progress-bar-fill' style={{ width: r.chartComplete + '%', background: pColor(r.chartComplete) }} /></div>
              {r.flags && <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>{r.flags.split(',').map(f => <span key={f} className='badge badge-amber'>{f.trim()}</span>)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INSPECTION ──────────────────────────────────────────────────────────────
function InspectionDashboard() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? INSPECTION_ITEMS : INSPECTION_ITEMS.filter(i => i.status === filter);
  const categories = [...new Set(INSPECTION_ITEMS.map(i => i.category))];

  return (
    <div>
      <div className='section-title'>Inspection Readiness Dashboard</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pass', 'warn', 'fail'].map(f => (
          <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(f)} style={{ fontSize: 10 }}>
            {f === 'all' ? 'All' : f === 'pass' ? '✓ Pass' : f === 'warn' ? '⚠ Warn' : '✗ Critical'}
          </button>
        ))}
      </div>
      {categories.map(cat => {
        const items = filtered.filter(i => i.category === cat);
        if (!items.length) return null;
        const all = INSPECTION_ITEMS.filter(i => i.category === cat);
        return (
          <div key={cat} className='table-wrap' style={{ marginBottom: 16 }}>
            <div className='table-head'><span>{cat}</span><span>{all.filter(i => i.status === 'pass').length}/{all.length} passing</span></div>
            <table><tbody>{items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ width: 24, paddingRight: 0, color: item.status === 'pass' ? 'var(--green)' : item.status === 'warn' ? 'var(--amber)' : 'var(--red)' }}>{item.status === 'pass' ? '✓' : item.status === 'warn' ? '⚠' : '✗'}</td>
                <td>{item.item}</td>
                <td style={{ textAlign: 'right' }}>{item.status === 'pass' ? <span className='badge badge-green'>Pass</span> : item.status === 'warn' ? <span className='badge badge-amber'>Attention</span> : <span className='badge badge-red'>Critical</span>}</td>
              </tr>
            ))}</tbody></table>
          </div>
        );
      })}
    </div>
  );
}

// ─── RESIDENT CHARTS ─────────────────────────────────────────────────────────
function ResidentCharts({ residents }) {
  const [selected, setSelected] = useState(null);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    if (residents.length) {
      setSelected(residents[0]);
      setChecks(Object.fromEntries(residents.map(r => [r.id, CHART_CHECKLIST.map(c => ({ ...c, done: false }))])));
    }
  }, [residents]);

  const toggle = (cid) => setChecks(prev => ({
    ...prev,
    [selected.id]: prev[selected.id].map(c => c.id === cid ? { ...c, done: !c.done } : c),
  }));

  if (!selected) return null;
  const cur = checks[selected.id] || [];
  const pct = cur.length ? Math.round((cur.filter(c => c.done).length / cur.length) * 100) : 0;

  return (
    <div className='two-col'>
      <div>
        <div className='section-title'>Residents</div>
        {residents.map(r => {
          const rc = checks[r.id] || [];
          const p = rc.length ? Math.round((rc.filter(c => c.done).length / rc.length) * 100) : 0;
          const flags = r.flags ? r.flags.split(',').filter(Boolean) : [];
          return (
            <div key={r.id} className={`res-card ${selected?.id === r.id ? 'selected' : ''}`} onClick={() => setSelected(r)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--heading)' }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Room {r.room} · DOB {r.dob} · {r.level}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{r.physician}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {codeBadge(r.code)}
                  <span style={{ fontSize: 14, fontWeight: 800, color: pColor(p), fontFamily: 'Syne,sans-serif' }}>{p}%</span>
                </div>
              </div>
              <div className='progress-bar-bg'><div className='progress-bar-fill' style={{ width: p + '%', background: pColor(p) }} /></div>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>🍽 {r.diet} · ⚠️ {r.allergies}</div>
              {flags.length > 0 && <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>{flags.map(f => <span key={f} className='badge badge-amber'>{f.trim()}</span>)}</div>}
            </div>
          );
        })}
      </div>
      <div>
        <div className='section-title'>{selected.name} — Chart Checklist</div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Diagnosis</div>
          <div style={{ fontSize: 11, color: 'var(--text)', lineHeight: 1.5, marginBottom: 10 }}>{selected.diagnosis}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--muted)' }}>Chart Completeness</span>
            <span style={{ color: pColor(pct), fontWeight: 700 }}>{cur.filter(c => c.done).length}/{cur.length} — {pct}%</span>
          </div>
          <div className='progress-bar-bg' style={{ height: 8 }}><div className='progress-bar-fill' style={{ width: pct + '%', background: pColor(pct) }} /></div>
        </div>
        <div className='checklist'>
          {cur.map(c => (
            <div key={c.id} className='check-item' onClick={() => toggle(c.id)}>
              <div className={`check-box ${c.done ? 'checked' : ''}`} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, textDecoration: c.done ? 'line-through' : 'none', color: c.done ? 'var(--muted)' : 'var(--text)' }}>{c.text}</div>
                <div className='check-wac'>{c.wac}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAR MODULE ──────────────────────────────────────────────────────────────
function MARModule({ residents }) {
  const [selectedRes, setSelectedRes] = useState(null);
  const [marData, setMarData] = useState({});
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const daysInMonth = new Date(year, today.getMonth() + 1, 0).getDate();
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  useEffect(() => { if (residents.length) setSelectedRes(residents[0]); }, [residents]);

  const getCell = (resId, medName, day) => marData[`${resId}|${medName}|${day}`] || 'pending';
  const cycleCell = (resId, medName, day) => {
    const key = `${resId}|${medName}|${day}`;
    const cur = marData[key] || 'pending';
    const next = { pending: 'given', given: 'refused', refused: 'held', held: 'pending' };
    setMarData(prev => ({ ...prev, [key]: next[cur] }));
  };
  const cellIcon = (s) => s === 'given' ? '✓' : s === 'refused' ? '✗' : s === 'held' ? 'H' : '';

  if (!selectedRes) return null;
  const meds = selectedRes.medications || [];
  const today_d = today.getDate();
  const givenCount = meds.filter(m => getCell(selectedRes.id, m.name, String(today_d)) === 'given').length;
  const pendingCount = meds.filter(m => getCell(selectedRes.id, m.name, String(today_d)) === 'pending').length;

  return (
    <div>
      <div className='section-title'>Medication Administration Record (MAR) — {month} {year}</div>
      <div className='alert-banner blue'>💊 Click each cell to cycle: Pending → Given ✓ → Refused ✗ → Held H</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {residents.map(r => (
          <button key={r.id} className={`btn ${selectedRes?.id === r.id ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSelectedRes(r)}>
            {r.name.split(' ')[0]} (Rm {r.room})
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--heading)' }}>{selectedRes.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Room {selectedRes.room} · {selectedRes.code} · Dr: {selectedRes.physician}</div>
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4 }}>⚠ Allergies: {selectedRes.allergies}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ textAlign: 'center', background: 'rgba(34,211,165,.1)', border: '1px solid rgba(34,211,165,.2)', borderRadius: 6, padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', fontFamily: 'Syne,sans-serif' }}>{givenCount}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Given today</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(246,166,35,.1)', border: '1px solid rgba(246,166,35,.2)', borderRadius: 6, padding: '8px 14px' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber)', fontFamily: 'Syne,sans-serif' }}>{pendingCount}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Pending today</div>
            </div>
          </div>
        </div>
      </div>

      <div className='mar-legend'>
        <div className='mar-legend-item'><div className='mar-dot' style={{ background: 'var(--surface)', border: '1px solid var(--border)' }} /><span>Pending</span></div>
        <div className='mar-legend-item'><div className='mar-dot' style={{ background: 'rgba(34,211,165,.3)' }} /><span>Given ✓</span></div>
        <div className='mar-legend-item'><div className='mar-dot' style={{ background: 'rgba(255,77,106,.3)' }} /><span>Refused ✗</span></div>
        <div className='mar-legend-item'><div className='mar-dot' style={{ background: 'rgba(246,166,35,.3)' }} /><span>Held H</span></div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ minWidth: 200, textAlign: 'left' }}>Medication</th>
              <th style={{ minWidth: 60 }}>Freq</th>
              <th style={{ minWidth: 80 }}>Time</th>
              {dayNums.map(d => (
                <th key={d} style={{ minWidth: 38, textAlign: 'center', color: Number(d) === today_d ? 'var(--amber)' : 'var(--muted)', fontWeight: Number(d) === today_d ? 700 : 400 }}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {meds.map((med, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.01)' }}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--heading)', fontSize: 12 }}>{med.name}</div>
                  {med.special && <div style={{ fontSize: 10, color: 'var(--amber)', marginTop: 2 }}>⚠ {med.special}</div>}
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{med.route}</div>
                </td>
                <td><span className={`badge ${med.freq === 'PRN' ? 'badge-blue' : 'badge-green'}`}>{med.freq}</span></td>
                <td style={{ fontSize: 11, color: 'var(--muted)' }}>{med.time}</td>
                {dayNums.map(d => {
                  const st = getCell(selectedRes.id, med.name, d);
                  const isPRN = med.freq === 'PRN';
                  return (
                    <td key={d} style={{ textAlign: 'center', padding: '6px 4px' }}>
                      <div
                        className={`mar-cell ${isPRN && st === 'pending' ? 'na' : st}`}
                        onClick={() => cycleCell(selectedRes.id, med.name, d)}
                        title={`${med.name} — Day ${d}: ${st}`}
                      >
                        {st === 'pending' && !isPRN ? '' : cellIcon(st)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(246,166,35,.07)', border: '1px solid rgba(246,166,35,.2)', borderRadius: 8, fontSize: 11, color: '#f6c95a' }}>
        📋 WAC 388-76-10315: All medications must be documented in the MAR at time of administration. Controlled substances require additional documentation. PRN medications should note reason administered.
      </div>
    </div>
  );
}

// ─── TRAINING TRACKER ────────────────────────────────────────────────────────
function TrainingTracker({ staff }) {
  const cols = [
    { key: 'cpr', label: 'CPR / BLS' },
    { key: 'hca', label: 'HCA / NA Cert' },
    { key: 'food', label: 'Food Handler' },
    { key: 'dementia', label: 'Dementia Training' },
  ];
  const alerts = [];
  staff.forEach(s => cols.forEach(c => {
    const d = daysUntil(s[c.key]);
    if (d < 90) alerts.push({ staff: s.name, cert: c.label, days: d, date: s[c.key] });
  }));
  alerts.sort((a, b) => a.days - b.days);

  return (
    <div>
      <div className='section-title'>Training &amp; Certification Tracker</div>
      {alerts.map((e, i) => (
        <div key={i} className={`alert-banner ${e.days < 0 ? 'red' : 'amber'}`}>
          <span>{e.days < 0 ? '⛔' : '⚠️'}</span>
          <span><strong>{e.staff}</strong> — {e.cert} {e.days < 0 ? `expired ${Math.abs(e.days)} days ago` : `expires in ${e.days} days`} ({e.date})</span>
        </div>
      ))}
      <div className='table-wrap' style={{ marginTop: 16 }}>
        <div className='table-head'><span>Staff Certification Matrix</span><span style={{ fontSize: 10 }}>WAC 388-76-10155 / 10160</span></div>
        <table>
          <thead><tr><th>Name</th><th>Role</th>{cols.map(c => <th key={c.key}>{c.label}</th>)}<th>Status</th><th>Notes</th></tr></thead>
          <tbody>{staff.map(s => {
            const sts = cols.map(c => certStatus(s[c.key]));
            const ov = sts.includes('expired') ? 'expired' : sts.includes('expiring') ? 'expiring' : 'current';
            return (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: 'var(--heading)' }}>{s.name}</td>
                <td style={{ fontSize: 11, color: 'var(--muted)' }}>{s.role}</td>
                {cols.map(c => (
                  <td key={c.key}>
                    <div>{certBadge(s[c.key])}</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{s[c.key]}</div>
                  </td>
                ))}
                <td>
                  {ov === 'expired' ? <span className='badge badge-red'>⛔ Action Now</span>
                    : ov === 'expiring' ? <span className='badge badge-amber'>⚠ Renew Soon</span>
                      : <span className='badge badge-green'>✓ Current</span>}
                </td>
                <td style={{ fontSize: 10, color: 'var(--muted)', maxWidth: 200 }}>{s.notes}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── INCIDENT REPORTING ──────────────────────────────────────────────────────
function IncidentReporting({ incidents, setIncidents, residents, sheetsLive }) {
  const [form, setForm] = useState({ type: '', resident: '', date: '', severity: 'minor', desc: '', dshs: 'No' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.type || !form.resident || !form.date) return;
    setSaving(true);
    const id = `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`;
    const row = { ...form, id };
    setIncidents(prev => [row, ...prev]);
    if (sheetsLive) await sheetsAppend(SHEETS_CONFIG.TABS.INCIDENTS, row);
    setForm({ type: '', resident: '', date: '', severity: 'minor', desc: '', dshs: 'No' });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className='two-col'>
      <div>
        <div className='section-title'>New Incident Report</div>
        {saved && <div className='alert-banner green'>✓ Incident logged{sheetsLive ? ' and saved to Google Sheets' : ''}.</div>}
        <div className='table-wrap'>
          <div className='table-head'><span>Incident Report Form</span><span>WAC 388-76-10520</span></div>
          <div className='form-grid'>
            <div>
              <div className='field-label'>Type</div>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value=''>Select…</option>
                {['Fall', 'Medication Error', 'Elopement', 'Injury', 'Behavioral Incident', 'Hospitalization', 'Death', 'Abuse/Neglect Report', 'Property Damage', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div className='field-label'>Resident</div>
              <select value={form.resident} onChange={e => setForm({ ...form, resident: e.target.value })}>
                <option value=''>Select…</option>
                {residents.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div><div className='field-label'>Date</div><input type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div>
              <div className='field-label'>Severity</div>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                {['minor', 'moderate', 'serious', 'critical'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ padding: '0 16px 12px' }}>
            <div className='field-label'>Description &amp; Actions Taken</div>
            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder='What happened, immediate response, corrective actions…' />
          </div>
          <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className='field-label' style={{ marginBottom: 0 }}>Reported to DSHS?</div>
            <select value={form.dshs} onChange={e => setForm({ ...form, dshs: e.target.value })} style={{ width: 'auto' }}>
              <option>No</option><option>Yes</option>
            </select>
            <div style={{ flex: 1 }} />
            <button className='btn btn-primary' onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Log Incident'}</button>
          </div>
          <div style={{ padding: '0 16px 14px' }}>
            <div style={{ background: 'rgba(246,166,35,.07)', border: '1px solid rgba(246,166,35,.2)', borderRadius: 6, padding: '10px 12px', fontSize: 11, color: '#f6c95a' }}>
              ⏱ Serious incidents must be reported to DSHS within <strong>24 hours</strong> (WAC 388-76-10520)
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='section-title'>Incident Log ({incidents.length})</div>
        {incidents.map(inc => (
          <div key={inc.id} className='incident-card'>
            <div className='incident-header'>
              <div><div className='incident-id'>{inc.id}</div><div className='incident-type'>{inc.type}</div></div>
              <span className={`badge badge-${inc.severity === 'critical' || inc.severity === 'serious' ? 'red' : inc.severity === 'moderate' ? 'amber' : 'blue'}`}>{inc.severity}</span>
            </div>
            <div className='incident-meta'>{inc.resident} · {inc.date}</div>
            {inc.desc && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{inc.desc}</div>}
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className='badge badge-green'>Logged</span>
              {inc.dshs === 'Yes' ? <span className='badge badge-green'>DSHS Filed</span> : <span className='badge badge-amber'>DSHS Pending</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WAC REFERENCE ───────────────────────────────────────────────────────────
function WACReference() {
  const [search, setSearch] = useState('');
  const filtered = WAC_REFS.filter(w =>
    w.code.toLowerCase().includes(search.toLowerCase()) ||
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.desc.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className='section-title'>DSHS / WAC Compliance Cross-Reference</div>
      <div className='metrics-grid' style={{ marginBottom: 20 }}>
        <div className='metric-card green'><div className='metric-label'>Compliant</div><div className='metric-value'>{WAC_REFS.filter(w => w.status === 'compliant').length}</div></div>
        <div className='metric-card amber'><div className='metric-label'>Needs Review</div><div className='metric-value'>{WAC_REFS.filter(w => w.status === 'warning').length}</div></div>
        <div className='metric-card blue'><div className='metric-label'>Total Sections</div><div className='metric-value'>{WAC_REFS.length}</div></div>
      </div>
      <div style={{ marginBottom: 16 }}><input placeholder='Search WAC code, title, or keyword…' value={search} onChange={e => setSearch(e.target.value)} /></div>
      {filtered.map(w => (
        <div key={w.code} className='wac-card'>
          <div className='wac-code'>{w.code}</div>
          <div className='wac-title'>{w.title}</div>
          <div className='wac-desc'>{w.desc}</div>
          <div style={{ marginTop: 10 }}>{w.status === 'compliant' ? <span className='badge badge-green'>✓ Compliant</span> : <span className='badge badge-amber'>⚠ Needs Review</span>}</div>
        </div>
      ))}
    </div>
  );
}

// ─── SETUP GUIDE ─────────────────────────────────────────────────────────────
function SetupGuide() {
  return (
    <div>
      <div className='section-title'>Google Sheets Setup Guide</div>
      <div className='alert-banner blue'>📋 Follow these steps once to connect your live Google Sheets backend.</div>
      {[
        { step: '1', title: 'Create your Google Spreadsheet', desc: "Go to sheets.google.com and create a new spreadsheet named 'Daima AFH Command Center'. Create 4 tabs: Residents, Staff, Incidents, Checklist." },
        { step: '2', title: 'Open Google Apps Script', desc: 'In your spreadsheet go to Extensions then Apps Script. Delete any default code.' },
        { step: '3', title: 'Paste the backend script', desc: 'Copy the contents of APPS_SCRIPT.gs from your download and paste into the Apps Script editor. Replace PASTE_YOUR_SPREADSHEET_ID_HERE with your actual ID.' },
        { step: '4', title: 'Deploy as Web App', desc: 'Click Deploy then New Deployment. Select Web app. Execute as Me. Who has access Anyone. Click Deploy and copy the Web App URL.' },
        { step: '5', title: 'Add environment variables in Vercel', desc: 'Go to your Vercel project Settings then Environment Variables. Add REACT_APP_SHEET_API_URL and REACT_APP_SPREADSHEET_ID. Then redeploy.' },
        { step: '6', title: 'You are live!', desc: 'Refresh the app. The sync indicator in the top bar turns green. All incidents and MAR data now save permanently to your Google Sheet.' },
      ].map(s => (
        <div key={s.step} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)', color: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{s.step}</div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', flex: 1 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--heading)', marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP SHELL ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: '📊 Command Center' },
  { id: 'inspection', label: '📋 Inspection' },
  { id: 'charts',     label: '🗂 Resident Charts' },
  { id: 'mar',        label: '💊 MAR' },
  { id: 'training',   label: '📅 Training' },
  { id: 'incidents',  label: '🚨 Incidents' },
  { id: 'wac',        label: '📑 WAC Reference' },
  { id: 'dailylog',   label: '📝 Daily Log' },
  { id: 'setup',      label: '⚙️ Setup Guide' },
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [residents, setResidents] = useState(DEFAULT_RESIDENTS);
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  const [incidents, setIncidents] = useState(DEFAULT_INCIDENTS);
  const [sheetsLive, setSheetsLive] = useState(false);

  useEffect(() => {
    async function load() {
      if (!SHEETS_CONFIG.SHEET_API_URL) return;
      const [r, s, inc] = await Promise.all([
        sheetsRead(SHEETS_CONFIG.TABS.RESIDENTS),
        sheetsRead(SHEETS_CONFIG.TABS.STAFF),
        sheetsRead(SHEETS_CONFIG.TABS.INCIDENTS),
      ]);
      if (r && r.length) { setResidents(r); setSheetsLive(true); }
      if (s && s.length) { setStaff(s); setSheetsLive(true); }
      if (inc && inc.length) { setIncidents(inc); setSheetsLive(true); }
    }
    load();
  }, []);

  const fail = INSPECTION_ITEMS.filter(i => i.status === 'fail').length;
  const warn = INSPECTION_ITEMS.filter(i => i.status === 'warn').length;
  const score = Math.round((INSPECTION_ITEMS.filter(i => i.status === 'pass').length / INSPECTION_ITEMS.length) * 100);
  const expiredStaff = DEFAULT_STAFF.filter(s => certStatus(s.hca) === 'expired' || certStatus(s.cpr) === 'expired').length;

  return (
    <>
      <style>{STYLE}</style>
      <div className='app'>
        <div className='topbar'>
          <div className='topbar-brand'>
            <div className='brand-dot' />
            <div>
              <div className='brand-name'>Daima AFH — Command Center</div>
              <div className='brand-sub'>11419 N Astor Rd, Spokane WA · DSHS / WAC 388-76</div>
            </div>
          </div>
          <div className='topbar-status'>
            <span className={`status-pill ${score >= 90 ? 'green' : score >= 75 ? 'amber' : 'red'}`}>Score {score}%</span>
            {fail > 0 && <span className='status-pill red'>{fail} Critical</span>}
            {warn > 0 && <span className='status-pill amber'>{warn} Warnings</span>}
            {expiredStaff > 0 && <span className='status-pill red'>⛔ {expiredStaff} Certs Expired</span>}
            <span className={`status-pill ${sheetsLive ? 'green' : 'amber'}`}>{sheetsLive ? '● Sheets Live' : '● Local Mode'}</span>
          </div>
        </div>
        <div className='nav'>
          {TABS.map(t => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className='main'>
          <SyncBar live={sheetsLive} />
          {tab === 'dashboard'  && <Dashboard residents={residents} incidents={incidents} staff={staff} />}
          {tab === 'inspection' && <InspectionDashboard />}
          {tab === 'charts'     && <ResidentCharts residents={residents} />}
          {tab === 'mar'        && <MARModule residents={residents} />}
          {tab === 'training'   && <TrainingTracker staff={staff} />}
          {tab === 'incidents'  && <IncidentReporting incidents={incidents} setIncidents={setIncidents} residents={residents} sheetsLive={sheetsLive} />}
          {tab === 'wac'        && <WACReference />}
           {tab === 'dailylog'   && <DailyLogGenerator />}
          {tab === 'setup'      && <SetupGuide />}
        </div>
      </div>
    </>
  );
}
