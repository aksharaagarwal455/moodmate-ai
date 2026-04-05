import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import Sidebar from '../components/Sidebar';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Profile() {
  const navigate = useNavigate();

  // Profile fields
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [msg, setMsg]         = useState('');
  const [msgType, setMsgType] = useState('success');
  const [saving, setSaving]   = useState(false);

  // Password change fields
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [pwMsg, setPwMsg]           = useState('');
  const [pwMsgType, setPwMsgType]   = useState('success');
  const [pwSaving, setPwSaving]     = useState(false);

  // Chart
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    document.body.style.background = '#0d0d1a';
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    setName(localStorage.getItem('userName') || '');
    setEmail(localStorage.getItem('email') || '');

    fetch(`${API}/mood/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        const h = (data.history || []).slice(0, 10).reverse();
        setMoodHistory(h);
      })
      .catch(() => {
        const h = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        setMoodHistory(h.slice(0, 10).reverse());
      });
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userName', name);
        localStorage.setItem('email', email);
        setMsg('Profile saved successfully!');
        setMsgType('success');
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg(data.error || 'Update failed.');
        setMsgType('error');
      }
    } catch {
      setMsg('Cannot connect to server.');
      setMsgType('error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg('');

    if (newPw.length < 6) {
      setPwMsg('New password must be at least 6 characters.');
      setPwMsgType('error');
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg('New passwords do not match.');
      setPwMsgType('error');
      return;
    }

    setPwSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg('Password changed successfully!');
        setPwMsgType('success');
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        setTimeout(() => setPwMsg(''), 3000);
      } else {
        setPwMsg(data.error || 'Password change failed.');
        setPwMsgType('error');
      }
    } catch {
      setPwMsg('Cannot connect to server.');
      setPwMsgType('error');
    } finally {
      setPwSaving(false);
    }
  };

  // Chart config
  const scores = { happy: 7, surprised: 6, neutral: 5, sad: 4, disgusted: 3, fearful: 2, angry: 1 };
  const chartData = {
    labels: moodHistory.map(e => {
      const d = new Date(e.logged_at || e.time);
      return isNaN(d) ? e.time : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }),
    datasets: [{
      label: 'Mood',
      data: moodHistory.map(e => scores[e.mood?.toLowerCase()] || 0),
      fill: false,
      borderColor: '#a78bfa',
      pointBackgroundColor: '#a78bfa',
      pointBorderColor: '#0d0d1a',
      pointBorderWidth: 2,
      pointRadius: 5,
      tension: 0.4,
    }],
  };
  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: 'rgba(240,238,255,0.25)', font: { family: 'Nunito', size: 11 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: {
        min: 1, max: 7,
        ticks: {
          stepSize: 1,
          color: 'rgba(240,238,255,0.25)',
          font: { family: 'Nunito', size: 11 },
          callback: v => ({ 7: 'Happy', 6: 'Surprised', 5: 'Neutral', 4: 'Sad', 3: 'Disgusted', 2: 'Fearful', 1: 'Angry' })[v] || '',
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .p-root { display: flex; min-height: 100vh; background: #0d0d1a; color: #f0eeff; font-family: 'Nunito', sans-serif; }
        .p-main { margin-left: 230px; flex: 1; padding: 40px 48px; max-width: 760px; }

        .p-section-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(240,238,255,0.25); margin-bottom: 8px; }
        .p-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #f0eeff; margin-bottom: 32px; }
        .p-card { background: #13131f; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
        .p-card-title { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(240,238,255,0.25); margin-bottom: 20px; }
        .p-form { display: flex; flex-direction: column; gap: 16px; }
        .p-field-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(240,238,255,0.35); display: block; margin-bottom: 8px; }
        .p-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); color: #f0eeff; padding: 13px 16px; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 500; outline: none; transition: border-color 0.2s; }
        .p-input:focus { border-color: rgba(167,139,250,0.45); }
        .p-save { background: linear-gradient(135deg, #7c3aed, #ec4899); border: none; color: white; padding: 12px 28px; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; align-self: flex-start; box-shadow: 0 4px 14px rgba(124,58,237,0.3); }
        .p-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .p-save:hover:not(:disabled) { transform: translateY(-1px) !important; box-shadow: 0 8px 20px rgba(124,58,237,0.45); }
        .p-success { font-size: 0.82rem; color: #6ee7b7; font-weight: 600; margin-top: 4px; }
        .p-error { font-size: 0.82rem; color: #fca5a5; font-weight: 600; margin-top: 4px; }
        .p-empty { font-size: 0.85rem; color: rgba(240,238,255,0.2); }
        .p-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 16px 0; }

        @media (max-width: 900px) {
          .p-main { margin-left: 0; padding: 24px 20px; padding-top: 70px; }
        }
      `}</style>

      <div className="p-root">
        <Sidebar />
        <main className="p-main">
          <div className="p-section-label">Account</div>
          <h1 className="p-title">Your Profile</h1>

          {/* ── Personal details ── */}
          <div className="p-card">
            <div className="p-card-title">Personal details</div>
            <form className="p-form" onSubmit={handleUpdate}>
              <div>
                <label className="p-field-label">Full name</label>
                <input className="p-input" type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="p-field-label">Email address</label>
                <input className="p-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="p-save" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save changes'}
              </button>
              {msg && <div className={msgType === 'success' ? 'p-success' : 'p-error'}>{msg}</div>}
            </form>
          </div>

          {/* ── Change password ── */}
          <div className="p-card">
            <div className="p-card-title">Change password</div>
            <form className="p-form" onSubmit={handlePasswordChange}>
              <div>
                <label className="p-field-label">Current password</label>
                <input className="p-input" type="password" placeholder="Enter current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required />
              </div>
              <hr className="p-divider" />
              <div>
                <label className="p-field-label">New password</label>
                <input className="p-input" type="password" placeholder="Min. 6 characters" value={newPw} onChange={e => setNewPw(e.target.value)} required />
              </div>
              <div>
                <label className="p-field-label">Confirm new password</label>
                <input className="p-input" type="password" placeholder="Repeat new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required />
              </div>
              <button className="p-save" type="submit" disabled={pwSaving}>
                {pwSaving ? 'Updating...' : 'Update password'}
              </button>
              {pwMsg && <div className={pwMsgType === 'success' ? 'p-success' : 'p-error'}>{pwMsg}</div>}
            </form>
          </div>

          {/* ── Mood trend chart ── */}
          <div className="p-card">
            <div className="p-card-title">Mood trend</div>
            {moodHistory.length === 0
              ? <div className="p-empty">No mood data yet. Start detecting moods from the dashboard.</div>
              : <Line data={chartData} options={chartOpts} />
            }
          </div>
        </main>
      </div>
    </>
  );
}