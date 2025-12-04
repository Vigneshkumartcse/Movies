import React, { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../config/Firebase";
import { FaGoogle, FaGamepad, FaUserCheck, FaLock, FaHome, FaInfoCircle, FaBrain, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

export default function GoogleLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [welcomeUser, setWelcomeUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setWelcomeUser(currentUser.displayName);
        setAlreadyLoggedIn(true);
        // Show modal when already logged in on page load
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000);
      } else {
        setWelcomeUser(null);
        setAlreadyLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await auth.signOut();
    setShowDropdown(false);
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Check if already logged in
    if (alreadyLoggedIn) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setWelcomeUser(user.displayName);
      setShowModal(true);
      setAlreadyLoggedIn(true);
      setTimeout(() => {
        setShowModal(false);
      }, 4000);
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
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
          {user && (
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
          )}
        </div>
      </nav>

      <div className="login-container">
        {/* Animated Background Elements */}
        <div className="login-bg-circle login-circle-1"></div>
        <div className="login-bg-circle login-circle-2"></div>
        <div className="login-bg-circle login-circle-3"></div>

      {/* Main Login Card */}
      <div className="login-card">
        {/* Icon Header */}
        <div className="login-icon-wrapper">
          <FaGamepad className="login-main-icon" />
        </div>

        {/* Title Section */}
        <h1 className="login-title">
          Welcome to <span className="login-brand">GuessGame</span>
        </h1>
        <p className="login-subtitle">
          🎬 Movies • 🌍 Countries • 🎵 Songs • 🏏 Cricket & More!
        </p>

        {/* Login Button */}
        <div className="login-button-wrapper">
          <button
            id="googleLogin"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="login-google-btn"
          >
            {loading ? (
              <>
                <div className="login-spinner"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <FaGoogle className="login-google-icon" />
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Features Section */}
        <div className="login-features">
          <div className="login-feature">
            <FaLock className="login-feature-icon" />
            <span>Secure Authentication</span>
          </div>
          <div className="login-feature">
            <FaGamepad className="login-feature-icon" />
            <span>Multiple Games</span>
          </div>
        </div>

        {/* Footer Text */}
        <p className="login-footer">
          By signing in, you agree to our{" "}
          <span className="login-link">Terms</span> &{" "}
          <span className="login-link">Privacy Policy</span>
        </p>
      </div>

        {/* Welcome/Already Logged In Modal */}
        {showModal && (
          <div className="login-modal-overlay">
            <div className="login-modal-card">
              <div className="login-modal-icon-wrapper">
                <FaUserCheck className="login-modal-icon" />
              </div>
              <h2 className="login-modal-title">
                {alreadyLoggedIn ? "Already Logged In!" : "Welcome Back!"}
              </h2>
              <p className="login-modal-name">{welcomeUser}</p>
              <div className="login-modal-progress"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
