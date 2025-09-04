import { useState, useEffect } from 'react'

function Question({ question, selectedAnswer, onAnswerSelect, isAnswerLocked, showFeedback }) {
  const [animationClass, setAnimationClass] = useState('')

  // Animation effect when question changes
  useEffect(() => {
    setAnimationClass('opacity-0 transform translate-y-4')
    const timer = setTimeout(() => {
      setAnimationClass('opacity-100 transform translate-y-0')
    }, 100)
    
    return () => clearTimeout(timer)
  }, [question.id])

  const getAnswerClasses = (answer) => {
    const baseClasses = "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium transform hover:scale-105"
    
    if (!showFeedback) {
      return `${baseClasses} ${
        selectedAnswer === answer
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
      }`
    }

    // Show feedback
    if (answer === question.correctAnswer) {
      return `${baseClasses} border-green-500 bg-green-50 text-green-700 scale-105`
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return `${baseClasses} border-red-500 bg-red-50 text-red-700`
    }
    
    return `${baseClasses} border-gray-200 bg-gray-50 text-gray-500`
  }

  const getAnswerIcon = (answer) => {
    if (!showFeedback) {
      return selectedAnswer === answer ? (
        <div className="w-6 h-6 border-2 border-indigo-500 bg-indigo-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      ) : (
        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
      )
    }

    // Show feedback icons
    if (answer === question.correctAnswer) {
      return (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return (
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      )
    }
    
    return <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
  }

  if (!question) return null

  return (
    <div className={`transition-all duration-500 ${animationClass}`}>
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(answer)}
            disabled={isAnswerLocked}
            className={getAnswerClasses(answer)}
            aria-label={`Answer option ${index + 1}: ${answer}`}
          >
            <div className="flex items-center space-x-4">
              {getAnswerIcon(answer)}
              <span className="flex-1">{answer}</span>
              {showFeedback && answer === question.correctAnswer && (
                <span className="text-green-600 font-semibold text-sm">
                  Correct!
                </span>
              )}
              {showFeedback && selectedAnswer === answer && answer !== question.correctAnswer && (
                <span className="text-red-600 font-semibold text-sm">
                  Incorrect
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <div className={`mt-6 p-4 rounded-xl transition-all duration-300 ${
          selectedAnswer === question.correctAnswer
            ? 'bg-green-50 border border-green-200'
            : selectedAnswer === 'SKIPPED'
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {selectedAnswer === question.correctAnswer ? (
              <>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium">Correct! Well done.</span>
              </>
            ) : selectedAnswer === 'SKIPPED' ? (
              <>
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-700 font-medium">
                  Question skipped. The correct answer is: <strong>{question.correctAnswer}</strong>
                </span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">
                  Incorrect. The correct answer is: <strong>{question.correctAnswer}</strong>
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Question
