/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { sheetsRead, sheetsAppend, SHEETS_CONFIG } from "./sheetsConfig";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#07090f; --surface:#0d1117; --card:#111820; --border:#1e2d3d;
    --amber:#f6a623; --green:#22d3a5; --red:#ff4d6a; --blue:#4fa3e0;
    --muted:#4a5568; --text:#cdd9e5; --heading:#e6edf3;
  }
  body { background:var(--bg); font-family:'DM Mono',monospace; color:var(--text); }
  .app { min-height:100vh; display:flex; flex-direction:column; }
  .topbar { background:var(--surface); border-bottom:1px solid var(--border); padding:0 28px; height:56px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .brand-dot { width:10px; height:10px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .brand-name { font-family:'Syne',sans-serif; font-weight:800; font-size:15px; letter-spacing:.08em; color:var(--heading); text-transform:uppercase; }
  .brand-sub { font-size:10px; color:var(--muted); letter-spacing:.12em; }
  .topbar-brand { display:flex; align-items:center; gap:10px; }
  .topbar-status { display:flex; gap:8px; }
  .status-pill { padding:3px 10px; border-radius:20px; border:1px solid var(--border); font-size:10px; letter-spacing:.1em; }
  .status-pill.green { border-color:var(--green); color:var(--green); }
  .status-pill.amber { border-color:var(--amber); color:var(--amber); }
  .status-pill.red   { border-color:var(--red);   color:var(--red); }
  .nav { background:var(--surface); border-bottom:1px solid var(--border); display:flex; padding:0 28px; overflow-x:auto; }
  .nav-tab { padding:12px 20px; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:all .2s; background:none; border-left:none; border-right:none; border-top:none; }
  .nav-tab:hover { color:var(--text); }
  .nav-tab.active { color:var(--amber); border-bottom-color:var(--amber); }
  .main { padding:28px; flex:1; }
  .section-title { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--muted); margin-bottom:16px; display:flex; align-items:center; gap:10px; }
  .section-title::after { content:''; flex:1; height:1px; background:var(--border); }
  .metrics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-bottom:28px; }
  .metric-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; position:relative; overflow:hidden; }
  .metric-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .metric-card.green::before { background:var(--green); }
  .metric-card.amber::before { background:var(--amber); }
  .metric-card.red::before   { background:var(--red); }
  .metric-card.blue::before  { background:var(--blue); }
  .metric-label { font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; margin-bottom:8px; }
  .metric-value { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; line-height:1; margin-bottom:4px; }
  .metric-card.green .metric-value { color:var(--green); }
  .metric-card.amber .metric-value { color:var(--amber); }
  .metric-card.red   .metric-value { color:var(--red); }
  .metric-card.blue  .metric-value { color:var(--blue); }
  .metric-sub { font-size:10px; color:var(--muted); }
  .table-wrap { background:var(--card); border:1px solid var(--border); border-radius:8px; overflow:hidden; margin-bottom:24px; }
  .table-head { padding:12px 16px; background:var(--surface); border-bottom:1px solid var(--border); font-size:11px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; display:flex; justify-content:space-between; align-items:center; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  thead th { padding:10px 16px; text-align:left; font-size:10px; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; border-bottom:1px solid var(--border); background:var(--surface); }
  tbody tr { border-bottom:1px solid var(--border); transition:background .15s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:rgba(255,255,255,.02); }
  td { padding:11px 16px; color:var(--text); }
  .badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; letter-spacing:.08em; font-weight:500; text-transform:uppercase; }
  .badge-green { background:rgba(34,211,165,.12); color:var(--green); border:1px solid rgba(34,211,165,.25); }
  .badge-amber { background:rgba(246,166,35,.12); color:var(--amber); border:1px solid rgba(246,166,35,.25); }
  .badge-red   { background:rgba(255,77,106,.12); color:var(--red);   border:1px solid rgba(255,77,106,.25); }
  .badge-blue  { background:rgba(79,163,224,.12); color:var(--blue);  border:1px solid rgba(79,163,224,.25); }
  .progress-bar-bg { background:var(--border); border-radius:4px; height:6px; overflow:hidden; width:100%; }
  .progress-bar-fill { height:100%; border-radius:4px; transition:width .6s ease; }
  .checklist { display:flex; flex-direction:column; gap:2px; }
  .check-item { display:flex; align-items:center; gap:10px; padding:10px 16px; border-radius:6px; cursor:pointer; transition:background .15s; font-size:12px; }
  .check-item:hover { background:rgba(255,255,255,.03); }
  .check-box { width:16px; height:16px; border-radius:3px; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
  .check-box.checked { background:var(--green); border-color:var(--green); }
  .check-box.checked::after { content:'✓'; font-size:10px; color:#07090f; font-weight:700; }
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
  .alert-banner { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:6px; margin-bottom:12px; font-size:12px; }
  .alert-banner.red   { background:rgba(255,77,106,.1); border:1px solid rgba(255,77,106,.3); color:#ff8fa3; }
  .alert-banner.amber { background:rgba(246,166,35,.1); border:1px solid rgba(246,166,35,.3); color:#f6c95a; }
  .alert-banner.green { background:rgba(34,211,165,.1); border:1px solid rgba(34,211,165,.3); color:var(--green); }
  .alert-banner.blue  { background:rgba(79,163,224,.1); border:1px solid rgba(79,163,224,.3); color:var(--blue); }
  .wac-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; transition:border-color .2s; }
  .wac-card:hover { border-color:var(--blue); }
  .wac-code { font-size:11px; color:var(--blue); letter-spacing:.1em; margin-bottom:4px; }
  .wac-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--heading); margin-bottom:6px; }
  .wac-desc { font-size:11px; color:var(--muted); line-height:1.6; }
  .two-col { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  @media(max-width:900px) { .two-col { grid-template-columns:1fr; } .form-grid { grid-template-columns:1fr; } }
  .incident-card { background:var(--card); border:1px solid var(--border); border-radius:8px; padding:16px; margin-bottom:10px; }
  .incident-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; }
  .incident-id { font-size:10px; color:var(--muted); letter-spacing:.1em; }
  .incident-type { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--heading); }
  .incident-meta { font-size:11px; color:var(--muted); margin-top:4px; }
  .sync-bar { font-size:10px; color:var(--muted); display:flex; align-items:center; gap:6px; padding:6px 0 14px; }
  .sync-dot { width:6px; height:6px; border-radius:50%; }
  .sync-dot.live { background:var(--green); box-shadow:0 0 6px var(--green); }
  .sync-dot.local { background:var(--amber); }
  ::-webkit-scrollbar { width:6px; height:6px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
`;

const DEFAULT_RESIDENTS = [
  { id:"R-001", name:"Margaret T.", room:"101", admission:"2024-03-12", level:"Level 3", physician:"Dr. Okonkwo", chartComplete:87, flags:"Med review due" },
  { id:"R-002", name:"Robert H.",   room:"102", admission:"2023-11-05", level:"Level 2", physician:"Dr. Patel",   chartComplete:100, flags:"" },
  { id:"R-003", name:"Dorothy W.",  room:"103", admission:"2024-06-22", level:"Level 4", physician:"Dr. Nguyen",  chartComplete:72,  flags:"Care plan update,TB test due" },
  { id:"R-004", name:"James B.",    room:"104", admission:"2022-08-14", level:"Level 3", physician:"Dr. Okonkwo", chartComplete:95,  flags:"Annual physical due" },
  { id:"R-005", name:"Helen C.",    room:"105", admission:"2024-09-01", level:"Level 2", physician:"Dr. Kim",     chartComplete:58,  flags:"Admission docs missing,Financial disclosure" },
];
const DEFAULT_STAFF = [
  { id:"S-001", name:"Amara N.",  role:"Caregiver",      hired:"2022-05-10", cpr:"2025-08-01", hca:"2026-01-15", food:"2026-03-01", dementia:"2027-01-10" },
  { id:"S-002", name:"Kevin O.",  role:"Caregiver",      hired:"2023-02-20", cpr:"2024-11-15", hca:"2025-04-01", food:"2025-02-14", dementia:"2026-06-20" },
  { id:"S-003", name:"Priya S.",  role:"Lead Caregiver", hired:"2021-09-01", cpr:"2026-09-01", hca:"2026-09-01", food:"2026-08-12", dementia:"2027-09-01" },
  { id:"S-004", name:"David M.",  role:"Caregiver",      hired:"2024-01-08", cpr:"2024-07-08", hca:"2025-01-08", food:"2025-11-20", dementia:"2026-01-08" },
  { id:"S-005", name:"Fatima A.", role:"Relief Staff",   hired:"2023-07-15", cpr:"2025-07-15", hca:"2025-10-30", food:"2025-06-01", dementia:"2026-07-15" },
];
const DEFAULT_INCIDENTS = [
  { id:"INC-2024-018", type:"Fall",             resident:"Robert H.",  date:"2024-11-28", severity:"minor",    dshs:"No",  desc:"Resident slipped in bathroom. No injury. Safety mat added." },
  { id:"INC-2024-019", type:"Medication Error", resident:"Helen C.",   date:"2024-12-03", severity:"moderate", dshs:"Yes", desc:"PM dose administered twice. Physician notified. No adverse effect." },
  { id:"INC-2025-001", type:"Elopement",        resident:"Dorothy W.", date:"2025-01-11", severity:"serious",  dshs:"Yes", desc:"Resident found in front yard at 6am. Door alarm installed." },
];
const CHART_CHECKLIST = [
  { id:"c1",  text:"Admission Agreement signed",         wac:"WAC 388-76-10200" },
  { id:"c2",  text:"Resident Rights form acknowledged",  wac:"WAC 388-76-10205" },
  { id:"c3",  text:"Initial Resident Assessment (ISP)",  wac:"WAC 388-76-10300" },
  { id:"c4",  text:"Physician orders on file",           wac:"WAC 388-76-10310" },
  { id:"c5",  text:"Current medication list (signed)",   wac:"WAC 388-76-10315" },
  { id:"c6",  text:"Dietary/allergy documentation",      wac:"WAC 388-76-10320" },
  { id:"c7",  text:"Emergency contact info verified",    wac:"WAC 388-76-10205" },
  { id:"c8",  text:"TB test/clearance on file",          wac:"WAC 388-76-10160" },
  { id:"c9",  text:"Annual physical (within 12 months)", wac:"WAC 388-76-10310" },
  { id:"c10", text:"Care plan reviewed & updated",       wac:"WAC 388-76-10300" },
  { id:"c11", text:"Advance Directive / POLST on file",  wac:"WAC 388-76-10210" },
  { id:"c12", text:"Financial agreement documented",     wac:"WAC 388-76-10200" },
];
const INSPECTION_ITEMS = [
  { category:"Personnel Files", item:"All staff credentials verified",       status:"pass" },
  { category:"Personnel Files", item:"Background check records on file",     status:"pass" },
  { category:"Personnel Files", item:"HCA training certificates current",    status:"warn" },
  { category:"Resident Care",   item:"ISPs current for all residents",       status:"warn" },
  { category:"Resident Care",   item:"Medication management logs complete",  status:"pass" },
  { category:"Resident Care",   item:"Dignity & rights policies posted",     status:"pass" },
  { category:"Home Safety",     item:"Fire drill log (2x per year)",         status:"pass" },
  { category:"Home Safety",     item:"Carbon monoxide detectors tested",     status:"pass" },
  { category:"Home Safety",     item:"Emergency evacuation plan posted",     status:"fail" },
  { category:"Home Safety",     item:"First aid kit stocked & accessible",   status:"pass" },
  { category:"Medications",     item:"Controlled substance log verified",    status:"pass" },
  { category:"Medications",     item:"Medications stored securely (locked)", status:"pass" },
  { category:"Medications",     item:"MAR documentation complete",           status:"warn" },
  { category:"Food Service",    item:"Food handler cards on file",           status:"warn" },
  { category:"Food Service",    item:"Fridge/freezer temps logged",          status:"fail" },
  { category:"Documentation",   item:"Incident reports filed within 24h",   status:"pass" },
  { category:"Documentation",   item:"Activity log maintained",              status:"pass" },
  { category:"Documentation",   item:"Resident grievance procedure posted",  status:"pass" },
];
const WAC_REFS = [
  { code:"WAC 388-76-10100", title:"Licensing Requirements",        desc:"AFH must be licensed by DSHS before providing care. License must be posted prominently.", status:"compliant" },
  { code:"WAC 388-76-10155", title:"Provider Qualifications",       desc:"Provider must complete 75-hour basic training, CPR/First Aid, food handler cert, and dementia training.", status:"compliant" },
  { code:"WAC 388-76-10160", title:"Employee Requirements",         desc:"All caregivers must meet background check, TB screening, HCA registration, and training requirements.", status:"warning" },
  { code:"WAC 388-76-10200", title:"Admission Agreement",           desc:"Written admission agreement required prior to or on day of admission.", status:"compliant" },
  { code:"WAC 388-76-10300", title:"Individual Service Plan (ISP)", desc:"ISP must be developed within 30 days of admission and reviewed annually.", status:"warning" },
  { code:"WAC 388-76-10310", title:"Health Monitoring",             desc:"Provider must monitor and document residents health conditions.", status:"compliant" },
  { code:"WAC 388-76-10315", title:"Medication Management",         desc:"Medications must be stored securely and documented on a MAR.", status:"compliant" },
  { code:"WAC 388-76-10400", title:"Physical Environment",          desc:"Home must meet safety, sanitation, and fire protection standards.", status:"warning" },
  { code:"WAC 388-76-10520", title:"Incident Reporting",            desc:"Reportable incidents must be reported to DSHS within 24 hours.", status:"compliant" },
  { code:"WAC 388-76-10205", title:"Resident Rights",               desc:"Provider must ensure residents rights including privacy, dignity, and grievance process.", status:"compliant" },
];

function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function certStatus(d) { const n=daysUntil(d); return n<0?"expired":n<60?"expiring":"current"; }
function certBadge(d) {
  const s=certStatus(d);
  return s==="expired" ? <span className="badge badge-red">Expired</span>
       : s==="expiring"? <span className="badge badge-amber">Exp Soon</span>
       : <span className="badge badge-green">Current</span>;
}
function pColor(p) { return p>=90?"#22d3a5":p>=70?"#f6a623":"#ff4d6a"; }

function SyncBar({live}) {
  return (
    <div className="sync-bar">
      <div className={`sync-dot ${live?"live":"local"}`}/>
      {live?<span>Live — syncing with Google Sheets</span>:<span>Local mode — connect Google Sheets to persist data</span>}
    </div>
  );
}

function Dashboard({residents,incidents,staff}) {
  const pass=INSPECTION_ITEMS.filter(i=>i.status==="pass").length;
  const fail=INSPECTION_ITEMS.filter(i=>i.status==="fail").length;
  const warn=INSPECTION_ITEMS.filter(i=>i.status==="warn").length;
  const score=Math.round((pass/INSPECTION_ITEMS.length)*100);
  const expd=staff.filter(s=>certStatus(s.cpr)==="expired"||certStatus(s.hca)==="expired").length;
  const expg=staff.filter(s=>certStatus(s.cpr)==="expiring"||certStatus(s.hca)==="expiring").length;
  const avg=residents.length?Math.round(residents.reduce((a,r)=>a+Number(r.chartComplete),0)/residents.length):0;
  return (
    <div>
      {fail>0&&<div className="alert-banner red">🚨 <span><strong>{fail} critical item{fail>1?"s":""}</strong> require immediate attention.</span></div>}
      {expd>0&&<div className="alert-banner red">⛔ <span><strong>{expd} staff member{expd>1?"s":""}</strong> have expired certifications.</span></div>}
      {expg>0&&<div className="alert-banner amber">⚠️ <span><strong>{expg} staff member{expg>1?"s":""}</strong> expiring within 60 days.</span></div>}
      <div className="section-title">Command Overview</div>
      <div className="metrics-grid">
        <div className={`metric-card ${score>=90?"green":score>=75?"amber":"red"}`}>
          <div className="metric-label">Inspection Score</div>
          <div className="metric-value">{score}%</div>
          <div className="metric-sub">{pass}/{INSPECTION_ITEMS.length} passing</div>
        </div>
        <div className="metric-card red">
          <div className="metric-label">Critical Fails</div>
          <div className="metric-value">{fail}</div>
          <div className="metric-sub">Immediate action needed</div>
        </div>
        <div className="metric-card amber">
          <div className="metric-label">Warnings</div>
          <div className="metric-value">{warn}</div>
          <div className="metric-sub">Needs attention</div>
        </div>
        <div className="metric-card blue">
          <div className="metric-label">Residents</div>
          <div className="metric-value">{residents.length}</div>
          <div className="metric-sub">Active / Max 6</div>
        </div>
        <div className={`metric-card ${avg>=90?"green":"amber"}`}>
          <div className="metric-label">Avg Chart Score</div>
          <div className="metric-value">{avg}%</div>
          <div className="metric-sub">Documentation</div>
        </div>
        <div className={`metric-card ${expd>0?"red":expg>0?"amber":"green"}`}>
          <div className="metric-label">Staff Credentials</div>
          <div className="metric-value">{staff.length-expd-expg}/{staff.length}</div>
          <div className="metric-sub">Fully current</div>
        </div>
      </div>
      <div className="two-col">
        <div>
          <div className="section-title">Readiness by Category</div>
          {[...new Set(INSPECTION_ITEMS.map(i=>i.category))].map(cat=>{
            const items=INSPECTION_ITEMS.filter(i=>i.category===cat);
            const p=Math.round((items.filter(i=>i.status==="pass").length/items.length)*100);
            return (
              <div key={cat} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:5}}>
                  <span>{cat}</span><span style={{color:pColor(p)}}>{p}%</span>
                </div>
                <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:p+"%",background:pColor(p)}}/></div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="section-title">Recent Incidents</div>
          {incidents.slice(0,3).map(inc=>(
            <div key={inc.id} className="incident-card" style={{marginBottom:8}}>
              <div className="incident-header">
                <div><div className="incident-id">{inc.id}</div><div className="incident-type">{inc.type}</div></div>
                <span className={`badge badge-${inc.severity==="serious"||inc.severity==="critical"?"red":inc.severity==="moderate"?"amber":"blue"}`}>{inc.severity}</span>
              </div>
              <div className="incident-meta">{inc.resident} · {inc.date}</div>
              <div style={{marginTop:6,fontSize:11,color:"var(--muted)"}}>{inc.desc}</div>
              <div style={{marginTop:8}}>{inc.dshs==="Yes"?<span className="badge badge-green">DSHS Filed</span>:<span className="badge badge-amber">DSHS Pending</span>}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InspectionDashboard() {
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?INSPECTION_ITEMS:INSPECTION_ITEMS.filter(i=>i.status===filter);
  const categories=[...new Set(INSPECTION_ITEMS.map(i=>i.category))];
  return (
    <div>
      <div className="section-title">Inspection Readiness Dashboard</div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","pass","warn","fail"].map(f=>(
          <button key={f} className={`btn ${filter===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilter(f)} style={{fontSize:10}}>
            {f==="all"?"All":f==="pass"?"✓ Pass":f==="warn"?"⚠ Warn":"✗ Critical"}
          </button>
        ))}
      </div>
      {categories.map(cat=>{
        const items=filtered.filter(i=>i.category===cat);
        if(!items.length) return null;
        const all=INSPECTION_ITEMS.filter(i=>i.category===cat);
        return (
          <div key={cat} className="table-wrap" style={{marginBottom:16}}>
            <div className="table-head"><span>{cat}</span><span>{all.filter(i=>i.status==="pass").length}/{all.length} passing</span></div>
            <table><tbody>{items.map((item,idx)=>(
              <tr key={idx}>
                <td style={{width:24,paddingRight:0,color:item.status==="pass"?"var(--green)":item.status==="warn"?"var(--amber)":"var(--red)"}}>{item.status==="pass"?"✓":item.status==="warn"?"⚠":"✗"}</td>
                <td>{item.item}</td>
                <td style={{textAlign:"right"}}>{item.status==="pass"?<span className="badge badge-green">Pass</span>:item.status==="warn"?<span className="badge badge-amber">Attention</span>:<span className="badge badge-red">Critical</span>}</td>
              </tr>
            ))}</tbody></table>
          </div>
        );
      })}
    </div>
  );
}

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
  if(!selected) return <div style={{color:"var(--muted)",padding:20}}>No residents loaded.</div>;
  const cur=checks[selected.id]||[];
  const pct=cur.length?Math.round((cur.filter(c=>c.done).length/cur.length)*100):0;
  return (
    <div className="two-col">
      <div>
        <div className="section-title">Residents</div>
        {residents.map(r=>{
          const rc=checks[r.id]||[];
          const p=rc.length?Math.round((rc.filter(c=>c.done).length/rc.length)*100):0;
          const flags=r.flags?r.flags.split(",").filter(Boolean):[];
          return (
            <div key={r.id} onClick={()=>setSelected(r)} style={{background:selected?.id===r.id?"rgba(246,166,35,.08)":"var(--card)",border:`1px solid ${selected?.id===r.id?"var(--amber)":"var(--border)"}`,borderRadius:8,padding:"12px 16px",marginBottom:8,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,color:"var(--heading)"}}>{r.name}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Room {r.room} · {r.level}</div>
                </div>
                <span style={{fontSize:14,fontWeight:800,color:pColor(p),fontFamily:"Syne,sans-serif"}}>{p}%</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:p+"%",background:pColor(p)}}/></div>
              {flags.length>0&&<div style={{marginTop:8,display:"flex",gap:4,flexWrap:"wrap"}}>{flags.map(f=><span key={f} className="badge badge-amber">{f}</span>)}</div>}
            </div>
          );
        })}
      </div>
      <div>
        <div className="section-title">{selected.name} — Chart Checklist</div>
        <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 16px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12}}>
            <span style={{color:"var(--muted)"}}>Completeness</span>
            <span style={{color:pColor(pct),fontWeight:700}}>{cur.filter(c=>c.done).length}/{cur.length} — {pct}%</span>
          </div>
          <div className="progress-bar-bg" style={{height:8}}><div className="progress-bar-fill" style={{width:pct+"%",background:pColor(pct)}}/></div>
        </div>
        <div className="checklist">
          {cur.map(c=>(
            <div key={c.id} className="check-item" onClick={()=>toggle(c.id)}>
              <div className={`check-box ${c.done?"checked":""}`}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,textDecoration:c.done?"line-through":"none",color:c.done?"var(--muted)":"var(--text)"}}>{c.text}</div>
                <div className="check-wac">{c.wac}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingTracker({staff}) {
  const cols=[{key:"cpr",label:"CPR / First Aid"},{key:"hca",label:"HCA Registration"},{key:"food",label:"Food Handler"},{key:"dementia",label:"Dementia Training"}];
  const alerts=[];
  staff.forEach(s=>cols.forEach(c=>{const d=daysUntil(s[c.key]);if(d<60)alerts.push({staff:s.name,cert:c.label,days:d,date:s[c.key]});}));
  alerts.sort((a,b)=>a.days-b.days);
  return (
    <div>
      <div className="section-title">Training Renewal Tracker</div>
      {alerts.map((e,i)=>(
        <div key={i} className={`alert-banner ${e.days<0?"red":"amber"}`}>
          <span>{e.days<0?"⛔":"⚠️"}</span>
          <span><strong>{e.staff}</strong> — {e.cert} {e.days<0?`expired ${Math.abs(e.days)} days ago`:`expires in ${e.days} days`} ({e.date})</span>
        </div>
      ))}
      <div className="table-wrap">
        <div className="table-head"><span>Staff Certification Matrix</span><span style={{fontSize:10}}>WAC 388-76-10155 / 10160</span></div>
        <table>
          <thead><tr><th>Name</th><th>Role</th>{cols.map(c=><th key={c.key}>{c.label}</th>)}<th>Status</th></tr></thead>
          <tbody>{staff.map(s=>{
            const sts=cols.map(c=>certStatus(s[c.key]));
            const ov=sts.includes("expired")?"expired":sts.includes("expiring")?"expiring":"current";
            return (
              <tr key={s.id}>
                <td style={{fontWeight:500,color:"var(--heading)"}}>{s.name}</td>
                <td style={{fontSize:11,color:"var(--muted)"}}>{s.role}</td>
                {cols.map(c=><td key={c.key}><div>{certBadge(s[c.key])}</div><div style={{fontSize:9,color:"var(--muted)",marginTop:2}}>{s[c.key]}</div></td>)}
                <td>{ov==="expired"?<span className="badge badge-red">⛔ Action Required</span>:ov==="expiring"?<span className="badge badge-amber">⚠ Renew Soon</span>:<span className="badge badge-green">✓ Current</span>}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

function IncidentReporting({incidents,setIncidents,residents,sheetsLive}) {
  const [form,setForm]=useState({type:"",resident:"",date:"",severity:"minor",desc:"",dshs:"No"});
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
  const submit=async()=>{
    if(!form.type||!form.resident||!form.date) return;
    setSaving(true);
    const id=`INC-${new Date().getFullYear()}-${String(incidents.length+1).padStart(3,"0")}`;
    const row={...form,id};
    setIncidents(prev=>[row,...prev]);
    if(sheetsLive) await sheetsAppend(SHEETS_CONFIG.TABS.INCIDENTS,row);
    setForm({type:"",resident:"",date:"",severity:"minor",desc:"",dshs:"No"});
    setSaving(false);setSaved(true);
    setTimeout(()=>setSaved(false),3000);
  };
  return (
    <div className="two-col">
      <div>
        <div className="section-title">New Incident Report</div>
        {saved&&<div className="alert-banner green">✓ Incident logged{sheetsLive?" and saved to Google Sheets":""}.</div>}
        <div className="table-wrap">
          <div className="table-head"><span>Incident Report Form</span><span>WAC 388-76-10520</span></div>
          <div className="form-grid">
            <div><div className="field-label">Type</div>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                <option value="">Select...</option>
                {["Fall","Medication Error","Elopement","Injury","Behavioral Incident","Hospitalization","Death","Abuse/Neglect Report","Property Damage","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><div className="field-label">Resident</div>
              <select value={form.resident} onChange={e=>setForm({...form,resident:e.target.value})}>
                <option value="">Select...</option>
                {residents.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <div><div className="field-label">Date</div><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
            <div><div className="field-label">Severity</div>
              <select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}>
                {["minor","moderate","serious","critical"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{padding:"0 16px 12px"}}>
            <div className="field-label">Description & Actions Taken</div>
            <textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="What happened, immediate response, corrective actions..."/>
          </div>
          <div style={{padding:"0 16px 12px",display:"flex",alignItems:"center",gap:12}}>
            <div className="field-label" style={{marginBottom:0}}>Reported to DSHS?</div>
            <select value={form.dshs} onChange={e=>setForm({...form,dshs:e.target.value})} style={{width:"auto"}}>
              <option>No</option><option>Yes</option>
            </select>
            <div style={{flex:1}}/>
            <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving?"Saving...":"Log Incident"}</button>
          </div>
          <div style={{padding:"0 16px 14px"}}>
            <div style={{background:"rgba(246,166,35,.07)",border:"1px solid rgba(246,166,35,.2)",borderRadius:6,padding:"10px 12px",fontSize:11,color:"#f6c95a"}}>
              ⏱ Serious incidents must be reported to DSHS within <strong>24 hours</strong> (WAC 388-76-10520)
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="section-title">Incident Log ({incidents.length})</div>
        {incidents.map(inc=>(
          <div key={inc.id} className="incident-card">
            <div className="incident-header">
              <div><div className="incident-id">{inc.id}</div><div className="incident-type">{inc.type}</div></div>
              <span className={`badge badge-${inc.severity==="critical"||inc.severity==="serious"?"red":inc.severity==="moderate"?"amber":"blue"}`}>{inc.severity}</span>
            </div>
            <div className="incident-meta">{inc.resident} · {inc.date}</div>
            {inc.desc&&<div style={{marginTop:6,fontSize:11,color:"var(--muted)",lineHeight:1.5}}>{inc.desc}</div>}
            <div style={{marginTop:8,display:"flex",gap:6}}>
              <span className="badge badge-green">Logged</span>
              {inc.dshs==="Yes"?<span className="badge badge-green">DSHS Filed</span>:<span className="badge badge-amber">DSHS Pending</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WACReference() {
  const [search,setSearch]=useState("");
  const filtered=WAC_REFS.filter(w=>w.code.toLowerCase().includes(search.toLowerCase())||w.title.toLowerCase().includes(search.toLowerCase())||w.desc.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="section-title">DSHS / WAC Compliance Cross-Reference</div>
      <div className="metrics-grid" style={{marginBottom:20}}>
        <div className="metric-card green"><div className="metric-label">Compliant</div><div className="metric-value">{WAC_REFS.filter(w=>w.status==="compliant").length}</div></div>
        <div className="metric-card amber"><div className="metric-label">Needs Review</div><div className="metric-value">{WAC_REFS.filter(w=>w.status==="warning").length}</div></div>
        <div className="metric-card blue"><div className="metric-label">Total Sections</div><div className="metric-value">{WAC_REFS.length}</div></div>
      </div>
      <div style={{marginBottom:16}}><input placeholder="Search WAC code, title, or keyword..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {filtered.map(w=>(
        <div key={w.code} className="wac-card">
          <div className="wac-code">{w.code}</div>
          <div className="wac-title">{w.title}</div>
          <div className="wac-desc">{w.desc}</div>
          <div style={{marginTop:10}}>{w.status==="compliant"?<span className="badge badge-green">✓ Compliant</span>:<span className="badge badge-amber">⚠ Needs Review</span>}</div>
        </div>
      ))}
    </div>
  );
}

function SetupGuide() {
  return (
    <div>
      <div className="section-title">Google Sheets Setup Guide</div>
      <div className="alert-banner blue">📋 Follow these steps once to connect your live Google Sheets backend.</div>
      {[
        {step:"1",title:"Create your Google Spreadsheet",desc:'Go to sheets.google.com and create a new spreadsheet named "Daima AFH Command Center". Create 4 tabs: Residents, Staff, Incidents, Checklist.'},
        {step:"2",title:"Open Google Apps Script",desc:"In your spreadsheet go to Extensions then Apps Script. Delete any default code."},
        {step:"3",title:"Paste the backend script",desc:"Copy the contents of APPS_SCRIPT.gs from your download and paste into the Apps Script editor. Replace PASTE_YOUR_SPREADSHEET_ID_HERE with your actual ID."},
        {step:"4",title:"Deploy as Web App",desc:"Click Deploy then New Deployment. Select Web app. Execute as Me. Who has access Anyone. Click Deploy and copy the Web App URL."},
        {step:"5",title:"Add environment variables in Vercel",desc:"Go to your Vercel project Settings then Environment Variables. Add REACT_APP_SHEET_API_URL and REACT_APP_SPREADSHEET_ID. Then redeploy."},
        {step:"6",title:"You are live!",desc:"Refresh the app. The sync indicator in the top bar turns green. All incidents and data now save permanently to your Google Sheet."},
      ].map(s=>(
        <div key={s.step} style={{display:"flex",gap:16,marginBottom:16}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"var(--amber)",color:"#07090f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:14,flexShrink:0}}>{s.step}</div>
          <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 16px",flex:1}}>
            <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,color:"var(--heading)",marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.7}}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS=[
  {id:"dashboard",  label:"📊 Command Center"},
  {id:"inspection", label:"📋 Inspection"},
  {id:"charts",     label:"🗂 Resident Charts"},
  {id:"training",   label:"📅 Training"},
  {id:"incidents",  label:"🚨 Incidents"},
  {id:"wac",        label:"📑 WAC Reference"},
  {id:"setup",      label:"⚙️ Setup Guide"},
];

export default function App() {
  const [tab,setTab]=useState("dashboard");
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

  const fail=INSPECTION_ITEMS.filter(i=>i.status==="fail").length;
  const warn=INSPECTION_ITEMS.filter(i=>i.status==="warn").length;
  const score=Math.round((INSPECTION_ITEMS.filter(i=>i.status==="pass").length/INSPECTION_ITEMS.length)*100);

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="topbar">
          <div className="topbar-brand">
            <div className="brand-dot"/>
            <div>
              <div className="brand-name">Daima AFH — Command Center</div>
              <div className="brand-sub">DSHS / WAC 388-76 Compliance System</div>
            </div>
          </div>
          <div className="topbar-status">
            <span className={`status-pill ${score>=90?"green":score>=75?"amber":"red"}`}>Score {score}%</span>
            {fail>0&&<span className="status-pill red">{fail} Critical</span>}
            {warn>0&&<span className="status-pill amber">{warn} Warnings</span>}
            <span className={`status-pill ${sheetsLive?"green":"amber"}`}>{sheetsLive?"● Sheets Live":"● Local Mode"}</span>
          </div>
        </div>
        <div className="nav">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="main">
          <SyncBar live={sheetsLive}/>
          {tab==="dashboard"  &&<Dashboard residents={residents} incidents={incidents} staff={staff}/>}
          {tab==="inspection" &&<InspectionDashboard/>}
          {tab==="charts"     &&<ResidentCharts residents={residents}/>}
          {tab==="training"   &&<TrainingTracker staff={staff}/>}
          {tab==="incidents"  &&<IncidentReporting incidents={incidents} setIncidents={setIncidents} residents={residents} sheetsLive={sheetsLive}/>}
          {tab==="wac"        &&<WACReference/>}
          {tab==="setup"      &&<SetupGuide/>}
        </div>
      </div>
    </>
  );
}
