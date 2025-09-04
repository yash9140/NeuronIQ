// Open Trivia DB API service
const API_BASE_URL = 'https://opentdb.com/api.php'

// Decode HTML entities and URL encoding
function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

// Decode URL encoding
function decodeUrlEncoding(str) {
  try {
    return decodeURIComponent(str)
  } catch (error) {
    // If decoding fails, return the original string
    return str
  }
}

// Clean and format text
function cleanText(text) {
  if (!text) return ''
  
  let cleaned = text
  
  // Multiple passes of URL decoding to handle nested encoding
  for (let i = 0; i < 3; i++) {
    const prevCleaned = cleaned
    cleaned = decodeUrlEncoding(cleaned)
    if (cleaned === prevCleaned) break // No more changes
  }
  
  // Decode HTML entities
  cleaned = decodeHtml(cleaned)
  
  // Fix common formatting issues
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
  
  // Capitalize first letter and add proper punctuation for questions
  if (cleaned) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    
    // Add question mark if it's a question and doesn't end with punctuation
    if (!cleaned.endsWith('?') && !cleaned.endsWith('.') && !cleaned.endsWith('!')) {
      cleaned += '?'
    }
  }
  
  return cleaned
}


// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Transform API response to our format
function transformQuestion(apiQuestion) {
  const cleanedQuestion = cleanText(apiQuestion.question)
  const incorrectAnswers = apiQuestion.incorrect_answers.map(cleanText)
  const correctAnswer = cleanText(apiQuestion.correct_answer)
  
  // Combine and shuffle all answers
  const allAnswers = shuffleArray([...incorrectAnswers, correctAnswer])
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    question: cleanedQuestion,
    answers: allAnswers,
    correctAnswer,
    difficulty: apiQuestion.difficulty,
    category: cleanText(apiQuestion.category)
  }
}

// Fetch questions from Open Trivia DB
export async function fetchQuestions(difficulty = 'medium', amount = 10) {
  try {
    const params = new URLSearchParams({
      amount: amount.toString(),
      difficulty,
      type: 'multiple',
      encode: 'default' // Use default encoding
    })

    const response = await fetch(`${API_BASE_URL}?${params}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.response_code !== 0) {
      throw new Error('API returned an error')
    }

    if (!data.results || data.results.length === 0) {
      throw new Error('No questions received from API')
    }

    return data.results.map(transformQuestion)
  } catch (error) {
    console.error('Error fetching questions:', error)
    
    // Return fallback questions if API fails
    return getFallbackQuestions(difficulty, amount)
  }
}

// Fallback questions in case API is unavailable
function getFallbackQuestions(difficulty, amount) {
  const fallbackQuestions = {
    easy: [
      {
        id: 'fallback-1',
        question: 'What is the capital of France?',
        answers: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        difficulty: 'easy',
        category: 'Geography'
      },
      {
        id: 'fallback-2',
        question: 'Which planet is known as the Red Planet?',
        answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        difficulty: 'easy',
        category: 'Science'
      },
      {
        id: 'fallback-3',
        question: 'What is 2 + 2?',
        answers: ['3', '4', '5', '6'],
        correctAnswer: '4',
        difficulty: 'easy',
        category: 'Mathematics'
      },
      {
        id: 'fallback-4',
        question: 'Which ocean is the largest?',
        answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        correctAnswer: 'Pacific',
        difficulty: 'easy',
        category: 'Geography'
      },
      {
        id: 'fallback-5',
        question: 'What is the chemical symbol for water?',
        answers: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctAnswer: 'H2O',
        difficulty: 'easy',
        category: 'Science'
      }
    ],
    medium: [
      {
        id: 'fallback-6',
        question: 'Who painted the Mona Lisa?',
        answers: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
        correctAnswer: 'Leonardo da Vinci',
        difficulty: 'medium',
        category: 'Art'
      },
      {
        id: 'fallback-7',
        question: 'What is the smallest country in the world?',
        answers: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
        correctAnswer: 'Vatican City',
        difficulty: 'medium',
        category: 'Geography'
      },
      {
        id: 'fallback-8',
        question: 'Which programming language was created by Brendan Eich?',
        answers: ['Python', 'Java', 'JavaScript', 'C++'],
        correctAnswer: 'JavaScript',
        difficulty: 'medium',
        category: 'Technology'
      },
      {
        id: 'fallback-9',
        question: 'What is the speed of light in vacuum?',
        answers: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '301,000,000 m/s'],
        correctAnswer: '299,792,458 m/s',
        difficulty: 'medium',
        category: 'Science'
      },
      {
        id: 'fallback-10',
        question: 'Which year did World War II end?',
        answers: ['1944', '1945', '1946', '1947'],
        correctAnswer: '1945',
        difficulty: 'medium',
        category: 'History'
      }
    ],
    hard: [
      {
        id: 'fallback-11',
        question: 'What is the Heisenberg Uncertainty Principle?',
        answers: [
          'Energy cannot be created or destroyed',
          'You cannot simultaneously know the exact position and momentum of a particle',
          'Light behaves as both wave and particle',
          'Matter and energy are equivalent'
        ],
        correctAnswer: 'You cannot simultaneously know the exact position and momentum of a particle',
        difficulty: 'hard',
        category: 'Science'
      },
      {
        id: 'fallback-12',
        question: 'Which algorithm is used for finding the shortest path in a graph?',
        answers: ['Bubble Sort', 'Dijkstra\'s Algorithm', 'Binary Search', 'Quick Sort'],
        correctAnswer: 'Dijkstra\'s Algorithm',
        difficulty: 'hard',
        category: 'Computer Science'
      },
      {
        id: 'fallback-13',
        question: 'What is the time complexity of merge sort?',
        answers: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 'O(n log n)',
        difficulty: 'hard',
        category: 'Computer Science'
      },
      {
        id: 'fallback-14',
        question: 'Which philosopher wrote "Being and Time"?',
        answers: ['Jean-Paul Sartre', 'Martin Heidegger', 'Friedrich Nietzsche', 'Immanuel Kant'],
        correctAnswer: 'Martin Heidegger',
        difficulty: 'hard',
        category: 'Philosophy'
      },
      {
        id: 'fallback-15',
        question: 'What is the derivative of e^x?',
        answers: ['e^x', 'x * e^x', 'e^(x-1)', 'ln(x)'],
        correctAnswer: 'e^x',
        difficulty: 'hard',
        category: 'Mathematics'
      }
    ]
  }

  const questions = fallbackQuestions[difficulty] || fallbackQuestions.medium
  return questions.slice(0, Math.min(amount, questions.length))
}

// Check if API is available
export async function checkApiAvailability() {
  try {
    const response = await fetch(`${API_BASE_URL}?amount=1&type=multiple`, {
      method: 'HEAD',
      timeout: 5000
    })
    return response.ok
  } catch (error) {
    return false
  }
}
