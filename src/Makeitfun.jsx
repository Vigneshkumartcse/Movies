import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import Load from './Load';

function Makeitfun() {
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
    <div className="cric-bg">
      {/* <button className="random-btn-fixed" onClick={handleRandomClick}>
        <FontAwesomeIcon icon={faDice} size="sm" color="#7c3aed" style={{marginRight: '0.5rem'}} />
        Random
      </button> */}
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
      <div className="Qs-card">
        <div className="page-header">
          <h1 className="page-title">🧠 Brain Teasers & Puzzles</h1>
          <p className="page-subtitle">Challenge yourself with these mind-bending questions!</p>
        </div>
        {currentQuestions.map((item, idx) => {
          const isAnswerShown = !!DisplayAnswer[startIdx + idx];
          return (
            <div key={startIdx + idx} style={{position: 'relative', marginBottom: '2.5rem'}}>
              <div className={`movie-clue`}>
                <div className='qsdiv'>
                  <div className="Question-title">{item.name}</div>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
                    <button
                      className="share-btn"
                      title="Share on WhatsApp"
                      style={{background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.1rem'}}
                      onClick={() => {
                        const url = window.location.href;
                        const text = encodeURIComponent(`${item.Question}\nPlay on: ${url}`);
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                      }}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{width: '20px', height: '20px'}} />
                      Share
                    </button>
                    <button
                      style={{
                        background: isAnswerShown ? 'linear-gradient(90deg, #43c6ac 0%, #667eea 100%)' : 'linear-gradient(90deg, #667eea 0%, #43c6ac 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1.3rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        boxShadow: isAnswerShown ? '0 2px 8px rgba(67, 198, 172, 0.15)' : '0 2px 8px rgba(102, 126, 234, 0.15)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        outline: 'none',
                        marginLeft: '0.5rem',
                      }}
                      onClick={() => {
                        setDisplayAnswer((prev) => ({
                          ...prev,
                          [startIdx + idx]: !isAnswerShown
                        }));
                      }}
                    >
                      {isAnswerShown ? 'Hide answer' : 'Show answer'}
                    </button>
                  </div>
                </div>
                <div className="Question-text" dangerouslySetInnerHTML={{__html: (item.Explanation || '').replaceAll('\n', '<br />')}} />
                {item.img && item.img !== 'null' && (
                  <div style={{ margin: '16px 0' }}>
                    {!DisplayImage[startIdx + idx] ? (
                      <button
                        style={{background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: '600', cursor: 'pointer'}}
                        onClick={() => setDisplayImage((prev) => ({ ...prev, [startIdx + idx]: true }))}
                      >
                        Show Image
                      </button>
                    ) : (
                      <img src={item.img} alt="Puzzle visual" style={{ width: 500, height: 300, objectFit: 'cover', borderRadius: '10px', boxShadow: '0 2px 8px #ccc' }} />
                    )}
                  </div>
                )}
              </div>
              {isAnswerShown && (
                <div style={{
                  background: '#fff',
                  borderLeft: '6px solid #2ecc40', // left-side green border
                  borderRadius: '18px',
                  padding: '24px 28px 20px 28px',
                  marginTop: '18px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 12px #e0e0e0',
                  color: '#222',
                  fontSize: '1.13rem',
                  position: 'relative',
                  maxWidth: '98%',
                  overflowWrap: 'break-word',
                }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1.18rem',
                    color: '#219150',
                    marginBottom: '14px',
                    letterSpacing: '0.5px',
                  }}>
                    Answer:
                  </div>
                  <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '2px 0',
                    color: '#222',
                    fontSize: '1.08rem',
                    marginTop: '2px',
                  }}
                  dangerouslySetInnerHTML={{__html: (item.Answer || '').replaceAll('\n', '<br />')}} />
                </div>
              )}
            </div>
          );
        })}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '1.5rem' }}>
          <button
            className="nav-arrow"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            &#8592; Prev
          </button>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#667eea' }}>
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
