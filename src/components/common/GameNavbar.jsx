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
  onBack = null,
  showTeam = false,
  onTeamStart = null,
  autoPlay = false,
  onAutoPlayToggle = null,
  showAutoPlay = false
}) {
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
    <div style={{
      position:'fixed', top:0, left:0, right:0, zIndex:999,
      background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
      boxShadow:'0 4px 20px rgba(0,0,0,0.08)', padding:'0.8rem 1rem',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      borderBottom:'1px solid rgba(102,126,234,0.15)'
    }}>
      {/* Left: Game title */}
      <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
        <span style={{fontSize:'1.3rem'}}>{gameIcon}</span>
        <h2 style={{
          margin:0,
          fontSize:'clamp(0.75rem, 3vw, 1rem)', fontWeight:800,
          color:'#667eea',
          background:'linear-gradient(90deg, #667eea, #764ba2)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', 
          backgroundClip:'text',
          whiteSpace:'nowrap',
          overflow:'hidden',
          textOverflow:'ellipsis'
        }}>{gameName}</h2>
      </div>

      {/* Score Badge - Always visible on mobile */}
      <div className="mobile-score-display" style={{display:'none'}}>
        {showScore && (
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'10px', padding:'0.5rem 0.9rem',
            boxShadow:'0 3px 12px rgba(102,126,234,0.25)',
            display:'flex', alignItems:'center', gap:'6px'
          }}>
            <span style={{fontSize:'1rem'}}>🪙</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'0.85rem'}}>{score}</span>
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div style={{display:'flex', alignItems:'center', gap:'8px'}} className="desktop-nav">
        {/* Auto Play Button (conditionally rendered) */}
        {onAutoPlayToggle && showAutoPlay && (
          <div style={{position:'relative', display:'inline-block'}}>
            <button
              onClick={onAutoPlayToggle}
              className="auto-play-btn"
              style={{
                background: autoPlay 
                  ? 'linear-gradient(135deg, #2ecc40, #27ae60)' 
                  : 'rgba(255, 255, 255, 0.95)',
                border: autoPlay ? 'none' : '2px solid rgba(102, 126, 234, 0.3)',
                borderRadius:'12px',
                padding:'0.5rem 1rem',
                color: autoPlay ? '#fff' : '#667eea',
                fontSize:'0.8rem',
                fontWeight:700,
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                gap:'8px',
                boxShadow: autoPlay 
                  ? '0 4px 15px rgba(46, 204, 64, 0.5), inset 0 1px 3px rgba(255,255,255,0.3)' 
                  : '0 3px 10px rgba(102, 126, 234, 0.2)',
                transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace:'nowrap',
                position:'relative',
                overflow:'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = autoPlay 
                  ? '0 6px 20px rgba(46, 204, 64, 0.6), inset 0 1px 3px rgba(255,255,255,0.3)' 
                  : '0 5px 15px rgba(102, 126, 234, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = autoPlay 
                  ? '0 4px 15px rgba(46, 204, 64, 0.5), inset 0 1px 3px rgba(255,255,255,0.3)' 
                  : '0 3px 10px rgba(102, 126, 234, 0.2)';
              }}
            >
              {autoPlay && (
                <div style={{
                  position:'absolute',
                  top:0, left:0, right:0, bottom:0,
                  background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation:'shimmer 2s infinite',
                  pointerEvents:'none'
                }}></div>
              )}
              <span style={{
                fontSize:'1.1rem',
                filter: autoPlay ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
              }}>
                {autoPlay ? '✅' : '▶️'}
              </span>
              <span style={{
                fontWeight:800,
                letterSpacing:'0.02em',
                textShadow: autoPlay ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
              }}>
                Auto {autoPlay ? 'ON' : 'OFF'}
              </span>
            </button>
            
            {/* Info Icon with Tooltip */}
            <div 
              className="info-icon"
              style={{
                position:'absolute',
                top:'-8px',
                right:'-8px',
                background:'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius:'50%',
                width:'20px',
                height:'20px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:'0.7rem',
                fontWeight:800,
                color:'#fff',
                cursor:'help',
                boxShadow:'0 2px 8px rgba(102, 126, 234, 0.4)',
                border:'2px solid #fff',
                zIndex:1
              }}
            >
              i
            </div>
            
            {/* Tooltip */}
            <div 
              className="auto-tooltip"
              style={{
                position:'absolute',
                top:'calc(100% + 10px)',
                right:'0',
                background:'rgba(0, 0, 0, 0.95)',
                backdropFilter:'blur(15px)',
                color:'#fff',
                padding:'0.8rem 1rem',
                borderRadius:'10px',
                fontSize:'0.75rem',
                fontWeight:600,
                whiteSpace:'nowrap',
                boxShadow:'0 8px 20px rgba(0, 0, 0, 0.4)',
                opacity:0,
                pointerEvents:'none',
                transition:'opacity 0.3s ease, transform 0.3s ease',
                zIndex:10001,
                transform:'translateY(-5px)'
              }}
            >
              Automatically moves to next question after answering (2s)
              <div style={{
                position:'absolute',
                top:'-5px',
                right:'20px',
                width:0,
                height:0,
                borderLeft:'6px solid transparent',
                borderRight:'6px solid transparent',
                borderBottom:'6px solid rgba(0, 0, 0, 0.95)'
              }}></div>
            </div>
          </div>
        )}
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
              position:'absolute', top:'110%', right:0, zIndex: 997,
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

        {/* Team Button */}
        {showTeam && (
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setShowTeamModal(v => !v)}
              title="Team Mode"
              style={{
                display:'flex', alignItems:'center', gap:'6px',
                background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color:'#fff', border:'none', borderRadius:'14px',
                padding:'0.7rem 1.2rem', fontWeight:700, fontSize:'0.9rem',
                boxShadow:'0 6px 20px rgba(67, 233, 123, 0.3)',
                cursor:'pointer', transition:'all 0.3s ease'
              }}
              onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0)'}
            >
              <span style={{fontSize:'1.1rem'}}>👥</span>
              Team
              <span style={{fontSize:'0.8rem', transition:'transform 0.3s', transform:showTeamModal?'rotate(180deg)':'rotate(0)'}}>▾</span>
            </button>
            
            {/* Team Selection Dropdown */}
            {showTeamModal && (
              <div style={{
                position:'absolute',
                top:'110%',
                right:0,
                zIndex: 997,
                background:'rgba(255,255,255,0.98)',
                backdropFilter:'blur(20px)',
                borderRadius:'16px',
                padding:'1.2rem',
                boxShadow:'0 12px 40px rgba(0,0,0,0.25)',
                minWidth:'280px',
                border:'2px solid rgba(67, 233, 123, 0.3)',
                animation:'slideDown 0.2s ease'
              }}>
                <div style={{
                  marginBottom:'1rem',
                  paddingBottom:'0.8rem',
                  borderBottom:'1px solid rgba(67, 233, 123, 0.15)'
                }}>
                  <div style={{
                    fontSize:'0.95rem',
                    fontWeight:800,
                    marginBottom:'0.3rem',
                    background:'linear-gradient(135deg, #43e97b, #38f9d7)',
                    WebkitBackgroundClip:'text',
                    WebkitTextFillColor:'transparent',
                    backgroundClip:'text',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.5rem'
                  }}>
                    <span style={{
                      width:'28px',
                      height:'28px',
                      background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      borderRadius:'8px',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      fontSize:'0.95rem',
                      boxShadow:'0 3px 10px rgba(67, 233, 123, 0.3)',
                      WebkitBackgroundClip:'initial',
                      WebkitTextFillColor:'initial',
                      backgroundClip:'initial'
                    }}>👥</span>
                    Select Teams
                  </div>
                  <p style={{
                    color:'#64748b',
                    fontSize:'0.72rem',
                    margin:0,
                    fontWeight:500
                  }}>
                    Choose number of teams (2-6)
                  </p>
                </div>
                
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(3, 1fr)',
                  gap:'0.6rem',
                  marginBottom:'1rem'
                }}>
                  {[2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setNumberOfTeams(num);
                      }}
                      style={{
                        aspectRatio:'1',
                        borderRadius:'12px',
                        border: numberOfTeams === num ? '2px solid #43e97b' : '2px solid rgba(67, 233, 123, 0.2)',
                        background: numberOfTeams === num 
                          ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' 
                          : 'rgba(67, 233, 123, 0.08)',
                        color: numberOfTeams === num ? '#fff' : '#10b981',
                        fontSize:'1.4rem',
                        fontWeight:800,
                        cursor:'pointer',
                        transition:'all 0.25s ease',
                        boxShadow: numberOfTeams === num 
                          ? '0 6px 16px rgba(67, 233, 123, 0.35)' 
                          : '0 2px 6px rgba(0,0,0,0.05)',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        position:'relative'
                      }}
                      onMouseEnter={(e) => {
                        if (numberOfTeams !== num) {
                          e.currentTarget.style.background = 'rgba(67, 233, 123, 0.15)';
                          e.currentTarget.style.transform = 'scale(1.08)';
                          e.currentTarget.style.borderColor = 'rgba(67, 233, 123, 0.4)';
                        } else {
                          e.currentTarget.style.transform = 'scale(1.08)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        if (numberOfTeams !== num) {
                          e.currentTarget.style.background = 'rgba(67, 233, 123, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(67, 233, 123, 0.2)';
                        }
                      }}
                    >
                      {numberOfTeams === num && (
                        <div style={{
                          position:'absolute',
                          top:'-4px',
                          right:'-4px',
                          width:'18px',
                          height:'18px',
                          background:'#fff',
                          borderRadius:'50%',
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          fontSize:'0.65rem',
                          boxShadow:'0 2px 6px rgba(0,0,0,0.2)',
                          color:'#10b981'
                        }}>
                          ✓
                        </div>
                      )}
                      {num}
                    </button>
                  ))}
                </div>
                
                <div style={{
                  display:'flex',
                  gap:'0.6rem',
                  paddingTop:'0.8rem',
                  borderTop:'1px solid rgba(67, 233, 123, 0.15)'
                }}>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowTeamModal(false);
                    }}
                    style={{
                      flex:1,
                      background:'rgba(239, 68, 68, 0.1)',
                      border:'2px solid rgba(239, 68, 68, 0.3)',
                      borderRadius:'10px',
                      padding:'0.65rem',
                      color:'#ef4444',
                      fontSize:'0.8rem',
                      fontWeight:700,
                      cursor:'pointer',
                      transition:'all 0.25s ease',
                      boxShadow:'0 2px 6px rgba(239, 68, 68, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowTeamModal(false);
                      if (onTeamStart) onTeamStart(numberOfTeams);
                    }}
                    style={{
                      flex:1.5,
                      background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      border:'none',
                      borderRadius:'10px',
                      padding:'0.65rem',
                      color:'#fff',
                      fontSize:'0.8rem',
                      fontWeight:700,
                      cursor:'pointer',
                      boxShadow:'0 4px 12px rgba(67, 233, 123, 0.3)',
                      transition:'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(67, 233, 123, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(67, 233, 123, 0.3)';
                    }}
                  >
                    Start Game →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
                background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
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

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-menu-btn"
        style={{
          display:'none',
          background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
          border:'none',
          borderRadius:'10px',
          padding:'0.6rem',
          cursor:'pointer',
          boxShadow:'0 4px 12px rgba(102,126,234,0.3)',
          transition:'all 0.3s ease'
        }}
      >
        <div style={{
          display:'flex',
          flexDirection:'column',
          gap:'4px',
          width:'24px',
          height:'20px'
        }}>
          <span style={{
            display:'block',
            width:'100%',
            height:'3px',
            background:'#fff',
            borderRadius:'2px',
            transition:'all 0.3s',
            transform: mobileMenuOpen ? 'rotate(45deg) translateY(10px)' : 'none'
          }}></span>
          <span style={{
            display:'block',
            width:'100%',
            height:'3px',
            background:'#fff',
            borderRadius:'2px',
            transition:'all 0.3s',
            opacity: mobileMenuOpen ? 0 : 1
          }}></span>
          <span style={{
            display:'block',
            width:'100%',
            height:'3px',
            background:'#fff',
            borderRadius:'2px',
            transition:'all 0.3s',
            transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-10px)' : 'none'
          }}></span>
        </div>
      </button>
    </div>

    {/* Mobile Dropdown Menu */}
    {mobileMenuOpen && (
      <div className="mobile-menu" style={{
        position:'fixed',
        top:'60px',
        left:0,
        right:0,
        background:'rgba(255,255,255,0.98)',
        backdropFilter:'blur(20px)',
        boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
        zIndex:998,
        padding:'1rem',
        maxHeight:'calc(100vh - 60px)',
        overflowY:'auto',
        animation:'slideDown 0.3s ease',
        display:'none'
      }}>
        {/* Mobile Score */}
        {showScore && (
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'12px',
            padding:'0.8rem',
            marginBottom:'1rem',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'8px'
          }}>
            <span style={{fontSize:'1.3rem'}}>🪙</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'1.1rem'}}>Score: {score}</span>
          </div>
        )}

        {/* Mobile Team Button */}
        {showTeam && (
          <button
            onClick={() => {
              setShowTeamModal(true);
              setMobileMenuOpen(false);
            }}
            style={{
              width:'100%',
              background:'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color:'#fff',
              border:'none',
              borderRadius:'12px',
              padding:'1rem',
              fontSize:'1rem',
              fontWeight:700,
              cursor:'pointer',
              marginBottom:'0.8rem',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:'8px',
              boxShadow:'0 4px 12px rgba(67, 233, 123, 0.3)'
            }}
          >
            <span style={{fontSize:'1.2rem'}}>👥</span>
            Team Mode
          </button>
        )}

        {/* Mobile Level Selector */}
        {showLevel && onLevelChange && (
          <div style={{marginBottom:'0.8rem'}}>
            <div style={{
              fontSize:'0.85rem',
              fontWeight:700,
              color:'#64748b',
              marginBottom:'0.5rem',
              textTransform:'uppercase',
              letterSpacing:'0.05em'
            }}>Select Level</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem'}}>
              {[ 
                {k:'easy', label:'Easy', grad:'linear-gradient(135deg,#43c6ac,#667eea)', icon:'🟢'},
                {k:'medium', label:'Medium', grad:'linear-gradient(135deg,#f7971e,#ffd200)', icon:'🟡'},
                {k:'hard', label:'Hard', grad:'linear-gradient(135deg,#e74c3c,#c0392b)', icon:'🔴'},
                {k:'random', label:'Random', grad:'linear-gradient(135deg,#667eea,#764ba2)', icon:'🎲'}
              ].map(opt => (
                <button
                  key={opt.k}
                  onClick={() => {
                    onLevelChange(opt.k);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: opt.grad,
                    border: level===opt.k ? '3px solid rgba(255,255,255,0.5)' : 'none',
                    borderRadius:'10px',
                    padding:'0.8rem',
                    color:'#fff',
                    fontSize:'0.85rem',
                    fontWeight:700,
                    cursor:'pointer',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    gap:'6px',
                    boxShadow:'0 3px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Games List */}
        <div style={{marginBottom:'0.8rem'}}>
          <div style={{
            fontSize:'0.85rem',
            fontWeight:700,
            color:'#64748b',
            marginBottom:'0.5rem',
            textTransform:'uppercase',
            letterSpacing:'0.05em'
          }}>Switch Game</div>
          <div style={{display:'flex', flexDirection:'column', gap:'0.6rem'}}>
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
                onClick={() => window.location.href = game.link}
                style={{
                  width:'100%',
                  background: game.grad,
                  border:'none',
                  borderRadius:'10px',
                  padding:'0.9rem',
                  color:'#fff',
                  fontSize:'0.9rem',
                  fontWeight:700,
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  gap:'10px',
                  boxShadow:'0 3px 10px rgba(0,0,0,0.15)',
                  transition:'transform 0.2s'
                }}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{fontSize:'1.2rem'}}>{game.icon}</span>
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Back Button */}
        {showBack && (
          <button
            onClick={() => {
              handleBackClick();
              setMobileMenuOpen(false);
            }}
            style={{
              width:'100%',
              background:'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color:'#fff',
              border:'none',
              borderRadius:'12px',
              padding:'1rem',
              fontSize:'1rem',
              fontWeight:700,
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:'8px',
              boxShadow:'0 4px 12px rgba(231,76,60,0.3)'
            }}
          >
            <span style={{fontSize:'1.2rem'}}>←</span>
            Back
          </button>
        )}
      </div>
    )}

    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @media (max-width: 768px) {
        .desktop-nav {
          display: none !important;
        }
        .mobile-menu-btn {
          display: flex !important;
        }
        .mobile-menu {
          display: block !important;
        }
        .mobile-score-display {
          display: flex !important;
        }
      }
      @media (min-width: 769px) {
        .desktop-nav {
          display: flex !important;
        }
      }
      .info-icon:hover + .auto-tooltip {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      .auto-play-btn:hover ~ .info-icon + .auto-tooltip {
        opacity: 0 !important;
      }
    `}</style>
    </>
  );
}

export default GameNavbar;
