import React, { useState, useEffect } from "react";
import "../../styles/App.css";
import Load from "../common/Load.jsx";
import GameNavbar from "../common/GameNavbar.jsx";

function GuessSong() {
  const [songs, setSongs] = useState([]);
  const [songIndex, setSongIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async function fetchSongs() {
    setLoading(true);
    try {
      const response = await fetch("https://guessmovie-4.onrender.com/songs");
      const data = await response.json();
      console.log("Fetched songs:", data);
      setSongs(shuffleArray(data));
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongs([]);
    }
    setLoading(false);
  }

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setScore((prev) => prev + 1);
  };

  const handleNextSong = () => {
    setSongIndex(songIndex + 1);
    setShowAnswer(false);
  };

  if (loading) {
    return <Load />;
  }

  if (!songs.length) {
    return (
      <div style={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
        color:'#fff',
        fontSize:'1.5rem',
        fontWeight:700
      }}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'1rem'}}>🎵</div>
          <p>No songs found. Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentSong = songs[songIndex];

  if (songIndex >= songs.length) {
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
            <span style={{fontSize:'1.5rem'}}>🎵</span>
            Guess the Song
          </h2>
          <div style={{
            background:'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius:'10px', padding:'0.48rem 1.12rem',
            boxShadow:'0 3px 12px rgba(102,126,234,0.25)',
            display:'flex', alignItems:'center', gap:'6px'
          }}>
            <span style={{fontSize:'1.04rem'}}>🎯</span>
            <span style={{color:'#fff', fontWeight:800, fontSize:'0.88rem'}}>{score}</span>
          </div>
        </div>
        
        <div style={{
          minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
          background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)', padding:'4.8rem 1.6rem 1.6rem 1.6rem'
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
            <p style={{fontSize:'0.96rem', color:'#4a5568', marginBottom:'1.2rem', fontWeight:600}}>You've completed all songs!</p>
            <div style={{
              background:'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius:'13px', padding:'0.96rem', marginBottom:'1.2rem',
              boxShadow:'0 6px 20px rgba(102,126,234,0.3)'
            }}>
              <div style={{fontSize:'0.8rem', color:'rgba(255,255,255,0.9)', fontWeight:600, marginBottom:'0.24rem'}}>Songs Viewed</div>
              <div style={{fontSize:'2rem', color:'#fff', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                <span>🎯</span>{score}
              </div>
            </div>
            <button
              onClick={()=>window.location.reload()}
              style={{
                background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
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

  const question = currentSong.clue && currentSong.clue.length > 0 ? currentSong.clue[0] : "No question available";
  const answer = currentSong.name || "No answer available";

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
      padding:'4.8rem 0.8rem 1.6rem 0.8rem',
      display:'flex', justifyContent:'center', alignItems:'flex-start'
    }}>
      {/* Navbar */}
      <GameNavbar 
        gameName="Guess the Song" 
        gameIcon="🎵" 
        showScore={true} 
        score={score} 
        showBack={true} 
        onBack={() => window.location.href = '/'}
      />

      {/* Main Content */}
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
          <span style={{fontSize:'2rem'}}>🎵</span>
          Guess the Song
        </h1>

        {/* Question Card */}
        <div style={{
          background: 'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
          padding: '2rem',
          marginBottom: '1.6rem',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute', top:0, right:0, fontSize:'6.4rem', opacity:0.1}}>🎼</div>
          <div style={{
            textAlign:'center',
            position:'relative',
            zIndex:1
          }}>
            <div style={{fontSize:'1rem', color:'rgba(255,255,255,0.8)', fontWeight:600, marginBottom:'0.8rem'}}>
              Song #{songIndex + 1} of {songs.length}
            </div>
            <div style={{ 
              fontWeight: 800, 
              color: '#fff', 
              fontSize: '1.44rem', 
              lineHeight:'1.5',
              textShadow:'0 2px 10px rgba(0,0,0,0.2)' 
            }}>
              {question}
            </div>
          </div>
        </div>

        {/* Show Answer and Skip Buttons */}
        {!showAnswer && (
          <div style={{display:'flex', justifyContent:'center', gap:'1rem', marginBottom:'1.6rem', flexWrap:'wrap'}}>
            <button
              onClick={handleNextSong}
              disabled={songIndex >= songs.length - 1}
              style={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: '#fff', fontWeight: 700, fontSize:'0.9rem',
                border:'none', borderRadius:'14px', padding:'0.85rem 2rem',
                boxShadow:'0 6px 20px rgba(231,76,60,0.3)', 
                cursor: songIndex >= songs.length - 1 ? 'not-allowed' : 'pointer',
                opacity: songIndex >= songs.length - 1 ? 0.6 : 1,
                transition:'all 0.3s ease'
              }}
              onMouseEnter={(e)=>{if(songIndex < songs.length - 1) e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={(e)=>{e.currentTarget.style.transform='translateY(0)';}}
            >
              ⏭️ Next
            </button>
            <button
              onClick={handleShowAnswer}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff', fontWeight: 800, fontSize:'1rem',
                border:'none', borderRadius:'16px', padding:'1rem 2.5rem',
                boxShadow:'0 8px 25px rgba(240,147,251,0.35)', cursor:'pointer',
                transition:'all 0.3s ease'
              }}
              onMouseEnter={(e)=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 12px 30px rgba(240,147,251,0.45)';}}
              onMouseLeave={(e)=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 8px 25px rgba(240,147,251,0.35)';}}
            >
              👁️ Show Answer
            </button>
          </div>
        )}

        {/* Answer Display */}
        {showAnswer && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(46, 204, 64, 0.3)',
              padding: '1.6rem',
              marginBottom: '1.6rem',
              textAlign:'center'
            }}>
              <div style={{fontSize:'0.9rem', color:'rgba(255,255,255,0.9)', fontWeight:600, marginBottom:'0.5rem'}}>
                ✅ Answer
              </div>
              <div style={{fontSize:'1.3rem', color:'#fff', fontWeight:800, lineHeight:'1.4'}}>
                {answer}
              </div>
            </div>

            {/* Next Button */}
            {songIndex < songs.length - 1 && (
              <div style={{display:'flex', justifyContent:'center'}}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
                    color: '#fff', fontWeight: 800, fontSize:'0.88rem',
                    border:'none', borderRadius:'13px', padding:'0.8rem 2rem',
                    boxShadow:'0 6px 20px rgba(102,126,234,0.35)', cursor:'pointer',
                    transition:'all 0.3s ease'
                  }}
                  onClick={handleNextSong}
                  onMouseEnter={(e)=>{e.currentTarget.style.transform='scale(1.05)';e.currentTarget.style.boxShadow='0 10px 24px rgba(102,126,234,0.45)';}}
                  onMouseLeave={(e)=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 6px 20px rgba(102,126,234,0.35)';}}
                >
                  Next Song →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GuessSong;
