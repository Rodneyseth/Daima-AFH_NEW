export const SHEETS_CONFIG = {
  SHEET_API_URL: process.env.REACT_APP_SHEET_API_URL || '',
  SPREADSHEET_ID: process.env.REACT_APP_SPREADSHEET_ID || '',
  TABS: {
    RESIDENTS: 'Residents',
    STAFF: 'Staff',
    INCIDENTS: 'Incidents',
    CHECKLIST: 'Checklist',
  },
};

export async function sheetsRead(tab) {
  if (!SHEETS_CONFIG.SHEET_API_URL) return null;
  try {
    const url = `${SHEETS_CONFIG.SHEET_API_URL}?tab=${tab}`;
    const res = await fetch(url);
    const data = await res.json();
    // Our Apps Script returns a plain array
    if (Array.isArray(data) && data.length > 0) return data;
    return null;
  } catch (e) {
    console.warn('Sheets read failed:', e);
    return null;
  }
}

export async function sheetsAppend(tab, row) {
  if (!SHEETS_CONFIG.SHEET_API_URL) return false;
  try {
    const res = await fetch(SHEETS_CONFIG.SHEET_API_URL, {
      method: 'POST',
      body: JSON.stringify({ tab, row }),
    });
    const data = await res.json();
    return data.success || false;
  } catch (e) {
    console.warn('Sheets append failed:', e);
    return false;
  }
}
