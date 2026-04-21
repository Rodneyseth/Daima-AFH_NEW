import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Caregiver');
  const [cprExpiry, setCprExpiry] = useState('');
  const [hcaExpiry, setHcaExpiry] = useState('');
  const [foodExpiry, setFoodExpiry] = useState('');
  const [dementiaExpiry, setDementiaExpiry] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const proxyDomain = '@staff.daima-afh.com';

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const email = `${staffId.trim().toUpperCase()}${proxyDomain}`;
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Call the server-side admin API — bypasses Supabase email validation
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, name, role, cprExpiry, hcaExpiry, foodExpiry, dementiaExpiry }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign up failed. Please try again.');
        setLoading(false);
        return;
      }

      const generatedId = data.staffId;
      setSuccess(`Account registered! Your Staff ID is: ${generatedId}. Use it to sign in.`);
      setStaffId(generatedId);
      setIsSignUp(false);
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{ background: 'linear-gradient(135deg, var(--bg) 0%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div 
        className="modal" 
        style={{ 
          maxWidth: isSignUp ? '600px' : '400px', 
          width: '100%',
          margin: '0 auto', 
          border: '1px solid rgba(246,166,35,0.2)', 
          background: 'rgba(13,17,23,0.7)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          padding: '40px',
          borderRadius: '16px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="brand-dot" style={{ margin: '0 auto 16px', transform: 'scale(1.5)' }} />
          <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '24px', fontWeight: '800', color: 'var(--amber)', marginBottom: '8px', letterSpacing: '1px' }}>
            Daima Command Center
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {isSignUp ? 'Staff Registration' : 'Secure Staff Portal'}
          </p>
        </div>
        
        {error && <div className="alert-banner red" style={{ marginBottom: '24px', borderRadius: '8px' }}>{error}</div>}
        {success && <div className="alert-banner green" style={{ marginBottom: '24px', borderRadius: '8px' }}>{success}</div>}
        
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          
          {/* SIGN UP FIELDS */}
          {isSignUp && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px' }}
                >
                  <option value="Caregiver">Caregiver</option>
                  <option value="Nursing Assistant">Nursing Assistant</option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>CPR Expiry</label>
                <input type="date" value={cprExpiry} onChange={(e) => setCprExpiry(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>HCA Expiry</label>
                <input type="date" value={hcaExpiry} onChange={(e) => setHcaExpiry(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Food Handler Expiry</label>
                <input type="date" value={foodExpiry} onChange={(e) => setFoodExpiry(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
              </div>
              
              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Dementia Training Expiry</label>
                <input type="date" value={dementiaExpiry} onChange={(e) => setDementiaExpiry(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px' }} />
              </div>
            </div>
          )}

          {/* COMMON CREDENTIALS (Sign In uses Staff ID, Sign Up generates it but sets Password) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            {!isSignUp && (
              <div>
                <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Staff ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. S-001"
                  value={staffId} 
                  onChange={(e) => setStaffId(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px', textTransform: 'uppercase' }}
                />
              </div>
            )}
            
            <div>
              <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '13px', 
              borderRadius: '8px',
              background: 'var(--amber)',
              color: '#07090f',
              fontWeight: '800',
              boxShadow: '0 4px 14px 0 rgba(246,166,35,0.39)',
              transition: 'background 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--muted)' }}>
          {isSignUp ? "Already have a Staff ID?" : "Don't have a Staff ID?"}
          <button 
            type="button" 
            className="btn-ghost"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--amber)', 
              marginLeft: '8px', 
              cursor: 'pointer',
              fontWeight: '600',
              padding: 0
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
}
