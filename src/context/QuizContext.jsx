import { createContext, useContext, useReducer, useEffect } from 'react'

const QuizContext = createContext()

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_SELECTED_ANSWER: 'SET_SELECTED_ANSWER',
  SET_SCORE: 'SET_SCORE',
  SET_QUIZ_COMPLETED: 'SET_QUIZ_COMPLETED',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_TIMER: 'SET_TIMER',
  RESET_QUIZ: 'RESET_QUIZ',
  SET_HIGH_SCORES: 'SET_HIGH_SCORES'
}

// Initial state
const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  score: { correct: 0, total: 0, totalQuestions: 0 },
  isLoading: false,
  error: null,
  isQuizCompleted: false,
  difficulty: 'medium',
  timeRemaining: 30,
  isTimerActive: false,
  highScores: []
}

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case ACTIONS.SET_QUESTIONS:
      return { 
        ...state, 
        questions: action.payload, 
        isLoading: false, 
        error: null,
        currentQuestionIndex: 0,
        selectedAnswers: {},
        score: { correct: 0, total: 0, totalQuestions: 0 },
        isQuizCompleted: false
      }
    
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestionIndex: action.payload }
    
    case ACTIONS.SET_SELECTED_ANSWER:
      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [state.currentQuestionIndex]: action.payload
        }
      }
    
    case ACTIONS.SET_SCORE:
      return { ...state, score: action.payload }
    
    case ACTIONS.SET_QUIZ_COMPLETED:
      return { ...state, isQuizCompleted: action.payload }
    
    case ACTIONS.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload }
    
    case ACTIONS.SET_TIMER:
      return { ...state, timeRemaining: action.payload }
    
    case ACTIONS.RESET_QUIZ:
      return {
        ...initialState,
        difficulty: state.difficulty,
        highScores: state.highScores
      }
    
    case ACTIONS.SET_HIGH_SCORES:
      return { ...state, highScores: action.payload }
    
    default:
      return state
  }
}

// Provider component
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  // Load high scores from localStorage on mount
  useEffect(() => {
    const savedHighScores = localStorage.getItem('quizHighScores')
    if (savedHighScores) {
      dispatch({ type: ACTIONS.SET_HIGH_SCORES, payload: JSON.parse(savedHighScores) })
    }
  }, [])

  // Save high scores to localStorage whenever they change
  useEffect(() => {
    if (state.highScores.length > 0) {
      localStorage.setItem('quizHighScores', JSON.stringify(state.highScores))
    }
  }, [state.highScores])

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setQuestions: (questions) => dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions }),
    setCurrentQuestion: (index) => dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: index }),
    setSelectedAnswer: (answer) => dispatch({ type: ACTIONS.SET_SELECTED_ANSWER, payload: answer }),
    setScore: (score) => dispatch({ type: ACTIONS.SET_SCORE, payload: score }),
    setQuizCompleted: (completed) => dispatch({ type: ACTIONS.SET_QUIZ_COMPLETED, payload: completed }),
    setDifficulty: (difficulty) => dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: difficulty }),
    setTimer: (time) => dispatch({ type: ACTIONS.SET_TIMER, payload: time }),
    resetQuiz: () => dispatch({ type: ACTIONS.RESET_QUIZ }),
    addHighScore: (scoreData, difficulty) => {
      const newScore = {
        score: scoreData.correct,
        total: scoreData.total,
        totalQuestions: scoreData.totalQuestions,
        difficulty,
        date: new Date().toISOString(),
        id: Date.now()
      }
      const updatedScores = [...state.highScores, newScore]
        .sort((a, b) => {
          // Sort by correct answers first, then by percentage
          if (a.score !== b.score) return b.score - a.score
          return (b.score / b.total) - (a.score / a.total)
        })
        .slice(0, 10) // Keep only top 10
      dispatch({ type: ACTIONS.SET_HIGH_SCORES, payload: updatedScores })
    }
  }

  return (
    <QuizContext.Provider value={{ state, actions }}>
      {children}
    </QuizContext.Provider>
  )
}

// Custom hook to use the context
export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
