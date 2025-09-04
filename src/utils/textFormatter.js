// Text formatting utilities for demonstration and testing

// Example of how the text cleaning works
export function demonstrateTextCleaning() {
  const examples = [
    "Who%20played%20General%20Aladeen%20in%20The%20Dictator%3F",
    "What%20is%20the%20capital%20of%20France%3F",
    "Which%20planet%20is%20known%20as%20the%20Red%20Planet%3F",
    "What%20is%202%20%2B%202%3F",
    "Which%20ocean%20is%20the%20largest%3F"
  ]

  console.log("Text Cleaning Examples:")
  console.log("=====================")
  
  examples.forEach((example, index) => {
    const cleaned = cleanText(example)
    console.log(`${index + 1}. Original: ${example}`)
    console.log(`   Cleaned:  ${cleaned}`)
    console.log("")
  })
}

// Clean and format text (same function as in quizApi.js)
function cleanText(text) {
  if (!text) return ''
  
  // First decode URL encoding
  let cleaned = decodeUrlEncoding(text)
  
  // Then decode HTML entities
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

// Decode URL encoding
function decodeUrlEncoding(str) {
  try {
    return decodeURIComponent(str)
  } catch (error) {
    // If decoding fails, return the original string
    return str
  }
}

// Decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}
