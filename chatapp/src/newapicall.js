// need function named sendMessage which takes message and retries as parameters and returns,
// it need s to use axio call and uses gemini 1.5-flash or 2.5 flash , and call
// the api https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`
//  convert the chat message into gemini "contents" format and send the request to google api and return the response
//include system prompt for assitant behaviour
// implement rtry logic  with backoff, handle errors 400 series with proper message
// return structure response { success: boolean, data: string, error: string }
// extract response from candidates[0].content.parts[0].text
// use a clean code and modular approach, separate concerns into different functions if needed

import axios from 'axios'
const API_KEY = 'AIzaSyDQZ1iSGL6XfUPYI4CNShT-cty9Oi2S-_8'
const MODEL_NAME = 'gemini-3-flash-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const SYSTEM_PROMPT = {
    role: 'system',
    parts: [
        {
            text: 'You are a helpful assistant that provides concise and accurate responses.'
        }
    ]
}

const convertToGoogleFormat = (messages) => {
    return messages.map(msg => ({
        role: msg.role, 
        parts: [
            {
                text: msg.content
            }
        ]
    }))
}

const sendRequest = async (contents) => {
    try {
        const response = await axios.post(API_URL, {
            contents: [SYSTEM_PROMPT, ...contents]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(`Error ${error.response.status}: ${error.response.data.error.message}`)
        } else {
            throw new Error(`Network error: ${error.message}`)
        }
    }
}

export const sendMessage = async (message, retries = 3) => {
    const contents = convertToGoogleFormat([message])
    for (let attempt = 0; attempt < retries; attempt++) {
        try {   
            const data = await sendRequest(contents)
            const candidates = data.candidates  
            if (candidates && candidates.length > 0) {
                return { success: true, data: candidates[0].content.parts[0].text, error: null }
            }
            return { success: false, data: null, error: 'No response from Google API' }
        } catch (error) {
            if (attempt < retries - 1) {
                const backoffTime = Math.pow(2, attempt) * 1000
                console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${backoffTime / 1000} seconds...`)
                await new Promise(resolve => setTimeout(resolve, backoffTime))
            } else {
                console.error(`All attempts failed: ${error.message}`)
                return { success: false, data: null, error: error.message }
            }
        }
    }   

}





