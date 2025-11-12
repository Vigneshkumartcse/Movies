import React, { useEffect, useState } from 'react';
import './App.css';
import Load from './Load.jsx';

function MovieGuess() {
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [message, setMessage] = useState('');
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
    const response = await fetch('https://guessmovie-4.onrender.com/movies');
    const data = await response.json();
    setMovies(shuffleArray(data));
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  if (!movies.length) {
    return <div ><Load/></div>;
  }

  const currentMovie = movies[movieIndex];
  const clues = currentMovie.clue;

  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
    setMessage('');
  };

  const handleSubmit = () => {
    const answer = currentMovie && currentMovie.name ? currentMovie.name : '';
    if (userGuess.trim().toLowerCase() === answer.trim().toLowerCase()) {
      setIsCorrect(true);
      setShowNext(true);
      setMessage('You are correct!');
      // Award points based on clueIndex
      const points = cluePoints[clueIndex] || 1;
      setScore(prev => prev + points);
    } else {
      if (clueIndex < clues.length - 1) {
        setClueIndex(clueIndex + 1);
        setMessage('Try again! Here is another clue.');
      } else {
        setMessage(`No more clues! The answer was: ${answer}`);
        setShowNext(true);
      }
    }
  };

  const handleNextMovie = () => {
    setMovieIndex(movieIndex + 1);
    setClueIndex(0);
    setUserGuess('');
    setIsCorrect(false);
    setShowNext(false);
    setMessage('');
  };

  if (movieIndex >= movies.length) {
    return (
      <div className="game-over-container">
        <div className="game-over-card">
          <h2>Game Over!</h2>
          <p>You have guessed all movies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cric-bg">
      <div className="score-bar-fixed">
        <span className="score-label">Score</span>
        <span className="score-value">
          <span role="img" aria-label="coin" className="coin-icon">🪙</span> {score}
        </span>
      </div>
      <div className="movie-card">
        <h1 className="title">🎬 Guess the Movie</h1>
        <div className="clue-section">
          <span className="clue-label">Clue:</span>
          <span className="clue-text" dangerouslySetInnerHTML={{__html: clues[clueIndex].replaceAll('/n', '<br />')}} />
        </div>
        <input
          className="guess-input"
          type="text"
          placeholder="Enter your guess"
          value={userGuess}
          onChange={handleInputChange}
          disabled={showNext}
        />
        <button className="submit-btn" onClick={handleSubmit} disabled={showNext}>Submit</button>
        {message && <p className={`message ${isCorrect ? 'correct' : 'wrong'}`} dangerouslySetInnerHTML={{__html: message.replaceAll('/n', '<br />')}} />}
        {showNext && movieIndex < movies.length - 1 && (
          <button className="next-btn" onClick={handleNextMovie}>Next Movie</button>
        )}
      </div>
    </div>
  );
}

export default MovieGuess;
