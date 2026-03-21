import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem('userName') || 'there';
  const firstName = userName.split(' ')[0];
  const initials = userName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const MOOD_COLORS = {
    happy:'#fbbf24', sad:'#60a5fa', angry:'#f87171',
    surprised:'#a78bfa', disgusted:'#34d399', fearful:'#f472b6', neutral:'#94a3b8'
  };

  useEffect(() => {
    document.body.style.background = '#0d0d1a';
    fetchHistory();
 }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    try {
      // Fetch history from MySQL
      const [histRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/mood/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/mood/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (histRes.status === 401) { navigate('/login'); return; }

      const histData = await histRes.json();
      const statsData = await statsRes.json();

      setHistory(histData.history || []);
      setStats(statsData.stats || []);
      setTotal(statsData.total || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      // Fallback to localStorage if backend is down
      const local = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      setHistory(local.map(e => ({ mood: e.mood, logged_at: e.time })));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .h-root{display:flex;min-height:100vh;background:#0d0d1a;color:#f0eeff;font-family:'Nunito',sans-serif;}
        .h-sidebar{width:230px;min-height:100vh;background:#10101e;border-right:1px solid rgba(255,255,255,0.05);display:flex;flex-direction:column;padding:28px 0;position:fixed;top:0;left:0;z-index:100;}
        .h-logo{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;padding:0 24px;margin-bottom:40px;}
        .h-nav{flex:1;padding:0 12px;display:flex;flex-direction:column;gap:2px;}
        .h-nav-label{font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,238,255,0.2);padding:0 12px;margin:8px 0 6px;}
        .h-nav-btn{display:flex;align-items:center;padding:11px 14px;border-radius:10px;cursor:pointer;font-size:0.9rem;font-weight:600;color:rgba(240,238,255,0.4);border:none;background:none;font-family:'Nunito',sans-serif;width:100%;text-align:left;transition:all 0.15s;}
        .h-nav-btn:hover{background:rgba(255,255,255,0.05);color:rgba(240,238,255,0.8);transform:none !important;}
        .h-nav-btn.active{background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.1));color:#c4b5fd;}
        .h-sidebar-bottom{padding:0 12px;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;margin-top:16px;}
        .h-user-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;}
        .h-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#ec4899);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:white;flex-shrink:0;}
        .h-user-name{font-size:0.88rem;font-weight:600;color:rgba(240,238,255,0.6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .h-signout{display:flex;align-items:center;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:rgba(240,238,255,0.25);border:none;background:none;font-family:'Nunito',sans-serif;width:100%;text-align:left;transition:all 0.15s;margin-top:2px;}
        .h-signout:hover{color:rgba(248,113,113,0.8);background:rgba(248,113,113,0.06);transform:none !important;}
        .h-main{margin-left:230px;flex:1;padding:40px 48px;}
        .h-section-label{font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(240,238,255,0.25);margin-bottom:8px;}
        .h-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#f0eeff;margin-bottom:28px;}

        .h-stats-row{display:flex;gap:14px;margin-bottom:32px;flex-wrap:wrap;}
        .h-stat-card{background:#13131f;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:20px 24px;min-width:140px;}
        .h-stat-num{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#a78bfa;}
        .h-stat-label{font-size:0.75rem;color:rgba(240,238,255,0.3);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px;}

        .h-top-moods{display:flex;gap:8px;margin-bottom:32px;flex-wrap:wrap;}
        .h-mood-badge{display:flex;align-items:center;gap:7px;background:#13131f;border:1px solid rgba(255,255,255,0.06);border-radius:100px;padding:7px 16px;}
        .h-mood-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .h-mood-badge-text{font-size:0.82rem;font-weight:600;color:rgba(240,238,255,0.6);text-transform:capitalize;}
        .h-mood-badge-count{font-size:0.78rem;color:rgba(240,238,255,0.25);margin-left:2px;}

        .h-list{display:flex;flex-direction:column;gap:10px;max-width:600px;}
        .h-item{background:#13131f;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;transition:border-color 0.2s;}
        .h-item:hover{border-color:rgba(167,139,250,0.25);}
        .h-item-left{display:flex;align-items:center;gap:12px;}
        .h-item-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
        .h-item-mood{font-size:0.95rem;font-weight:700;color:#f0eeff;text-transform:capitalize;}
        .h-item-time{font-size:0.78rem;color:rgba(240,238,255,0.28);font-weight:400;}
        .h-empty{color:rgba(240,238,255,0.2);font-size:0.9rem;padding:40px 0;}
        .h-spinner{width:28px;height:28px;border:2px solid rgba(255,255,255,0.08);border-top-color:#a78bfa;border-radius:50%;animation:spin 0.75s linear infinite;margin:60px auto;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @media(max-width:900px){.h-sidebar{display:none;}.h-main{margin-left:0;padding:24px;}}
      `}</style>

      <div className="h-root">
        <aside className="h-sidebar">
          <div className="h-logo">MoodMate</div>
          <nav className="h-nav">
            <div className="h-nav-label">Main</div>
            <button className="h-nav-btn" onClick={()=>navigate('/dashboard')}>Discover</button>
            <button className="h-nav-btn active">History</button>
            <button className="h-nav-btn" onClick={()=>navigate('/profile')}>Profile</button>
          </nav>
          <div className="h-sidebar-bottom">
            <div className="h-user-row">
              <div className="h-avatar">{initials}</div>
              <span className="h-user-name">{firstName}</span>
            </div>
            <button className="h-signout" onClick={()=>{localStorage.clear();navigate('/');}}>Sign out</button>
          </div>
        </aside>

        <main className="h-main">
          <div className="h-section-label">Your journal</div>
          <h1 className="h-title">Mood History</h1>

          {loading ? <div className="h-spinner" /> : (
            <>
              {/* Stats row */}
              <div className="h-stats-row">
                <div className="h-stat-card">
                  <div className="h-stat-num">{total}</div>
                  <div className="h-stat-label">Total sessions</div>
                </div>
                {stats[0] && (
                  <div className="h-stat-card">
                    <div className="h-stat-num" style={{color: MOOD_COLORS[stats[0].mood]||'#a78bfa', textTransform:'capitalize'}}>{stats[0].mood}</div>
                    <div className="h-stat-label">Top mood</div>
                  </div>
                )}
                <div className="h-stat-card">
                  <div className="h-stat-num">{stats.length}</div>
                  <div className="h-stat-label">Moods explored</div>
                </div>
              </div>

              {/* Top moods badges */}
              {stats.length > 0 && (
                <div className="h-top-moods">
                  {stats.map((s, i) => (
                    <div className="h-mood-badge" key={i}>
                      <span className="h-mood-dot" style={{background: MOOD_COLORS[s.mood]||'#a78bfa'}} />
                      <span className="h-mood-badge-text">{s.mood}</span>
                      <span className="h-mood-badge-count">×{s.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* History list */}
              {history.length === 0 ? (
                <div className="h-empty">No entries yet. Go discover some music first.</div>
              ) : (
                <div className="h-list">
                  {history.map((entry, i) => (
                    <div className="h-item" key={i}>
                      <div className="h-item-left">
                        <span className="h-item-dot" style={{background: MOOD_COLORS[entry.mood]||'#a78bfa', boxShadow:`0 0 6px ${MOOD_COLORS[entry.mood]||'#a78bfa'}60`}} />
                        <span className="h-item-mood">{entry.mood}</span>
                      </div>
                      <span className="h-item-time">{formatDate(entry.logged_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}