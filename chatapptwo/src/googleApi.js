// generate json response from google api
// end points is https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent
// use axios
import axios from 'axios'
 const API_KEY = 'your-api-key-here'
//const API_KEY = ' '

const MODEL_NAME = 'gemini-3-flash-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

export const generateContent = async (messages) => {
    try {
        // Convert messages format to Google's expected format
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: [
                {
                    text: msg.content
                }
            ]
        }))

        const response = await axios.post(API_URL, {
            contents: contents
        }, {
            headers: {
                'Content-Type': 'application/json'
                // API key is passed as query parameter in URL, no header needed
            }
        })

        console.log('Response from Google API:', response.data)
        
        // Parse Google's response format
        const candidates = response.data.candidates
        if (candidates && candidates.length > 0) {
            return candidates[0].content.parts[0].text
        }
        throw new Error('No response from Google API')
    } catch (error) {
        console.error('Error generating content:', error.response?.data || error.message)
        throw error
    }
}



