import { useState, useEffect } from 'react'

function ProgressBar({ current, total }) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const progress = (current / total) * 100

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [progress])

  const getProgressColor = () => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getProgressText = () => {
    if (progress < 30) return 'Getting started'
    if (progress < 70) return 'Halfway there'
    if (progress < 100) return 'Almost done'
    return 'Complete'
  }

  return (
    <div className="w-full">
      {/* Progress Text */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progress
        </span>
        <span className="text-sm text-gray-500">
          {current} of {total} questions
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${animatedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Progress Status */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">
          {getProgressText()}
        </span>
      </div>

      {/* Progress Percentage */}
      <div className="mt-1 text-center">
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default ProgressBar
