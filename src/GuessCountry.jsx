import React, { useState } from "react";
import "./App.css";
import Load from "./Load.jsx";
// removed unused image import

function GuessCountry() {
  const [countries, setCountries] = useState([]);
  const [countryIndex, setCountryIndex] = useState(0);
  const [clueOptions, setClueOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(null); // 'easy', 'medium', 'hard', 'random'
  const [loading, setLoading] = useState(false);
  const [selectedClue, setSelectedClue] = useState(null);
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  const [gamesMenuOpen, setGamesMenuOpen] = useState(false);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function fetchCountries(selectedLevel) {
    setLoading(true);
    let url = "https://guessmovie-4.onrender.com/CountryByCapital/";
    if (selectedLevel === "easy") url += "Easy";
    else if (selectedLevel === "medium") url += "Medium";
    else if (selectedLevel === "hard") url += "Hard";
    else if (selectedLevel === "random") url += "random";
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched data for level:", selectedLevel, data);
      setCountries(shuffleArray(data));
    } catch {
      setCountries([]);
    }
    setLoading(false);
  }

  // Shuffle clues and store in clueOptions when country changes - MUST be before any returns
  React.useEffect(() => {
    if (countries.length > 0 && countryIndex < countries.length) {
      const currentCountry = countries[countryIndex];
      if (currentCountry && Array.isArray(currentCountry.clue)) {
        const cluesArr = [...currentCountry.clue];
        for (let i = cluesArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cluesArr[i], cluesArr[j]] = [cluesArr[j], cluesArr[i]];
        }
        setClueOptions(cluesArr.slice(0, 4));
      } else {
        setClueOptions([]);
      }
    }
  }, [countries, countryIndex]);

  if (!level) {
    return (
      <>
        {/* Navbar */}
        <div style={{
          position:'fixed', top:0, left:0, right:0, zIndex:999,
          background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
          boxShadow:'0 4px 20px rgba(0,0,0,0.08)', padding:'0.8rem 1.6rem',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid rgba(102,126,234,0.15)'
        }}>
          <h2 style={{
            fontSize:'1.2rem', fontWeight:800, margin:0,
            background:'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text', display:'flex', alignItems:'center', gap:'8px'
          }}>
            <span style={{fontSize:'1.5rem'}}>🌎</span>
            Guess the Country Capital
          </h2>
        </div>
        
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          minHeight:'100vh', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding:'4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          <div style={{
            background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
            borderRadius:'19px', padding:'2.4rem 2rem', boxShadow:'0 16px 48px rgba(0,0,0,0.3)',
            maxWidth:'480px', width:'100%', textAlign:'center'
          }}>
            <div style={{marginBottom:'1.6rem'}}>
              <span style={{fontSize:'2.4rem', marginBottom:'0.4rem', display:'block'}}>🌍</span>
            <h2 style={{
              color:'#2d3748', fontWeight:800, fontSize:'1.6rem', marginBottom:'0.4rem',
              background:'linear-gradient(90deg, #667eea, #764ba2)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              backgroundClip:'text'
            }}>
              Choose Your Challenge
            </h2>
            <p style={{color:'#718096', fontSize:'0.8rem', fontWeight:500}}>
              Select a difficulty level to begin
            </p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem'}}>
            {[
              {k:'easy', label:'Easy', grad:'linear-gradient(135deg,#43c6ac,#667eea)', icon:'🟢'},
              {k:'medium', label:'Medium', grad:'linear-gradient(135deg,#f7971e,#ffd200)', icon:'🟡'},
              {k:'hard', label:'Hard', grad:'linear-gradient(135deg,#e74c3c,#c0392b)', icon:'🔴'},
              {k:'random', label:'Random', grad:'linear-gradient(135deg,#667eea,#764ba2)', icon:'🎲'}
            ].map(opt => (
              <button
                key={opt.k}
                type="button"
                onMouseDown={(e)=>{e.preventDefault();setLevel(opt.k);fetchCountries(opt.k);}}
                style={{
                  background:opt.grad, color:'#fff', border:'none', borderRadius:'13px',
                  padding:'0.96rem 1.2rem', fontWeight:700, fontSize:'0.88rem',
                  boxShadow:'0 6px 16px rgba(0,0,0,0.15)', cursor:'pointer',
                  transition:'all 0.3s ease', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'0.4rem'
                }}
                onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-3px) scale(1.02)'}
                onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0) scale(1)'}
              >
                <span style={{fontSize:'1.04rem'}}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }
  if (loading) {
    return <div><Load /></div>;
  }
  if (!countries.length) {
    return (
      <div>
        <Load />
        <p style={{textAlign:'center',marginTop:'2rem',color:'#e74c3c'}}>No questions found for this level.</p>
      </div>
    );
  }

  const currentCountry = countries[countryIndex];

  // Remove input field, use button selection
  const handleClueSelect = (clue) => {
    const answer = currentCountry && (currentCountry.answer || currentCountry.Answer) ? (currentCountry.answer || currentCountry.Answer) : "";
    setSelectedClue(clue);
    if (clue.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setIsCorrect(true);
      setShowNext(true);
      setMessage("You are correct!");
      setScore((prev) => prev + 5); // Award fixed points
    } else {
      setIsCorrect(false);
      setShowNext(true);
      setMessage(`Wrong! The answer was: ${answer}`);
    }
  };

  const handleNextCountry = () => {
    setCountryIndex(countryIndex + 1);
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
    setSelectedClue(null);
  };

  const handleSelectLevel = (lv) => {
    setLevel(lv);
    setCountries([]);
    setCountryIndex(0);
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
    setSelectedClue(null);
    setLevelMenuOpen(false);
    fetchCountries(lv);
  };

  if (countryIndex >= countries.length) {
    return (
      <>
        {/* Navbar */}
        <div style={{
          position:'fixed', top:0, left:0, right:0, zIndex:999,
          background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
          boxShadow:'0 4px 20px rgba(0,0,0,0.08)', padding:'0.8rem 1.6rem',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:'1px solid rgba(102,126,234,0.15)'
        }}>
          <h2 style={{
            fontSize:'1.2rem', fontWeight:800, margin:0,
            color:'#667eea',
            background:'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text', display:'flex', alignItems:'center', gap:'8px'
          }}>
            <span style={{fontSize:'1.5rem'}}>🌎</span>
            Guess the Country Capital
          </h2>
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'10px', padding:'0.48rem 1.12rem',
            boxShadow:'0 3px 12px rgba(102,126,234,0.25)',
            display:'flex', alignItems:'center', gap:'6px'
          }}>
            <span style={{fontSize:'1.04rem'}}>🪙</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'0.88rem'}}>{score}</span>
          </div>
        </div>
        
        <div style={{
          minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
          background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding:'4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          <div style={{
            background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
            borderRadius:'22px', padding:'2.4rem 2rem', textAlign:'center',
            boxShadow:'0 20px 48px rgba(0,0,0,0.3)', maxWidth:'400px'
          }}>
          <div style={{fontSize:'4rem', marginBottom:'0.8rem'}}>🎉</div>
          <h2 style={{
            fontSize:'2rem', fontWeight:800, marginBottom:'0.8rem',
            background:'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
          }}>Game Complete!</h2>
          <p style={{fontSize:'0.96rem', color:'#4a5568', marginBottom:'1.2rem', fontWeight:600}}>You've guessed all countries!</p>
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'13px', padding:'0.96rem', marginBottom:'1.2rem',
            boxShadow:'0 6px 20px rgba(102,126,234,0.3)'
          }}>
            <div style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.9)', fontWeight:600, marginBottom:'0.24rem'}}>Final Score</div>
            <div style={{fontSize:'2rem', color:'#fff', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
              <span>🪙</span>{score}
            </div>
          </div>
          <button
            onClick={()=>window.location.reload()}
            style={{
              background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color:'#fff', border:'none', borderRadius:'11px',
              padding:'0.8rem 2rem', fontWeight:700, fontSize:'0.88rem',
              boxShadow:'0 5px 16px rgba(102,126,234,0.3)', cursor:'pointer',
              transition:'all 0.3s ease'
            }}
            onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.05)'}
            onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}
          >
            🔄 Play Again
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding:'4.8rem 0.8rem 1.6rem 0.8rem',
      display:'flex', justifyContent:'center', alignItems:'flex-start'
    }}>
      <div style={{
        position:'fixed', top:0, left:0, right:0, zIndex:999,
        background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)',
        boxShadow:'0 4px 20px rgba(0,0,0,0.08)', padding:'0.8rem 1.6rem',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid rgba(102,126,234,0.15)'
      }}>
        {/* Left: App title */}
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <span style={{fontSize:'1.5rem'}}>🌎</span>
          <h2 style={{
            margin:0,
            fontSize:'1.1rem', fontWeight:800,
            color:'#667eea',
            background:'linear-gradient(90deg, #667eea, #764ba2)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
          }}>Guess the Country Capital</h2>
        </div>

        {/* Right: Games dropdown + Back button + Level selector + score */}
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
                  {name:'Guess Country', icon:'🌍', grad:'linear-gradient(135deg,#2ecc40,#27ae60)', link:'/GuessCountry'}
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
          
          <button
            onClick={() => {setLevel(null); setCountries([]); setCountryIndex(0); setScore(0);}}
            title="Back to level selection"
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
                  onMouseDown={(e) => { e.preventDefault(); handleSelectLevel(opt.k); }}
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
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'10px', padding:'0.48rem 1.12rem',
            boxShadow:'0 3px 12px rgba(102,126,234,0.25)',
            display:'flex', alignItems:'center', gap:'6px'
          }}>
            <span style={{fontSize:'1.04rem'}}>🪙</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'0.88rem'}}>{score}</span>
          </div>
        </div>
        </div>
      </div>
      <div style={{
        background:'rgba(255,255,255,0.95)', backdropFilter:'blur(20px)',
        borderRadius:'22px', padding:'2rem', maxWidth:'560px', width:'100%',
        boxShadow:'0 20px 48px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.3)'
      }}>
        <h1 style={{
          fontSize:'1.76rem', fontWeight:800, textAlign:'center', marginBottom:'1.6rem',
          background:'linear-gradient(90deg, #667eea, #764ba2)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'
        }}>
          <span style={{fontSize:'2rem'}}>🌎</span>
          Guess the Country Capital
        </h1>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
          padding: '1.6rem 2rem',
          marginBottom: '1.6rem',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute', top:0, right:0, fontSize:'6.4rem', opacity:0.1}}>🌐</div>
          <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.44rem', display: 'block', textAlign:'center', position:'relative', zIndex:1, textShadow:'0 2px 10px rgba(0,0,0,0.2)' }}>
            {currentCountry && currentCountry.name ? currentCountry.name : ''}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.6rem' }}>
          {clueOptions.map((clue, idx) => {
            const isSelected = selectedClue === clue;
            const answer = currentCountry && (currentCountry.answer || currentCountry.Answer) ? (currentCountry.answer || currentCountry.Answer) : "";
            const clueNorm = clue.trim().toLowerCase();
            const answerNorm = answer.trim().toLowerCase();
            const isCorrectClue = clueNorm === answerNorm;

            let buttonBg = 'linear-gradient(90deg, #667eea 0%, #43c6ac 100%)';
            // Always show correct answer in green once revealed
            if (showNext && isCorrectClue) {
              buttonBg = 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)';
            }
            // If user selected and overall result is wrong, color red for the selected one
            if (showNext && isSelected && !isCorrect) {
              buttonBg = 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)';
            }
            // If user selected and was correct, make sure it stays green
            if (showNext && isSelected && isCorrect) {
              buttonBg = 'linear-gradient(90deg, #2ecc40 0%, #27ae60 100%)';
            }

            return (
              <button
                key={idx}
                className="clue-btn"
                style={{
                  background: buttonBg,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '13px',
                  padding: '0.96rem 1.2rem',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  boxShadow: (isSelected || (showNext && isCorrectClue)) ? '0 6px 20px rgba(0,0,0,0.3)' : '0 3px 12px rgba(102, 126, 234, 0.2)',
                  cursor: showNext ? 'not-allowed' : 'pointer',
                  opacity: showNext ? 0.95 : 1,
                  transition: 'all 0.3s ease',
                  transform: (isSelected || (showNext && isCorrectClue)) ? 'scale(1.05)' : 'scale(1)',
                  position:'relative', overflow:'hidden', textAlign:'center'
                }}
                onClick={() => !showNext && handleClueSelect(clue)}
                disabled={showNext}
                onMouseEnter={(e)=>!showNext&&(e.currentTarget.style.transform='scale(1.03)')}
                onMouseLeave={(e)=>!showNext&&(e.currentTarget.style.transform='scale(1)')}
              >
                {clue}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent:'center', marginBottom: '0.8rem', flexWrap:'wrap' }}>
          {!showNext && (
            <button
              style={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: '#fff', fontWeight: 700, fontSize:'0.8rem',
                border:'none', borderRadius:'11px', padding:'0.68rem 1.6rem',
                boxShadow:'0 5px 16px rgba(231,76,60,0.3)', cursor:'pointer',
                transition:'all 0.3s ease'
              }}
              onClick={handleNextCountry}
              disabled={countryIndex >= countries.length - 1}
              onMouseEnter={(e)=>e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={(e)=>e.currentTarget.style.transform='translateY(0)'}
            >
              ⏭️ Skip
            </button>
          )}
        </div>
        {showNext && countryIndex < countries.length - 1 && (
          <div style={{display:'flex', justifyContent:'center', marginTop:'0.8rem'}}>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff', fontWeight: 800, fontSize:'0.88rem',
                border:'none', borderRadius:'13px', padding:'0.8rem 2rem',
                boxShadow:'0 6px 20px rgba(102,126,234,0.35)', cursor:'pointer',
                transition:'all 0.3s ease'
              }}
              onClick={handleNextCountry}
              onMouseEnter={(e)=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 10px 24px rgba(102,126,234,0.45)';}}
              onMouseLeave={(e)=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 6px 20px rgba(102,126,234,0.35)';}}
            >
              Next Country →
            </button>
          </div>
        )}
        {message && (
          <div style={{
            marginTop:'1.2rem', padding:'0.96rem 1.2rem', borderRadius:'13px',
            background: isCorrect ? 'linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color:'#fff', fontWeight:700, fontSize:'0.88rem', textAlign:'center',
            boxShadow: isCorrect ? '0 6px 16px rgba(46,204,64,0.3)' : '0 6px 16px rgba(231,76,60,0.3)',
            display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'
          }}>
            <span style={{fontSize:'1.2rem'}}>{isCorrect ? '✅' : '❌'}</span>
            <span dangerouslySetInnerHTML={{__html: message.replaceAll("/n", "<br />")}} />
          </div>
        )}
      </div>
    </div>
  );
}

export default GuessCountry;
