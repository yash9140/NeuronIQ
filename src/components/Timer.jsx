import { useState, useEffect } from 'react'

function Timer({ timeRemaining, isActive, onTimeUp }) {
  const [isWarning, setIsWarning] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  useEffect(() => {
    setIsWarning(timeRemaining <= 10)
    setIsCritical(timeRemaining <= 5)
  }, [timeRemaining])

  const getTimerColor = () => {
    if (isCritical) return 'text-red-500 bg-red-100'
    if (isWarning) return 'text-yellow-500 bg-yellow-100'
    return 'text-indigo-500 bg-indigo-100'
  }

  const getTimerIcon = () => {
    if (isCritical) {
      return (
        <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
    
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${getTimerColor()}`}>
      {getTimerIcon()}
      <span className="font-semibold text-lg">
        {timeRemaining}s
      </span>
      {!isActive && (
        <span className="text-xs opacity-75">
          (Paused)
        </span>
      )}
    </div>
  )
}

export default Timer
