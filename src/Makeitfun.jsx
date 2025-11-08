import React, { useState, useEffect } from 'react';
import Load from './Load';

function Makeitfun() {
  const [Question, setQuestion] = useState([]);
  const [DisplayAnswer, setDisplayAnswer] = useState({});
  const [page, setPage] = useState(0);
  const pageSize = 2;

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

  return (
    <div className="cric-bg">
  <div className="movie-card makeitfun-wide">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <button
            className="nav-arrow"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            style={{ marginRight: '2rem' }}
          >
            &#8592; Previous
          </button>
          <span style={{ fontWeight: 600, fontSize: '1.1rem', alignSelf: 'center' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="nav-arrow"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page === totalPages - 1}
            style={{ marginLeft: '2rem' }}
          >
            Next &#8594;
          </button>
        </div>
        {currentQuestions.map((item, idx) => {
          const isAnswerShown = !!DisplayAnswer[startIdx + idx];
          return (
            <div
              key={startIdx + idx}
              className={`movie-clue${isAnswerShown ? ' answer-shown' : ''}`}
            >
              <div className='qsdiv'>
                <div className="Question-title">{item.name}</div>
                <span
                  className={`btn${isAnswerShown ? ' btn-green' : ''}`}
                  onClick={() => {
                    setDisplayAnswer((prev) => ({
                      ...prev,
                      [startIdx + idx]: !isAnswerShown
                    }));
                  }}
                >
                  {isAnswerShown ? 'Hide answer' : 'Show answer'}
                </span>
              </div>
              <div className="Question-text">{isAnswerShown ? item.Answer : item.Question}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Makeitfun;
