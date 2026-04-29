// generate json response from google api
// end points is https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent
// use axios
// be a responsible ai, apply guardrails to prevent harmful or inappropriate content from being generated, and provide options for users to report any issues they encounter with the generated content.
// add system prompt to prevent harmful or inappropriate content from being generated, and provide options for users to report any issues they encounter with the generated content.
// filter the inputs and outputs to prevent harmful or inappropriate content from being generated, and provide options for users to report any issues they encounter with the generated content.
import axios from 'axios'

const API_KEY = 'AIzaSyDQZ1iSGL6XfUPYI4CNShT-cty9Oi2S-_8'
//const API_KEY = ' '

const MODEL_NAME = 'gemini-3-flash-preview'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

// System prompt for guardrails - enforces responsible AI behavior
const SYSTEM_PROMPT = `You are a helpful and responsible AI assistant. 
You must follow these guidelines:
1. Never generate harmful, violent, or inappropriate content
2. Never provide instructions for creating weapons, illegal drugs, or harmful substances
3. Never generate content that promotes hate speech, discrimination, or harassment
4. Never share personal information about private individuals
5. Never generate content that is sexually explicit or pornographic
6. Never provide medical, legal, or financial advice - always suggest consulting professionals
7. Always be truthful and avoid spreading misinformation
8. If asked to do something harmful or inappropriate, politely decline and explain why
9. If you encounter any issues or inappropriate requests, respond responsibly

If a user asks you to generate inappropriate content, respond with: "I'm sorry, but I can't help with that request. This type of content goes against my responsible AI guidelines."

Report any issues to the user and suggest they use the reporting feature if available.`

// Keywords to filter for harmful/inappropriate content (input guardrails)
const BLOCKED_KEYWORDS = [
    'harm', 'violence', 'weapon', 'bomb', 'attack', 'kill', 'murder', 'suicide',
    'hate', 'racist', 'sexist', 'discriminat', 'harass',
    'porn', 'sexually explicit', 'nude', 'nsfw',
    'drug', 'illegal', 'fraud', 'scam',
    'hack', 'exploit', 'virus', 'malware',
    'personal information', 'private data', 'dox',
    'medical advice', 'legal advice', 'financial advice'
]

// Check if content contains blocked keywords
const containsBlockedContent = (text) => {
    const lowerText = text.toLowerCase()
    return BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()))
}

// Filter and sanitize user input
const filterInput = (content) => {
    if (containsBlockedContent(content)) {
        return {
            isBlocked: true,
            message: "I'm sorry, but I can't process this request. It appears to contain content that goes against my responsible AI guidelines. If you believe this is an error, please use the reporting feature to let us know."
        }
    }
    return { isBlocked: false }
}

// Filter and sanitize AI output
const filterOutput = (content) => {
    if (!content) {
        return { isBlocked: true, message: "I didn't receive a valid response. Please try again." }
    }
    if (containsBlockedContent(content)) {
        return {
            isBlocked: true,
            message: "I'm sorry, but the response generated contained content that violates our responsible AI guidelines. This has been filtered out. Please try a different query, or report this issue using the reporting feature."
        }
    }
    return { isBlocked: false, content }
}

export const generateContent = async (messages) => {
    try {
        // Filter user inputs before processing
        for (const msg of messages) {
            if (msg.role === 'user') {
                const inputCheck = filterInput(msg.content)
                if (inputCheck.isBlocked) {
                    return {
                        success: false,
                        error: inputCheck.message,
                        isGuardrail: true
                    }
                }
            }
        }

        // Convert messages format to Google's expected format  
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: [
                {
                    text: msg.content
                }
            ]
        }))

        // Prepend system prompt to the first user message
        const systemMessage = {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT }]
        }

        const response = await axios.post(API_URL, {
            systemInstruction: {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }]
            },
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
            const rawResponse = candidates[0].content.parts[0].text
            
            // Filter the output for harmful/inappropriate content
            const outputCheck = filterOutput(rawResponse)
            if (outputCheck.isBlocked) {
                return {
                    success: false,
                    error: outputCheck.message,
                    isGuardrail: true
                }
            }
            
            return {
                success: true,
                content: rawResponse
            }
        }
        
        return {
            success: false,
            error: "I didn't receive a valid response from the AI. Please try again.",
            isGuardrail: false
        }
    } catch (error) {
        console.error('Error generating content:', error.response?.data || error.message)
        return {
            success: false,
            error: "An error occurred while generating the response. Please try again later.",
            isGuardrail: false
        }
    }
}
