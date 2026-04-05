import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Landing  from './pages/Landing';
import Login    from './pages/Login';
import Signup   from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Result   from './pages/Result';
import History  from './pages/History';
import Profile  from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { moodDisplayData } from './utils/MoodMap';

// ── Single source of truth for API URL ──────────────────────────────────────
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', background: '#0d0d1a', color: '#f0eeff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'Nunito, sans-serif', gap: '16px',
    }}>
      <div style={{ fontSize: '4rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', opacity: 0.15 }}>404</div>
      <div style={{ fontSize: '1.1rem', color: 'rgba(240,238,255,0.4)' }}>This page doesn't exist.</div>
      <button
        onClick={() => navigate('/')}
        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)', border: 'none', color: 'white', padding: '12px 28px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Nunito, sans-serif' }}
      >
        Go home
      </button>
    </div>
  );
}

function App() {
  const [loading, setLoading]   = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [mood, setMood]         = useState('');
  const [advice, setAdvice]     = useState('');
  const [tracks, setTracks]     = useState([]);
  const [playlist, setPlaylist] = useState(null);

  const navigate = useNavigate();

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'en-US';
    utterance.pitch = 1.2;
    utterance.rate  = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const fetchMusicByMood = async (moodInput) => {
    setLoading(true);
    setMood(moodInput);
    setNoResult(false);
    setTracks([]);
    setPlaylist(null);

    document.body.style.backgroundColor = moodDisplayData[moodInput]?.bgColor || '#0d0d1a';

    const currentMoodData = moodDisplayData[moodInput];
    if (currentMoodData) {
      speak(`Your mood is ${moodInput}. ${currentMoodData.quote}`);
    }

    // Save mood to MySQL
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API}/mood/log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ mood: moodInput }),
        });
      } catch (err) {
        console.warn('Could not log mood to DB:', err.message);
      }
    }

    // localStorage fallback
    localStorage.setItem('lastMood', moodInput);
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const newHistory = [{ mood: moodInput, time: new Date().toLocaleString() }, ...history].slice(0, 50);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));

    try {
      const [musicResponse, adviceResponse] = await Promise.all([
        fetch(`${API}/tracks/${moodInput}`),
        fetch(`${API}/advice/${moodInput}`),
      ]);

      const musicData  = await musicResponse.json();
      const adviceData = await adviceResponse.json();

      if (musicResponse.ok && musicData.tracks?.length > 0) {
        setTracks(musicData.tracks);
        setPlaylist(musicData.playlist);
        setNoResult(false);
      } else {
        setNoResult(true);
        setTracks([]);
        setPlaylist(null);
      }

      setAdvice(adviceData.advice || '');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error fetching mood-based data:', err);
      setNoResult(true);
      setTracks([]);
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard
            fetchMusicByMood={fetchMusicByMood}
            mood={mood} loading={loading} noResult={noResult}
            advice={advice} tracks={tracks} playlist={playlist}
          />
        </PrivateRoute>
      } />

      <Route path="/result" element={
        <PrivateRoute>
          <Result loading={loading} noResult={noResult} mood={mood}
            advice={advice} tracks={tracks} playlist={playlist} />
        </PrivateRoute>
      } />

      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;