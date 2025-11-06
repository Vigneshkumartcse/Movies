import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import MovieGuess from './MovieGuess.jsx'
import GuessCrickter from './GuessCrickter.jsx'
createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Movieguess" element={<MovieGuess />} />
        <Route path="/GuessCrickter" element={<GuessCrickter />} />
      </Routes>
    </BrowserRouter>

)
