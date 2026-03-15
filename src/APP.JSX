 /* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { sheetsRead, sheetsAppend, SHEETS_CONFIG } from './sheetsConfig';
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=D
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#07090f; --surface:#0d1117; --card:#111820; --border:#1e2d3d;
    --amber:#f6a623; --green:#22d3a5; --red:#ff4d6a; --blue:#4fa3e0;
    --purple:#a78bfa; --muted:#4a5568; --text:#cdd9e5; --heading:#e6edf3;
  }
  body { background:var(--bg); font-family:'DM Mono',monospace; color:var(--text); }
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:
  .brand-dot { width:10px; height:10px; border-radius:50%; background:var(--green); bo
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:15px; letter
  .brand-sub { font-size:10px; color:var(--muted); letter-spacing:.12em; }
  .topbar-brand { display:flex; align-items:center; gap:10px; }
  .topbar-status { display:flex; gap:8px; flex-wrap:wrap; }
  .status-pill { padding:3px 10px; border-radius:20px; border:1px solid var(--border);
  .status-pill.green { border-color:var(--green); color:var(--green); }
  .status-pill.amber { border-color:var(--amber); color:var(--amber); }
  .status-pill.red   { border-color:var(--red);   color:var(--red); }
  .nav { background:var(--surface); border-bottom:1px solid var(--border); display:fle
  .nav-tab { padding:12px 18px; font-size:11px; letter-spacing:.08em; text-transform:u
  .nav-tab:hover { color:var(--text); }
  .nav-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
  .main { padding:28px; flex:1; }
  .section-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; let
  .section-title::after { content:''; flex:1; height:1px; background:var(--border); }
  .metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1f
  .metric-card { background:var(--card); border:1px solid var(--border); border-radius
  .metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height
  .metric-card.green::before { background:var(--green); }
  .metric-card.amber::before { background:var(--amber); }
  .metric-card.red::before   { background:var(--red); }
  .metric-card.blue::before  { background:var(--blue); }
  .metric-card.purple::before{ background:var(--purple); }
  .metric-label { font-size:10px; letter-spacing:.1em; color:var(--muted); text-transf
  .metric-value { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; line
  .metric-card.green .metric-value { color:var(--green); }
  .metric-card.amber .metric-value { color:var(--amber); }
M+Mono:
0 28px;
x-shado
-spacin
font-s
x; padd
ppercas
ter-spa
r)); ga
:8px; p
:2px; }
orm:upp
-height

 .metric-card.red   .metric-value { color:var(--red); }
.metric-card.blue  .metric-value { color:var(--blue); }
.metric-card.purple .metric-value { color:var(--purple); }
.metric-sub { font-size:10px; color:var(--muted); }
.table-wrap { background:var(--card); border:1px solid var(--border); border-radius:
.table-head { padding:12px 16px; background:var(--surface); border-bottom:1px solid
table { width:100%; border-collapse:collapse; font-size:12px; }
thead th { padding:10px 16px; text-align:left; font-size:10px; letter-spacing:.1em;
tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
tbody tr:last-child { border-bottom:none; }
tbody tr:hover { background:rgba(255,255,255,.02); }
td { padding:10px 16px; color:var(--text); vertical-align:middle; }
.badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; l .badge-green { background:rgba(34,211,165,.12); color:var(--green); border:1px soli .badge-amber { background:rgba(246,166,35,.12); color:var(--amber); border:1px sol .badge-red { background:rgba(255,77,106,.12); color:var(--red); border:1px sol .badge-blue { background:rgba(79,163,224,.12); color:var(--blue); border:1px sol .badge-purple { background:rgba(167,139,250,.12); color:var(--purple);border:1px sol .progress-bar-bg { background:var(--border); border-radius:4px; height:6px; overflow .progress-bar-fill { height:100%; border-radius:4px; transition:width .6s ease; } .checklist { display:flex; flex-direction:column; gap:2px; }
.check-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border- .check-item:hover { background:rgba(255,255,255,.03); }
.check-box { width:16px; height:16px; border-radius:3px; border:1.5px solid var(--bo .check-box.checked { background:var(--green); border-color:var(--green); } .check-box.checked::after { content:'✓'; font-size:10px; color:#07090f; font-weight: .check-wac { font-size:9px; color:var(--blue); letter-spacing:.08em; }
.form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:16px; } .field-label { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color: input,select,textarea { width:100%; background:var(--surface); border:1px solid var( input:focus,select:focus,textarea:focus { border-color:var(--amber); }
textarea { resize:vertical; min-height:80px; }
select option { background:var(--surface); }
.btn { padding:9px 20px; border-radius:5px; font-family:'DM Mono',monospace; font-si .btn-primary { background:var(--amber); color:#07090f; font-weight:700; } .btn-primary:hover { filter:brightness(1.1); }
.btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--bord .btn-ghost:hover { color:var(--text); border-color:var(--text); }
.btn-sm { padding:5px 12px; font-size:10px; }
.alert-banner { display:flex; align-items:center; gap:12px; padding:12px 16px; borde .alert-banner.red { background:rgba(255,77,106,.1); border:1px solid rgba(255,77,1 .alert-banner.amber { background:rgba(246,166,35,.1); border:1px solid rgba(246,166, .alert-banner.green { background:rgba(34,211,165,.1); border:1px solid rgba(34,211,1 .alert-banner.blue { background:rgba(79,163,224,.1); border:1px solid rgba(79,163,2 .wac-card { background:var(--card); border:1px solid var(--border); border-radius:8p .wac-card:hover { border-color:var(--blue); }
.wac-code { font-size:11px; color:var(--blue); letter-spacing:.1em; margin-bottom:4p
8px; ov
var(--b
color:v
etter-s
d rgba(
id rgba
id rgba
id rgba
id rgba
:hidden
radius:
rder);
700; }
var(--m
--borde
ze:11px
er); }
r-radiu
06,.3);
35,.3);
65,.3);
24,.3);
x; padd
x; }

   .wac-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:v
  .wac-desc { font-size:11px; color:var(--muted); line-height:1.6; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .three-col { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  @media(max-width:1000px) { .three-col { grid-template-columns:1fr 1fr; } }
  @media(max-width:900px) { .two-col,.three-col { grid-template-columns:1fr; } .form-g
  .incident-card { background:var(--card); border:1px solid var(--border); border-radi
  .incident-header { display:flex; justify-content:space-between; align-items:flex-sta
  .incident-id { font-size:10px; color:var(--muted); letter-spacing:.1em; }
  .incident-type { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; col
  .incident-meta { font-size:11px; color:var(--muted); margin-top:4px; }
  .sync-bar { font-size:10px; color:var(--muted); display:flex; align-items:center; ga
  .sync-dot { width:6px; height:6px; border-radius:50%; }
  .sync-dot.live { background:var(--green); box-shadow:0 0 6px var(--green); }
  .sync-dot.local { background:var(--amber); }
  .mar-cell { width:36px; height:36px; border-radius:6px; border:1.5px solid var(--bor
  .mar-cell:hover { border-color:var(--amber); }
  .mar-cell.given { background:rgba(34,211,165,.15); border-color:var(--green); }
  .mar-cell.refused { background:rgba(255,77,106,.15); border-color:var(--red); }
  .mar-cell.held { background:rgba(246,166,35,.15); border-color:var(--amber); }
  .mar-cell.na { background:rgba(79,163,224,.08); border-color:var(--blue); opacity:.5
  .res-card { background:var(--card); border:1px solid var(--border); border-radius:8p
  .res-card.selected { border-color:var(--amber); background:rgba(246,166,35,.05); }
  .res-card:hover { border-color:var(--muted); }
  .mar-legend { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:14px; font-size:
  .mar-legend-item { display:flex; align-items:center; gap:5px; }
  .mar-dot { width:10px; height:10px; border-radius:3px; }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
`;
// ─── REAL DAIMA AFH DATA ────────────────────────────────────────────────────
const DEFAULT_RESIDENTS = [
  {
    id:'R-001', name:'Marion Tenneson', room:'A', admission:'2023-08-14',
    dob:'1983-11-17', level:'Level 3', code:'Full Code',
    physician:'Dr. Hela Kelsch', pharmacy:'Ready Meds Pharmacy',
    chartComplete:88, diet:'Diabetic, Low Carb',
    allergies:'Shellfish, Morphine, Bactrim DS',
    diagnosis:'Type 2 DM, Schizophrenia, Bipolar Disorder, Depression, Anxiety, Nightm
    flags:'Blood sugar checks daily,POLST on file,Controlled substance (Lorazepam)',
    medications:[
      { name:'Clozapine 450mg', freq:'QD', time:'Bedtime', route:'Oral', special:'BING
      { name:'Divalproex ER 1500mg', freq:'QD', time:'Bedtime', route:'Oral', special:
      { name:'Sertraline 200mg', freq:'QD', time:'Morning', route:'Oral', special:'' }
ar(--he
rid { g
us:8px;
rt; mar
or:var(
p:6px;
der); d
;}
x; padd
11px; }
are Dis
O proto
'Handle
,

     { name:'Bupropion XL 450mg', freq:'QD', time:'Morning', route:'Oral', special:'T
    { name:'Jardiance 25mg', freq:'QD', time:'Morning', route:'Oral', special:'Diabe
    { name:'Atorvastatin 80mg', freq:'QD', time:'Bedtime', route:'Oral', special:''
    { name:'Prazosin 4mg', freq:'QD', time:'Bedtime', route:'Oral', special:'For nig
    { name:'Fenofibrate 160mg', freq:'QD', time:'Before dinner', route:'Oral', speci
    { name:'Lisinopril 2.5mg', freq:'QD', time:'Bedtime', route:'Oral', special:'' }
    { name:'Lubiprostone 8mcg', freq:'BID', time:'With meals', route:'Oral', special
    { name:'Vitamin D3 2000IU', freq:'QD', time:'With meal', route:'Oral', special:'
    { name:'Blood Sugar Check', freq:'QD', time:'As directed', route:'Accu-Chek', sp
    { name:'Lorazepam 1mg', freq:'PRN', time:'As needed', route:'Oral', special:'PRN
] },
{
  id:'R-002', name:'Albert Goblick', room:'C', admission:'2024-12-13',
  dob:'1943-12-29', level:'Level 2', code:'DNR',
  physician:'Dr. Ronald Smith (VA)', pharmacy:'VA Pharmacy',
  chartComplete:82, diet:'Regular',
  allergies:'None known',
  diagnosis:'HIV-1, Hypertension, Depression, Insomnia, Skin conditions',
  flags:'DNR — verify orders,VA medications (family supply),HIV medications',
  medications:[
    { name:'Cobicistat/Elviteg/Emtric/Tenofov 150/150/200/10mg', freq:'QD', time:'Mo
    { name:'Darunavir 800mg', freq:'QD', time:'Morning', route:'Oral', special:'MAR
    { name:'Eliquis 2.5mg', freq:'BID', time:'Every 12 hours', route:'Oral', special
    { name:'Lisinopril 5mg (2 tabs)', freq:'QD', time:'Morning', route:'Oral', speci
    { name:'Mirtazapine 15mg', freq:'QD', time:'Bedtime', route:'Oral', special:'Dep
    { name:'Polyethylene Glycol 17g', freq:'QD', time:'Morning', route:'Oral', speci
    { name:'Vitamin D3 4000IU (2 tabs)', freq:'QD', time:'With food', route:'Oral',
    { name:'Mupirocin 2% Ointment', freq:'TID', time:'Topical', route:'Topical', spe
    { name:'Clobetasol 0.05% Cream', freq:'BID', time:'Topical', route:'Topical', sp
    { name:'Trazodone 50mg', freq:'PRN', time:'Bedtime PRN', route:'Oral', special:'
    { name:'Ensure Liquid', freq:'BID', time:'Twice daily', route:'Oral', special:'F
] },
{
  id:'R-003', name:'Robert Carter', room:'B', admission:'2024-11-13',
  dob:'1967-07-23', level:'Level 3', code:'DNR',
  physician:'Dr. Haley Key (Seva Medical)', pharmacy:'Ready Meds Pharmacy',
  chartComplete:75, diet:'Diabetic, Low Sodium',
  allergies:'No known allergies',
  diagnosis:'Type 2 DM with nephropathy, Hypertension, PTSD, Hyperlipidemia, Neuropa
  flags:'DNR — verify orders,No MAR uploaded yet,POLST pending',
  medications:[
    { name:'Medications pending upload', freq:'—', time:'—', route:'—', special:'Con
  ]
}, {
wo tabl
tes' },
},
htmares
al:'' }
,
:'' },
' },
ecial:'
anxiet
rning',
only —
:'HTR —
al:'Blo
ression
al:'Fam
special
cial:'P
ecial:'
PRN ins
amily s
thy, An
tact Dr

     id:'R-004', name:'Teresa Byrd (Tina)', room:'B', admission:'2025-08-14',
    dob:'1970-06-30', level:'Level 3', code:'Full Code',
    physician:'Dr. Haley Key (Seva Medical)', pharmacy:'Ready Meds Pharmacy (Spokane V
    chartComplete:79, diet:'Regular',
    allergies:'Penicillin',
    diagnosis:'Essential Tremor, Major Depressive Disorder, Anxiety, COPD, Restless Le
    flags:'Hepatitis C treatment (Mavyret 8 weeks),Nebulizer treatments PRN,Naloxone o
    medications:[
      { name:'Doxepin 10mg', freq:'QD', time:'Bedtime', route:'Oral', special:'Handle
      { name:'Escitalopram 20mg', freq:'QD', time:'Morning', route:'Oral', special:''
      { name:'Furosemide 40mg (1⁄2 tab)', freq:'BID', time:'8AM / Noon', route:'Oral', s
      { name:'Ropinirole 1mg', freq:'BID', time:'8AM / 5PM', route:'Oral', special:'Re
      { name:'Spironolactone 25mg', freq:'QD', time:'Morning', route:'Oral', special:'
      { name:'Topiramate 50mg', freq:'QD', time:'Morning', route:'Oral', special:'Hand
      { name:'Trazodone 100mg', freq:'QD', time:'Bedtime', route:'Oral', special:'Repl
      { name:'Polyethylene Glycol 17g', freq:'QD', time:'Morning', route:'Oral', speci
      { name:'Mavyret 300mg (3 tabs)', freq:'QD', time:'Daily x8 weeks', route:'Oral',
      { name:'Ketoconazole 2% Cream', freq:'QD', time:'Morning', route:'Topical', spec
      { name:'Triamcinolone 0.1% Cream', freq:'BID', time:'Twice daily x14 days', rout
      { name:'Budesonide 0.5mg/2ml', freq:'PRN BID', time:'As needed', route:'Nebulize
      { name:'Ipratropium-Albuterol 3ml', freq:'PRN Q6H', time:'As needed', route:'Neb
      { name:'Naloxone 4mg', freq:'PRN', time:'Emergency only', route:'Nasal', special
] },
];
const DEFAULT_STAFF = [
  {
    id:'S-001', name:'Dakarai Dibi', role:'Registered Nurse',
    hired:'2024-01-01',
    cpr:'2026-08-31',
    hca:'2026-12-31',
    food:'2026-12-31',
    dementia:'2026-12-31',
    notes:'RN License #823621 TX Board — Multistate Compact. BLS expires 08/2026.'
}, {
}, {
id:'S-002', name:'Evelyn Tserayi', role:'Caregiver',
hired:'2025-11-14',
cpr:'2026-06-01',
hca:'2026-11-14',
food:'2026-06-01',
dementia:'2026-11-14',
notes:'HCA Application pending — Credential #HMCC.HM.70071137'
id:'S-003', name:'Claret Gatawa', role:'Nursing Assistant',
alley)'
gs Synd
n hand'
with gl
},
pecial:
stless
Handle
le with
aces pr
al:'Mix
 specia
ial:'Ap
e:'Topi
r', spe
ulizer'
:'Call

     hired:'2025-10-08',
    cpr:'2026-10-08',
    hca:'2026-01-08',
    food:'2026-10-08',
    dementia:'2026-10-08',
    notes:'NA Cert #NC70019153 — EXPIRED 01/08/2026. Must renew immediately.'
}, {
}, ];
const DEFAULT_INCIDENTS = [
  { id:'INC-2025-001', type:'Documentation', resident:'Robert Carter', date:'2025-03-1
];
const CHART_CHECKLIST = [
  { id:'c1',  text:'Admission Agreement signed',         wac:'WAC 388-76-10200' },
  { id:'c2',  text:'Resident Rights form acknowledged',  wac:'WAC 388-76-10205' },
  { id:'c3',  text:'Initial Resident Assessment (ISP)',  wac:'WAC 388-76-10300' },
  { id:'c4',  text:'Physician orders on file',           wac:'WAC 388-76-10310' },
  { id:'c5',  text:'Current medication list (signed)',   wac:'WAC 388-76-10315' },
id:'S-004', name:'Beline Mokoro', role:'Nursing Assistant',
hired:'2023-08-04',
cpr:'2026-08-04',
hca:'2025-10-30',
food:'2026-08-04',
dementia:'2026-08-04',
notes:'NA Cert #NC61469970 — EXPIRED 10/30/2025. Must renew immediately.'
  { id:'c6',  text:'Dietary/allergy documentation',
  { id:'c7',  text:'Emergency contact info verified',
  { id:'c8',  text:'TB test/clearance on file',
  { id:'c9',  text:'Annual physical (within 12 months)', wac:'WAC 388-76-10310' },
  { id:'c10', text:'Care plan reviewed & updated',       wac:'WAC 388-76-10300' },
  { id:'c11', text:'Advance Directive / POLST on file',  wac:'WAC 388-76-10210' },
  { id:'c12', text:'Financial agreement documented',     wac:'WAC 388-76-10200' },
];
const INSPECTION_ITEMS = [
  { category:'Personnel Files', item:'All staff credentials verified',
  { category:'Personnel Files', item:'Background check records on file',
  { category:'Personnel Files', item:'HCA / NA certifications current',
  { category:'Resident Care',   item:'ISPs current for all residents',
  { category:'Resident Care',   item:'Medication management logs complete',  status:'w
{ category:'Resident Care',
{ category:'Home Safety',
{ category:'Home Safety',
{ category:'Home Safety',
item:'Dignity & rights policies posted',
item:'Fire drill log (2x per year)',
item:'Carbon monoxide detectors tested',
item:'Emergency evacuation plan posted',
status:'p
status:'p
status:'p
status:'p
wac:'WAC 388-76-10320' },
wac:'WAC 388-76-10205' },
wac:'WAC 388-76-10160' },
status:'f
status:'p
status:'f
status:'w
0', sev
ail' },
ass' },
ail' },
arn' },
arn' },
ass' },
ass' },
ass' },
ass' },

 ];
{ category:'Home Safety',
{ category:'Medications',
{ category:'Medications',
{ category:'Medications',
{ category:'Food Service',
{ category:'Food Service',
{ category:'Documentation',
{ category:'Documentation',
{ category:'Documentation',   item:'Resident grievance procedure posted',  status:'p
{ code:'WAC 388-76-10310', title:'Health Monitoring',
{ code:'WAC 388-76-10315', title:'Medication Management',
{ code:'WAC 388-76-10400', title:'Physical Environment',
{ code:'WAC 388-76-10520', title:'Incident Reporting',
{ code:'WAC 388-76-10205', title:'Resident Rights',
desc:'Provider mus
desc:'Medications
desc:'Home must me
desc:'Reportable i
desc:'Provider mus
item:'First aid kit stocked & accessible',   status:'p
item:'Controlled substance log verified',    status:'w
item:'Medications stored securely (locked)', status:'p
                                item:'MAR documentation complete',
                                item:'Food handler cards on file',
                                item:'Fridge/freezer temps logged',
                                item:'Incident reports filed within 24h',
                                item:'Activity log maintained',
const WAC_REFS = [
  { code:'WAC 388-76-10100', title:'Licensing Requirements',
  { code:'WAC 388-76-10155', title:'Provider Qualifications',
  { code:'WAC 388-76-10160', title:'Employee Requirements',
  { code:'WAC 388-76-10200', title:'Admission Agreement',
  { code:'WAC 388-76-10300', title:'Individual Service Plan (ISP)', desc:'ISP must be
];
// ─── HELPERS ────────────────────────────────────────────────────────────────
function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function certStatus(d) { const n=daysUntil(d); return n<0?'expired':n<60?'expiring':'c
function certBadge(d) {
const s=certStatus(d);
return s==='expired' ? <span className='badge badge-red'>   Expired</span>
: s==='expiring' ? <span className='badge badge-amber'>⚠ Exp Soon</span> : <span className='badge badge-green'>✓ Current</span>;
}
function pColor(p) { return p>=90?'#22d3a5':p>=70?'#f6a623':'#ff4d6a'; }
function codeBadge(c) {
  return c==='DNR'
    ? <span className='badge badge-red'>DNR</span>
    : <span className='badge badge-green'>Full Code</span>;
}
const DAYS = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','
function SyncBar({live}) {
  return (
    <div className='sync-bar'>
      <div className={`sync-dot ${live?"live":"local"}`}/>
status:'w
status:'p
status:'w
status:'pa
 status:'p
desc:'AFH must be
desc:'Provider mus
desc:'All caregive
desc:'Written admi
ass' },
arn' },
ass' },
arn' },
ass' },
arn' },
ss' },
ass' },
ass' },
license
t compl
rs must
ssion a
develop
t monit
must be
et safe
ncident
t ensur
urrent'
17','18

       {live ? <span>Live — syncing with Google Sheets</span>
            : <span>Local mode — connect Google Sheets to persist data</span>}
</div> );
}
// ─── DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({residents, incidents, staff}) {
  const pass=INSPECTION_ITEMS.filter(i=>i.status==='pass').length;
  const fail=INSPECTION_ITEMS.filter(i=>i.status==='fail').length;
  const warn=INSPECTION_ITEMS.filter(i=>i.status==='warn').length;
  const score=Math.round((pass/INSPECTION_ITEMS.length)*100);
  const expd=staff.filter(s=>certStatus(s.cpr)==='expired'||certStatus(s.hca)==='expir
  const expg=staff.filter(s=>certStatus(s.cpr)==='expiring'||certStatus(s.hca)==='expi
  const avg=residents.length?Math.round(residents.reduce((a,r)=>a+Number(r.chartComple
  const totalMeds = residents.reduce((a,r)=>a+(r.medications?.length||0),0);
  return (
    <div>
 {fail>0 && <div className='alert-banner red'>
{expd>0 && <div className='alert-banner red'>
{expg>0 && <div className='alert-banner amber'>
<div className='alert-banner amber'> <span><strong>Robert Carter</strong> — MA
<span><strong>{fail} critical it
<span><strong>{expd} staff membe
  <span><strong>{expg} staff mem
   <div className='section-title'>Command Overview</div>
<div className='metrics-grid'>
  <div className={`metric-card ${score>=90?"green":score>=75?"amber":"red"}`}>
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
ed').le
ring').
te),0)/
em{fai
r{expd
ber{ex
R / me
l > p d

   </div>
  <div className={`metric-card ${avg>=90?"green":"amber"}`}>
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
    {[...new Set(INSPECTION_ITEMS.map(i=>i.category))].map(cat=>{
      const items=INSPECTION_ITEMS.filter(i=>i.category===cat);
      const p=Math.round((items.filter(i=>i.status==='pass').length/items.length
      return (
        <div key={cat} style={{marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11
            <span>{cat}</span><span style={{color:pColor(p)}}>{p}%</span>
          </div>
          <div className='progress-bar-bg'><div className='progress-bar-fill' st
        </div>
); })}
</div> <div>
    <div className='section-title'>Resident Snapshot</div>
    {residents.map(r=>(
      <div key={r.id} style={{background:'var(--card)',border:'1px solid var(--b
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'f
          <div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13
            <div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>Room {r.
          </div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'flex
            {codeBadge(r.code)}
            <span style={{fontSize:14,fontWeight:800,color:pColor(r.chartComplet
          </div>
        </div>
        <div className='progress-bar-bg'><div className='progress-bar-fill' styl
        {r.flags && <div style={{marginTop:8,display:'flex',gap:4,flexWrap:'wrap
</div> ))}
)*100);
,margin
yle={{w
order)'
lex-sta
,color:
room} ·
-end'}}
e),font
e={{wid
'}}>{r.

         </div>
      </div>
</div> );
}
// ─── INSPECTION ──────────────────────────────────────────────────────────────
function InspectionDashboard() {
  const [filter,setFilter]=useState('all');
  const filtered=filter==='all'?INSPECTION_ITEMS:INSPECTION_ITEMS.filter(i=>i.status==
  const categories=[...new Set(INSPECTION_ITEMS.map(i=>i.category))];
  return (
    <div>
      <div className='section-title'>Inspection Readiness Dashboard</div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {['all','pass','warn','fail'].map(f=>(
          <button key={f} className={`btn ${filter===f?"btn-primary":"btn-ghost"}`} on
{f==='all'?'All':f==='pass'?'✓ Pass':f==='warn'?'⚠ Warn':'✗ Critical'} </button>
))} </div>
      {categories.map(cat=>{
        const items=filtered.filter(i=>i.category===cat);
        if(!items.length) return null;
        const all=INSPECTION_ITEMS.filter(i=>i.category===cat);
        return (
          <div key={cat} className='table-wrap' style={{marginBottom:16}}>
            <div className='table-head'><span>{cat}</span><span>{all.filter(i=>i.statu
            <table><tbody>{items.map((item,idx)=>(
              <tr key={idx}>
                <td style={{width:24,paddingRight:0,color:item.status==='pass'?'var(--
                <td>{item.item}</td>
                <td style={{textAlign:'right'}}>{item.status==='pass'?<span className=
              </tr>
            ))}</tbody></table>
</div> );
})} </div>
); }
// ─── RESIDENT CHARTS ─────────────────────────────────────────────────────────
function ResidentCharts({residents}) {
  const [selected,setSelected]=useState(null);
=filter
Click={
s==='pa
green)'
'badge

 const [checks,setChecks]=useState({});
useEffect(()=>{
  if(residents.length){
    setSelected(residents[0]);
    setChecks(Object.fromEntries(residents.map(r=>[r.id,CHART_CHECKLIST.map(c=>({...
} },[]);
const toggle=(cid)=>setChecks(prev=>({...prev,[selected.id]:prev[selected.id].map(c=
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
        const flags=r.flags?r.flags.split(',').filter(Boolean):[];
        return (
          <div key={r.id} className={`res-card ${selected?.id===r.id?"selected":""}`
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'f
              <div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13
                <div style={{fontSize:10,color:'var(--muted)',marginTop:2}}>Room {r.
                <div style={{fontSize:10,color:'var(--muted)'}}>{r.physician}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-en
                {codeBadge(r.code)}
                <span style={{fontSize:14,fontWeight:800,color:pColor(p),fontFamily:
              </div>
</div>
<div className='progress-bar-bg'><div className='progress-bar-fill' styl <div style={{marginTop:8,fontSize:11,color:'var(--muted)'}}> {r.diet} {flags.length>0 && <div style={{marginTop:6,display:'flex',gap:4,flexWra
</div> );
})} </div>
    <div>
      <div className='section-title'>{selected.name} — Chart Checklist</div>
      <div style={{background:'var(--card)',border:'1px solid var(--border)',borderR
        <div style={{fontSize:11,color:'var(--muted)',marginBottom:4}}>Diagnosis</di
        <div style={{fontSize:11,color:'var(--text)',lineHeight:1.5,marginBottom:10}
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fo
 <span style={{color:'var(--muted)'}}>Chart Completeness</span>
c,done:
>c.id==
} onCli
lex-sta
,color:
room} ·
d',gap:
'Syne,s
e={{wid ·{ p:'wrap
adius:8
v>
}>{sele
ntSize:
 r

             <span style={{color:pColor(pct),fontWeight:700}}>{cur.filter(c=>c.done).le
          </div>
          <div className='progress-bar-bg' style={{height:8}}><div className='progress
        </div>
        <div className='checklist'>
          {cur.map(c=>(
            <div key={c.id} className='check-item' onClick={()=>toggle(c.id)}>
              <div className={`check-box ${c.done?"checked":""}`}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,textDecoration:c.done?'line-through':'none',c
                <div className='check-wac'>{c.wac}</div>
              </div>
</div> ))}
        </div>
      </div>
</div> );
}
// ─── MAR MODULE ──────────────────────────────────────────────────────────────
function MARModule({residents}) {
  const [selectedRes, setSelectedRes] = useState(null);
  const [marData, setMarData] = useState({});
  const today = new Date();
  const month = today.toLocaleString('default',{month:'long'});
  const year = today.getFullYear();
  const daysInMonth = new Date(year, today.getMonth()+1, 0).getDate();
  const dayNums = Array.from({length:daysInMonth},(_,i)=>String(i+1));
  useEffect(()=>{ if(residents.length) setSelectedRes(residents[0]); },[]);
  const getCell = (resId, medName, day) => marData[`${resId}|${medName}|${day}`] || 'p
  const cycleCell = (resId, medName, day) => {
    const key=`${resId}|${medName}|${day}`;
    const cur=marData[key]||'pending';
    const next={pending:'given',given:'refused',refused:'held',held:'pending'};
    setMarData(prev=>({...prev,[key]:next[cur]}));
};
const cellIcon = (s) => s==='given'?'✓':s==='refused'?'✗':s==='held'?'H':'';
  if(!selectedRes) return null;
  const meds = selectedRes.medications || [];
  const today_d = today.getDate();
ngth}/{
-bar-fi
olor:c.
ending'

 const givenCount = meds.filter(m=>getCell(selectedRes.id,m.name,String(today_d))==='
const pendingCount = meds.filter(m=>getCell(selectedRes.id,m.name,String(today_d))==
return (
  <div>
<div className='section-title'>Medication Administration Record (MAR) — {month} <div className='alert-banner blue'> Click each cell to cycle: Pending → Given
    <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap'}}>
      {residents.map(r=>(
        <button key={r.id} className={`btn ${selectedRes?.id===r.id?"btn-primary":"b
          {r.name.split(' ')[0]} (Rm {r.room})
        </button>
      ))}
</div>
    <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRad
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'
<div>
<div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color <div style={{fontSize:11,color:'var(--muted)'}}>Room {selectedRes.room} · <div style={{fontSize:11,color:'var(--amber)',marginTop:4}}>⚠ Allergies: {
        </div>
        <div style={{display:'flex',gap:10}}>
          <div style={{textAlign:'center',background:'rgba(34,211,165,.1)',border:'1
            <div style={{fontSize:18,fontWeight:800,color:'var(--green)',fontFamily:
            <div style={{fontSize:10,color:'var(--muted)'}}>Given today</div>
          </div>
          <div style={{textAlign:'center',background:'rgba(246,166,35,.1)',border:'1
            <div style={{fontSize:18,fontWeight:800,color:'var(--amber)',fontFamily:
            <div style={{fontSize:10,color:'var(--muted)'}}>Pending today</div>
          </div>
        </div>
      </div>
</div>
    <div className='mar-legend'>
      <div className='mar-legend-item'><div className='mar-dot' style={{background:'
      <div className='mar-legend-item'><div className='mar-dot' style={{background:'
      <div className='mar-legend-item'><div className='mar-dot' style={{background:'
      <div className='mar-legend-item'><div className='mar-dot' style={{background:'
</div>
    <div style={{overflowX:'auto'}}>
      <table style={{minWidth:900}}>
<thead> <tr>
 given')
='pendi
{year}< ✓ → Re
tn-ghos
ius:8,p
,flexWr
:'var(-
{select
selecte
px soli
'Syne,s
px soli
'Syne,s
var(--s
rgba(34
rgba(25
rgba(24
f

               <th style={{minWidth:200,textAlign:'left'}}>Medication</th>
              <th style={{minWidth:60}}>Freq</th>
              <th style={{minWidth:80}}>Time</th>
              {dayNums.map(d=>(
                <th key={d} style={{minWidth:38,textAlign:'center',color:Number(d)===t
                  {d}
</th> ))}
            </tr>
          </thead>
          <tbody>
            {meds.map((med,idx)=>(
              <tr key={idx} style={{background:idx%2===0?'transparent':'rgba(255,255,2
                <td>
                  <div style={{fontWeight:500,color:'var(--heading)',fontSize:12}}>{me
                  {med.special && <div style={{fontSize:10,color:'var(--amber)',margin
                  <div style={{fontSize:10,color:'var(--muted)'}}>{med.route}</div>
                </td>
                <td><span className={`badge ${med.freq==="PRN"?"badge-blue":"badge-gre
                <td style={{fontSize:11,color:'var(--muted)'}}>{med.time}</td>
                {dayNums.map(d=>{
                  const st=getCell(selectedRes.id,med.name,d);
                  const isPRN=med.freq==='PRN';
                  return (
                    <td key={d} style={{textAlign:'center',padding:'6px 4px'}}>
                      <div
                        className={`mar-cell ${isPRN&&st==="pending"?"na":st}`}
                        onClick={()=>cycleCell(selectedRes.id,med.name,d)}
                        title={`${med.name} — Day ${d}: ${st}`}
                      >
                        {st==='pending'&&!isPRN?'':cellIcon(st)}
</div> </td>
); })}
</tr> ))}
          </tbody>
        </table>
</div>
      <div style={{marginTop:16,padding:'12px 16px',background:'rgba(246,166,35,.07)',
           WAC 388-76-10315: All medications must be documented in the MAR at time of
      </div>
    </div>
); }
 oday_d?
55,.01)
d.name}
Top:2}}
en"}`}>
border:
admini
s

 // ─── TRAINING TRACKER ────────────────────────────────────────────────────────
function TrainingTracker({staff}) {
  const cols=[
    {key:'cpr',label:'CPR / BLS'},
    {key:'hca',label:'HCA / NA Cert'},
    {key:'food',label:'Food Handler'},
    {key:'dementia',label:'Dementia Training'},
  ];
  const alerts=[];
  staff.forEach(s=>cols.forEach(c=>{
    const d=daysUntil(s[c.key]);
    if(d<90) alerts.push({staff:s.name,cert:c.label,days:d,date:s[c.key]});
  }));
  alerts.sort((a,b)=>a.days-b.days);
  return (
    <div>
      <div className='section-title'>Training & Certification Tracker</div>
      {alerts.map((e,i)=>(
<div key={i} className={`alert-banner ${e.days<0?"red":"amber"}`}> <span>{e.days<0?' ':' '}</span>
<span><strong>{e.staff}</strong> — {e.cert} {e.days<0?`expired ${Math.abs(e.
</div> ))}
      <div className='table-wrap' style={{marginTop:16}}>
        <div className='table-head'><span>Staff Certification Matrix</span><span style
        <table>
          <thead><tr><th>Name</th><th>Role</th>{cols.map(c=><th key={c.key}>{c.label}<
          <tbody>{staff.map(s=>{
            const sts=cols.map(c=>certStatus(s[c.key]));
            const ov=sts.includes('expired')?'expired':sts.includes('expiring')?'expir
            return (
              <tr key={s.id}>
                <td style={{fontWeight:500,color:'var(--heading)'}}>{s.name}</td>
                <td style={{fontSize:11,color:'var(--muted)'}}>{s.role}</td>
                {cols.map(c=>(
                  <td key={c.key}>
                    <div>{certBadge(s[c.key])}</div>
                    <div style={{fontSize:9,color:'var(--muted)',marginTop:2}}>{s[c.ke
</td> ))}
<td>
{ov==='expired' ? <span className='badge badge-red'> Action Now</s :ov==='expiring'? <span className='badge badge-amber'>⚠ Renew Soon</ : <span className='badge badge-green'>✓ Current</span>}
   days)}
={{font
/th>)}<
ing':'c
y]}</di
pan> span>

 </td>
                <td style={{fontSize:10,color:'var(--muted)',maxWidth:200}}>{s.notes}<
              </tr>
            );
          })}</tbody>
        </table>
      </div>
</div> );
}
// ─── INCIDENT REPORTING ──────────────────────────────────────────────────────
function IncidentReporting({incidents, setIncidents, residents, sheetsLive}) {
  const [form,setForm]=useState({type:'',resident:'',date:'',severity:'minor',desc:'',
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
  const submit=async()=>{
    if(!form.type||!form.resident||!form.date) return;
    setSaving(true);
    const id=`INC-${new Date().getFullYear()}-${String(incidents.length+1).padStart(3,
    const row={...form,id};
    setIncidents(prev=>[row,...prev]);
    if(sheetsLive) await sheetsAppend(SHEETS_CONFIG.TABS.INCIDENTS,row);
    setForm({type:'',resident:'',date:'',severity:'minor',desc:'',dshs:'No'});
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),3000);
};
  return (
    <div className='two-col'>
<div>
<div className='section-title'>New Incident Report</div>
{saved && <div className='alert-banner green'>✓ Incident logged{sheetsLive?' a <div className='table-wrap'>
          <div className='table-head'><span>Incident Report Form</span><span>WAC 388-7
          <div className='form-grid'>
            <div><div className='field-label'>Type</div>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.va
                <option value=''>Select...</option>
                {['Fall','Medication Error','Elopement','Injury','Behavioral Incident'
              </select>
            </div>
            <div><div className='field-label'>Resident</div>
              <select value={form.resident} onChange={e=>setForm({...form,resident:e.t
                <option value=''>Select...</option>
/td>
dshs:'N
"0")}`;
nd save
6-10520
lue})}>
,'Hospi
arget.v

             {residents.map(r=><option key={r.id} value={r.name}>{r.name}</option>)
          </select>
        </div>
        <div><div className='field-label'>Date</div><input type='date' value={form
        <div><div className='field-label'>Severity</div>
          <select value={form.severity} onChange={e=>setForm({...form,severity:e.t
            {['minor','moderate','serious','critical'].map(s=><option key={s}>{s}<
          </select>
        </div>
      </div>
      <div style={{padding:'0 16px 12px'}}>
        <div className='field-label'>Description & Actions Taken</div>
        <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.va
      </div>
      <div style={{padding:'0 16px 12px',display:'flex',alignItems:'center',gap:12
        <div className='field-label' style={{marginBottom:0}}>Reported to DSHS?</d
        <select value={form.dshs} onChange={e=>setForm({...form,dshs:e.target.valu
          <option>No</option><option>Yes</option>
        </select>
        <div style={{flex:1}}/>
        <button className='btn btn-primary' onClick={submit} disabled={saving}>{sa
      </div>
      <div style={{padding:'0 16px 14px'}}>
        <div style={{background:'rgba(246,166,35,.07)',border:'1px solid rgba(246,
             Serious incidents must be reported to DSHS within <strong>24 hours</s
        </div>
      </div>
    </div>
  </div>
  <div>
    <div className='section-title'>Incident Log ({incidents.length})</div>
    {incidents.map(inc=>(
      <div key={inc.id} className='incident-card'>
        <div className='incident-header'>
          <div><div className='incident-id'>{inc.id}</div><div className='incident
          <span className={`badge badge-${inc.severity==="critical"||inc.severity=
        </div>
        <div className='incident-meta'>{inc.resident} · {inc.date}</div>
        {inc.desc && <div style={{marginTop:6,fontSize:11,color:'var(--muted)',lin
        <div style={{marginTop:8,display:'flex',gap:6,flexWrap:'wrap'}}>
          <span className='badge badge-green'>Logged</span>
          {inc.dshs==='Yes'?<span className='badge badge-green'>DSHS Filed</span>:
        </div>
</div> ))}
  </div>
</div>
 }
.date}
arget.v
/option
lue})}
,flexWr
iv>
e})} st
ving?'S
166,35,
trong>
-type'>
=="seri
eHeight
<span c

 ); }
// ─── WAC REFERENCE ───────────────────────────────────────────────────────────
function WACReference() {
  const [search,setSearch]=useState('');
  const filtered=WAC_REFS.filter(w=>
    w.code.toLowerCase().includes(search.toLowerCase())||
    w.title.toLowerCase().includes(search.toLowerCase())||
    w.desc.toLowerCase().includes(search.toLowerCase())
); return (
    <div>
      <div className='section-title'>DSHS / WAC Compliance Cross-Reference</div>
      <div className='metrics-grid' style={{marginBottom:20}}>
        <div className='metric-card green'><div className='metric-label'>Compliant</di
        <div className='metric-card amber'><div className='metric-label'>Needs Review<
        <div className='metric-card blue'><div className='metric-label'>Total Sections
      </div>
      <div style={{marginBottom:16}}><input placeholder='Search WAC code, title, or ke
      {filtered.map(w=>(
        <div key={w.code} className='wac-card'>
          <div className='wac-code'>{w.code}</div>
          <div className='wac-title'>{w.title}</div>
          <div className='wac-desc'>{w.desc}</div>
          <div style={{marginTop:10}}>{w.status==='compliant'?<span className='badge b
</div> ))}
</div> );
}
// ─── SETUP GUIDE ─────────────────────────────────────────────────────────────
function SetupGuide() {
  return (
<div>
<div className='section-title'>Google Sheets Setup Guide</div>
<div className='alert-banner blue'> Follow these steps once to connect your li {[
        {step:'1',title:'Create your Google Spreadsheet',desc:'Go to sheets.google.com
        {step:'2',title:'Open Google Apps Script',desc:'In your spreadsheet go to Exte
        {step:'3',title:'Paste the backend script',desc:'Copy the contents of APPS_SCR
        {step:'4',title:'Deploy as Web App',desc:'Click Deploy then New Deployment. Se
        {step:'5',title:'Add environment variables in Vercel',desc:'Go to your Vercel
        {step:'6',title:'You are live!',desc:'Refresh the app. The sync indicator in t
 v><div
/div><d
</div><
yword..
adge-gr
ve Goo
 and cr
nsions
IPT.gs
lect We
project
he top
g

       ].map(s=>(
        <div key={s.step} style={{display:'flex',gap:16,marginBottom:16}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'var(--amber)'
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borde
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color
            <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.7}}>{s.desc}</d
          </div>
        </div>
))} </div>
); }
// ─── APP SHELL ───────────────────────────────────────────────────────────────
const TABS = [
  {id:'dashboard',
  {id:'inspection',
  {id:'charts',
  {id:'mar',
  {id:'training',
  {id:'incidents',
  {id:'wac',
  {id:'setup',
];
label:' Command Center'}, label:' Inspection'}, label:' Resident Charts'}, label:' MAR'},
label:' Training'}, label:' Incidents'}, label:' WAC Reference'}, label:' Setup Guide'},
        export default function App() {
  const [tab,setTab]=useState('dashboard');
  const [residents,setResidents]=useState(DEFAULT_RESIDENTS);
  const [staff,setStaff]=useState(DEFAULT_STAFF);
  const [incidents,setIncidents]=useState(DEFAULT_INCIDENTS);
  const [sheetsLive,setSheetsLive]=useState(false);
  useEffect(()=>{
    async function load() {
      if(!SHEETS_CONFIG.SHEET_API_URL) return;
      const [r,s,inc]=await Promise.all([
        sheetsRead(SHEETS_CONFIG.TABS.RESIDENTS),
        sheetsRead(SHEETS_CONFIG.TABS.STAFF),
        sheetsRead(SHEETS_CONFIG.TABS.INCIDENTS),
      ]);
      if(r&&r.length){setResidents(r);setSheetsLive(true);}
      if(s&&s.length){setStaff(s);setSheetsLive(true);}
      if(inc&&inc.length){setIncidents(inc);setSheetsLive(true);}
}
    load();
  },[]);
,color:
rRadius
:'var(-
iv>

 const fail=INSPECTION_ITEMS.filter(i=>i.status==='fail').length;
const warn=INSPECTION_ITEMS.filter(i=>i.status==='warn').length;
const score=Math.round((INSPECTION_ITEMS.filter(i=>i.status==='pass').length/INSPECT
const expiredStaff=DEFAULT_STAFF.filter(s=>certStatus(s.hca)==='expired'||certStatus
return ( <>
    <style>{STYLE}</style>
    <div className='app'>
      <div className='topbar'>
        <div className='topbar-brand'>
          <div className='brand-dot'/>
          <div>
            <div className='brand-name'>Daima AFH — Command Center</div>
            <div className='brand-sub'>11419 N Astor Rd, Spokane WA · DSHS / WAC 388
          </div>
        </div>
        <div className='topbar-status'>
<span className={`status-pill ${score>=90?"green":score>=75?"amber":"red"} {fail>0 && <span className='status-pill red'>{fail} Critical</span>} {warn>0 && <span className='status-pill amber'>{warn} Warnings</span>} {expiredStaff>0 && <span className='status-pill red'> {expiredStaff} Cer <span className={`status-pill ${sheetsLive?"green":"amber"}`}>{sheetsLive?
        </div>
      </div>
      <div className='nav'>
        {TABS.map(t=>(
          <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick
        ))}
      </div>
      <div className='main'>
        <SyncBar live={sheetsLive}/>
        {tab==='dashboard'  && <Dashboard residents={residents} incidents={incidents
        {tab==='inspection' && <InspectionDashboard/>}
 && <ResidentCharts residents={residents}/>}
&& <MARModule residents={residents}/>}
&& <TrainingTracker staff={staff}/>}
{tab==='charts'
{tab==='mar'
{tab==='training'
{tab==='incidents'  && <IncidentReporting incidents={incidents} setIncidents
          {tab==='wac'
          {tab==='setup'
        </div>
</div> </>
); }
&& <WACReference/>}
&& <SetupGuide/>}
ION_ITE
(s.cpr)
-76</di
`}>Scor
ts Exp '● Shee
={()=>s
} staff
={setIn
i

 
