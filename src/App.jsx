
import './App.css';
import Card from './Card.jsx';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();

  return (
    <div className='outer' >
  <Card data="Guess Movie"  onClick={() => { navigate('/movieguess') }} />
  <Card data="Guess Cricketer"  onClick={() => { navigate('/GuessCrickter') }} />
    </div>
  );
}

export default App;
