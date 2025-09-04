import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import Question from './Question'
import ProgressBar from './ProgressBar'
import Timer from './Timer'

function Quiz() {
  const { state, actions } = useQuiz()
  const navigate = useNavigate()
  const [isAnswerLocked, setIsAnswerLocked] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = state.questions[state.currentQuestionIndex]
  const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1
  const hasSelectedAnswer = state.selectedAnswers[state.currentQuestionIndex] !== undefined
  const hasSkipped = state.selectedAnswers[state.currentQuestionIndex] === 'SKIPPED'

  // Timer effect
  useEffect(() => {
    if (!currentQuestion || isAnswerLocked) return

    const timer = setInterval(() => {
      if (state.timeRemaining > 0) {
        actions.setTimer(state.timeRemaining - 1)
      } else {
        // Time's up - auto-lock answer
        handleTimeUp()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [state.timeRemaining, currentQuestion, isAnswerLocked])

  // Reset timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      actions.setTimer(30)
      setIsAnswerLocked(false)
      setShowFeedback(false)
    }
  }, [state.currentQuestionIndex, currentQuestion])

  const handleTimeUp = useCallback(() => {
    setIsAnswerLocked(true)
    setShowFeedback(true)
    
    // Auto-select first option if no answer selected
    if (!hasSelectedAnswer) {
      actions.setSelectedAnswer(currentQuestion.answers[0])
    }
  }, [hasSelectedAnswer, currentQuestion, actions])

  const handleAnswerSelect = (answer) => {
    if (isAnswerLocked) return
    
    actions.setSelectedAnswer(answer)
    setIsAnswerLocked(true)
    setShowFeedback(true)
  }

  const handleSkip = () => {
    if (isAnswerLocked) return
    
    actions.setSelectedAnswer('SKIPPED')
    setIsAnswerLocked(true)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (!hasSelectedAnswer && !isAnswerLocked && !hasSkipped) return

    // Calculate score if this is the last question
    if (isLastQuestion) {
      calculateFinalScore()
      navigate('/results')
    } else {
      actions.setCurrentQuestion(state.currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (state.currentQuestionIndex > 0) {
      actions.setCurrentQuestion(state.currentQuestionIndex - 1)
    }
  }

  const calculateFinalScore = () => {
    let score = 0
    let totalAnswered = 0
    
    state.questions.forEach((question, index) => {
      const selectedAnswer = state.selectedAnswers[index]
      if (selectedAnswer && selectedAnswer !== 'SKIPPED') {
        totalAnswered++
        if (selectedAnswer === question.correctAnswer) {
          score++
        }
      }
    })
    
    // Store score with both correct answers and total answered questions
    const scoreData = {
      correct: score,
      total: totalAnswered,
      totalQuestions: state.questions.length
    }
    
    actions.setScore(scoreData)
    actions.setQuizCompleted(true)
    actions.addHighScore(scoreData, state.difficulty)
  }

  // Redirect to home if no questions loaded
  if (!state.questions.length) {
    navigate('/')
    return null
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Preparing learning session...</p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Learning Session</h3>
          <p className="text-red-600 mb-4">{state.error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Progress */}
            <div className="flex-1">
              <ProgressBar
                current={state.currentQuestionIndex + 1}
                total={state.questions.length}
              />
            </div>
            
            {/* Timer */}
            <div className="flex items-center space-x-4">
              <Timer
                timeRemaining={state.timeRemaining}
                isActive={!isAnswerLocked}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <Question
            question={currentQuestion}
            selectedAnswer={state.selectedAnswers[state.currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            isAnswerLocked={isAnswerLocked}
            showFeedback={showFeedback}
          />
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={state.currentQuestionIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              Previous
            </button>

            {/* Question Info */}
            <div className="text-center">
              <p className="text-gray-600">
                Question {state.currentQuestionIndex + 1} of {state.questions.length}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {currentQuestion.difficulty} • {currentQuestion.category}
              </p>
            </div>

            {/* Next/Finish Button */}
            <button
              onClick={handleNext}
              disabled={!hasSelectedAnswer && !isAnswerLocked && !hasSkipped}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
            >
              {isLastQuestion ? 'Complete Learning' : 'Next Question'}
            </button>
          </div>
          
          {/* Skip Button */}
          {!isAnswerLocked && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSkip}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Skip Question
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!hasSelectedAnswer && !isAnswerLocked && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Select an answer to continue your learning or skip the question. You have {state.timeRemaining} seconds remaining.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
