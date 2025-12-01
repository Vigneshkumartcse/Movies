import React from 'react'

function Load() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gap: '2rem'
    }}>
      {/* Modern spinning loader */}
      <div style={{
        width: '80px',
        height: '80px',
        border: '8px solid rgba(255,255,255,0.2)',
        borderTop: '8px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}></div>
      
      {/* Loading text with gradient */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7), #fff)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'shimmer 2s linear infinite'
      }}>
        Loading...
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  )
}

export default Load
