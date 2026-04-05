import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const userName = localStorage.getItem('userName') || 'there';
  const firstName = userName.split(' ')[0];
  const initials = userName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const navItems = [
    { label: 'Discover', path: '/dashboard' },
    { label: 'History',  path: '/history'   },
    { label: 'Profile',  path: '/profile'   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');

        .sb-sidebar {
          width: 230px;
          min-height: 100vh;
          background: #10101e;
          border-right: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          padding: 28px 0;
          position: fixed;
          top: 0; left: 0;
          z-index: 200;
          transition: transform 0.25s ease;
        }

        .sb-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          padding: 0 24px;
          margin-bottom: 40px;
          cursor: pointer;
        }

        .sb-nav {
          flex: 1;
          padding: 0 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sb-section-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240,238,255,0.2);
          padding: 0 12px;
          margin: 8px 0 6px;
        }

        .sb-nav-btn {
          display: flex;
          align-items: center;
          padding: 11px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(240,238,255,0.4);
          border: none;
          background: none;
          font-family: 'Nunito', sans-serif;
          width: 100%;
          text-align: left;
          transition: all 0.15s;
        }
        .sb-nav-btn:hover {
          background: rgba(255,255,255,0.05);
          color: rgba(240,238,255,0.8);
          transform: none !important;
        }
        .sb-nav-btn.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.1));
          color: #c4b5fd;
        }

        .sb-bottom {
          padding: 0 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 16px;
          margin-top: 16px;
        }

        .sb-user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
        }

        .sb-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }

        .sb-user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(240,238,255,0.6);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sb-signout {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(240,238,255,0.25);
          border: none;
          background: none;
          font-family: 'Nunito', sans-serif;
          width: 100%;
          text-align: left;
          transition: all 0.15s;
          margin-top: 2px;
        }
        .sb-signout:hover {
          color: rgba(248,113,113,0.8);
          background: rgba(248,113,113,0.06);
          transform: none !important;
        }

        /* ── Mobile hamburger ── */
        .sb-hamburger {
          display: none;
          position: fixed;
          top: 16px; left: 16px;
          z-index: 300;
          background: #10101e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
        }
        .sb-hamburger span {
          display: block;
          width: 20px; height: 2px;
          background: rgba(240,238,255,0.7);
          border-radius: 2px;
          transition: all 0.2s;
        }

        .sb-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 199;
        }

        @media (max-width: 900px) {
          .sb-sidebar {
            transform: translateX(-100%);
          }
          .sb-sidebar.open {
            transform: translateX(0);
          }
          .sb-hamburger {
            display: flex;
          }
          .sb-overlay.open {
            display: block;
          }
        }
      `}</style>

      {/* Hamburger button (mobile only) */}
      <button className="sb-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
        <span /><span /><span />
      </button>

      {/* Overlay (closes menu on tap outside) */}
      <div
        className={`sb-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`sb-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sb-logo" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>
          MoodMate
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Main</div>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`sb-nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setMenuOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sb-bottom">
          <div className="sb-user-row">
            <div className="sb-avatar">{initials}</div>
            <span className="sb-user-name">{firstName}</span>
          </div>
          <button className="sb-signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </aside>
    </>
  );
}