import { supabaseAdmin } from '../lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { password, name, role, cprExpiry, hcaExpiry, foodExpiry, dementiaExpiry } = req.body;

  if (!password || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields: name, role, password' });
  }

  // 1. Generate Staff ID
  const generatedId = `S-${Math.floor(1000 + Math.random() * 9000)}`;
  const email = `${generatedId}@staff.daima-afh.com`;

  // 2. Create Auth user via admin API — bypasses email validation & confirmation
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip confirmation email
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // 3. Insert staff record
  const { error: dbError } = await supabaseAdmin.from('staff').insert([{
    staff_id: generatedId,
    name,
    role,
    cpr_expiry: cprExpiry || null,
    hca_expiry: hcaExpiry || null,
    food_expiry: foodExpiry || null,
    dementia_expiry: dementiaExpiry || null,
    hired_date: new Date().toISOString().split('T')[0],
    notes: 'Self-registered',
  }]);

  if (dbError) {
    // Roll back auth user if DB insert fails
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return res.status(500).json({ error: dbError.message });
  }

  return res.status(201).json({ staffId: generatedId });
}
