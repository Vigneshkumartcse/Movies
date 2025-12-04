import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import app from '../config/Firebase';
import { FaUserCircle, FaSignOutAlt, FaHome, FaInfoCircle, FaBrain } from 'react-icons/fa';

export default function About() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await auth.signOut();
    setShowDropdown(false);
  };

  return (
    <>
      {/* Modern Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 2.5rem)',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
          fontWeight: '800',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          🎮 BrainBuzz
        </div>

        {/* Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <FaHome /> Home
          </Link>

          <Link to="/about" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            background: 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <FaInfoCircle /> About
          </Link>

          <Link to="/tricky" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            transition: 'all 0.3s',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <FaBrain /> Puzzles
          </Link>

          {/* Profile Button */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  background: user.photoURL 
                    ? `url(${user.photoURL}) center/cover` 
                    : 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#667eea',
                  fontSize: '1.3rem',
                  transition: 'all 0.3s',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {!user.photoURL && <FaUserCircle />}
              </button>
              
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  minWidth: '220px',
                  padding: '0.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      margin: '0 0 0.3rem 0',
                      fontWeight: '700',
                      color: '#2d3748',
                      fontSize: '1rem'
                    }}>{user.displayName}</p>
                    <p style={{
                      margin: '0',
                      fontSize: '0.85rem',
                      color: '#718096'
                    }}>{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      background: 'transparent',
                      border: 'none',
                      color: '#e53e3e',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 62, 62, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.8)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaUserCircle /> Login
            </button>
          )}
        </div>
      </nav>

      <div className="about-full" style={{ paddingTop: '90px' }}>
      <h1 className="about-title">Welcome to BrainBuzz — where learning meets fun! 🎉</h1>
      <p className="about-desc">
        We know how boring classes can sometimes get 😴, so we decided to make something that turns those dull moments into exciting challenges. Here, you’ll find a mix of:
      </p>
      <ul className="about-list">
        <li>🎬 Movie & Character Guessing</li>
        <li>🏏 Cricket Brain Games</li>
        <li>🧠 Mind-twisting Puzzles — all designed to keep your brain active and your mood fresh.</li>
      </ul>
      <p className="about-desc">
        Our goal is simple — to make students think, laugh, and stay curious. Whether you’re guessing a movie from emojis, solving a tricky riddle, or challenging your friends to beat your score, every click here is about having fun while sharpening your mind.
      </p>
      <p className="about-desc">
        We believe learning doesn't always need books — sometimes, it just needs a good puzzle and a smile! 😊
      </p>
      </div>
    </>
  );
}
