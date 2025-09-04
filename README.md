# NeuronIQ - Smart Learning Through Intelligent Questioning

A modern, responsive quiz application built with React, Vite, and Tailwind CSS. Enhance your learning with intelligent questions from the Open Trivia Database API, featuring a clean UI, timer functionality, and comprehensive scoring system designed for smart, focused learning.

## 🚀 Features

### Core Features
- **Interactive Quiz Interface**: Clean, responsive design that works on desktop and mobile
- **Question Management**: One question at a time with four multiple-choice options
- **Score Tracking**: Real-time scoring with detailed results
- **Progress Tracking**: Visual progress bar and question counter
- **Results Summary**: Comprehensive review of all answers with correct/incorrect indicators

### Advanced Features
- **Timer Per Question**: 30-second timer with auto-lock functionality
- **Difficulty Levels**: Easy, Medium, and Hard difficulty options
- **High Score Persistence**: Local storage for top 10 scores
- **API Integration**: Questions from Open Trivia Database with fallback data
- **Error Handling**: Graceful handling of network issues and API failures
- **Accessibility**: ARIA labels, keyboard navigation, and focus management
- **Animations**: Smooth transitions and visual feedback

### Technical Features
- **React Router**: Navigation between Home, Quiz, and Results pages
- **State Management**: Comprehensive context-based state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized with React hooks and efficient re-renders
- **Edge Case Handling**: Network failures, rapid clicks, page refreshes

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.13
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **API**: Open Trivia Database
- **Linting**: ESLint with React-specific rules

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Use

1. **Select Difficulty**: Choose from Easy, Medium, or Hard difficulty levels for targeted learning
2. **Start Learning**: Click "Start Quiz" to begin your intelligent learning session
3. **Answer Questions**: Select your answer for each question and learn from feedback
4. **Timer**: Each question has a 30-second timer to enhance focus and learning efficiency
5. **Navigation**: Use Previous/Next buttons to navigate through your learning journey
6. **View Results**: See your learning progress and detailed answer review
7. **Track Progress**: Your learning achievements are automatically saved locally

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Home.jsx        # Landing page with difficulty selection
│   ├── Quiz.jsx        # Main quiz interface
│   ├── Question.jsx    # Individual question component
│   ├── Results.jsx     # Results and score display
│   ├── ProgressBar.jsx # Progress indicator
│   └── Timer.jsx       # Timer component
├── context/            # State management
│   └── QuizContext.jsx # Quiz state and actions
├── services/           # API and utilities
│   └── quizApi.js      # Open Trivia DB integration
├── App.jsx             # Main app component with routing
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎯 Key Components

### QuizContext
Centralized state management using React Context and useReducer:
- Question management
- Score tracking
- Timer state
- High score persistence
- Error handling

### API Service
Robust API integration with fallback:
- Open Trivia Database integration
- Error handling and retry logic
- Fallback questions for offline use
- Data transformation and sanitization

### Responsive Design
Mobile-first approach with Tailwind CSS:
- Responsive layouts
- Touch-friendly interactions
- Accessible color schemes
- Smooth animations

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🌟 Features in Detail

### Timer Functionality
- 30-second countdown per question
- Visual warning when time is running low
- Auto-lock answer when time expires
- Pause/resume functionality

### Difficulty System
- **Easy**: Basic questions for beginners
- **Medium**: Moderate difficulty questions
- **Hard**: Challenging questions for experts
- Different question sets for each difficulty

### High Score System
- Persistent storage using localStorage
- Top 10 scores maintained
- Difficulty-specific scoring
- Date tracking for each score

### Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast color schemes
- Semantic HTML structure

## 🚨 Error Handling

The application handles various edge cases:
- Network connectivity issues
- API failures with fallback questions
- Empty or malformed data
- Rapid user interactions
- Page refreshes during quiz
- Timer edge cases

## 🎨 Customization

### Styling
- Modify Tailwind classes in components
- Update color schemes in `tailwind.config.js`
- Add custom animations in `App.css`

### Configuration
- Adjust timer duration in `Quiz.jsx`
- Modify question count in `Home.jsx`
- Update API parameters in `quizApi.js`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing intelligent learning questions
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the component-based architecture
- [Vite](https://vitejs.dev/) for the fast build tool

## 🧠 About NeuronIQ

NeuronIQ represents the fusion of neuroscience-inspired learning principles with intelligent questioning systems. The name reflects our commitment to smart, focused learning that stimulates neural pathways and enhances knowledge retention through strategic questioning and immediate feedback.
