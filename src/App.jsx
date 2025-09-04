import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import './App.css'

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App
