// Result.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { moodDisplayData } from '../utils/MoodMap';

function Result({ tracks = [], loading = false, noResult = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const mood = location?.state?.mood || localStorage.getItem('lastMood');

  useEffect(() => {
    if (!mood) {
      setTimeout(() => navigate('/'), 2000);
    }
  }, [mood, navigate]);

  const moodData = moodDisplayData[mood];

  if (!mood) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>No mood detected. Redirecting to home...</p>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: moodData?.bgColor || '#eee',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2>You are feeling: <strong>{mood.toUpperCase()}</strong></h2>
        <p style={{ fontStyle: 'italic', marginTop: '10px' }}>{moodData?.quote}</p>
      </div>

      <h3 style={{ marginBottom: '20px' }}>Music Suggestions for Your Mood</h3>

      {loading ? (
        <div className="spinner" style={{ margin: '50px auto' }} />
      ) : noResult ? (
        <p style={{ fontSize: '1.2rem', color: '#555' }}>No songs found for this mood. Try a different one!</p>
      ) : Array.isArray(tracks) && tracks.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          justifyContent: 'center'
        }}>
          {tracks.map((track, index) => (
            <div key={index} style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              animation: `fadeIn 0.4s ease-out`
            }}>
              <img
                src={track.img}
                alt={track.name}
                style={{ width: '150px', height: '150px', borderRadius: '8px', marginBottom: '10px', objectFit: 'cover' }}
              />
              <h4 style={{ margin: '5px 0', fontSize: '1.1rem', color: '#333' }}>{track.name}</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#777' }}>{track.artist}</p>
              {track.preview && (
                <audio controls style={{ width: '100%', maxWidth: '220px' }}>
                  <source src={track.preview} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '1rem', color: '#777' }}>No tracks to display.</p>
      )}
    </div>
  );
}

export default Result;