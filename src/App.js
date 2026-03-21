import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Result from './pages/Result';
import History from './pages/History';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import { moodDisplayData } from './utils/MoodMap';

function App() {
  const [loading, setLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [mood, setMood] = useState('');
  const [advice, setAdvice] = useState('');
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  const navigate = useNavigate();

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const fetchMusicByMood = async (moodInput) => {
    setLoading(true);
    setMood(moodInput);
    setNoResult(false);
    setTracks([]);
    setPlaylist(null);

    document.body.style.backgroundColor = moodDisplayData[moodInput]?.bgColor || '#fff';

    const currentMoodData = moodDisplayData[moodInput];
    if (currentMoodData) {
      speak(`Your mood is ${moodInput}. ${currentMoodData.quote}`);
    }

    // ── Save mood to MySQL (real database) ──────────────────────────────
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/mood/log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ mood: moodInput }),
        });
      } catch (err) {
        console.warn('Could not log mood to DB:', err.message);
      }
    }

    // ── Also keep localStorage for quick access ─────────────────────────
    localStorage.setItem('lastMood', moodInput);
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const newHistory = [{ mood: moodInput, time: new Date().toLocaleString() }, ...history].slice(0, 50);
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));

    try {
      const musicResponse = await fetch(`http://localhost:5000/tracks/${moodInput}`);
      const musicData = await musicResponse.json();

      if (musicResponse.ok && musicData.tracks && musicData.tracks.length > 0) {
        setTracks(musicData.tracks);
        setPlaylist(musicData.playlist);
        setNoResult(false);
      } else {
        setNoResult(true);
        setTracks([]);
        setPlaylist(null);
      }

      const adviceResponse = await fetch(`http://localhost:5000/advice/${moodInput}`);
      const adviceData = await adviceResponse.json();
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
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
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
    </Routes>
  );
}

export default App;