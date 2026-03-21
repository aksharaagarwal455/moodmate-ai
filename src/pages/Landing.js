import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ln-root {
          min-height: 100vh;
          background: #0d0d1a;
          font-family: 'Nunito', sans-serif;
          color: #f0eeff;
          overflow: hidden;
          position: relative;
        }

        /* Animated gradient orbs */
        .ln-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          animation: orb-float 8s ease-in-out infinite alternate;
        }
        .ln-orb-1 { width: 500px; height: 500px; background: rgba(124,58,237,0.25); top: -100px; right: -80px; }
        .ln-orb-2 { width: 350px; height: 350px; background: rgba(236,72,153,0.15); bottom: 50px; left: -60px; animation-delay: 2s; }
        .ln-orb-3 { width: 250px; height: 250px; background: rgba(251,146,60,0.12); top: 40%; left: 40%; animation-delay: 4s; }

        @keyframes orb-float {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-30px) scale(1.05); }
        }

        .ln-nav {
          position: relative; z-index: 10;
          padding: 28px 60px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .ln-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem; font-weight: 800;
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.01em;
        }

        .ln-nav-btns { display: flex; gap: 12px; }

        .btn-nav-ghost {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,238,255,0.8);
          padding: 10px 22px; border-radius: 100px;
          font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-nav-ghost:hover { background: rgba(255,255,255,0.1); color: #f0eeff; transform: none !important; }

        .btn-nav-fill {
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          border: none; color: white;
          padding: 10px 22px; border-radius: 100px;
          font-family: 'Nunito', sans-serif; font-size: 0.9rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.35);
        }
        .btn-nav-fill:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 28px rgba(124,58,237,0.5); }

        .ln-hero {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 80px 40px 60px;
        }

        .ln-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(167,139,250,0.1);
          border: 1px solid rgba(167,139,250,0.25);
          color: #c4b5fd; padding: 6px 18px; border-radius: 100px;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 36px;
        }

        .ln-badge-dot {
          width: 6px; height: 6px; background: #a78bfa; border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        .ln-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 6.5vw, 5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .ln-h1-grad {
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ln-sub {
          font-size: 1.1rem; font-weight: 400;
          color: rgba(240,238,255,0.5); line-height: 1.7;
          max-width: 500px; margin-bottom: 48px;
        }

        .ln-cta { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }

        .btn-cta-main {
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          border: none; color: white;
          padding: 16px 44px; border-radius: 100px;
          font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 8px 32px rgba(124,58,237,0.4);
          letter-spacing: 0.01em;
        }
        .btn-cta-main:hover { transform: translateY(-3px) !important; box-shadow: 0 16px 40px rgba(124,58,237,0.55); }

        .btn-cta-ghost {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(240,238,255,0.7);
          padding: 16px 44px; border-radius: 100px;
          font-family: 'Nunito', sans-serif; font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-cta-ghost:hover { background: rgba(255,255,255,0.09); color: #f0eeff; transform: none !important; }

        .ln-features {
          position: relative; z-index: 10;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.06);
          margin: 60px 0 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .ln-feature {
          background: #0d0d1a;
          padding: 36px 48px;
        }

        .ln-feature-tag {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #a78bfa; margin-bottom: 10px;
        }

        .ln-feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem; font-weight: 700;
          color: #f0eeff; margin-bottom: 8px;
        }

        .ln-feature-desc {
          font-size: 0.88rem; font-weight: 400;
          color: rgba(240,238,255,0.38); line-height: 1.6;
        }

        @media (max-width: 768px) {
          .ln-nav { padding: 20px 24px; }
          .ln-features { grid-template-columns: 1fr; }
          .ln-feature { padding: 24px; }
        }
      `}</style>

      <div className="ln-root">
        <div className="ln-orb ln-orb-1" />
        <div className="ln-orb ln-orb-2" />
        <div className="ln-orb ln-orb-3" />

        <nav className="ln-nav">
          <div className="ln-logo">MoodMate</div>
          <div className="ln-nav-btns">
            <button className="btn-nav-ghost" onClick={() => navigate('/login')}>Sign in</button>
            <button className="btn-nav-fill" onClick={() => navigate('/signup')}>Get started</button>
          </div>
        </nav>

        <div className="ln-hero">
          <div className="ln-badge">
            <span className="ln-badge-dot" />
            AI-Powered Music Discovery
          </div>

          <h1 className="ln-h1">
            Music that <span className="ln-h1-grad">feels</span><br />
            exactly right
          </h1>

          <p className="ln-sub">
            Tell MoodMate how you're feeling — or just show it your face — and get a personalized playlist curated by AI, instantly.
          </p>

          <div className="ln-cta">
            <button className="btn-cta-main" onClick={() => navigate('/signup')}>Start for free</button>
            <button className="btn-cta-ghost" onClick={() => navigate('/login')}>Sign in</button>
          </div>
        </div>

        <div className="ln-features">
          <div className="ln-feature">
            <div className="ln-feature-tag">Feature 01</div>
            <div className="ln-feature-title">Facial Mood Detection</div>
            <div className="ln-feature-desc">Your camera reads your expression in real time using on-device AI</div>
          </div>
          <div className="ln-feature" style={{borderLeft:'1px solid rgba(255,255,255,0.06)', borderRight:'1px solid rgba(255,255,255,0.06)'}}>
            <div className="ln-feature-tag">Feature 02</div>
            <div className="ln-feature-title">Instant Track Curation</div>
            <div className="ln-feature-desc">9 songs with 30-sec previews delivered the moment your mood is detected</div>
          </div>
          <div className="ln-feature">
            <div className="ln-feature-tag">Feature 03</div>
            <div className="ln-feature-title">Mood Journal</div>
            <div className="ln-feature-desc">Track your emotional patterns over time with a visual mood history</div>
          </div>
        </div>
      </div>
    </>
  );
}