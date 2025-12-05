import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import Load from '../common/Load';
import GameNavbar from '../common/GameNavbar';
import { useNavigate } from 'react-router-dom';

function Makeitfun() {
  const navigate = useNavigate();
  
  function handleModalRandom() {
    if (Question.length > 0) {
      const idx = Math.floor(Math.random() * Question.length);
      setRandomQuestion(Question[idx]);
      setShowRandomAnswer(false);
    }
  }
  const [showModal, setShowModal] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState(null);
  const [showRandomAnswer, setShowRandomAnswer] = useState(false);
  const [Question, setQuestion] = useState([]);
  const [DisplayAnswer, setDisplayAnswer] = useState({});
  const [DisplayImage, setDisplayImage] = useState({});
  const [page, setPage] = useState(0);
  const pageSize = 3;

  async function fetchQuestion() {
    try {
      const response = await fetch("https://guessmovie-4.onrender.com/Questions");
      const jsonData = await response.json();
      setQuestion(jsonData);
      console.log(jsonData);
    } catch (err) {
      console.error('Failed to fetch questions', err);
      setQuestion([]);
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!Question || Question.length === 0) {
    return <div ><Load /></div>;
  }

  // Pagination logic
  const startIdx = page * pageSize;
  const endIdx = startIdx + pageSize;
  const currentQuestions = Question.slice(startIdx, endIdx);
  const totalPages = Math.ceil(Question.length / pageSize);

  // function handleAnswer(idx) {
  //   setDisplayAnswer((prev) => ({ ...prev, [startIdx + idx]: true }));
  // }

  function handleRandomClick() {
    if (Question.length > 0) {
      const idx = Math.floor(Math.random() * Question.length);
      setRandomQuestion(Question[idx]);
      setShowModal(true);
      setShowRandomAnswer(false);
    }
  }

  function handleCloseModal() {
  setShowModal(false);
  setRandomQuestion(null);
  setShowRandomAnswer(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
      paddingTop: '4.5rem',
      paddingBottom: '2rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem'
    }}>
      <GameNavbar 
        gameName="Brain Teasers" 
        gameIcon="🧩"
        onBack={() => navigate('/')}
      />
      
      {showModal && randomQuestion && (
        <div className="modal-bg">
          <div className="modal-card">
            <button className="modal-close" onClick={handleCloseModal}>
              &#10005;
            </button>
            <div style={{
              background: '#fff',
              borderLeft: '6px solid #2ecc40',
              borderRadius: '18px',
              padding: '24px 28px 20px 28px',
              marginTop: '8px',
              marginBottom: '10px',
              boxShadow: '0 2px 12px #e0e0e0',
              color: '#222',
              fontSize: '1.13rem',
              position: 'relative',
              maxWidth: '98%',
              overflowWrap: 'break-word',
            }}>
              <div className='qsdiv'>
                <div className="Question-title" style={{ fontWeight: 700, fontSize: '1.18rem', color: '#219150', marginBottom: '10px', letterSpacing: '0.5px' }}>{randomQuestion.name}</div>
              </div>
              <div className="Question-text" style={{ color: '#222', fontSize: '1.08rem' }} dangerouslySetInnerHTML={{__html: (randomQuestion.Explanation || randomQuestion.Question || '').replaceAll('\n', '<br />')}} />
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.2rem'}}>
              {!showRandomAnswer && (
                <button className="modal-random-btn" onClick={handleModalRandom}>
                  <FontAwesomeIcon icon={faDice} size="sm" color="#7c3aed" style={{marginRight: '0.4rem'}} />
                  Random
                </button>
              )}
              {!showRandomAnswer ? (
                <button className="show-answer-btn" onClick={() => setShowRandomAnswer(true)}>
                  Show Answer
                </button>
              ) : (
                <div style={{
                  background: '#fff',
                  borderLeft: '6px solid #2ecc40',
                  borderRadius: '18px',
                  padding: '24px 28px 20px 28px',
                  marginTop: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 12px #e0e0e0',
                  color: '#222',
                  fontSize: '1.13rem',
                  position: 'relative',
                  maxWidth: '98%',
                  overflowWrap: 'break-word',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.18rem', color: '#219150', marginBottom: '14px', letterSpacing: '0.5px' }}>Answer:</div>
                  <div style={{ background: '#fff', borderRadius: '8px', padding: '2px 0', color: '#222', fontSize: '1.08rem', marginTop: '2px' }} dangerouslySetInnerHTML={{__html: (randomQuestion.Answer || '').replaceAll('\n', '<br />')}} />
                </div>
              )}
              <button className="zoom-btn" title="Zoom" style={{marginRight: '12px'}}>
                <FontAwesomeIcon icon={faSearchPlus} />
              </button>
             
            </div>
          </div>
        </div>
      )}
      <div style={{
        maxWidth: '95%',
        width: '95%',
        margin: '0 auto',
        padding: 'clamp(1rem, 4vw, 2rem)'
      }}>
        {currentQuestions.map((item, idx) => {
          const isAnswerShown = !!DisplayAnswer[startIdx + idx];
          return (
            <div key={startIdx + idx} style={{position: 'relative', marginBottom: '2.5rem'}}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: 'clamp(1.2rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{
                  marginBottom: '1.2rem'
                }}>
                  <h2 style={{
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
                    fontWeight: '800',
                    color: '#2d3748',
                    marginBottom: '1rem',
                    lineHeight: '1.3',
                    letterSpacing: '-0.02em'
                  }}>{item.name}</h2>
                  <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem', justifyContent: 'flex-start'}}>
                    <button
                      className="share-btn"
                      title="Share on WhatsApp"
                      style={{
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '12px', 
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', 
                        fontWeight: '700', 
                        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)', 
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        minHeight: '44px'
                      }}
                      onClick={() => {
                        const url = window.location.href;
                        const text = encodeURIComponent(`${item.Question}\nPlay on: ${url}`);
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                      }}
                      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{width: '18px', height: '18px'}} />
                      Share
                    </button>
                    <button
                      style={{
                        background: isAnswerShown ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'linear-gradient(135deg, #8b9ded 0%, #f1abc2 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: 800,
                        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                        boxShadow: isAnswerShown ? '0 4px 15px rgba(231, 76, 60, 0.4)' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        outline: 'none',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={() => {
                        setDisplayAnswer((prev) => ({
                          ...prev,
                          [startIdx + idx]: !isAnswerShown
                        }));
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <span style={{fontSize: '1.1rem'}}>{isAnswerShown ? '👁️' : '👁️‍🗨️'}</span>
                      {isAnswerShown ? 'Hide Answer' : 'Show Answer'}
                    </button>
                  </div>
                </div>
                <div style={{
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                  color: '#374151',
                  lineHeight: '1.75',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                  wordBreak: 'break-word'
                }} dangerouslySetInnerHTML={{__html: (item.Explanation || '').replaceAll('\n', '<br />')}} />
                {item.img && item.img !== 'null' && (
                  <div style={{ margin: '16px 0' }}>
                    {!DisplayImage[startIdx + idx] ? (
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '12px', 
                          padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)', 
                          fontWeight: '700',
                          fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.3s',
                          minHeight: '44px'
                        }}
                        onClick={() => setDisplayImage((prev) => ({ ...prev, [startIdx + idx]: true }))}
                        onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                        onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🖼️ Show Image
                      </button>
                    ) : (
                      <img src={item.img} alt="Puzzle visual" style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }} />
                    )}
                  </div>
                )}
              </div>
              {isAnswerShown && (
                <div style={{
                  background: 'rgba(212, 248, 232, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderLeft: 'clamp(4px, 1vw, 6px) solid #10b981',
                  borderRadius: '20px',
                  padding: 'clamp(1.2rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem)',
                  marginTop: '1.5rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
                  color: '#1a5f4f',
                  fontSize: '1.1rem',
                  position: 'relative',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.3rem',
                    color: '#059669',
                    marginBottom: '1rem',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ✓ Answer:
                  </div>
                  <div style={{
                    color: '#1a5f4f',
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    fontWeight: '500'
                  }}
                  dangerouslySetInnerHTML={{__html: (item.Answer || '').replaceAll('\n', '<br />')}} />
                </div>
              )}
            </div>
          );
        })}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3rem', gap: '1.5rem' }}>
          <button
            className="nav-arrow"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            &#8592; Prev
          </button>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', background: 'rgba(255, 255, 255, 0.2)', padding: '0.5rem 1rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
            {page + 1} / {totalPages}
          </span>
          <button
            className="nav-arrow"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
          >
            Next &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}
export default Makeitfun;
