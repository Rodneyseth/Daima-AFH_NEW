import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg)' }}>
      <div className="modal" style={{ maxWidth: '400px', margin: '0 auto', border: '1px solid var(--border)', background: 'var(--card)', padding: '32px' }}>
        <h2 className="modal-title" style={{ textAlign: 'center', marginBottom: '8px' }}>Daima Command Center</h2>
        <p className="modal-sub" style={{ textAlign: 'center', marginBottom: '24px' }}>Sign in to continue</p>
        
        {error && <div className="alert-banner red" style={{ marginBottom: '16px' }}>{error}</div>}
        
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
