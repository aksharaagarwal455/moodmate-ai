import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import MoodInput from '../MoodInput';
import FaceMoodDetector from '../FaceMoodDetector';
import { moodDisplayData } from '../utils/MoodMap';

export default function Dashboard({
  fetchMusicByMood,
  tracks = [],
  mood = '',
  loading = false,
  noResult = false,
  advice = '',
  playlist = null,
}) {
  const moodData = moodDisplayData[mood];

  useEffect(() => {
    document.body.style.background = '#0d0d1a';
    return () => { document.body.style.background = ''; };
  }, []);

  const MOOD_COLORS = {
    happy: '#fbbf24', sad: '#60a5fa', angry: '#f87171',
    surprised: '#a78bfa', disgusted: '#34d399', fearful: '#f472b6', neutral: '#94a3b8',
  };
  const accentColor = MOOD_COLORS[mood] || '#a78bfa';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Nunito:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root { display: flex; min-height: 100vh; background: #0d0d1a; color: #f0eeff; font-family: 'Nunito', sans-serif; }
        .db-main { margin-left: 230px; flex: 1; display: flex; flex-direction: column; }

        .db-topbar {
          padding: 32px 48px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: linear-gradient(180deg, rgba(13,13,26,0.8) 0%, transparent 100%);
        }
        .db-greeting { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(240,238,255,0.3); margin-bottom: 6px; }
        .db-page-title { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; color: #f0eeff; letter-spacing: -0.02em; }
        .db-page-title-accent { background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .db-content { padding: 32px 48px; flex: 1; }
        .db-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 32px; }

        .db-card { background: #13131f; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; transition: border-color 0.2s; }
        .db-card:hover { border-color: rgba(255,255,255,0.1); }
        .db-card-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(240,238,255,0.25); margin-bottom: 16px; }

        .db-mood-pill { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; padding: 12px 24px; margin-bottom: 24px; }
        .db-mood-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .db-mood-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #f0eeff; text-transform: capitalize; }
        .db-mood-quote { font-size: 0.85rem; color: rgba(240,238,255,0.4); font-style: italic; margin-left: 8px; }

        .db-advice { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-left: 3px solid #a78bfa; border-radius: 12px; padding: 14px 18px; font-size: 0.9rem; color: rgba(240,238,255,0.55); font-style: italic; line-height: 1.6; margin-bottom: 28px; }

        .db-section-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .db-section-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(240,238,255,0.25); }

        .db-tracks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
        .db-track-card { background: #13131f; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow: hidden; transition: all 0.2s ease; cursor: pointer; }
        .db-track-card:hover { border-color: rgba(167,139,250,0.3); transform: translateY(-3px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
        .db-track-img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; background: #1a1a2e; }
        .db-track-body { padding: 12px 14px; }
        .db-track-name { font-size: 0.85rem; font-weight: 700; color: #f0eeff; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .db-track-artist { font-size: 0.75rem; color: rgba(240,238,255,0.35); font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 10px; }
        .db-track-audio { width: 100%; height: 26px; opacity: 0.65; }
        .db-track-audio:hover { opacity: 1; }
        .db-track-link { font-size: 0.75rem; color: #a78bfa; font-weight: 600; text-decoration: none; }
        .db-track-link:hover { color: #c4b5fd; }

        .db-empty { text-align: center; padding: 80px 40px; }
        .db-empty-title { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: rgba(240,238,255,0.12); margin-bottom: 10px; }
        .db-empty-sub { font-size: 0.85rem; color: rgba(240,238,255,0.2); }

        .db-spinner { width: 36px; height: 36px; border: 2px solid rgba(255,255,255,0.08); border-top-color: #a78bfa; border-radius: 50%; animation: spin 0.75s linear infinite; margin: 60px auto; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .db-main { margin-left: 0; }
          .db-topbar, .db-content { padding: 24px 20px; padding-top: 70px; }
          .db-input-grid { grid-template-columns: 1fr; }
          .db-topbar { padding-top: 70px; }
        }
      `}</style>

      <div className="db-root">
        <Sidebar />

        <main className="db-main">
          <div className="db-topbar">
            <div className="db-greeting">Welcome back, {localStorage.getItem('userName')?.split(' ')[0] || 'there'}</div>
            <h1 className="db-page-title">How are you <span className="db-page-title-accent">feeling?</span></h1>
          </div>

          <div className="db-content">
            <div className="db-input-grid">
              <div className="db-card">
                <div className="db-card-label">Type your mood</div>
                <MoodInput onSubmit={fetchMusicByMood} />
              </div>
              <div className="db-card">
                <div className="db-card-label">Camera detection</div>
                <FaceMoodDetector onMoodDetected={fetchMusicByMood} />
              </div>
            </div>

            <AnimatePresence>
              {mood && moodData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  className="db-mood-pill"
                >
                  <span className="db-mood-dot" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}60` }} />
                  <span className="db-mood-text">{mood}</span>
                  <span className="db-mood-quote">— {moodData.quote}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {advice && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25, delay: 0.1 }}
                  className="db-advice"
                >
                  {advice}
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="db-spinner" />
            ) : noResult && !playlist ? (
              <div className="db-empty">
                <div className="db-empty-title">No tracks found</div>
                <div className="db-empty-sub">Try: happy, sad, angry, calm, neutral</div>
              </div>
            ) : tracks.length > 0 ? (
              <>
                <div className="db-section-row">
                  <span className="db-section-label">{tracks.length} tracks for "{mood}"</span>
                </div>
                <div className="db-tracks-grid">
                  {tracks.map((track, i) => (
                    <motion.div
                      key={track.id || i} className="db-track-card"
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.045 }}
                    >
                      <img className="db-track-img" src={track.img} alt={track.name} />
                      <div className="db-track-body">
                        <div className="db-track-name">{track.name}</div>
                        <div className="db-track-artist">{track.artist}</div>
                        {track.preview
                          ? <audio className="db-track-audio" controls><source src={track.preview} type="audio/mpeg" /></audio>
                          : track.link && <a className="db-track-link" href={track.link} target="_blank" rel="noopener noreferrer">Listen on iTunes ↗</a>
                        }
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="db-empty">
                <div className="db-empty-title">Your vibe, your music</div>
                <div className="db-empty-sub">Enter your mood above or use the camera to get started</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}