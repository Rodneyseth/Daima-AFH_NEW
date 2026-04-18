/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { sheetsRead, sheetsAppend, SHEETS_CONFIG } from './sheetsConfig';
import AuthPage from './AuthPage';
import { supabase } from './supabaseClient';

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
--bg:#07090f; --surface:#0d1117; --card:#111820; --border:#1e2d3d;
--amber:#f6a623; --green:#22d3a5; --red:#ff4d6a; --blue:#4fa3e0;
--purple:#a78bfa; --muted:#4a5568; --text:#cdd9e5; --heading:#e6edf3;
}
body { background:var(--bg); font-family:'DM Mono',monospace; color:var(--text); }
.app { min-height:100vh; display:flex; flex-direction:column; }
.topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:0 28px; height:56px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
.brand-dot { width:10px; height:10px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:15px; letter-spacing:.08em; color:var(--heading); text-transform:uppercase; }
.brand-sub { font-size:10px; color:var(--muted); letter-spacing:.12em; }
.topbar-brand { display:flex; align-items:center; gap:10px; }
.topbar-status { display:flex; gap:8px; flex-wrap:wrap; }
.status-pill { padding:3px 10px; border-radius:20px; border:1px solid var(--border); font-size:10px; letter-spacing:.1em; }
.status-pill.green { border-color:var(--green); color:var(--green); }
.status-pill.amber { border-color:var(--amber); color:var(--amber); }
.status-pill.red   { border-color:var(--red);   color:var(--red); }
.nav { background:var(--surface); border-bottom:1px solid var(--border); display:flex; padding:0 28px; overflow-x:auto; }
.nav-tab { padding:12px 18px; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:all .2s; background:none; border-left:none; border-right:none; border-top:none; }
.nav-tab:hover { color:var(--text); }
.nav-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
.main { padding:28px; flex:1; }
.section-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
.section-title::after { content:''; flex:1; height:1px; background:var(--border); }
.metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:12px; margin-bottom:28px; }
.metric-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; position:relative; overflow:hidden; }
.metric--card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
.metric-card.green::before { background:var(--green); }
.metric-card.amber::before { background:var(--amber); }
.metric-card.red::before   { background:var(--red); }
.metric-card.blue::before  { background:var(--blue); }
.metric-card.purple::before{ background:var(--purple); }
.metric-label { font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
.metric-value { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; line-height:1; margin-bottom:4px; }
.metric-card.green .metric-value { color:var(--green); }
.metric-card.amber .metric-value { color:var(--amber); }
.metric-card.red   .metric-value { color:var(--red); }
.metric-card.blue  .metric-value { color:var(--blue); }
.metric-card.purple .metric-value { color:var(--purple); }
.metric-sub { font-size:10px; color:var(--muted); }
.table-wrap { background:var(--card); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:24px; }
.table-head { padding:12px 16px; background:var(--surface); border-bottom:1px solid var(--border); font-size:11px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; }
table { width:100%; border-collapse:collapse; font-size:12px; }
thead th { padding:10px 16px; text-align:left; font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; border-bottom:1px solid var(--border); background:var(--surface); }
tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
tbody tr:last-child { border-bottom:none; }
tbody tr:hover { background:rgba(255,255,255,.02); }
td { padding:10px 16px; color:var(--text); vertical-align:middle; }
.badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; letter-spacing:.08em; font-weight:500; text-transform:uppercase; }
.badge-green  { background:rgba(34,211,165,.12); color:var(--green); border:1px solid rgba(34,211,165,.25); }
.badge-amber  { background:rgba(246,166,35,.12);  color:var(--amber); border:1px solid rgba(246,166,35,.25); }
.badge-red    { background:rgba(255,77,106,.12);  color:var(--red);   border:1px solid rgba(255,77,106,.25); }
.badge-blue   { background:rgba(79,163,224,.12);  color:var(--blue);  border:1px solid rgba(79,163,224,.25); }
.badge-purple { background:rgba(167,139,250,.12); color:var(--purple);border:1px solid rgba(167,139,250,.25); }
.badge-muted  { background:rgba(74,85,104,.12);   color:var(--muted); border:1px solid rgba(74,85,104,.25); }
.progress-bar-bg { background:var(--border); border-radius:4px; height:6px; overflow:hidden; width:100%; }
.progress-bar-fill { height:100%; border-radius:4px; transition:width .6s ease; }
.checklist { display:flex; flex-direction:column; gap:2px; }
.check-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:6px; cursor:pointer; transition:background .15s; font-size:12px; }
.check-item:hover { background:rgba(255,255,255,.03); }
.check-box { width:16px; height:16px; border-radius:3px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
.check-box.checked { background:var(--green); border-color:var(--green); }
.check-box.checked::after { content:'checkmark'; font-size:10px; color:#07090f; font-weight:700; }
.check-wac { font-size:9px; color:var(--blue); letter-spacing:.08em; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:16px; }
.field-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
input,select,textarea { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:5px; padding:8px 12px; font-family:'DM Mono',monospace; font-size:12px; color:var(--text); outline:none; transition:border .2s; }
input:focus,select:focus,textarea:focus { border-color:var(--amber); }
textarea { resize:vertical; min-height:80px; }
select option { background:var(--surface); }
.btn { padding:9px 20px; border-radius:5px; font-family:'DM Mono',monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; cursor:pointer; transition:all .2s; border:none; }
.btn-primary { background:var(--amber); color:#07090f; font-weight:700; }
.btn-primary:hover { filter:brightness(1.1); }
.btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border); }
.btn-ghost:hover { color:var(--text); border-color:var(--text); }
.btn-sm { padding:5px 12px; font-size:10px; }
.btn-danger { background:rgba(255,77,106,.15); color:var(--red); border:1px solid rgba(255,77,106,.3); }
.alert-banner { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:6px; margin-bottom:10px; font-size:12px; }
.alert-banner.red   { background:rgba(255,77,106,.1); border:1px solid rgba(255,77,106,.3); color:#ff8fa3; }
.alert-banner.amber { background:rgba(246,166,35,.1); border:1px solid rgba(246,166,35,.3); color:#f6c95a; }
.alert-banner.green { background:rgba(34,211,165,.1); border:1px solid rgba(34,211,165,.3); color:var(--green); }
.alert-banner.blue  { background:rgba(79,163,224,.1); border:1px solid rgba(79,163,224,.3); color:var(--blue); }
.two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
@media(max-width:1000px) { .three-col { grid-template-columns:1fr 1fr; } }
@media(max-width:900px)  { .two-col,.three-col { grid-template-columns:1fr; } .form-grid { grid-template-columns:1fr; } }
.incident-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; }
.sync-bar { font-size:10px; color:var(--muted); display:flex; align-items:center; gap:6px; padding:6px 0 14px; }
.sync-dot { width:6px; height:6px; border-radius:50%; }
.sync-dot.live { background:var(--green); box-shadow:0 0 6px var(--green); }
.sync-dot.local { background:var(--amber); }
.mar-cell { width:36px; height:36px; border-radius:6px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:all .2s; background:var(--surface); }
.mar-cell:hover { border-color:var(--amber); }
.mar-cell.given { background:rgba(34,211,165,.15); border-color:var(--green); }
.mar-cell.refused { background:rgba(255,77,106,.15); border-color:var(--red); }
.mar-cell.held { background:rgba(246,166,35,.15); border-color:var(--amber); }
.res-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:14px 16px; margin-bottom:8px; cursor:pointer; transition:all .15s; }
.res-card.selected { border-color:var(--amber); background:rgba(246,166,35,.05); }
.res--card:hover { border-color:var(--muted); }
.mar-legend { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:14px; font-size:11px; }
.mar-legend-item { display:flex; align-items:center; gap:5px; }
.mar-dot { width:10px; height:10px; border-radius:3px; }
.wac-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; }
.wac-code { font-size:11px; color:var(--blue); letter-spacing:.1em; margin-bottom:4px; }
.wac-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--heading); margin-bottom:6px; }
.wac-desc { font-size:11px; color:var(--muted); line-height:1.6; }

/* VAULT STYLES */
.vault-cats { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:10px; margin-bottom:20px; }
.vault-cat { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:14px; cursor:pointer; transition:all .15s; text-align:center; }
.vault-cat:hover { border-color:var(--muted); }
.vault-cat.active { border-color:var(--amber); background:rgba(246,166,35,.05); }
.vault-cat-icon { font-size:22px; margin-bottom:6px; }
.vault-cat-label { font-size:11px; font-weight:700; color:var(--heading); }
.vault-cat-count { font-size:10px; color:var(--muted); margin-top:2px; }
.doc-row { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:12px 16px; margin-bottom:8px; display:flex; align-items:center; gap:12px; transition:all .15s; }
.doc-row:hover { border-color:var(--muted); }
.doc-icon { width:38px; height:38px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.doc-body { flex:1; min-width:0; }
.doc-name { font-size:13px; font-weight:600; color:var(--heading); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.doc-meta { font-size:10px; color:var(--muted); }
.doc-actions { display:flex; gap:6px; align-items:center; flex-shrink:0; }
.drop-zone { border:2px dashed var(--border); border-radius:10px; padding:32px; text-align:center; cursor:pointer; transition:all .2s; margin-bottom:16px; }
.drop-zone:hover,.drop-zone.dragover { border-color:var(--amber); background:rgba(246,166,35,.04); }
.drop-zone-icon { font-size:32px; margin-bottom:10px; }
.drop-zone-text { font-size:13px; color:var(--muted); line-height:1.6; }
.drop-zone-text strong { color:var(--amber); }
.drop-zone-types { font-size:10px; color:var(--muted); margin-top:6px; opacity:.6; }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
.modal { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:28px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; }
.modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:var(--heading); margin-bottom:4px; }
.modal-sub { font-size:11px; color:var(--muted); margin-bottom:20px; }

/* BINDER STYLES */
.binder-card { background:var(--card); border:1px solid var(--border); border-radius:10px; overflow:hidden; transition:all .15s; cursor:pointer; }
.binder--card:hover { border-color:var(--muted); transform:translateY(-1px); }
.binder-spine { height:4px; }
.binder-body { padding:16px; }
.binder-icon { font-size:26px; margin-bottom:8px; }
.binder-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--heading); margin-bottom:4px; }
.binder-desc { font-size:11px; color:var(--muted); line-height:1.5; margin-bottom:10px; }
.binder-count { font-size:10px; color:var(--muted); }
.print-area { background:white; color:#111; padding:40px; font-family:'DM Mono',monospace; font-size:12px; line-height:1.7; }
.print-cover { text-align:center; padding:60px 0 40px; border-bottom:2px solid #111; margin-bottom:32px; }
.print-cover h1 { font-size:24px; font-weight:800; margin-bottom:8px; }
.print-cover p { font-size:13px; color:#555; }
.print-section { margin-bottom:40px; page-break-after:always; }
.print-section-header { background:#111; color:white; padding:10px 16px; border-radius:6px; margin-bottom:16px; }
.print-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #eee; font-size:12px; }
.print-row:last-child { border:none; }
.print-label { color:#555; }
.print-value { font-weight:600; color:#111; }
.print-status-ok { color:#16a34a; font-weight:700; }
.print-status-miss { color:#dc2626; font-weight:700; }
@media print {
.app,.nav,.topbar { display:none !important; }
.print-area { padding:20px; }
.print-section { page-break-after:always; }
body { background:white !important; }
}
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-track { background:var(--bg); }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────

const DEFAULT_RESIDENTS = [
{ id:'R-001', name:'Marion Tenneson', room:'A', admission:'2023-08-14', dob:'1983-11-17', level:'Level 3', code:'Full Code', physician:'Dr. Hela Kelsch', pharmacy:'Ready Meds Pharmacy', chartComplete:88, diet:'Diabetic, Low Carb', allergies:'Shellfish, Morphine, Bactrim DS', diagnosis:'Type 2 DM, Schizophrenia, Bipolar Disorder, Depression, Anxiety, Nightmare Disorder', flags:'Blood sugar checks daily,POLST on file,Controlled substance (Lorazepam)', medications:[{name:'Clozapine 450mg',freq:'QD',time:'Bedtime',route:'Oral',special:'BINGO protocol'},{name:'Divalproex ER 1500mg',freq:'QD',time:'Bedtime',route:'Oral',special:'Handle with gloves'},{name:'Sertraline 200mg',freq:'QD',time:'Morning',route:'Oral',special:''},{name:'Bupropion XL 450mg',freq:'QD',time:'Morning',route:'Oral',special:''},{name:'Jardiance 25mg',freq:'QD',time:'Morning',route:'Oral',special:''},{name:'Atorvastatin 80mg',freq:'QD',time:'Bedtime',route:'Oral',special:''},{name:'Prazosin 4mg',freq:'QD',time:'Bedtime',route:'Oral',special:'For nightmares'},{name:'Fenofibrate 160mg',freq:'QD',time:'Before dinner',route:'Oral',special:''},{name:'Lisinopril 2.5mg',freq:'QD',time:'Bedtime',route:'Oral',special:''},{name:'Vitamin D3 2000IU',freq:'QD',time:'With meal',route:'Oral',special:''},{name:'Blood Sugar Check',freq:'QD',time:'Daily',route:'Accu-Chek',special:'Diabetic MAR'},{name:'Lorazepam 1mg',freq:'PRN',time:'As needed',route:'Oral',special:'PRN anxiety - controlled substance'}] },
{ id:'R-002', name:'Albert Goblick', room:'C', admission:'2024-12-13', dob:'1943-12-29', level:'Level 2', code:'DNR', physician:'Dr. Ronald Smith (VA)', pharmacy:'VA Pharmacy', chartComplete:82, diet:'Regular', allergies:'None known', diagnosis:'HIV-1, Hypertension, Depression, Insomnia, Skin conditions', flags:'DNR verify orders,VA medications family supply,HIV medications', medications:[{name:'Cobicistat combo 150/150/200/10mg',freq:'QD',time:'Morning',route:'Oral',special:'HIV - VA supply'},{name:'Darunavir 800mg',freq:'QD',time:'Morning',route:'Oral',special:'MAR only - VA supply'},{name:'Eliquis 2.5mg',freq:'BID',time:'Every 12 hours',route:'Oral',special:'HTR high-risk'},{name:'Lisinopril 5mg',freq:'QD',time:'Morning',route:'Oral',special:'BP - reduce if <90/60'},{name:'Mirtazapine 15mg',freq:'QD',time:'Bedtime',route:'Oral',special:'Depression, weight, insomnia'},{name:'Polyethylene Glycol 17g',freq:'QD',time:'Morning',route:'Oral',special:'Family supply'},{name:'Vitamin D3 4000IU',freq:'QD',time:'With food',route:'Oral',special:''},{name:'Ensure Liquid',freq:'BID',time:'Twice daily',route:'Oral',special:'Family supply - nutrition'}] },
{ id:'R-003', name:'Robert Carter', room:'B', admission:'2024-11-13', dob:'1967-07-23', level:'Level 3', code:'DNR', physician:'Dr. Haley Key (Seva Medical)', pharmacy:'Ready Meds Pharmacy', chartComplete:75, diet:'Diabetic, Low Sodium', allergies:'No known allergies', diagnosis:'Type 2 DM with nephropathy, Hypertension, PTSD, Hyperlipidemia, Neuropathy', flags:'DNR verify orders,No MAR uploaded yet,POLST pending', medications:[{name:'Medications pending upload',freq:'-',time:'-',route:'-',special:'Contact Dr. Haley Key (888) 637-9669'}] },
{ id:'R-004', name:'Teresa Byrd (Tina)', room:'B', admission:'2025-08-14', dob:'1970-06-30', level:'Level 3', code:'Full Code', physician:'Dr. Haley Key (Seva Medical)', pharmacy:'Ready Meds Pharmacy (Spokane Valley)', chartComplete:79, diet:'Regular', allergies:'Penicillin', diagnosis:'Essential Tremor, Major Depressive Disorder, Anxiety, COPD, Restless Legs, Hepatitis C', flags:'Hepatitis C treatment Mavyret 8 weeks,Nebulizer PRN,Naloxone on hand', medications:[{name:'Doxepin 10mg',freq:'QD',time:'Bedtime',route:'Oral',special:'Handle with gloves'},{name:'Escitalopram 20mg',freq:'QD',time:'Morning',route:'Oral',special:''},{name:'Furosemide 40mg',freq:'BID',time:'8AM/Noon',route:'Oral',special:'Half tablet'},{name:'Ropinirole 1mg',freq:'BID',time:'8AM/5PM',route:'Oral',special:'Restless legs'},{name:'Trazodone 100mg',freq:'QD',time:'Bedtime',route:'Oral',special:''},{name:'Mavyret 300mg',freq:'QD',time:'Daily x8wks',route:'Oral',special:'Hep C treatment'},{name:'Polyethylene Glycol 17g',freq:'QD',time:'Morning',route:'Oral',special:''},{name:'Budesonide 0.5mg',freq:'PRN BID',time:'As needed',route:'Nebulizer',special:'PRN respiratory'},{name:'Naloxone 4mg',freq:'PRN',time:'Emergency only',route:'Nasal',special:'Call 911 first'}] },
];

const DEFAULT_STAFF = [
{ id:'S-001', name:'Dakarai Dibi', role:'Registered Nurse', hired:'2024-01-01', cpr:'2026-08-31', hca:'2026-12-31', food:'2026-12-31', dementia:'2026-12-31', notes:'RN License #823621 TX Board - Multistate Compact. BLS expires 08/2026.' },
{ id:'S-002', name:'Evelyn Tserayi', role:'Caregiver', hired:'2025-11-14', cpr:'2026-06-01', hca:'2026-11-14', food:'2026-06-01', dementia:'2026-11-14', notes:'HCA Application pending - Credential HMCC.HM.70071137' },
{ id:'S-003', name:'Claret Gatawa', role:'Nursing Assistant', hired:'2025-10-08', cpr:'2026-10-08', hca:'2026-01-08', food:'2026-10-08', dementia:'2026-10-08', notes:'NA Cert NC70019153 - EXPIRED 01/08/2026. Must renew immediately.' },
{ id:'S-004', name:'Beline Mokoro', role:'Nursing Assistant', hired:'2023-08-04', cpr:'2026-08-04', hca:'2025-10-30', food:'2026-08-04', dementia:'2026-08-04', notes:'NA Cert NC61469970 - EXPIRED 10/30/2025. Must renew immediately.' },
];

const DEFAULT_INCIDENTS = [
{ id:'INC-2025-001', type:'Documentation', resident:'Robert Carter', date:'2025-03-10', severity:'minor', dshs:'No', desc:'MAR not yet on file for resident. Orders needed from Dr. Haley Key.' },
];

const INSPECTION_ITEMS = [
{ category:'Personnel Files', item:'All staff credentials verified', status:'fail' },
{ category:'Personnel Files', item:'Background check records on file', status:'pass' },
{ category:'Personnel Files', item:'HCA / NA certifications current', status:'fail' },
{ category:'Resident Care',   item:'ISPs current for all residents', status:'warn' },
{ category:'Resident Care',   item:'Medication management logs complete', status:'warn' },
{ category:'Resident Care',   item:'Dignity and rights policies posted', status:'pass' },
{ category:'Home Safety',     item:'Fire drill log (2x per year)', status:'pass' },
{ category:'Home Safety',     item:'Carbon monoxide detectors tested', status:'pass' },
{ category:'Home Safety',     item:'Emergency evacuation plan posted', status:'pass' },
{ category:'Home Safety',     item:'First aid kit stocked and accessible', status:'pass' },
{ category:'Medications',     item:'Controlled substance log verified', status:'warn' },
{ category:'Medications',     item:'Medications stored securely locked', status:'pass' },
{ category:'Medications',     item:'MAR documentation complete', status:'warn' },
{ category:'Food Service',    item:'Food handler cards on file', status:'pass' },
{ category:'Food Service',    item:'Fridge/freezer temps logged', status:'warn' },
{ category:'Documentation',   item:'Incident reports filed within 24h', status:'pass' },
{ category:'Documentation',   item:'Activity log maintained', status:'pass' },
{ category:'Documentation',   item:'Resident grievance procedure posted', status:'pass' },
];

const WAC_REFS = [
{ code:'WAC 388-76-10100', title:'Licensing Requirements', desc:'AFH must be licensed by DSHS before providing care. License must be posted prominently.', status:'compliant' },
{ code:'WAC 388-76-10155', title:'Provider Qualifications', desc:'Provider must complete 75-hour basic training, CPR/First Aid, food handler cert, and dementia training.', status:'compliant' },
{ code:'WAC 388-76-10160', title:'Employee Requirements', desc:'All caregivers must meet background check, TB screening, HCA registration, and training requirements.', status:'warning' },
{ code:'WAC 388-76-10200', title:'Admission Agreement', desc:'Written admission agreement required prior to or on day of admission.', status:'compliant' },
{ code:'WAC 388-76-10300', title:'Individual Service Plan (ISP)', desc:'ISP must be developed within 30 days of admission and reviewed annually.', status:'warning' },
{ code:'WAC 388-76-10310', title:'Health Monitoring', desc:'Provider must monitor and document residents health conditions.', status:'compliant' },
{ code:'WAC 388-76-10315', title:'Medication Management', desc:'Medications must be stored securely and documented on a MAR.', status:'compliant' },
{ code:'WAC 388-76-10400', title:'Physical Environment', desc:'Home must meet safety, sanitation, and fire protection standards.', status:'warning' },
{ code:'WAC 388-76-10520', title:'Incident Reporting', desc:'Reportable incidents must be reported to DSHS within 24 hours.', status:'compliant' },
{ code:'WAC 388-76-10205', title:'Resident Rights', desc:'Provider must ensure residents rights including privacy, dignity, and grievance process.', status:'compliant' },
];

const CHART_CHECKLIST = [
{ id:'c1',  text:'Admission Agreement signed',        wac:'WAC 388-76-10200' },
{ id:'c2',  text:'Resident Rights acknowledged',      wac:'WAC 388-76-10205' },
{ id:'c3',  text:'Initial Resident Assessment (ISP)', wac:'WAC 388-76-10300' },
{ id:'c4',  text:'Physician orders on file',          wac:'WAC 388-76-10310' },
{ id:'c5',  text:'Current medication list signed',    wac:'WAC 388-76-10315' },
{ id:'c6',  text:'Dietary/allergy documentation',     wac:'WAC 388-76-10320' },
{ id:'c7',  text:'Emergency contact info verified',   wac:'WAC 388-76-10205' },
{ id:'c8',  text:'TB test/clearance on file',         wac:'WAC 388-76-10160' },
{ id:'c9',  text:'Annual physical within 12 months',  wac:'WAC 388-76-10310' },
{ id:'c10', text:'Care plan reviewed and updated',    wac:'WAC 388-76-10300' },
{ id:'c11', text:'Advance Directive / POLST on file', wac:'WAC 388-76-10210' },
{ id:'c12', text:'Financial agreement documented',    wac:'WAC 388-76-10200' },
];

const VAULT_CATEGORIES = [
{ key:'all',      label:'All Files',     icon:'📂' },
{ key:'License',  label:'Licenses',      icon:'🏛️' },
{ key:'Insurance',label:'Insurance',     icon:'🛡️' },
{ key:'Resident', label:'Resident Docs', icon:'🧑‍🦳' },
{ key:'Staff',    label:'Staff Files',   icon:'👥' },
{ key:'Policy',   label:'Policies',      icon:'📋' },
{ key:'Other',    label:'Other',         icon:'📄' },
];

const CAT_COLORS = {
License:'rgba(246,166,35,.15)', Insurance:'rgba(34,211,165,.15)',
Resident:'rgba(79,163,224,.15)', Staff:'rgba(167,139,250,.15)',
Policy:'rgba(255,77,106,.15)', Other:'rgba(74,85,104,.15)',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function certStatus(d) { const n=daysUntil(d); return n<0?'expired':n<60?'expiring':'current'; }
function certBadge(d) {
const s=certStatus(d);
return s==='expired'  ? <span className='badge badge-red'>Expired</span>
: s==='expiring' ? <span className='badge badge-amber'>Exp Soon</span>
: <span className='badge badge-green'>Current</span>;
}
function pColor(p) { return p>=90?'#22d3a5':p>=70?'#f6a623':'#ff4d6a'; }
function codeBadge(c) { return c==='DNR' ? <span className='badge badge-red'>DNR</span> : <span className='badge badge-green'>Full Code</span>; }
function expiryBadge(dateStr) {
if(!dateStr) return <span className='badge badge-muted'>No Expiry</span>;
const d=daysUntil(dateStr);
if(d<0) return <span className='badge badge-red'>EXPIRED</span>;
if(d<90) return <span className='badge badge-amber'>Exp {new Date(dateStr).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>;
return <span className='badge badge-green'>Valid to {new Date(dateStr).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</span>;
}
function fmtBytes(b) { if(b<1024) return b+'B'; if(b<1048576) return (b/1024).toFixed(1)+'KB'; return (b/1048576).toFixed(1)+'MB'; }
function fmtDate(d) { return new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }

function SyncBar({live}) {
return (
<div className='sync-bar'>
<div className={`sync-dot ${live?'live':'local'}`}/>
{live ? <span>Live - syncing with Google Sheets</span>
: <span>Local mode - connect Google Sheets to persist data</span>}
</div>
);
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

function Dashboard({residents, incidents, staff, documents}) {
const pass=INSPECTION_ITEMS.filter(i=>i.status==='pass').length;
const fail=INSPECTION_ITEMS.filter(i=>i.status==='fail').length;
const warn=INSPECTION_ITEMS.filter(i=>i.status==='warn').length;
const score=Math.round((pass/INSPECTION_ITEMS.length)*100);
const expiredStaff=staff.filter(s=>certStatus(s.cpr)==='expired'||certStatus(s.hca)==='expired');
const expiringDocs=documents.filter(d=>d.expiry&&daysUntil(d.expiry)<90&&daysUntil(d.expiry)>=0);
const expiredDocs=documents.filter(d=>d.expiry&&daysUntil(d.expiry)<0);
const totalMeds=residents.reduce((a,r)=>a+(r.medications?.length||0),0);

return (
<div>
{fail>0&&<div className='alert-banner red'>🚨 <span><strong>{fail} critical items</strong> require immediate attention - staff certifications expired.</span></div>}
{expiredStaff.length>0&&<div className='alert-banner red'>⛔ <span><strong>{expiredStaff.map(s=>s.name).join(' and ')}</strong> have expired certifications. Renew immediately.</span></div>}
{expiredDocs.length>0&&<div className='alert-banner red'>📄 <span><strong>{expiredDocs.length} document{expiredDocs.length>1?'s':''}</strong> in the Vault have expired.</span></div>}
{expiringDocs.length>0&&<div className='alert-banner amber'>⚠️ <span><strong>{expiringDocs.length} document{expiringDocs.length>1?'s':''}</strong> expiring within 90 days.</span></div>}
<div className='alert-banner amber'>⚠️ <span><strong>Robert Carter</strong> - MAR/medication orders not yet on file. Contact Dr. Haley Key at (888) 637-9669.</span></div>


  <div className='section-title'>Command Overview</div>
  <div className='metrics-grid'>
    <div className={`metric-card ${score>=90?'green':score>=75?'amber':'red'}`}>
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
    <div className='metric-card green'>
      <div className='metric-label'>Vault Documents</div>
      <div className='metric-value'>{documents.length}</div>
      <div className='metric-sub'>{expiredDocs.length} expired, {expiringDocs.length} expiring</div>
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
      {[...new Set(INSPECTION_ITEMS.map(i=>i.category))].map(cat=>{
        const items=INSPECTION_ITEMS.filter(i=>i.category===cat);
        const p=Math.round((items.filter(i=>i.status==='pass').length/items.length)*100);
        return (
          <div key={cat} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:5}}>
              <span>{cat}</span><span style={{color:pColor(p)}}>{p}%</span>
            </div>
            <div className='progress-bar-bg'><div className='progress-bar-fill' style={{width:p+'%',background:pColor(p)}}/></div>
          </div>
        );
      })}
    </div>
    <div>
      <div className='section-title'>Resident Snapshot</div>
      {residents.map(r=>(
        <div key={r.id} style={{background:'var(---card)',border:'1px solid var(---border)',borderRadius:8,padding:'12px 16px',marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
            <div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'var(---heading)'}}>{r.name}</div>
              <div style={{fontSize:10,color:'var(---muted)',marginTop:2}}>Room {r.room} - {r.diet}</div>
            </div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'flex-end'}}>
              {codeBadge(r.code)}
              <span style={{fontSize:14,fontWeight:800,color:pColor(r.chartComplete),fontFamily:'Syne,sans-serif'}}>{r.chartComplete}%</span>
            </div>
          </div>
          <div className='progress-bar-bg'><div className='progress-bar-fill' style={{width:r.chartComplete+'%',background:pColor(r.chartComplete)}}/></div>
        </div>
      ))}
    </div>
  </div>
</div>

);
}

// ─── INSPECTION ──────────────────────────────────────────────────────────────

function InspectionDashboard() {
const [filter,setFilter]=useState('all');
const filtered=filter==='all'?INSPECTION_ITEMS:INSPECTION_ITEMS.filter(i=>i.status===filter);
const categories=[...new Set(INSPECTION_ITEMS.map(i=>i.category))];
return (
<div>
<div className='section-title'>Inspection Readiness</div>
<div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
{['all','pass','warn','fail'].map(f=>(
<button key={f} className={`btn ${filter===f?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter(f)} style={{fontSize:10}}>
{f==='all'?'All':f==='pass'?'Pass':f==='warn'?'Warnings':'Critical'}
</button>
))}
</div>
{categories.map(cat=>{
const items=filtered.filter(i=>i.category===cat);
if(!items.length) return null;
const all=INSPECTION_ITEMS.filter(i=>i.category===cat);
return (
<div key={cat} className='table-wrap' style={{marginBottom:16}}>
<div className='table-head'><span>{cat}</span><span>{all.filter(i=>i.status==='pass').length}/{all.length} passing</span></div>
<table><tbody>{items.map((item,idx)=>(
<tr key={idx}>
<td style={{width:24,paddingRight:0,color:item.status==='pass'?'var(--green)':item.status==='warn'?'var(--amber)':'var(--red)'}}>{item.status==='pass'?'✓':item.status==='warn'?'⚠':'✗'}</td>
<td>{item.item}</td>
<td style={{textAlign:'right'}}>{item.status==='pass'?<span className='badge badge-green'>Pass</span>:item.status==='warn'?<span className='badge badge-amber'>Attention</span>:<span className='badge badge-red'>Critical</span>}</td>
</tr>
))}</tbody></table>
</div>
);
})}
</div>
);
}

// ─── RESIDENT CHARTS ─────────────────────────────────────────────────────────

function ResidentCharts({residents}) {
const [selected,setSelected]=useState(null);
const [checks,setChecks]=useState({});
useEffect(()=>{
if(residents.length){
setSelected(residents[0]);
setChecks(Object.fromEntries(residents.map(r=>[r.id,CHART_CHECKLIST.map(c=>({...c,done:false}))])));
}
},[]);
const toggle=(cid)=>setChecks(prev=>({...prev,[selected.id]:prev[selected.id].map(c=>c.id===cid?{...c,done:!c.done}:c)}));
if(!selected) return null;
const cur=checks[selected.id]||[];
const pct=cur.length?Math.round((cur.filter(c=>c.done).length/cur.length)*100):0;
return (
<div className='two-col'>
<div>
<div className='section-title'>Residents</div>
{residents.map(r=>{
const rc=checks[r.id]||[];
const p=rc.length?Math.round((rc.filter(c=>c.done).length/rc.length)*100):0;
return (
<div key={r.id} className={`res-card ${selected?.id===r.id?'selected':''}`} onClick={()=>setSelected(r)}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
<div>
<div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'var(--heading)'}}>{r.name}</div>
<div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>Room {r.room} - {r.dob} - {r.level}</div>
<div style={{fontSize:10,color:'var(--muted)'}}>{r.physician}</div>
</div>
<div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
{codeBadge(r.code)}
<span style={{fontSize:14,fontWeight:800,color:pColor(p),fontFamily:'Syne,sans-serif'}}>{p}%</span>
</div>
</div>
<div className='progress-bar-bg'><div className='progress-bar-fill' style={{width:p+'%',background:pColor(p)}}/></div>
<div style={{marginTop:6,fontSize:11,color:'var(--muted)'}}>Diet: {r.diet} - Allergies: {r.allergies}</div>
</div>
);
})}
</div>
<div>
<div className='section-title'>{selected.name} - Chart Checklist</div>
<div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:8,padding:'12px 16px',marginBottom:12}}>
<div style={{fontSize:11,color:'var(--muted)',marginBottom:8}}>{selected.diagnosis}</div>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:12}}>
<span style={{color:'var(--muted)'}}>Chart Completeness</span>
<span style={{color:pColor(pct),fontWeight:700}}>{cur.filter(c=>c.done).length}/{cur.length} - {pct}%</span>
</div>
<div className='progress-bar-bg' style={{height:8}}><div className='progress-bar-fill' style={{width:pct+'%',background:pColor(pct)}}/></div>
</div>
<div className='checklist'>
{cur.map(c=>(
<div key={c.id} className='check-item' onClick={()=>toggle(c.id)}>
<div className={`check-box ${c.done?'checked':''}`}>{c.done?'✓':''}</div>
<div style={{flex:1}}>
<div style={{fontSize:12,textDecoration:c.done?'line-through':'none',color:c.done?'var(--muted)':'var(--text)'}}>{c.text}</div>
<div className='check-wac'>{c.wac}</div>
</div>
</div>
))}
</div>
</div>
</div>
);
}

// ─── MAR ─────────────────────────────────────────────────────────────────────

function MARModule({residents}) {
const [selectedRes,setSelectedRes]=useState(null);
const [marData,setMarData]=useState({});
const today=new Date();
const daysInMonth=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
const dayNums=Array.from({length:daysInMonth},(_,i)=>String(i+1));
useEffect(()=>{ if(residents.length) setSelectedRes(residents[0]); },[]);
const getCell=(resId,medName,day)=>marData[`${resId}|${medName}|${day}`]||'pending';
const cycleCell=(resId,medName,day)=>{
const key=`${resId}|${medName}|${day}`;
const cur=marData[key]||'pending';
const next={pending:'given',given:'refused',refused:'held',held:'pending'};
setMarData(prev=>({...prev,[key]:next[cur]}));
};
const cellIcon=(s)=>s==='given'?'✓':s==='refused'?'✗':s==='held'?'H':'';
if(!selectedRes) return null;
const meds=selectedRes.medications||[];
const today_d=today.getDate();
const givenCount=meds.filter(m=>getCell(selectedRes.id,m.name,String(today_d))==='given').length;
const pendingCount=meds.filter(m=>getCell(selectedRes.id,m.name,String(today_d))==='pending').length;
return (
<div>
<div className='section-title'>MAR - {today.toLocaleString('default',{month:'long'})} {today.getFullYear()}</div>
<div className='alert-banner blue'>Click each cell to cycle: Pending - Given - Refused - Held</div>
<div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
{residents.map(r=>(
<button key={r.id} className={`btn ${selectedRes?.id===r.id?'btn-primary':'btn-ghost'}`} onClick={()=>setSelectedRes(r)}>
{r.name.split(' ')[0]} (Rm {r.room})
</button>
))}
</div>
<div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:8,padding:'14px 16px',marginBottom:14}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}>
<div>
<div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:'var(--heading)'}}>{selectedRes.name}</div>
<div style={{fontSize:11,color:'var(--muted)'}}>Room {selectedRes.room} - {selectedRes.code} - {selectedRes.physician}</div>
<div style={{fontSize:11,color:'var(--red)',marginTop:4}}>Allergies: {selectedRes.allergies}</div>
</div>
<div style={{display:'flex',gap:10}}>
<div style={{textAlign:'center',background:'rgba(34,211,165,.1)',border:'1px solid rgba(34,211,165,.2)',borderRadius:6,padding:'8px 14px'}}>
<div style={{fontSize:18,fontWeight:800,color:'var(--green)',fontFamily:'Syne,sans-serif'}}>{givenCount}</div>
<div style={{fontSize:10,color:'var(--muted)'}}>Given today</div>
</div>
<div style={{textAlign:'center',background:'rgba(246,166,35,.1)',border:'1px solid rgba(246,166,35,.2)',borderRadius:6,padding:'8px 14px'}}>
<div style={{fontSize:18,fontWeight:800,color:'var(--amber)',fontFamily:'Syne,sans-serif'}}>{pendingCount}</div>
<div style={{fontSize:10,color:'var(--muted)'}}>Pending today</div>
</div>
</div>
</div>
</div>
<div className='mar-legend'>
<div className='mar-legend-item'><div className='mar-dot' style={{background:'var(--surface)',border:'1px solid var(--border)'}}/><span>Pending</span></div>
<div className='mar-legend-item'><div className='mar-dot' style={{background:'rgba(34,211,165,.3)'}}/><span>Given</span></div>
<div className='mar-legend-item'><div className='mar-dot' style={{background:'rgba(255,77,106,.3)'}}/><span>Refused</span></div>
<div className='mar-legend-item'><div className='mar-dot' style={{background:'rgba(246,166,35,.3)'}}/><span>Held</span></div>
</div>
<div style={{overflowX:'auto'}}>
<table style={{minWidth:900}}>
<thead><tr>
<th style={{minWidth:200,textAlign:'left'}}>Medication</th>
<th style={{minWidth:60}}>Freq</th>
<th style={{minWidth:80}}>Time</th>
{dayNums.map(d=>(
<th key={d} style={{minWidth:38,textAlign:'center',color:Number(d)===today_d?'var(--amber)':'var(--muted)',fontWeight:Number(d)===today_d?700:400}}>{d}</th>
))}
</tr></thead>
<tbody>
{meds.map((med,idx)=>(
<tr key={idx} style={{background:idx%2===0?'transparent':'rgba(255,255,255,.01)'}}>
<td>
<div style={{fontWeight:500,color:'var(--heading)',fontSize:12}}>{med.name}</div>
{med.special&&<div style={{fontSize:10,color:'var(--amber)',marginTop:2}}>{med.special}</div>}
<div style={{fontSize:10,color:'var(--muted)'}}>{med.route}</div>
</td>
<td><span className={`badge ${med.freq==='PRN'?'badge-blue':'badge-green'}`}>{med.freq}</span></td>
<td style={{fontSize:11,color:'var(--muted)'}}>{med.time}</td>
{dayNums.map(d=>{
const st=getCell(selectedRes.id,med.name,d);
return (
<td key={d} style={{textAlign:'center',padding:'6px 4px'}}>
<div className={`mar-cell ${st}`} onClick={()=>cycleCell(selectedRes.id,med.name,d)}>
{cellIcon(st)}
</div>
</td>
);
})}
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}

// ─── TRAINING ────────────────────────────────────────────────────────────────

function TrainingTracker({staff}) {
const cols=[{key:'cpr',label:'CPR/BLS'},{key:'hca',label:'HCA/NA Cert'},{key:'food',label:'Food Handler'},{key:'dementia',label:'Dementia'}];
const alerts=[];
staff.forEach(s=>cols.forEach(c=>{
const d=daysUntil(s[c.key]);
if(d<90) alerts.push({staff:s.name,cert:c.label,days:d,date:s[c.key]});
}));
alerts.sort((a,b)=>a.days-b.days);
return (
<div>
<div className='section-title'>Training and Certification Tracker</div>
{alerts.map((e,i)=>(
<div key={i} className={`alert-banner ${e.days<0?'red':'amber'}`}>
<span>{e.days<0?'⛔':'⚠️'}</span>
<span><strong>{e.staff}</strong> - {e.cert} {e.days<0?`expired ${Math.abs(e.days)} days ago`:`expires in ${e.days} days`} ({e.date})</span>
</div>
))}
<div className='table-wrap' style={{marginTop:16}}>
<div className='table-head'><span>Staff Certification Matrix</span><span style={{fontSize:10}}>WAC 388-76-10155</span></div>
<table>
<thead><tr><th>Name</th><th>Role</th>{cols.map(c=><th key={c.key}>{c.label}</th>)}<th>Notes</th></tr></thead>
<tbody>{staff.map(s=>(
<tr key={s.id}>
<td style={{fontWeight:500,color:'var(--heading)'}}>{s.name}</td>
<td style={{fontSize:11,color:'var(--muted)'}}>{s.role}</td>
{cols.map(c=>(
<td key={c.key}>
<div>{certBadge(s[c.key])}</div>
<div style={{fontSize:9,color:'var(--muted)',marginTop:2}}>{s[c.key]}</div>
</td>
))}
<td style={{fontSize:10,color:'var(--muted)',maxWidth:200}}>{s.notes}</td>
</tr>
))}</tbody>
</table>
</div>
</div>
);
}

// ─── INCIDENTS ───────────────────────────────────────────────────────────────

function IncidentReporting({incidents,setIncidents,residents,sheetsLive}) {
const [form,setForm]=useState({type:'',resident:'',date:'',severity:'minor',desc:'',dshs:'No'});
const [saved,setSaved]=useState(false);
const submit=async()=>{
if(!form.type||!form.resident||!form.date) return;
const id=`INC-${new Date().getFullYear()}-${String(incidents.length+1).padStart(3,'0')}`;
const row={...form,id};
setIncidents(prev=>[row,...prev]);
if(sheetsLive) await sheetsAppend(SHEETS_CONFIG.TABS.INCIDENTS,row);
setForm({type:'',resident:'',date:'',severity:'minor',desc:'',dshs:'No'});
setSaved(true); setTimeout(()=>setSaved(false),3000);
};
return (
<div className='two-col'>
<div>
<div className='section-title'>New Incident Report</div>
{saved&&<div className='alert-banner green'>Incident logged successfully.</div>}
<div className='table-wrap'>
<div className='table-head'><span>Incident Report Form</span><span>WAC 388-76-10520</span></div>
<div className='form-grid'>
<div><div className='field-label'>Type</div>
<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
<option value=''>Select...</option>
{['Fall','Medication Error','Elopement','Injury','Behavioral Incident','Hospitalization','Death','Abuse/Neglect Report','Other'].map(t=><option key={t}>{t}</option>)}
</select>
</div>
<div><div className='field-label'>Resident</div>
<select value={form.resident} onChange={e=>setForm({...form,resident:e.target.value})}>
<option value=''>Select...</option>
{residents.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
</select>
</div>
<div><div className='field-label'>Date</div><input type='date' value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
<div><div className='field-label'>Severity</div>
<select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}>
{['minor','moderate','serious','critical'].map(s=><option key={s}>{s}</option>)}
</select>
</div>
</div>
<div style={{padding:'0 16px 12px'}}>
<div className='field-label'>Description and Actions Taken</div>
<textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder='What happened, immediate response, corrective actions...'/>
</div>
<div style={{padding:'0 16px 14px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
<div className='field-label' style={{marginBottom:0}}>Reported to DSHS?</div>
<select value={form.dshs} onChange={e=>setForm({...form,dshs:e.target.value})} style={{width:'auto'}}>
<option>No</option><option>Yes</option>
</select>
<div style={{flex:1}}/>
<button className='btn btn-primary' onClick={submit}>Log Incident</button>
</div>
</div>
</div>
<div>
<div className='section-title'>Incident Log ({incidents.length})</div>
{incidents.map(inc=>(
<div key={inc.id} className='incident-card'>
<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
<div>
<div style={{fontSize:10,color:'var(--muted)'}}>{inc.id}</div>
<div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'var(--heading)'}}>{inc.type}</div>
</div>
<span className={`badge badge-${inc.severity==='critical'||inc.severity==='serious'?'red':inc.severity==='moderate'?'amber':'blue'}`}>{inc.severity}</span>
</div>
<div style={{fontSize:11,color:'var(--muted)'}}>{inc.resident} - {inc.date}</div>
{inc.desc&&<div style={{marginTop:6,fontSize:11,color:'var(--muted)',lineHeight:1.5}}>{inc.desc}</div>}
<div style={{marginTop:8,display:'flex',gap:6}}><span className='badge badge-green'>Logged</span>{inc.dshs==='Yes'?<span className='badge badge-green'>DSHS Filed</span>:<span className='badge badge-amber'>DSHS Pending</span>}</div>
</div>
))}
</div>
</div>
);
}

// ─── WAC REFERENCE ───────────────────────────────────────────────────────────

function WACReference() {
const [search,setSearch]=useState('');
const filtered=WAC_REFS.filter(w=>w.code.toLowerCase().includes(search.toLowerCase())||w.title.toLowerCase().includes(search.toLowerCase())||w.desc.toLowerCase().includes(search.toLowerCase()));
return (
<div>
<div className='section-title'>WAC Compliance Reference</div>
<div style={{marginBottom:16}}><input placeholder='Search WAC code, title, or keyword...' value={search} onChange={e=>setSearch(e.target.value)}/></div>
{filtered.map(w=>(
<div key={w.code} className='wac-card'>
<div className='wac-code'>{w.code}</div>
<div className='wac-title'>{w.title}</div>
<div className='wac-desc'>{w.desc}</div>
<div style={{marginTop:10}}>{w.status==='compliant'?<span className='badge badge-green'>Compliant</span>:<span className='badge badge-amber'>Needs Review</span>}</div>
</div>
))}
</div>
);
}

// ─── DOCUMENT VAULT ──────────────────────────────────────────────────────────

function DocumentVault({documents,setDocuments}) {
const [activeCategory,setActiveCategory]=useState('all');
const [showUpload,setShowUpload]=useState(false);
const [dragover,setDragover]=useState(false);
const [form,setForm]=useState({name:'',category:'License',expiry:'',resident:'',notes:''});
const [selectedFile,setSelectedFile]=useState(null);
const [saved,setSaved]=useState(false);
const fileInputRef=useRef();

const filtered=activeCategory==='all'?documents:documents.filter(d=>d.category===activeCategory);
const countFor=(cat)=>cat==='all'?documents.length:documents.filter(d=>d.category===cat).length;

const handleFile=(file)=>{
if(!file) return;
const reader=new FileReader();
reader.onload=(e)=>{
setSelectedFile({name:file.name,size:file.size,type:file.type,data:e.target.result});
if(!form.name) setForm(prev=>({...prev,name:file.name.replace(/.[^/.]+$/,'')}));
};
reader.readAsDataURL(file);
};

const handleDrop=(e)=>{
e.preventDefault(); setDragover(false);
const file=e.dataTransfer.files[0];
if(file) handleFile(file);
};

const saveDoc=()=>{
if(!form.name||!form.category) return;
const doc={
id:'DOC-'+Date.now(),
name:form.name,
category:form.category,
expiry:form.expiry||null,
resident:form.resident||null,
notes:form.notes||null,
uploadDate:new Date().toISOString().split('T')[0],
fileName:selectedFile?.name||null,
fileSize:selectedFile?.size||null,
fileType:selectedFile?.type||null,
fileData:selectedFile?.data||null,
};
const updated=[doc,...documents];
setDocuments(updated);
try { localStorage.setItem('daima_vault',JSON.stringify(updated)); } catch(e) {}
setForm({name:'',category:'License',expiry:'',resident:'',notes:''});
setSelectedFile(null);
setShowUpload(false);
setSaved(true); setTimeout(()=>setSaved(false),3000);
};

const deleteDoc=(id)=>{
const updated=documents.filter(d=>d.id!==id);
setDocuments(updated);
try { localStorage.setItem('daima_vault',JSON.stringify(updated)); } catch(e) {}
};

const downloadFile=(doc)=>{
if(!doc.fileData) return;
const a=document.createElement('a');
a.href=doc.fileData;
a.download=doc.fileName||doc.name;
a.click();
};

const expiringCount=documents.filter(d=>d.expiry&&daysUntil(d.expiry)<90&&daysUntil(d.expiry)>=0).length;
const expiredCount=documents.filter(d=>d.expiry&&daysUntil(d.expiry)<0).length;

return (
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
<div className='section-title' style={{marginBottom:0}}>Document Vault</div>
<div style={{display:'flex',gap:8,alignItems:'center'}}>
{expiredCount>0&&<span className='badge badge-red'>{expiredCount} expired</span>}
{expiringCount>0&&<span className='badge badge-amber'>{expiringCount} expiring</span>}
<button className='btn btn-primary' onClick={()=>setShowUpload(true)}>+ Upload Document</button>
</div>
</div>


  {saved&&<div className='alert-banner green'>Document saved to vault.</div>}

  <div className='vault-cats'>
    {VAULT_CATEGORIES.map(cat=>(
      <div key={cat.key} className={`vault-cat ${activeCategory===cat.key?'active':''}`} onClick={()=>setActiveCategory(cat.key)}>
        <div className='vault-cat-icon'>{cat.icon}</div>
        <div className='vault-cat-label'>{cat.label}</div>
        <div className='vault-cat-count'>{countFor(cat.key)} docs</div>
      </div>
    ))}
  </div>

  {filtered.length===0?(
    <div style={{background:'var(---card)',border:'2px dashed var(---border)',borderRadius:10,padding:40,textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:12}}>📂</div>
      <div style={{fontSize:14,color:'var(---muted)',marginBottom:12}}>No documents in this category yet</div>
      <button className='btn btn-primary' onClick={()=>setShowUpload(true)}>Upload First Document</button>
    </div>
  ):(
    filtered.map(doc=>(
      <div key={doc.id} className='doc-row'>
        <div className='doc-icon' style={{background:CAT_COLORS[doc.category]||'rgba(74,85,104,.15)'}}>
          {VAULT_CATEGORIES.find(c=>c.key===doc.category)?.icon||'📄'}
        </div>
        <div className='doc-body'>
          <div className='doc-name'>{doc.name}</div>
          <div className='doc-meta'>
            {doc.category} - Uploaded {fmtDate(doc.uploadDate)}
            {doc.fileSize&&` - ${fmtBytes(doc.fileSize)}`}
            {doc.resident&&` - Resident: ${doc.resident}`}
          </div>
          {doc.notes&&<div style={{fontSize:10,color:'var(---muted)',marginTop:2,fontStyle:'italic'}}>{doc.notes}</div>}
        </div>
        <div className='doc-actions'>
          {expiryBadge(doc.expiry)}
          {doc.fileData&&(
            <button className='btn btn-ghost btn-sm' onClick={()=>downloadFile(doc)}>Download</button>
          )}
          <button className='btn btn-danger btn-sm' onClick={()=>deleteDoc(doc.id)}>Delete</button>
        </div>
      </div>
    ))
  )}

  {showUpload&&(
    <div className='modal-overlay' onClick={e=>{if(e.target.className==='modal-overlay')setShowUpload(false)}}>
      <div className='modal'>
        <div className='modal-title'>Upload Document</div>
        <div className='modal-sub'>File is stored locally in your browser. Accepts PDF, Word, images.</div>

        <div
          className={`drop-zone ${dragover?'dragover':''}`}
          onDragOver={e=>{e.preventDefault();setDragover(true)}}
          onDragLeave={()=>setDragover(false)}
          onDrop={handleDrop}
          onClick={()=>fileInputRef.current.click()}
        >
          <input ref={fileInputRef} type='file' style={{display:'none'}} accept='.pdf,.doc,.docx,.jpg,.jpeg,.png' onChange={e=>handleFile(e.target.files[0])}/>
          {selectedFile?(
            <div>
              <div style={{fontSize:24,marginBottom:8}}>✅</div>
              <div style={{fontSize:13,color:'var(---green)',fontWeight:600}}>{selectedFile.name}</div>
              <div style={{fontSize:11,color:'var(---muted)',marginTop:4}}>{fmtBytes(selectedFile.size)}</div>
            </div>
          ):(
            <>
              <div className='drop-zone-icon'>📎</div>
              <div className='drop-zone-text'>Drag and drop your file here<br/>or <strong>click to browse</strong></div>
              <div className='drop-zone-types'>PDF - DOCX - JPG - PNG - max 10MB</div>
            </>
          )}
        </div>

        <div className='form-grid' style={{padding:0,marginBottom:12}}>
          <div style={{gridColumn:'1/-1'}}>
            <div className='field-label'>Document Name *</div>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder='e.g. AFH License 2026'/>
          </div>
          <div>
            <div className='field-label'>Category *</div>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {VAULT_CATEGORIES.filter(c=>c.key!=='all').map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <div className='field-label'>Expiry Date</div>
            <input type='date' value={form.expiry} onChange={e=>setForm({...form,expiry:e.target.value})}/>
          </div>
          <div>
            <div className='field-label'>Linked Resident (optional)</div>
            <input value={form.resident} onChange={e=>setForm({...form,resident:e.target.value})} placeholder='Resident name'/>
          </div>
          <div>
            <div className='field-label'>Notes (optional)</div>
            <input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder='Any notes...'/>
          </div>
        </div>

        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:16}}>
          <button className='btn btn-ghost' onClick={()=>setShowUpload(false)}>Cancel</button>
          <button className='btn btn-primary' onClick={saveDoc} disabled={!form.name||!form.category}>Save to Vault</button>
        </div>
      </div>
    </div>
  )}
</div>

);
}

// ─── BINDER HUB ──────────────────────────────────────────────────────────────

function BinderHub({residents,staff,documents}) {
const [activeBinder,setActiveBinder]=useState(null);

const binders=[
{
id:'residents', icon:'🧑‍🦳', title:'Current Resident Binder', color:'var(--amber)',
desc:'All active residents with care info, diagnoses, allergies, and document status.',
count:`${residents.length} residents`,
generate:()=>setActiveBinder('residents'),
},
{
id:'staff', icon:'👥', title:'Staff Credentials Binder', color:'var(--green)',
desc:'All staff members with certifications, hire dates, and compliance status.',
count:`${staff.length} staff members`,
generate:()=>setActiveBinder('staff'),
},
{
id:'policies', icon:'📋', title:'Policies and Procedures', color:'var(--blue)',
desc:'All policy documents uploaded to the vault.',
count:`${documents.filter(d=>d.category==='Policy').length} policy docs`,
generate:()=>setActiveBinder('policies'),
},
{
id:'medications', icon:'💊', title:'Medication Orders Binder', color:'var(--purple)',
desc:'Current medication orders and MAR records per resident.',
count:'Phase 2',
phase2:true,
},
{
id:'incidents', icon:'🚨', title:'Incident Report Binder', color:'var(--red)',
desc:'All incident reports with DSHS filing status.',
count:'Phase 2',
phase2:true,
},
{
id:'vault', icon:'🔐', title:'Full Document Vault Export', color:'var(--muted)',
desc:'Complete listing of all documents with expiry status.',
count:`${documents.length} total documents`,
generate:()=>setActiveBinder('vault'),
},
];

if(activeBinder) {
return <BinderPreview type={activeBinder} residents={residents} staff={staff} documents={documents} onBack={()=>setActiveBinder(null)}/>;
}

return (
<div>
<div className='section-title'>Binder Hub</div>
<div className='alert-banner blue'>Click Generate on any binder to preview it. Then use your browser Print - Save as PDF to download.</div>
<div className='three-col' style={{marginTop:16}}>
{binders.map(b=>(
<div key={b.id} className='binder-card' onClick={!b.phase2?b.generate:undefined} style={{opacity:b.phase2?0.6:1,cursor:b.phase2?'default':'pointer'}}>
<div className='binder-spine' style={{background:b.color}}/>
<div className='binder-body'>
<div className='binder-icon'>{b.icon}</div>
<div className='binder-title'>{b.title}</div>
<div className='binder-desc'>{b.desc}</div>
<div className='binder-count'>{b.count}</div>
{!b.phase2?(
<button className='btn btn-primary btn-sm' style={{marginTop:12,width:'100%'}} onClick={e=>{e.stopPropagation();b.generate();}}>
Generate Binder
</button>
):(
<button className='btn btn-ghost btn-sm' style={{marginTop:12,width:'100%',cursor:'default'}}>Phase 2</button>
)}
</div>
</div>
))}
</div>
</div>
);
}

function BinderPreview({type,residents,staff,documents,onBack}) {
const today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

const print=()=>window.print();

return (
<div>
<div style={{display:'flex',gap:10,alignItems:'center',marginBottom:20,flexWrap:'wrap'}}>
<button className='btn btn-ghost' onClick={onBack}>Back to Binder Hub</button>
<button className='btn btn-primary' onClick={print}>Print / Save as PDF</button>
<div style={{fontSize:11,color:'var(--muted)'}}>Use browser Print - Save as PDF to download</div>
</div>


  <div className='print-area'>
    {type==='residents'&&(
      <>
        <div className='print-cover'>
          <h1>Current Resident Binder</h1>
          <p>Daima Adult Family Home LLC</p>
          <p>11419 N. Astor Rd, Spokane, WA 99218</p>
          <p>Generated: {today} - {residents.length} active residents</p>
        </div>
        {residents.map((r,i)=>(
          <div key={r.id} className='print-section'>
            <div className='print-section-header'>
              <strong>Room {r.room} - {r.name}</strong>
            </div>
            <div className='print-row'><span className='print-label'>Date of Birth</span><span className='print-value'>{r.dob}</span></div>
            <div className='print-row'><span className='print-label'>Admission Date</span><span className='print-value'>{r.admission}</span></div>
            <div className='print-row'><span className='print-label'>Care Level</span><span className='print-value'>{r.level}</span></div>
            <div className='print-row'><span className='print-label'>Code Status</span><span className='print-value'>{r.code}</span></div>
            <div className='print-row'><span className='print-label'>Primary Physician</span><span className='print-value'>{r.physician}</span></div>
            <div className='print-row'><span className='print-label'>Pharmacy</span><span className='print-value'>{r.pharmacy}</span></div>
            <div className='print-row'><span className='print-label'>Diet</span><span className='print-value'>{r.diet}</span></div>
            <div className='print-row'><span className='print-label'>Allergies</span><span className='print-value'>{r.allergies}</span></div>
            <div className='print-row'><span className='print-label'>Diagnosis</span><span className='print-value'>{r.diagnosis}</span></div>
            <div style={{marginTop:12,fontWeight:700,fontSize:11}}>Documents on File:</div>
            {['Admission Agreement','Physician Orders','Care Plan','POLST/Advance Directive'].map(docType=>{
              const found=documents.some(d=>d.resident===r.name&&d.name.toLowerCase().includes(docType.toLowerCase().split(' ')[0]));
              return (
                <div key={docType} className='print-row'>
                  <span className='print-label'>{docType}</span>
                  <span className={found?'print-status-ok':'print-status-miss'}>{found?'On File':'Missing'}</span>
                </div>
              );
            })}
          </div>
        ))}
      </>
    )}

    {type==='staff'&&(
      <>
        <div className='print-cover'>
          <h1>Staff Credentials Binder</h1>
          <p>Daima Adult Family Home LLC</p>
          <p>Generated: {today} - {staff.length} staff members</p>
        </div>
        {staff.map(s=>(
          <div key={s.id} className='print-section'>
            <div className='print-section-header'><strong>{s.name} - {s.role}</strong></div>
            <div className='print-row'><span className='print-label'>Hire Date</span><span className='print-value'>{s.hired}</span></div>
            <div className='print-row'>
              <span className='print-label'>CPR/BLS</span>
              <span className={daysUntil(s.cpr)<0?'print-status-miss':'print-status-ok'}>
                {daysUntil(s.cpr)<0?'EXPIRED':'Current'} - Expires {s.cpr}
              </span>
            </div>
            <div className='print-row'>
              <span className='print-label'>HCA/NA Certification</span>
              <span className={daysUntil(s.hca)<0?'print-status-miss':'print-status-ok'}>
                {daysUntil(s.hca)<0?'EXPIRED':'Current'} - Expires {s.hca}
              </span>
            </div>
            <div className='print-row'>
              <span className='print-label'>Food Handler</span>
              <span className={daysUntil(s.food)<0?'print-status-miss':'print-status-ok'}>
                {daysUntil(s.food)<0?'EXPIRED':'Current'} - Expires {s.food}
              </span>
            </div>
            <div className='print-row'>
              <span className='print-label'>Dementia Training</span>
              <span className={daysUntil(s.dementia)<0?'print-status-miss':'print-status-ok'}>
                {daysUntil(s.dementia)<0?'EXPIRED':'Current'} - Expires {s.dementia}
              </span>
            </div>
            {s.notes&&<div className='print-row'><span className='print-label'>Notes</span><span className='print-value'>{s.notes}</span></div>}
          </div>
        ))}
      </>
    )}

    {type==='policies'&&(
      <>
        <div className='print-cover'>
          <h1>Policies and Procedures Binder</h1>
          <p>Daima Adult Family Home LLC</p>
          <p>Generated: {today}</p>
        </div>
        <div className='print-section'>
          <div className='print-section-header'><strong>Policy Documents</strong></div>
          {documents.filter(d=>d.category==='Policy').length===0?(
            <div style={{padding:'20px 0',color:'#666'}}>No policy documents uploaded yet. Upload policy documents in the Document Vault.</div>
          ):(
            documents.filter(d=>d.category==='Policy').map(doc=>(
              <div key={doc.id} className='print-row'>
                <span className='print-label'>{doc.name}</span>
                <span className='print-value'>Uploaded {fmtDate(doc.uploadDate)}{doc.expiry?` - Expires ${fmtDate(doc.expiry)}`:''}</span>
              </div>
            ))
          )}
        </div>
      </>
    )}

    {type==='vault'&&(
      <>
        <div className='print-cover'>
          <h1>Document Vault Export</h1>
          <p>Daima Adult Family Home LLC</p>
          <p>Generated: {today} - {documents.length} total documents</p>
        </div>
        {VAULT_CATEGORIES.filter(c=>c.key!=='all').map(cat=>{
          const docs=documents.filter(d=>d.category===cat.key);
          if(docs.length===0) return null;
          return (
            <div key={cat.key} className='print-section'>
              <div className='print-section-header'><strong>{cat.icon} {cat.label}</strong></div>
              {docs.map(doc=>(
                <div key={doc.id} className='print-row'>
                  <span className='print-label'>{doc.name}</span>
                  <span className='print-value'>{doc.expiry?`Expires ${fmtDate(doc.expiry)}`:'No Expiry'}</span>
                </div>
              ))}
            </div>
          );
        })}
      </>
    )}

    <div style={{marginTop:40,paddingTop:20,borderTop:'1px solid #ccc',fontSize:10,color:'#999',textAlign:'center'}}>
      Daima Adult Family Home LLC - 11419 N. Astor Rd, Spokane, WA 99218 - (509) 306-4371 - Generated {today}
    </div>
  </div>
</div>

);
}

// ─── APP SHELL ───────────────────────────────────────────────────────────────

const TABS = [
{ id:'dashboard',  label:'Command Center' },
{ id:'inspection', label:'Inspection' },
{ id:'charts',     label:'Resident Charts' },
{ id:'mar',        label:'MAR' },
{ id:'training',   label:'Training' },
{ id:'incidents',  label:'Incidents' },
{ id:'vault',      label:'Document Vault' },
{ id:'binders',    label:'Binder Hub' },
{ id:'wac',        label:'WAC Reference' },
];

function MainApp() {
const [tab,setTab]=useState('dashboard');
const [residents]=useState(DEFAULT_RESIDENTS);
const [staff]=useState(DEFAULT_STAFF);
const [incidents,setIncidents]=useState(DEFAULT_INCIDENTS);
const [documents,setDocuments]=useState([]);
const [sheetsLive,setSheetsLive]=useState(false);

useEffect(()=>{
// Load saved vault documents from localStorage
try {
const saved=localStorage.getItem('daima_vault');
if(saved) setDocuments(JSON.parse(saved));
} catch(e) {}


// Try Google Sheets
async function load() {
  if(!SHEETS_CONFIG.SHEET_API_URL) return;
  const [r,s,inc]=await Promise.all([
    sheetsRead(SHEETS_CONFIG.TABS.RESIDENTS),
    sheetsRead(SHEETS_CONFIG.TABS.STAFF),
    sheetsRead(SHEETS_CONFIG.TABS.INCIDENTS),
  ]);
  if(r&&r.length){ setSheetsLive(true); }
  if(s&&s.length){ setSheetsLive(true); }
  if(inc&&inc.length){ setIncidents(inc); setSheetsLive(true); }
}
load();

},[]);

const fail=INSPECTION_ITEMS.filter(i=>i.status==='fail').length;
const warn=INSPECTION_ITEMS.filter(i=>i.status==='warn').length;
const score=Math.round((INSPECTION_ITEMS.filter(i=>i.status==='pass').length/INSPECTION_ITEMS.length)*100);
const expiredStaff=DEFAULT_STAFF.filter(s=>certStatus(s.hca)==='expired'||certStatus(s.cpr)==='expired').length;

return (
<>
<style>{STYLE}</style>
<div className='app'>
<div className='topbar'>
<div className='topbar-brand'>
<div className='brand-dot'/>
<div>
<div className='brand-name'>Daima AFH - Command Center</div>
<div className='brand-sub'>11419 N Astor Rd, Spokane WA - DSHS / WAC 388-76</div>
</div>
</div>
<div className='topbar-status'>
<span className={`status-pill ${score>=90?'green':score>=75?'amber':'red'}`}>Score {score}%</span>
{fail>0&&<span className='status-pill red'>{fail} Critical</span>}
{warn>0&&<span className='status-pill amber'>{warn} Warnings</span>}
{expiredStaff>0&&<span className='status-pill red'>{expiredStaff} Certs Expired</span>}
<span className={`status-pill ${sheetsLive?'green':'amber'}`}>{sheetsLive?'Sheets Live':'Local Mode'}</span>
</div>
</div>
<div className='nav'>
{TABS.map(t=>(
<button key={t.id} className={`nav-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
))}
</div>
<div className='main'>
<SyncBar live={sheetsLive}/>
{tab==='dashboard'  && <Dashboard residents={residents} incidents={incidents} staff={staff} documents={documents}/>}
{tab==='inspection' && <InspectionDashboard/>}
{tab==='charts'     && <ResidentCharts residents={residents}/>}
{tab==='mar'        && <MARModule residents={residents}/>}
{tab==='training'   && <TrainingTracker staff={staff}/>}
{tab==='incidents'  && <IncidentReporting incidents={incidents} setIncidents={setIncidents} residents={residents} sheetsLive={sheetsLive}/>}
{tab==='vault'      && <DocumentVault documents={documents} setDocuments={setDocuments}/>}
{tab==='binders'    && <BinderHub residents={residents} staff={staff} documents={documents}/>}
{tab==='wac'        && <WACReference/>}
</div>
</div>
</>
);
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/" element={session ? <MainApp /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
