import { useState } from "react";
import { sheetsAppend, SHEETS_CONFIG } from "./sheetsConfig";

const ACTIVITIES = [
  "Morning Hygiene", "Breakfast", "Lunch", "Dinner",
  "Medications Given", "Group Activity", "Community Outing",
  "Afternoon Personal Care", "Evening Routine",
  "Fluid Intake Monitored", "Visitor", "Bedtime Routine",
];

const MOODS = [
  "Calm and cooperative", "Pleasant and engaged", "Anxious / restless",
  "Irritable / agitated", "Withdrawn / low mood",
  "Confused / disoriented", "Elevated / excitable",
];

const COMPLAINTS = [
  "None", "Headache", "Stomach pain / nausea", "Body pain / discomfort",
  "Fatigue / low energy", "Shortness of breath", "Other (see notes)",
];

const SHIFTS  = ["Morning (6am-2pm)", "Afternoon (2pm-10pm)", "Overnight (10pm-6am)"];
const TITLES  = ["Caregiver", "House Manager", "Program Manager", "Nurse", "Other"];
const MODEL   = "claude-sonnet-4-20250514";
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY || "";
const todayStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function DailyLogGenerator() {
  const [form, setForm] = useState({
    residentName: "", date: todayStr(), shift: "", staffName: "",
    staffTitle: "Caregiver", mood: "", physicalComplaints: "None",
    activities: [], incidents: "", notifications: "", concerns: "", additionalNotes: "",
  });
  const [note,    setNote]    = useState("");
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleActivity = a => set("activities",
    form.activities.includes(a) ? form.activities.filter(x => x !== a) : [...form.activities, a]
  );

  const ready = form.residentName.trim() && form.date && form.shift && form.staffName.trim() && form.mood;

  const generate = async () => {
    if (!ready) { setError("Please fill in all required fields (marked *)."); return; }
    if (!API_KEY) { setError("Anthropic API key not configured. Add REACT_APP_ANTHROPIC_API_KEY in Vercel environment variables."); return; }
    setError(""); setLoading(true); setNote(""); setSaved(false);
    const prompt = `You are a professional Adult Family Home (AFH) caregiver writing a DSHS-compliant daily log note. Write in objective, first-person, professional language. Be specific, factual, and concise. Use past tense.

Shift details:
- Resident: ${form.residentName}
- Date: ${form.date}
- Shift: ${form.shift}
- Staff: ${form.staffName}, ${form.staffTitle}
- Overall mood/presentation: ${form.mood}
- Physical complaints: ${form.physicalComplaints}
- Activities completed: ${form.activities.length > 0 ? form.activities.join(", ") : "None documented"}
${form.incidents      ? `- Behavioral incidents: ${form.incidents}` : ""}
${form.notifications  ? `- Notifications made: ${form.notifications}` : ""}
${form.concerns       ? `- Concerns/follow-up needed: ${form.concerns}` : ""}
${form.additionalNotes? `- Additional notes: ${form.additionalNotes}` : ""}

Write a single cohesive daily log paragraph (4-8 sentences). Start with the resident's name and shift. Include mood, activities, any incidents with staff response, notifications, and concerns. End with: "${form.staffName}, ${form.staffTitle}".`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model: MODEL, max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) { setError(`API error: ${data.error.message}`); }
      else { setNote(data.content?.find(b => b.type === "text")?.text?.trim() || ""); }
    } catch (e) { setError("Failed to generate note. Please try again."); }
    finally { setLoading(false); }
  };

  const saveToSheets = async () => {
    setSaving(true);
    const ok = await sheetsAppend(SHEETS_CONFIG.TABS.CHECKLIST, {
      Date: form.date, Shift: form.shift, "Resident Name": form.residentName,
      "Staff Name": form.staffName, "Staff Title": form.staffTitle,
      "Mood / Presentation": form.mood, "Physical Complaints": form.physicalComplaints,
      "Activities Completed": form.activities.join(", "),
      "Behavioral Incidents": form.incidents, "Notifications Made": form.notifications,
      "Concerns / Follow-Up": form.concerns, "Additional Notes": form.additionalNotes,
      "Generated Log Note": note, Timestamp: new Date().toISOString(),
    });
    setSaving(false);
    if (ok) setSaved(true);
    else setError("Failed to save to Sheets. Check your API URL.");
  };

  const copy = () => { navigator.clipboard.writeText(note); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <div className="section-title">Daily Log Generator</div>
      <div style={{ marginBottom: 24, color: 'var(--muted)', fontSize: 12 }}>
        AI-powered shift notes in under 2 minutes · DSHS-compliant language · Copy-ready
      </div>

      <Section label="🗒️  Shift Information" sub="Basic details for this shift entry">
        <div style={grid3}>
          <Field label="RESIDENT NAME" required>
            <input placeholder="First Last" value={form.residentName} onChange={e => set("residentName", e.target.value)} />
          </Field>
          <Field label="DATE" required>
            <input value={form.date} onChange={e => set("date", e.target.value)} />
          </Field>
          <Field label="SHIFT" required>
            <select value={form.shift} onChange={e => set("shift", e.target.value)}>
              <option value="">-- Select --</option>
              {SHIFTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div style={grid2}>
          <Field label="STAFF NAME (WRITER)" required>
            <input placeholder="Your full name" value={form.staffName} onChange={e => set("staffName", e.target.value)} />
          </Field>
          <Field label="STAFF TITLE">
            <select value={form.staffTitle} onChange={e => set("staffTitle", e.target.value)}>
              {TITLES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section label="🧍  Resident Status" sub="Mood, behavior, and general presentation this shift">
        <div style={grid2}>
          <Field label="OVERALL MOOD / PRESENTATION" required>
            <select value={form.mood} onChange={e => set("mood", e.target.value)}>
              <option value="">-- Select --</option>
              {MOODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="ANY PHYSICAL COMPLAINTS?">
            <select value={form.physicalComplaints} onChange={e => set("physicalComplaints", e.target.value)}>
              {COMPLAINTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>
          Activities Completed This Shift
        </div>
        <div style={checkGrid}>
          {ACTIVITIES.map(a => {
            const checked = form.activities.includes(a);
            return (
              <div
                key={a}
                onClick={() => toggleActivity(a)}
                className="check-item"
                style={{
                  border: `1px solid ${checked ? 'var(--green)' : 'var(--border)'}`,
                  borderRadius: 6,
                  background: checked ? 'rgba(34,211,165,.07)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div className={`check-box ${checked ? 'checked' : ''}`} />
                <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase' }}>{a}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section label="⚠️  Incidents, Concerns & Notifications" sub="Leave blank if none -- only fill what applies">
        <Field label="ANY BEHAVIORAL INCIDENTS?">
          <textarea
            style={{ minHeight: 80 }}
            placeholder="Describe what happened, time, your response, and outcome."
            value={form.incidents}
            onChange={e => set("incidents", e.target.value)}
          />
        </Field>
        <div style={grid2}>
          <Field label="NOTIFICATIONS MADE THIS SHIFT">
            <textarea style={{ minHeight: 65 }} placeholder="Example: Guardian called at 3:00 PM re: upcoming appointment." value={form.notifications} onChange={e => set("notifications", e.target.value)} />
          </Field>
          <Field label="CONCERNS / FOLLOW-UP NEEDED">
            <textarea style={{ minHeight: 65 }} placeholder="Example: Resident eating less for 3 days -- recommend physician follow-up." value={form.concerns} onChange={e => set("concerns", e.target.value)} />
          </Field>
        </div>
        <Field label="ADDITIONAL NOTES">
          <textarea style={{ minHeight: 70 }} placeholder="Positive behaviors, goal progress, family updates, maintenance issues..." value={form.additionalNotes} onChange={e => set("additionalNotes", e.target.value)} />
        </Field>
      </Section>

      {error && <div className="alert-banner red" style={{ marginBottom: 16 }}>⚠ {error}</div>}

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <button
          className="btn btn-primary"
          onClick={generate}
          disabled={loading}
          style={{ minWidth: 260, fontSize: 13, padding: '12px 28px' }}
        >
          {loading ? "Generating..." : "✦ Generate Daily Log Note"}
        </button>
      </div>

      {(loading || note) && (
        <Section label="✅  Your Daily Log Note" sub="Ready to copy into your log · Review and customize before filing">
          <div className="alert-banner blue">
            DSHS-compliant language · Objective, first-person · Review and customize before filing
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 20px', minHeight: 80 }}>
            {loading
              ? <span style={{ color: 'var(--muted)', fontSize: 13 }}>Generating your note...</span>
              : <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{note}</p>
            }
          </div>
          {note && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={copy}>
                {copied ? "✓ Copied!" : "Copy to Clipboard"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={saveToSheets} disabled={saving || saved}>
                {saving ? "Saving..." : saved ? "✓ Saved to Sheets" : "Save to Google Sheets"}
              </button>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

function Section({ label, sub, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--heading)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{sub}</div>}
      </div>
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div className="field-label">
        {label}{required && <span style={{ color: 'var(--red)' }}> *</span>}
      </div>
      {children}
    </div>
  );
}

const grid3     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 };
const grid2     = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 };
const checkGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8 };
