import React, { useEffect, useState } from "react";
import "../../styles/App.css";
import Load from "../common/Load.jsx";
import GameNavbar from "../common/GameNavbar.jsx";

function MovieGuess() {
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const cluePoints = [5, 4, 3, 2, 1];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function fetchMovies() {
    const response = await fetch("https://guessmovie-4.onrender.com/movies");
    const data = await response.json();
    setMovies(shuffleArray(data));
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  if (!movies.length) {
    return (
      <div>
        <Load />
      </div>
    );
  }

  const currentMovie = movies[movieIndex];
  const clues = currentMovie.clue;

  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
    setMessage("");
  };

  const handleSubmit = () => {
    const answer = currentMovie && currentMovie.name ? currentMovie.name : "";
    if (userGuess.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setIsCorrect(true);
      setShowNext(true);
      setMessage("You are correct!");
      // Award points based on clueIndex
      const points = cluePoints[clueIndex] || 1;
      setScore((prev) => prev + points);
    } else {
      if (clueIndex < clues.length - 1) {
        setClueIndex(clueIndex + 1);
        setMessage("Try again! Here is another clue.");
      } else {
        setMessage(`No more clues! The answer was: ${answer}`);
        setShowNext(true);
      }
    }
  };

  const handleNextMovie = () => {
    setMovieIndex(movieIndex + 1);
    setClueIndex(0);
    setUserGuess("");
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
  };

  if (movieIndex >= movies.length) {
    return (
      <>
        <GameNavbar 
          gameName="Guess the Movie" 
          gameIcon="🎬" 
          showScore={true} 
          score={score} 
          showBack={false}
        />
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
            <p style={{fontSize:'0.96rem', color:'#4a5568', marginBottom:'1.2rem', fontWeight:600}}>You've guessed all movies!</p>
            <div style={{
              background:'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius:'13px', padding:'0.96rem', marginBottom:'1.2rem',
              boxShadow:'0 6px 20px rgba(102,126,234,0.3)'
            }}>
              <div style={{fontSize:'0.72rem', color:'rgba(255,255,255,0.9)', fontWeight:600, marginBottom:'0.24rem'}}>Final Score</div>
              <div style={{fontSize:'2rem', fontWeight:800, color:'#fff'}}>🪙 {score}</div>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background:'linear-gradient(135deg, #667eea, #764ba2)',
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
      <GameNavbar 
        gameName="Guess the Movie" 
        gameIcon="🎬" 
        showScore={true} 
        score={score} 
        showBack={true} 
        onBack={() => window.location.href = '/'}
      />
      
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
          <span style={{fontSize:'2rem'}}>🎬</span>
          Guess the Movie
        </h1>

        {/* Clue Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
          padding: '2rem',
          marginBottom: '1.6rem',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{position:'absolute', top:0, right:0, fontSize:'6.4rem', opacity:0.1}}>🎬</div>
          <div style={{
            textAlign:'center',
            position:'relative',
            zIndex:1
          }}>
            <div style={{
              display:'flex', 
              alignItems:'center', 
              justifyContent:'space-between', 
              marginBottom:'0.8rem'
            }}>
              <div style={{flex:1}}></div>
              <div style={{fontSize:'1rem', color:'rgba(255,255,255,0.8)', fontWeight:600}}>
                💡 Clue {clueIndex + 1} of {clues.length}
              </div>
              <div style={{flex:1, display:'flex', justifyContent:'flex-end'}}>
                {clueIndex < clues.length - 1 && !showNext && (
                  <button
                    onClick={() => {
                      setClueIndex(clueIndex + 1);
                      setMessage("");
                    }}
                    style={{
                      background:'rgba(255,255,255,0.25)',
                      backdropFilter:'blur(10px)',
                      border:'1.5px solid rgba(255,255,255,0.4)',
                      borderRadius:'10px',
                      padding:'0.5rem 1rem',
                      color:'#fff',
                      fontSize:'0.8rem',
                      fontWeight:700,
                      cursor:'pointer',
                      transition:'all 0.3s ease',
                      display:'flex',
                      alignItems:'center',
                      gap:'0.4rem',
                      boxShadow:'0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    onMouseEnter={(e)=>{
                      e.currentTarget.style.background='rgba(255,255,255,0.35)';
                      e.currentTarget.style.transform='translateY(-2px) translateX(2px)';
                      e.currentTarget.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e)=>{
                      e.currentTarget.style.background='rgba(255,255,255,0.25)';
                      e.currentTarget.style.transform='translateY(0) translateX(0)';
                      e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';
                    }}
                  >
                    Next Clue →
                  </button>
                )}
              </div>
            </div>
            <div style={{ 
              fontWeight: 700, 
              color: '#fff', 
              fontSize: '1.44rem', 
              lineHeight:'1.5',
              textShadow:'0 2px 10px rgba(0,0,0,0.2)' 
            }}
            dangerouslySetInnerHTML={{
              __html: clues[clueIndex].replaceAll("/n", "<br />"),
            }}
            />
          </div>
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter your guess..."
          value={userGuess}
          onChange={handleInputChange}
          disabled={showNext}
          style={{
            width:'100%', padding:'0.96rem 1.2rem', borderRadius:'13px',
            border:'2px solid rgba(102,126,234,0.2)', fontSize:'0.88rem',
            marginBottom:'1.2rem', fontWeight:600, outline:'none',
            transition:'all 0.3s ease', boxSizing:'border-box'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor='#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor='rgba(102,126,234,0.2)'}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent:'center', marginBottom: '0.8rem', flexWrap:'wrap' }}>
          <button
            onClick={handleSubmit}
            disabled={showNext || !userGuess.trim()}
            style={{
              background: (showNext || !userGuess.trim()) ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff', fontWeight: 700, fontSize:'0.9rem',
              border:'none', borderRadius:'12px', padding:'0.85rem 2.2rem',
              boxShadow: (showNext || !userGuess.trim()) ? '0 4px 12px rgba(0,0,0,0.1)' : '0 6px 20px rgba(102,126,234,0.35)', 
              cursor: (showNext || !userGuess.trim()) ? 'not-allowed' : 'pointer',
              transition:'all 0.3s ease',
              opacity: (showNext || !userGuess.trim()) ? 0.6 : 1,
              display:'flex',
              alignItems:'center',
              gap:'0.5rem'
            }}
            onMouseEnter={(e)=>{if(!showNext && userGuess.trim()) {
              e.currentTarget.style.transform='translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow='0 8px 24px rgba(102,126,234,0.45)';
            }}}
            onMouseLeave={(e)=>{
              e.currentTarget.style.transform='translateY(0) scale(1)';
              e.currentTarget.style.boxShadow=(showNext || !userGuess.trim())?'0 4px 12px rgba(0,0,0,0.1)':'0 6px 20px rgba(102,126,234,0.35)';
            }}
          >
            <span style={{fontSize:'1.1rem'}}>✓</span> Submit Answer
          </button>
          
          {!showNext && (
            <button
              onClick={handleNextMovie}
              disabled={movieIndex >= movies.length - 1}
              style={{
                background: (movieIndex >= movies.length - 1) ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: '#fff', fontWeight: 700, fontSize:'0.9rem',
                border:'none', borderRadius:'12px', padding:'0.85rem 2.2rem',
                boxShadow: (movieIndex >= movies.length - 1) ? '0 4px 12px rgba(0,0,0,0.1)' : '0 6px 20px rgba(231,76,60,0.3)', 
                cursor: movieIndex >= movies.length - 1 ? 'not-allowed' : 'pointer',
                opacity: movieIndex >= movies.length - 1 ? 0.6 : 1,
                transition:'all 0.3s ease',
                display:'flex',
                alignItems:'center',
                gap:'0.5rem'
              }}
              onMouseEnter={(e)=>{if(movieIndex < movies.length - 1) {
                e.currentTarget.style.transform='translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow='0 8px 24px rgba(231,76,60,0.45)';
              }}}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform='translateY(0) scale(1)';
                e.currentTarget.style.boxShadow=(movieIndex >= movies.length - 1)?'0 4px 12px rgba(0,0,0,0.1)':'0 6px 20px rgba(231,76,60,0.3)';
              }}
            >
              <span style={{fontSize:'1.1rem'}}>⏭️</span> Skip Movie
            </button>
          )}
        </div>

        {/* Next Movie Button */}
        {showNext && movieIndex < movies.length - 1 && (
          <div style={{display:'flex', justifyContent:'center', marginTop:'0.8rem'}}>
            <button
              onClick={handleNextMovie}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff', fontWeight: 800, fontSize:'0.95rem',
                border:'none', borderRadius:'12px', padding:'0.9rem 2.4rem',
                boxShadow:'0 6px 20px rgba(102,126,234,0.35)', cursor:'pointer',
                transition:'all 0.3s ease',
                display:'flex',
                alignItems:'center',
                gap:'0.6rem'
              }}
              onMouseEnter={(e)=>{
                e.currentTarget.style.transform='translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow='0 10px 28px rgba(102,126,234,0.5)';
              }}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform='translateY(0) scale(1)';
                e.currentTarget.style.boxShadow='0 6px 20px rgba(102,126,234,0.35)';
              }}
            >
              <span style={{fontSize:'1.2rem'}}>🎬</span> Next Movie
            </button>
          </div>
        )}

        {/* Message Display */}
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

export default MovieGuess;
