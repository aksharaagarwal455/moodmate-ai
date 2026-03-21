import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Guest';

  // Get initials like "AA"
  const initials = userName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2); // Limit to 2 letters

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/dashboard')}>
        🎧 MoodMate
      </div>

      <div style={styles.right}>
        <div style={styles.avatar}>{initials}</div>

        <div style={styles.links}>
          <button onClick={() => navigate('/dashboard')} style={styles.btn}>Dashboard</button>
          <button onClick={() => navigate('/history')} style={styles.btn}>History</button>
          <button
            onClick={() => {
              localStorage.removeItem('loggedIn');
              localStorage.removeItem('userName');
              navigate('/login');
            }}
            style={{ ...styles.btn, backgroundColor: '#ff5252' }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#fff',
    padding: '15px 30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Poppins',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#6200ee'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  avatar: {
    backgroundColor: '#6200ee',
    color: 'white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
  },
  links: {
    display: 'flex',
    gap: '10px'
  },
  btn: {
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#6200ee',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

export default Navbar;
