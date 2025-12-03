import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './pages/App.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import MovieGuess from './components/games/MovieGuess.jsx'
import GuessCrickter from './components/games/GuessCrickter.jsx'
import Makeitfun from './components/games/Makeitfun.jsx'
import About from './pages/About.jsx'
import Nav from './components/layout/Nav.jsx'
import Detective from './components/games/Detective.jsx'
import Login from './pages/Login.jsx'
import GuessCountry from './components/games/GuessCountry.jsx'
import GuessSong from './components/games/GuessSong.jsx'
import GK from './components/games/GK.jsx'


createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Nav />
      <Routes > 
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/Movieguess" element={<MovieGuess />} />
        <Route path="/GuessCrickter" element={<GuessCrickter />} />
        <Route path="/tricky" element={<Makeitfun />} />
        <Route path="/mystery" element={<Detective />} />
        <Route path="/login" element={<Login />} />
        <Route path="/GuessCountry" element={<GuessCountry />} />
        <Route path="/GuessSong" element={<GuessSong />} />
        <Route path="/GK" element={<GK />} />
       
      </Routes>
    </BrowserRouter>

)
