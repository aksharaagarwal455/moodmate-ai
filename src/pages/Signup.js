import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user info to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('userId', data.user.id);
        navigate('/dashboard');
      } else {
        // Show exact error from backend (duplicate email, etc.)
        setError(data.error || 'Signup failed. Please try again.');
      }

    } catch (err) {
      setError('Cannot connect to server. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-root { min-height:100vh; display:flex; font-family:'Nunito',sans-serif; background:#0d0d1a; color:#f0eeff; }
        .auth-left { flex:1; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; padding:60px; background:linear-gradient(145deg,#1a0533 0%,#0d0d1a 60%,#1a1040 100%); }
        .auth-left-orb1 { position:absolute; width:400px; height:400px; border-radius:50%; background:rgba(124,58,237,0.2); filter:blur(90px); top:-80px; right:-80px; pointer-events:none; }
        .auth-left-orb2 { position:absolute; width:280px; height:280px; border-radius:50%; background:rgba(236,72,153,0.15); filter:blur(80px); bottom:40px; left:20px; pointer-events:none; }
        .auth-left-content { position:relative; z-index:2; max-width:420px; }
        .auth-left-logo { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; background:linear-gradient(135deg,#a78bfa,#f472b6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:48px; }
        .auth-left-h { font-family:'Syne',sans-serif; font-size:2.8rem; font-weight:800; line-height:1.1; letter-spacing:-0.03em; color:#f0eeff; margin-bottom:20px; }
        .auth-left-h span { background:linear-gradient(135deg,#a78bfa,#f472b6,#fb923c); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .auth-left-sub { font-size:1rem; color:rgba(240,238,255,0.45); line-height:1.7; }
        .auth-right { width:460px; background:#13131f; border-left:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 50px; }
        .auth-form-title { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; color:#f0eeff; margin-bottom:6px; width:100%; }
        .auth-form-sub { font-size:0.88rem; color:rgba(240,238,255,0.35); margin-bottom:36px; width:100%; }
        .auth-form { width:100%; display:flex; flex-direction:column; gap:18px; }
        .auth-field-label { font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:rgba(240,238,255,0.4); display:block; margin-bottom:8px; }
        .auth-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:#f0eeff; padding:14px 16px; border-radius:12px; font-family:'Nunito',sans-serif; font-size:0.95rem; outline:none; transition:border-color 0.2s,background 0.2s; }
        .auth-input:focus { border-color:rgba(167,139,250,0.5); background:rgba(167,139,250,0.04); }
        .auth-input::placeholder { color:rgba(240,238,255,0.18); }
        .auth-error { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:#fca5a5; padding:10px 14px; border-radius:10px; font-size:0.85rem; }
        .auth-submit { width:100%; background:linear-gradient(135deg,#7c3aed,#ec4899); border:none; color:white; padding:15px; border-radius:12px; font-family:'Nunito',sans-serif; font-size:1rem; font-weight:700; cursor:pointer; transition:all 0.25s; margin-top:4px; box-shadow:0 8px 24px rgba(124,58,237,0.35); opacity:1; }
        .auth-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none !important; }
        .auth-submit:hover:not(:disabled) { transform:translateY(-2px) !important; box-shadow:0 14px 32px rgba(124,58,237,0.5); }
        .auth-switch { font-size:0.88rem; color:rgba(240,238,255,0.35); margin-top:20px; text-align:center; }
        .auth-switch-link { color:#a78bfa; cursor:pointer; font-weight:700; background:none; border:none; font-family:'Nunito',sans-serif; font-size:0.88rem; padding:0; margin-left:4px; text-decoration:underline; text-underline-offset:3px; }
        .auth-switch-link:hover { color:#c4b5fd; transform:none !important; background:none; }
        @media (max-width:900px) { .auth-left{display:none;} .auth-right{width:100%; border-left:none;} }
      `}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="auth-left-orb1" /><div className="auth-left-orb2" />
          <div className="auth-left-content">
            <div className="auth-left-logo">MoodMate</div>
            <h2 className="auth-left-h">Join the<br /><span>vibe.</span></h2>
            <p className="auth-left-sub">Create your free account and let AI discover music that resonates with how you actually feel.</p>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-title">Create account</div>
          <div className="auth-form-sub">Free forever — no credit card needed</div>
          <form className="auth-form" onSubmit={handleSignup}>
            <div>
              <label className="auth-field-label">Full name</label>
              <input className="auth-input" type="text" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} required />
            </div>
            <div>
              <label className="auth-field-label">Email address</label>
              <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="auth-field-label">Password</label>
              <input className="auth-input" type="password" placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="auth-switch">Already have one?<button className="auth-switch-link" onClick={()=>navigate('/login')}>Sign in</button></p>
        </div>
      </div>
    </>
  );
}