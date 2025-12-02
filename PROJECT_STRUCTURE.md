# Project Structure

## 📁 Organized Directory Layout

```
src/
├── assets/              # Static assets (images, icons, etc.)
├── components/          # React components
│   ├── common/         # Reusable common components
│   │   ├── Card.jsx           # Card component for game listings
│   │   ├── GameNavbar.jsx     # Reusable navbar with Games dropdown, Score, Level selector
│   │   └── Load.jsx           # Loading spinner component
│   │
│   ├── games/          # Game components
│   │   ├── Detective.jsx      # Mystery solving game
│   │   ├── GuessCountry.jsx   # Country capital guessing game
│   │   ├── GuessCrickter.jsx  # Cricket player guessing game
│   │   ├── GuessSong.jsx      # Song guessing game
│   │   ├── Makeitfun.jsx      # Brain puzzles game
│   │   └── MovieGuess.jsx     # Movie guessing game
│   │
│   └── layout/         # Layout components
│       ├── Nav.jsx            # Main navigation bar
│       └── ScoreBar.jsx       # Score display component
│
├── config/             # Configuration files
│   └── Firebase.js            # Firebase configuration and initialization
│
├── pages/              # Page-level components
│   ├── About.jsx              # About page
│   ├── App.jsx                # Home/Landing page
│   └── Login.jsx              # Login page with Google authentication
│
├── styles/             # CSS stylesheets
│   ├── App.css                # Main application styles
│   ├── Card.css               # Card component styles
│   └── index.css              # Global styles
│
└── main.jsx            # Application entry point with routing

```

## 🎯 Component Categories

### Common Components (`components/common/`)
Reusable UI components shared across multiple pages:
- **Card**: Game card display with hover effects
- **GameNavbar**: Feature-rich navbar with dropdown menus and dynamic props
- **Load**: Animated loading spinner

### Game Components (`components/games/`)
Individual game implementations:
- **Detective**: Mystery solving with story-based puzzles
- **GuessCountry**: Geography quiz with difficulty levels
- **GuessCrickter**: Cricket trivia game
- **GuessSong**: Music identification game
- **Makeitfun**: Brain teasers and logic puzzles
- **MovieGuess**: Movie guessing from clues

### Layout Components (`components/layout/`)
Structural components for page layout:
- **Nav**: Top navigation with links
- **ScoreBar**: Score tracking display

### Pages (`pages/`)
Top-level page components:
- **App**: Landing page with game cards
- **About**: Information about the application
- **Login**: Authentication page

## 📦 Import Path Examples

### From main.jsx (root level):
```javascript
import App from './pages/App.jsx'
import GuessCountry from './components/games/GuessCountry.jsx'
import GameNavbar from './components/common/GameNavbar.jsx'
import './styles/index.css'
```

### From Game Components (components/games/):
```javascript
import Load from '../common/Load.jsx'
import GameNavbar from '../common/GameNavbar.jsx'
import '../../styles/App.css'
```

### From Pages (pages/):
```javascript
import Card from '../components/common/Card.jsx'
import app from '../config/Firebase'
import '../styles/App.css'
```

### From Common Components (components/common/):
```javascript
import '../../styles/Card.css'
```

## 🚀 Benefits of This Structure

### ✅ Maintainability
- Clear separation of concerns
- Easy to locate specific components
- Logical grouping by functionality

### ✅ Scalability
- New games go in `components/games/`
- New pages go in `pages/`
- New shared components go in `components/common/`

### ✅ Reusability
- Common components are easily accessible
- No duplication of shared code
- Centralized styling

### ✅ Developer Experience
- Intuitive folder structure
- Predictable import paths
- Better IDE auto-completion

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `GameNavbar.jsx`)
- **Folders**: camelCase (e.g., `components/`, `config/`)
- **Styles**: kebab-case or PascalCase matching component (e.g., `App.css`, `Card.css`)

## 🔧 Configuration

- **Firebase**: All Firebase config and initialization in `config/Firebase.js`
- **Routing**: Centralized in `main.jsx` using React Router
- **Styles**: Global styles in `styles/`, component-specific styles co-located or in styles folder

## 🎮 Game Routes

All game routes are defined in `main.jsx`:
- `/` - Home (App.jsx)
- `/about` - About page
- `/login` - Login page
- `/movieguess` - Movie Guess game
- `/GuessCrickter` - Cricket player game
- `/tricky` - Brain puzzles (Makeitfun)
- `/mystery` - Detective game
- `/GuessCountry` - Country capital game
- `/GuessSong` - Song guessing game
