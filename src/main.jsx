import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import MovieGuess from './MovieGuess.jsx'
import GuessCrickter from './GuessCrickter.jsx'
import Makeitfun from './Makeitfun.jsx'
import About from './About.jsx'
import Nav from './Nav.jsx'
import Detective from './Detective.jsx'
import Login from './Login.jsx'


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
       
      </Routes>
    </BrowserRouter>

)
