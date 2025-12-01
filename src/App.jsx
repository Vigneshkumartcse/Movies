
import './App.css';
import Card from './Card.jsx';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className='landing-page'>
      <div className='landing-header'>
        <h1 className='landing-title'>
          <span className='title-emoji'>🎮</span>
          BrainBuzz
          <span className='title-emoji'>🧠</span>
        </h1>
        <p className='landing-subtitle'>Where Fun Meets Intelligence</p>
        <p className='landing-description'>
          Challenge your mind with exciting games! From movie trivia to cricket legends and brain-twisting puzzles.
        </p>
      </div>
      
      <div className='cards-container'>
        <Card 
          data="🎬 Guess the Movie" 
          onClick={() => { navigate('/movieguess') }} 
        />
        <Card 
          data="🏏 Guess the Cricketer" 
          onClick={() => { navigate('/GuessCrickter') }} 
        />
        <Card 
          data="🧩 Brain Puzzles" 
          onClick={() => { navigate('/tricky') }} 
        />
        <Card 
          data="🧩 Solve Mystery" 
          onClick={() => { navigate('/Mystery') }} 
        />
        <Card 
          data="🌍 Guess the Country" 
          onClick={() => { navigate('/GuessCountry') }} 
        />
      
      </div>

      <div className='landing-footer'>
        <p>Start your challenge now! Pick a game and test your knowledge 🚀</p>
      </div>
      
      
    </div>
  );
}

export default App;
