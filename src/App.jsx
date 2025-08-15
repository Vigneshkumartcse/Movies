import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);
  const [clueIndex, setClueIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchMovies() {
    const response = await fetch('https://moviebackend-1-7bwx.onrender.com/movies');
    const data = await response.json();
    setMovies(data);
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  if (!movies.length) {
    return <div className="loading">Loading...</div>;
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
    <div className="app-bg">
      <div className="movie-card">
        <h1 className="title">🎬 Guess the Movie</h1>
        <div className="clue-section">
          <span className="clue-label">Clue:</span>
          <span className="clue-text">{clues[clueIndex]}</span>
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
        {message && <p className={`message ${isCorrect ? 'correct' : 'wrong'}`}>{message}</p>}
        {showNext && movieIndex < movies.length - 1 && (
          <button className="next-btn" onClick={handleNextMovie}>Next Movie</button>
        )}
      </div>
    </div>
  );
}

export default App;
