import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { fetchQuestions } from '../services/quizApi'

function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { actions, state } = useQuiz()
  const navigate = useNavigate()

  const difficulties = [
    { value: 'easy', label: 'Easy', description: 'Basic questions for beginners', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', description: 'Moderate difficulty questions', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Hard', description: 'Challenging questions for experts', color: 'bg-red-500' }
  ]

  const handleStartQuiz = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      actions.setDifficulty(selectedDifficulty)
      actions.setLoading(true)
      
      const questions = await fetchQuestions(selectedDifficulty, 10)
      
      if (questions.length === 0) {
        throw new Error('No learning content available. Please try again.')
      }
      
      actions.setQuestions(questions)
      navigate('/quiz')
    } catch (err) {
      setError(err.message || 'Failed to load learning content. Please try again.')
      actions.setError(err.message)
    } finally {
      setIsLoading(false)
      actions.setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            NeuronIQ
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Smart learning through intelligent questioning
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Choose Difficulty Level
          </h2>
          
          <div className="space-y-4">
            {difficulties.map((difficulty) => (
              <label
                key={difficulty.value}
                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedDifficulty === difficulty.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name="difficulty"
                    value={difficulty.value}
                    checked={selectedDifficulty === difficulty.value}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full ${difficulty.color} ${
                    selectedDifficulty === difficulty.value ? 'ring-4 ring-indigo-200' : ''
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">
                        {difficulty.label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${difficulty.color}`}>
                        {difficulty.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {difficulty.description}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* High Scores */}
        {state.highScores.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              High Scores
            </h3>
            <div className="space-y-2">
              {state.highScores.slice(0, 5).map((score, index) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">
                      {new Date(score.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-800">
                      {score.score}/{score.total || score.totalQuestions || 10}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium text-white ${
                      score.difficulty === 'easy' ? 'bg-green-500' :
                      score.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {score.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700 font-medium">Error</span>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Preparing Learning Session...</span>
            </div>
          ) : (
            'Start Learning'
          )}
        </button>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Smart learning features:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Intelligent Timer', 'Learning Progress', 'Knowledge Tracking', 'Adaptive Difficulty', 'Neural Feedback'].map((feature) => (
              <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
