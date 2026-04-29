// API Configuration for Google Gemini API
// Follows clean architecture - separate config from business logic

const API_KEY = 'AIzaSyDQZ1iSGL6XfUPYI4CNShT-cty9Oi2S-_8'

const MODEL_NAME = 'gemini-3-flash-preview'

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`

const FULL_API_URL = `${API_URL}?key=${API_KEY}`

// Request configuration
const REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 seconds timeout
}

export const apiConfig = {
    API_KEY,
    MODEL_NAME,
    API_URL,
    FULL_API_URL,
    REQUEST_CONFIG
}

export default apiConfig