import React from 'react';

const SpotifyLoginButton = () => {
  const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
  const redirectUri = 'http://localhost:3000/spotify-callback'; // ✅ This must match your dashboard
  const scopes = 'user-read-email playlist-read-private';

  const handleSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
  };

  return (
    <button onClick={handleSpotifyLogin} style={{ padding: '12px 24px', fontSize: '1rem' }}>
      🎧 Login with Spotify
    </button>
  );
};

export default SpotifyLoginButton;
