import React, { useState } from "react";

function GameNavbar({ 
  gameName = "Game", 
  gameIcon = "🎮", 
  showScore = false, 
  score = 0, 
  showLevel = false, 
  level = null, 
  onLevelChange = null,
  showBack = true,
  onBack = null
}) {
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, zIndex:999,
      background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
      boxShadow:'0 4px 20px rgba(0,0,0,0.08)', padding:'0.8rem 1.6rem',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      borderBottom:'1px solid rgba(102,126,234,0.15)'
    }}>
      {/* Left: Game title */}
      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
        <span style={{fontSize:'1.5rem'}}>{gameIcon}</span>
        <h2 style={{
          margin:0,
          fontSize:'1.1rem', fontWeight:800,
          color:'#667eea',
          background:'linear-gradient(90deg, #667eea, #764ba2)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', 
          backgroundClip:'text'
        }}>{gameName}</h2>
      </div>

      {/* Right: Games dropdown + Back + Level + Score */}
      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
        {/* Games Dropdown */}
        <div style={{ position:'relative' }} tabIndex={0} onBlur={() => setTimeout(()=>setGamesMenuOpen(false),150)}>
          <button
            onClick={() => setGamesMenuOpen(v => !v)}
            title="Switch Games"
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              background:'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color:'#fff', border:'none', borderRadius:'14px',
              padding:'0.7rem 1.2rem', fontWeight:700, fontSize:'0.9rem',
              boxShadow:'0 6px 20px rgba(245,87,108,0.3)',
              cursor:'pointer', transition:'all 0.3s ease'
            }}
            onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0)'}
          >
            <span style={{fontSize:'1.1rem'}}>🎮</span>
            Games
            <span style={{fontSize:'0.8rem', transition:'transform 0.3s', transform:gamesMenuOpen?'rotate(180deg)':'rotate(0)'}}>▾</span>
          </button>
          {gamesMenuOpen && (
            <div style={{
              position:'absolute', top:'110%', right:0, zIndex: 1000,
              background:'rgba(255,255,255,0.98)', backdropFilter:'blur(10px)',
              borderRadius:'13px', padding:'8px',
              boxShadow:'0 12px 32px rgba(0,0,0,0.2)', minWidth:'200px',
              border:'1px solid rgba(245,87,108,0.2)',
              animation:'slideDown 0.2s ease'
            }}>
              {[
                {name:'Home', icon:'🏠', grad:'linear-gradient(135deg,#667eea,#764ba2)', link:'/'},
                {name:'Guess Movie', icon:'🎬', grad:'linear-gradient(135deg,#f093fb,#f5576c)', link:'/movieguess'},
                {name:'Guess Cricketer', icon:'🏏', grad:'linear-gradient(135deg,#43c6ac,#667eea)', link:'/GuessCrickter'},
                {name:'Brain Puzzles', icon:'🧩', grad:'linear-gradient(135deg,#f7971e,#ffd200)', link:'/tricky'},
                {name:'Solve Mystery', icon:'🕵️', grad:'linear-gradient(135deg,#e74c3c,#c0392b)', link:'/mystery'},
                {name:'Guess Country', icon:'🌍', grad:'linear-gradient(135deg,#2ecc40,#27ae60)', link:'/GuessCountry'},
                {name:'Guess Song', icon:'🎵', grad:'linear-gradient(135deg,#667eea,#764ba2)', link:'/GuessSong'}
              ].map(game => (
                <button
                  key={game.name}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); window.location.href = game.link; }}
                  style={{
                    width:'100%', textAlign:'left', margin:'5px 0', padding:'0.6rem 0.8rem',
                    border:'none', borderRadius:'10px', color:'#fff', fontWeight:700,
                    background: game.grad, cursor:'pointer', display:'flex', alignItems:'center', gap:'8px',
                    boxShadow:'0 3px 8px rgba(0,0,0,0.1)',
                    transition:'all 0.2s ease', fontSize:'0.8rem'
                  }}
                  onMouseEnter={(e)=>{e.currentTarget.style.transform='translateX(4px)';e.currentTarget.style.boxShadow='0 5px 12px rgba(0,0,0,0.2)';}}
                  onMouseLeave={(e)=>{e.currentTarget.style.transform='translateX(0)';e.currentTarget.style.boxShadow='0 3px 8px rgba(0,0,0,0.1)';}}
                >
                  <span style={{fontSize:'1rem'}}>{game.icon}</span>
                  {game.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        {showBack && (
          <button
            onClick={handleBackClick}
            title="Back"
            style={{
              display:'flex', alignItems:'center', gap:'6px',
              background:'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color:'#fff', border:'none', borderRadius:'14px',
              padding:'0.7rem 1.2rem', fontWeight:700, fontSize:'0.9rem',
              boxShadow:'0 6px 20px rgba(231,76,60,0.3)',
              cursor:'pointer', transition:'all 0.3s ease'
            }}
            onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0)'}
          >
            <span style={{fontSize:'1.1rem'}}>←</span>
            Back
          </button>
        )}

        {/* Level Selector */}
        {showLevel && onLevelChange && (
          <div style={{ position:'relative' }} tabIndex={0} onBlur={() => setTimeout(()=>setLevelMenuOpen(false),150)}>
            <button
              onClick={() => setLevelMenuOpen(v => !v)}
              title="Select difficulty level"
              style={{
                display:'flex', alignItems:'center', gap:'12px',
                background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color:'#fff', border:'none', borderRadius:'14px',
                padding:'0.7rem 1.4rem', fontWeight:700, fontSize:'1rem',
                boxShadow:'0 6px 20px rgba(102,126,234,0.3)',
                cursor:'pointer', transition:'all 0.3s ease'
              }}
              onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0)'}
            >
              <span style={{fontSize:'1.2rem'}}>⚙️</span>
              {level ? `${level.charAt(0).toUpperCase()+level.slice(1)}` : 'Level'}
              <span style={{fontSize:'0.8rem', transition:'transform 0.3s', transform:levelMenuOpen?'rotate(180deg)':'rotate(0)'}}>▾</span>
            </button>
            {levelMenuOpen && (
              <div style={{
                position:'absolute', top:'110%', left:0, zIndex: 1000,
                background:'rgba(255,255,255,0.98)', backdropFilter:'blur(10px)',
                borderRadius:'13px', padding:'8px',
                boxShadow:'0 12px 32px rgba(0,0,0,0.2)', minWidth:'176px',
                border:'1px solid rgba(102,126,234,0.2)',
                animation:'slideDown 0.2s ease'
              }}>
                {[ 
                  {k:'easy', label:'Easy', grad:'linear-gradient(135deg,#43c6ac,#667eea)', icon:'🟢'},
                  {k:'medium', label:'Medium', grad:'linear-gradient(135deg,#f7971e,#ffd200)', icon:'🟡'},
                  {k:'hard', label:'Hard', grad:'linear-gradient(135deg,#e74c3c,#c0392b)', icon:'🔴'},
                  {k:'random', label:'Random', grad:'linear-gradient(135deg,#667eea,#764ba2)', icon:'🎲'}
                ].map(opt => (
                  <button
                    key={opt.k}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); onLevelChange(opt.k); setLevelMenuOpen(false); }}
                    style={{
                      width:'100%', textAlign:'left', margin:'5px 0', padding:'0.6rem 0.8rem',
                      border:'none', borderRadius:'10px', color:'#fff', fontWeight:700,
                      background: opt.grad, cursor:'pointer', display:'flex', alignItems:'center', gap:'8px',
                      boxShadow: level===opt.k ? '0 0 0 2px rgba(102,126,234,0.3)' : '0 3px 8px rgba(0,0,0,0.1)',
                      transition:'all 0.2s ease', fontSize:'0.8rem'
                    }}
                    onMouseEnter={(e)=>{e.currentTarget.style.transform='translateX(4px)';e.currentTarget.style.boxShadow='0 5px 12px rgba(0,0,0,0.2)';}}
                    onMouseLeave={(e)=>{e.currentTarget.style.transform='translateX(0)';e.currentTarget.style.boxShadow=level===opt.k?'0 0 0 2px rgba(102,126,234,0.3)':'0 3px 8px rgba(0,0,0,0.1)';}}
                  >
                    <span style={{fontSize:'1rem'}}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Score Badge */}
        {showScore && (
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'10px', padding:'0.48rem 1.12rem',
            boxShadow:'0 3px 12px rgba(102,126,234,0.25)',
            display:'flex', alignItems:'center', gap:'6px'
          }}>
            <span style={{fontSize:'1.04rem'}}>🪙</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'0.88rem'}}>{score}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameNavbar;
