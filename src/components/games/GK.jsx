import React, { useState, useEffect } from "react";
import "../../styles/App.css";
import Load from "../common/Load.jsx";
import GameNavbar from "../common/GameNavbar.jsx";
import { useNavigate } from "react-router-dom";

function GK() {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shuffledClues, setShuffledClues] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const response = await fetch("https://guessmovie-4.onrender.com/GK");
      const data = await response.json();
      // Extract unique categories
      const categories = [...new Set(data.map(item => item.category))];
      setAllCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      setAllCategories([]);
    }
    setLoading(false);
  }

  async function fetchQuestions(category, region) {
    setLoading(true);
    try {
      let allData = [];
      if (region === "world") {
        // Fetch both world and india data
        const [worldResponse, indiaResponse] = await Promise.all([
          fetch(`https://guessmovie-4.onrender.com/GKSingle/${category}/world`),
          fetch(`https://guessmovie-4.onrender.com/GKSingle/${category}/india`)
        ]);
        const worldData = await worldResponse.json();
        const indiaData = await indiaResponse.json();
        allData = [...worldData, ...indiaData];
      } else {
        // Fetch only india data
        const response = await fetch(`https://guessmovie-4.onrender.com/GKSingle/${category}/india`);
        allData = await response.json();
      }
      
      // Shuffle all questions
      const shuffledQuestions = shuffleArray(allData);
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Failed to fetch questions", error);
      setQuestions([]);
    }
    setLoading(false);
  }

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Shuffle clues when question changes
  React.useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      const currentQuestion = questions[currentIndex];
      if (currentQuestion && Array.isArray(currentQuestion.clues)) {
        setShuffledClues(shuffleArray(currentQuestion.clues));
      } else {
        setShuffledClues([]);
      }
    }
  }, [questions, currentIndex]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    fetchQuestions(selectedCategory, region);
  };

  const handleAnswerClick = (answer) => {
    if (showNext) return;
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].answer;
    setIsCorrect(correct);
    setShowNext(true);
    if (correct) {
      setMessage("You are correct!");
      setScore(score + 5);
    } else {
      setMessage(`Wrong! The answer was: ${questions[currentIndex].answer}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setShowNext(false);
      setMessage("");
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedRegion(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
    setShuffledClues([]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
    setShuffledClues([]);
    setShowCategoryDropdown(false);
    fetchQuestions(category, selectedRegion);
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setShowNext(false);
    setMessage("");
    setShuffledClues([]);
    setShowRegionDropdown(false);
    fetchQuestions(selectedCategory, region);
  };

  // Category Selection Screen
  if (!selectedCategory) {
    return (
      <>
        <GameNavbar 
          gameName="GK Quiz" 
          gameIcon="📚" 
          onBack={() => navigate('/')}
        />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          {loading ? (
            <Load />
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '19px',
              padding: '2.4rem 2rem',
              boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
              maxWidth: '550px',
              width: '100%',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '1.6rem' }}>
                <span style={{ fontSize: '2.4rem', marginBottom: '0.4rem', display: 'block' }}>📚</span>
                <h2 style={{
                  color: '#2d3748',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  marginBottom: '0.4rem',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Choose Your Category
                </h2>
                <p style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 500 }}>
                  Select a category to begin
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1.2rem 1rem',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s',
                      textTransform: 'capitalize'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Region Selection Screen
  if (!selectedRegion) {
    return (
      <>
        <GameNavbar 
          gameName="GK Quiz" 
          gameIcon="📚" 
          showBack={true}
          onBack={handleBackToCategories}
        />
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '19px',
            padding: '2.4rem 2rem',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '1.6rem' }}>
              <span style={{ fontSize: '2.4rem', marginBottom: '0.4rem', display: 'block' }}>🌍</span>
              <h2 style={{
                color: '#2d3748',
                fontWeight: 800,
                fontSize: '1.6rem',
                marginBottom: '0.4rem',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Choose Your Region
              </h2>
              <p style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 500 }}>
                Category: <strong style={{ textTransform: 'capitalize' }}>{selectedCategory}</strong>
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <button
                onClick={() => handleRegionSelect('india')}
                style={{
                  background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.2rem 1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(247, 151, 30, 0.4)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(247, 151, 30, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(247, 151, 30, 0.4)';
                }}
              >
                🇮🇳 India
              </button>
              <button
                onClick={() => handleRegionSelect('world')}
                style={{
                  background: 'linear-gradient(135deg, #43c6ac 0%, #667eea 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1.2rem 1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(67, 198, 172, 0.4)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(67, 198, 172, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(67, 198, 172, 0.4)';
                }}
              >
                🌍 World
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }



  // Quiz Screen
  if (loading) {
    return <Load />;
  }

  if (questions.length === 0) {
    return (
      <>
        <GameNavbar 
          gameName="GK Quiz" 
          gameIcon="📚" 
          showBack={true}
          onBack={handleBackToCategories}
        />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          <p style={{ color: '#fff', fontSize: '1.2rem' }}>No questions available</p>
        </div>
      </>
    );
  }

  if (currentIndex >= questions.length) {
    return (
      <>
        <GameNavbar 
          gameName="GK Quiz" 
          gameIcon="📚" 
          showScore={true}
          score={score}
          showBack={false}
        />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4.8rem 1.6rem 1.6rem 1.6rem'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '22px',
            padding: '2.4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 48px rgba(0,0,0,0.3)',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.8rem' }}>🎉</div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 800,
              marginBottom: '0.8rem',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Quiz Complete!
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#4a5568', marginBottom: '1.2rem', fontWeight: 600 }}>
              You've completed all questions!
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '13px',
              padding: '0.96rem',
              marginBottom: '1.2rem',
              boxShadow: '0 6px 20px rgba(102,126,234,0.3)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600, marginBottom: '0.24rem' }}>Final Score</div>
              <div style={{ fontSize: '2rem', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span>🪙</span>{score}
              </div>
            </div>
            <button
              onClick={handleBackToCategories}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '11px',
                padding: '0.8rem 2rem',
                fontWeight: 700,
                fontSize: '0.88rem',
                boxShadow: '0 5px 16px rgba(102,126,234,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '4.8rem 0.8rem 1.6rem 0.8rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <GameNavbar 
        gameName="GK Quiz" 
        gameIcon="📚" 
        showScore={true}
        score={score}
        showBack={true}
        onBack={handleBackToCategories}
      />

      {/* Category & Region Dropdown */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 999,
        display: 'flex',
        gap: '10px'
      }}>
        {/* Category Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowRegionDropdown(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#667eea',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📚 {selectedCategory}
            <span style={{
              fontSize: '0.7rem',
              transition: 'transform 0.3s',
              transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>▼</span>
          </button>
          {showCategoryDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              minWidth: '160px',
              padding: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              maxHeight: '300px',
              overflowY: 'auto',
              animation: 'dropdownSlide 0.3s ease-out'
            }}>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: cat === selectedCategory ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    border: 'none',
                    color: '#2d3748',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = cat === selectedCategory ? 'rgba(102, 126, 234, 0.1)' : 'transparent'}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Region Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowRegionDropdown(!showRegionDropdown);
              setShowCategoryDropdown(false);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#667eea',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {selectedRegion === 'india' ? '🇮🇳 India' : '🌍 World'}
            <span style={{
              fontSize: '0.7rem',
              transition: 'transform 0.3s',
              transform: showRegionDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>▼</span>
          </button>
          {showRegionDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              minWidth: '140px',
              padding: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: 'dropdownSlide 0.3s ease-out'
            }}>
              <button
                onClick={() => handleRegionChange('india')}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  background: selectedRegion === 'india' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  border: 'none',
                  color: '#2d3748',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = selectedRegion === 'india' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'}
              >
                🇮🇳 India
              </button>
              <button
                onClick={() => handleRegionChange('world')}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  background: selectedRegion === 'world' ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  border: 'none',
                  color: '#2d3748',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '8px',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = selectedRegion === 'world' ? 'rgba(102, 126, 234, 0.1)' : 'transparent'}
              >
                🌍 World
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Content */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '22px',
        padding: '2rem',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        <h1 style={{
          fontSize: '1.76rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '1.6rem',
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          GK Quiz
        </h1>

        {/* Question Display */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
          padding: '1.6rem 2rem',
          marginBottom: '1.6rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '6.4rem', opacity: 0.1 }}>❓</div>
          <span style={{
            fontWeight: 800,
            color: '#fff',
            fontSize: '1.44rem',
            display: 'block',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            {currentQuestion.question}
          </span>
        </div>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.8rem',
          marginBottom: '1.6rem'
        }}>
          {shuffledClues.map((clue, idx) => {
            const isSelected = selectedAnswer === clue;
            const isCorrectAnswer = clue === currentQuestion.answer;

            let buttonBg = 'linear-gradient(90deg, #667eea 0%, #43c6ac 100%)';
            // Always show correct answer in green once revealed
            if (showNext && isCorrectAnswer) {
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
                  boxShadow: (isSelected || (showNext && isCorrectAnswer)) ? '0 6px 20px rgba(0,0,0,0.3)' : '0 3px 12px rgba(102, 126, 234, 0.2)',
                  cursor: showNext ? 'not-allowed' : 'pointer',
                  opacity: showNext ? 0.95 : 1,
                  transition: 'all 0.3s ease',
                  transform: (isSelected || (showNext && isCorrectAnswer)) ? 'scale(1.05)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}
                onClick={() => !showNext && handleAnswerClick(clue)}
                disabled={showNext}
                onMouseEnter={(e) => !showNext && (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => !showNext && (e.currentTarget.style.transform = 'scale(1)')}
              >
                {clue}
              </button>
            );
          })}
        </div>

        {/* Skip Button */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          {!showNext && (
            <button
              style={{
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                border: 'none',
                borderRadius: '11px',
                padding: '0.68rem 1.6rem',
                boxShadow: '0 5px 16px rgba(231,76,60,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleNext}
              disabled={currentIndex >= questions.length - 1}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ⏭️ Skip
            </button>
          )}
        </div>

        {/* Next Button */}
        {showNext && currentIndex < questions.length - 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.8rem' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                borderRadius: '13px',
                padding: '0.8rem 2rem',
                boxShadow: '0 6px 20px rgba(102,126,234,0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={handleNext}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(102,126,234,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102,126,234,0.35)';
              }}
            >
              Next Question →
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            marginTop: '1.2rem',
            padding: '0.96rem 1.2rem',
            borderRadius: '13px',
            background: isCorrect ? 'linear-gradient(135deg, #2ecc40 0%, #27ae60 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            textAlign: 'center',
            boxShadow: isCorrect ? '0 6px 16px rgba(46,204,64,0.3)' : '0 6px 16px rgba(231,76,60,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>{isCorrect ? '✅' : '❌'}</span>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GK;
