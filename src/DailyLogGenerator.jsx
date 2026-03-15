import { useState } from "react";
import { sheetsAppend, SHEETS_CONFIG } from "./sheetsConfig";

// ── helpers ────────────────────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const ACTIVITIES = [
  "Morning Hygiene",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Medications Given",
  "Group Activity",
  "Community Outing",
  "Afternoon Personal Care",
  "Evening Routine",
  "Fluid Intake Monitored",
  "Visitor",
  "Bedtime Routine",
];

const MOODS = [
  "Calm and cooperative",
  "Pleasant and engaged",
  "Anxious / restless",
  "Irritable / agitated",
  "Withdrawn / low mood",
  "Confused / disoriented",
  "Elevated / excitable",
];

const COMPLAINTS = [
  "None",
  "Headache",
  "Stomach pain / nausea",
  "Body pain / discomfort",
  "Fatigue / low energy",
  "Shortness of breath",
  "Other (see notes)",
];

const SHIFTS = ["Morning (6am–2pm)", "Afternoon (2pm–10pm)", "Overnight (10pm–6am)"];

const TITLES = ["Caregiver", "House Manager", "Program Manager", "Nurse", "Other"];

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ── component ──────────────────────────────────────────────────────────────
export default function DailyLogGenerator() {
  const [form, setForm] = useState({
    residentName: "",
    date: today(),
    shift: "",
    staffName: "",
    staffTitle: "Caregiver",
    mood: "",
    physicalComplaints: "None",
    activities: [],
    incidents: "",
    notifications: "",
    concerns: "",
    additionalNotes: "",
  });

  const [generatedNote, setGeneratedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleActivity = (a) =>
    set(
      "activities",
      form.activities.includes(a)
        ? form.activities.filter((x) => x !== a)
        : [...form.activities, a]
    );

  const requiredFilled =
    form.residentName.trim() &&
    form.date.trim() &&
    form.shift &&
    form.staffName.trim() &&
    form.mood;

  // ── AI generation ──────────────────────────────────────────────────────
  const generate = async () => {
    if (!requiredFilled) {
      setError("Please fill in all required fields (marked with *).");
      return;
    }
    setError("");
    setLoading(true);
    setGeneratedNote("");
    setSaved(false);

    const prompt = `You are a professional Adult Family Home (AFH) caregiver writing a DSHS-compliant daily log note. Write in objective, first-person, professional language. Be specific, factual, and concise. Do NOT use subjective judgments. Use past tense.

Shift details:
- Resident: ${form.residentName}
- Date: ${form.date}
- Shift: ${form.shift}
- Staff: ${form.staffName}, ${form.staffTitle}
- Overall mood/presentation: ${form.mood}
- Physical complaints: ${form.physicalComplaints}
- Activities completed: ${form.activities.length > 0 ? form.activities.join(", ") : "None documented"}
${form.incidents ? `- Behavioral incidents: ${form.incidents}` : ""}
${form.notifications ? `- Notifications made: ${form.notifications}` : ""}
${form.concerns ? `- Concerns/follow-up needed: ${form.concerns}` : ""}
${form.additionalNotes ? `- Additional notes: ${form.additionalNotes}` : ""}

Write a single cohesive daily log paragraph (4–8 sentences). Start with the resident's name and shift. Include mood, activities, any incidents with staff response, notifications, and concerns. End with staff signature line formatted as: "${form.staffName}, ${form.staffTitle}".`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      setGeneratedNote(text.trim());
    } catch (e) {
      setError("Failed to generate note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Save to Sheets ─────────────────────────────────────────────────────
  const saveToSheets = async () => {
    if (!generatedNote) return;
    setSaving(true);
    const row = {
      Date: form.date,
      Shift: form.shift,
      "Resident Name": form.residentName,
      "Staff Name": form.staffName,
      "Staff Title": form.staffTitle,
      "Mood / Presentation": form.mood,
      "Physical Complaints": form.physicalComplaints,
      "Activities Completed": form.activities.join(", "),
      "Behavioral Incidents": form.incidents,
      "Notifications Made": form.notifications,
      "Concerns / Follow-Up": form.concerns,
      "Additional Notes": form.additionalNotes,
      "Generated Log Note": generatedNote,
      "Timestamp": new Date().toISOString(),
    };
    const ok = await sheetsAppend(SHEETS_CONFIG.TABS.CHECKLIST, row);
    setSaving(false);
    if (ok) setSaved(true);
    else setError("Failed to save to Google Sheets. Check your API URL.");
  };

  // ── Copy ───────────────────────────────────────────────────────────────
  const copyNote = () => {
    navigator.clipboard.writeText(generatedNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <h1 style={styles.title}>Daily Log Generator</h1>
          <p style={styles.subtitle}>
            AI-powered shift notes in under 2 minutes · DSHS-compliant language · Copy-ready
          </p>
        </div>

        {/* ── Section 1: Shift Info ── */}
        <Section icon="🗒️" title="Shift Information" sub="Basic details for this shift entry">
          <div style={styles.grid3}>
            <Field label="RESIDENT NAME" required>
              <input
                style={styles.input}
                placeholder="First Last"
                value={form.residentName}
                onChange={(e) => set("residentName", e.target.value)}
              />
            </Field>
            <Field label="DATE" required>
              <input
                style={styles.input}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </Field>
            <Field label="SHIFT" required>
              <select style={styles.select} value={form.shift} onChange={(e) => set("shift", e.target.value)}>
                <option value="">— Select —</option>
                {SHIFTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div style={styles.grid2}>
            <Field label="STAFF NAME (WRITER)" required>
              <input
                style={styles.input}
                placeholder="Your full name"
                value={form.staffName}
                onChange={(e) => set("staffName", e.target.value)}
              />
            </Field>
            <Field label="STAFF TITLE">
              <select style={styles.select} value={form.staffTitle} onChange={(e) => set("staffTitle", e.target.value)}>
                {TITLES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* ── Section 2: Resident Status ── */}
        <Section icon="🧍" title="Resident Status" sub="Mood, behavior, and general presentation this shift">
          <div style={styles.grid2}>
            <Field label="OVERALL MOOD / PRESENTATION" required>
              <select style={styles.select} value={form.mood} onChange={(e) => set("mood", e.target.value)}>
                <option value="">— Select —</option>
                {MOODS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="ANY PHYSICAL COMPLAINTS?">
              <select style={styles.select} value={form.physicalComplaints} onChange={(e) => set("physicalComplaints", e.target.value)}>
                {COMPLAINTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <p style={styles.checkLabel}>ACTIVITIES COMPLETED THIS SHIFT</p>
          <div style={styles.checkGrid}>
            {ACTIVITIES.map((a) => (
              <label key={a} style={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={form.activities.includes(a)}
                  onChange={() => toggleActivity(a)}
                  style={styles.checkbox}
                />
                <span style={styles.checkText}>{a.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* ── Section 3: Incidents ── */}
        <Section icon="⚠️" title="Incidents, Concerns & Notifications" sub="Leave blank if none — only fill what applies">
          <Field label="ANY BEHAVIORAL INCIDENTS?">
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              placeholder={`Describe what happened, time, your response, and outcome.\nExample: At 2:15 PM, resident refused to transition to dining room, raised voice. Staff offered choice of seating. Resident cooperative within 5 min.`}
              value={form.incidents}
              onChange={(e) => set("incidents", e.target.value)}
            />
          </Field>
          <div style={styles.grid2}>
            <Field label="NOTIFICATIONS MADE THIS SHIFT">
              <textarea
                style={{ ...styles.input, ...styles.textareaSm }}
                placeholder="Example: Guardian Jane Smith called at 3:00 PM re: upcoming appointment. House manager notified."
                value={form.notifications}
                onChange={(e) => set("notifications", e.target.value)}
              />
            </Field>
            <Field label="CONCERNS / FOLLOW-UP NEEDED">
              <textarea
                style={{ ...styles.input, ...styles.textareaSm }}
                placeholder="Example: Resident has been eating less for 3 days — recommend physician follow-up."
                value={form.concerns}
                onChange={(e) => set("concerns", e.target.value)}
              />
            </Field>
          </div>
          <Field label="ADDITIONAL NOTES (ANYTHING ELSE WORTH DOCUMENTING)">
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Positive behaviors, goal progress, family updates, maintenance issues, anything else..."
              value={form.additionalNotes}
              onChange={(e) => set("additionalNotes", e.target.value)}
            />
          </Field>
        </Section>

        {/* ── Error ── */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* ── Generate Button ── */}
        <button style={styles.generateBtn} onClick={generate} disabled={loading}>
          {loading ? "Generating…" : "✦ Generate Daily Log Note"}
        </button>

        {/* ── Output ── */}
        {(loading || generatedNote) && (
          <Section icon="✅" title="Your Daily Log Note" sub="Ready to copy into your log">
            <div style={styles.noteHint}>
              <strong>DSHS-compliant language</strong> · Objective, first-person · Review and customize before filing
            </div>
            <div style={styles.noteBox}>
              {loading ? (
                <div style={styles.loadingDots}>
                  <span>●</span><span>●</span><span>●</span>
                </div>
              ) : (
                <p style={styles.noteText}>{generatedNote}</p>
              )}
            </div>
            {generatedNote && (
              <div style={styles.actionRow}>
                <button style={styles.copyBtn} onClick={copyNote}>
                  {copied ? "✓ Copied!" : "Copy to Clipboard"}
                </button>
                <button
                  style={{ ...styles.saveBtn, opacity: saved ? 0.6 : 1 }}
                  onClick={saveToSheets}
                  disabled={saving || saved}
                >
                  {saving ? "Saving…" : saved ? "✓ Saved to Sheets" : "Save to Google Sheets"}
                </button>
              </div>
            )}
          </Section>
        )}

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function Section({ icon, title, sub, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionIcon}>{icon}</span>
        <div>
          <h2 style={styles.sectionTitle}>{title}</h2>
          <p style={styles.sectionSub}>{sub}</p>
        </div>
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.fieldLabel}>
        {label}{required && <span style={styles.required}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const navy = "#1a2744";
const navyLight = "#2d3f6e";
const accent = "#3b5bdb";
const accentLight = "#e8edff";
const border = "#d8dde8";
const muted = "#6b7a99";
const bg = "#f5f7fc";

const styles = {
  page: {
    minHeight: "100vh",
    background: bg,
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: "40px 20px 80px",
  },
  container: {
    maxWidth: 860,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  header: {
    textAlign: "center",
    padding: "20px 0 10px",
  },
  title: {
    fontSize: 38,
    fontWeight: 700,
    color: navy,
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: muted,
    marginTop: 8,
    fontSize: 15,
  },
  section: {
    background: "#fff",
    borderRadius: 14,
    border: `1px solid ${border}`,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(26,39,68,0.05)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "22px 28px 0",
  },
  sectionIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: muted,
    margin: 0,
  },
  sectionSub: {
    color: muted,
    fontSize: 13,
    margin: "2px 0 0",
  },
  sectionBody: {
    padding: "20px 28px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: navy,
    fontFamily: "'Arial', sans-serif",
  },
  required: {
    color: "#e03131",
  },
  input: {
    border: `1.5px solid ${border}`,
    borderRadius: 8,
    padding: "10px 13px",
    fontSize: 14,
    color: navy,
    outline: "none",
    fontFamily: "'Arial', sans-serif",
    background: "#fff",
    transition: "border-color 0.15s",
  },
  select: {
    border: `1.5px solid ${border}`,
    borderRadius: 8,
    padding: "10px 13px",
    fontSize: 14,
    color: navy,
    outline: "none",
    fontFamily: "'Arial', sans-serif",
    background: "#fff",
    cursor: "pointer",
    appearance: "auto",
  },
  textarea: {
    minHeight: 90,
    resize: "vertical",
    lineHeight: 1.5,
  },
  textareaSm: {
    minHeight: 70,
    resize: "vertical",
    lineHeight: 1.5,
  },
  checkLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: navy,
    fontFamily: "'Arial', sans-serif",
    margin: "4px 0 10px",
    textAlign: "center",
  },
  checkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 10,
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: `1.5px solid ${border}`,
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    background: "#fff",
    transition: "border-color 0.15s, background 0.15s",
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: accent,
    cursor: "pointer",
    flexShrink: 0,
  },
  checkText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: navy,
    fontFamily: "'Arial', sans-serif",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1.5px solid #ffc9c9",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#c92a2a",
    fontSize: 14,
    fontFamily: "'Arial', sans-serif",
  },
  generateBtn: {
    background: navy,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "16px 32px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.02em",
    fontFamily: "'Arial', sans-serif",
    transition: "background 0.15s",
    alignSelf: "center",
    minWidth: 280,
  },
  noteHint: {
    background: accentLight,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    color: navyLight,
    fontFamily: "'Arial', sans-serif",
  },
  noteBox: {
    border: `1.5px solid ${border}`,
    borderRadius: 10,
    padding: "18px 20px",
    minHeight: 100,
    background: "#fafbfe",
  },
  noteText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: navy,
    whiteSpace: "pre-wrap",
    fontFamily: "'Georgia', serif",
  },
  loadingDots: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    padding: "20px 0",
    color: muted,
    fontSize: 20,
    animation: "pulse 1s infinite",
  },
  actionRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  copyBtn: {
    background: accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
  },
  saveBtn: {
    background: "#fff",
    color: navy,
    border: `1.5px solid ${border}`,
    borderRadius: 8,
    padding: "11px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Arial', sans-serif",
  },
};
