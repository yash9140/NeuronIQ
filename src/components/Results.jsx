import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

function Results() {
  const { state, actions } = useQuiz()
  const navigate = useNavigate()
  const [animationClass, setAnimationClass] = useState('opacity-0 transform translate-y-8')
  const [showDetails, setShowDetails] = useState(false)

  const score = state.score
  const totalQuestions = state.questions.length
  const correctAnswers = typeof score === 'object' ? score.correct : score
  const totalAnswered = typeof score === 'object' ? score.total : score
  const percentage = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setAnimationClass('opacity-100 transform translate-y-0')
    }, 100)

    // Show details after main animation
    const detailsTimer = setTimeout(() => {
      setShowDetails(true)
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(detailsTimer)
    }
  }, [])

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Outstanding! You\'re a quiz master!'
    if (percentage >= 80) return 'Excellent work! Well done!'
    if (percentage >= 70) return 'Good job! You did well!'
    if (percentage >= 60) return 'Not bad! Keep practicing!'
    if (percentage >= 50) return 'You passed! Try again for a better score!'
    return 'Don\'t give up! Practice makes perfect!'
  }

  const getScoreEmoji = () => {
    if (percentage >= 90) return '🏆'
    if (percentage >= 80) return '🎉'
    if (percentage >= 70) return '👏'
    if (percentage >= 60) return '👍'
    if (percentage >= 50) return '😊'
    return '💪'
  }

  const handleRestart = () => {
    actions.resetQuiz()
    navigate('/')
  }

  const handleTryAgain = () => {
    actions.resetQuiz()
    navigate('/quiz')
  }

  // Redirect if no quiz data
  if (!state.questions.length || !state.isQuizCompleted) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Results Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 mb-6 transition-all duration-700 ${animationClass}`}>
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getScoreEmoji()}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Learning Session Complete!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {getScoreMessage()}
            </p>
            
            {/* Score Circle */}
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                  className={`transition-all duration-1000 ease-out ${getScoreColor()}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor()}`}>
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {correctAnswers}/{totalAnswered}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Details */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="text-2xl font-bold text-gray-800">{correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{totalAnswered - correctAnswers}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800 capitalize">{state.difficulty}</div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800">{totalQuestions - totalAnswered}</div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              New Learning Session
            </button>
            <button
              onClick={handleTryAgain}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Practice More
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Home
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 transition-all duration-500 delay-300 ${
          showDetails ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Learning Review
          </h2>
          
          <div className="space-y-4">
            {state.questions.map((question, index) => {
              const selectedAnswer = state.selectedAnswers[index]
              const isCorrect = selectedAnswer === question.correctAnswer
              const isSkipped = selectedAnswer === 'SKIPPED'
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCorrect
                      ? 'border-green-200 bg-green-50'
                      : isSkipped
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Question Number */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCorrect ? 'bg-green-500 text-white' : isSkipped ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    
                    {/* Question Content */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {question.question}
                      </h3>
                      
                      {/* Answers */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-20">Your answer:</span>
                          <span className={`text-sm font-medium ${
                            isCorrect ? 'text-green-700' : isSkipped ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {isSkipped ? 'Skipped' : selectedAnswer || 'No answer selected'}
                          </span>
                          {isCorrect ? (
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : isSkipped ? (
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        {!isCorrect && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-20">Correct answer:</span>
                            <span className="text-sm font-medium text-green-700">
                              {question.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results
