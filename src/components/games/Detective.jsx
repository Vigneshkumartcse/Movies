import React, { useState, useEffect } from "react";
import Load from '../common/Load';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers, faLightbulb, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function Detective() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswerMap, setShowAnswerMap] = useState({}); // index -> bool
  const [expandedCluesMap, setExpandedCluesMap] = useState({}); // index -> bool

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:3331/Detective');
        const json = await res.json();
        const arr = Array.isArray(json) ? json : (json ? [json] : []);
        if (active) {
          setCases(arr);
          setError(null);
        }
      } catch {
        if (active) {
          setError('Failed to load detective cases from API.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6"><Load /></div>;
  }

  if (!loading && cases.length === 0) {
    return <div className="max-w-5xl mx-auto p-6 text-center text-sm text-gray-600 dark:text-gray-400">No detective mysteries available.</div>;
  }

  function toggleAnswer(idx) {
    setShowAnswerMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  }
  function toggleClues(idx) {
    setExpandedCluesMap(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="cric-bg detective-bg">
      <div className="detective-container">
        <div className="page-header" style={{marginBottom:'2rem'}}>
          <h1 className="page-title">🔍 Detective Mysteries</h1>
          <p className="page-subtitle">Solve the case using logic, clues, and careful observation</p>
        </div>
        {error && <div className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</div>}
        <div className="detective-grid">
          {cases.map((c, idx) => {
            const lines = (c.Question || '').split('\n');
            const title = lines[0] || `Mystery #${idx + 1}`;
            const subtitle = lines[1] || '';
            const body = lines.slice(2).join('\n');
            const showAnswer = !!showAnswerMap[idx];
            const expandedClues = !!expandedCluesMap[idx];
            return (
              <div key={idx} className="detective-card">
                <div className="detective-header">
                  <div className="flex items-center gap-3">
                    <div className="detective-icon">
                      <FontAwesomeIcon icon={faBook} />
                    </div>
                    <div>
                      <h2 className="detective-title">{title}</h2>
                      {subtitle && <p className="detective-subtitle">{subtitle}</p>}
                    </div>
                  </div>
                  <div className="detective-stats">
                    <span><FontAwesomeIcon icon={faLightbulb} /> {c.clues?.length || 0}</span>
                    <span><FontAwesomeIcon icon={faUsers} /> {c.peopleInvolved?.length || 0}</span>
                  </div>
                </div>
                <p className="detective-question whitespace-pre-line">{body || c.Question}</p>
                <p className="detective-question whitespace-pre-line">{body || c.Question}</p>
                {c.peopleInvolved && (
                  <div className="detective-section">
                    <h3 className="detective-section-title">
                      <FontAwesomeIcon icon={faUsers} /> People Involved
                    </h3>
                    <ul className="detective-list">
                      {c.peopleInvolved.map((p,i)=><li key={i}>• {p}</li>)}
                    </ul>
                  </div>
                )}
                {c.Questionasked && (
                  <div className="detective-section">
                    <h3 className="detective-section-title">Statements</h3>
                    <div className="space-y-2">
                      {c.Questionasked.map((q,i)=>(
                        <blockquote key={i} className="detective-statement">{q}</blockquote>
                      ))}
                    </div>
                  </div>
                )}
                {c.clues && (
                  <div className="detective-section">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="detective-section-title">Clues</h4>
                      <button onClick={()=>toggleClues(idx)} className="detective-toggle-btn">
                        {expandedClues ? (<><FontAwesomeIcon icon={faChevronUp}/> Hide</>) : (<><FontAwesomeIcon icon={faChevronDown}/> Show</>)}
                      </button>
                    </div>
                    {expandedClues && (
                      <ul className="detective-clues-list">
                        {c.clues.map((cl,i)=><li key={i}>• {cl}</li>)}
                      </ul>
                    )}
                  </div>
                )}
                {c.Options && (
                  <div className="detective-section detective-options">
                    <h4 className="detective-section-title">Options</h4>
                    <div className="mt-3 space-y-2">
                      {c.Options.map((o,i)=>(
                        <label key={i} className="detective-option-label">
                          {o}
                          <input type="radio" name={`suspect-${idx}`} value={o} className="accent-amber-500" />
                        </label>
                      ))}
                    </div>
                    {c.Answer && (
                      <button onClick={()=>toggleAnswer(idx)} className="show-answer-btn" style={{marginTop:'1rem'}}>
                        {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
                      </button>
                    )}
                  </div>
                )}
                {showAnswer && c.Answer && (
                  <div className="answer-box-fixed" style={{marginTop:'1.25rem'}}>
                    <span className="answer-label">Answer:</span>
                    <span className="whitespace-pre-line">{c.Answer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Detective;
