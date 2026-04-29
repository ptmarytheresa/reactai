// AI Service Layer
// Main service for generating content with guardrails and error handling

import axios from 'axios'
import { apiConfig } from '../config/apiConfig.js'
import { getSystemPrompt } from '../config/systemPrompt.js'
import { inputGuardrail } from '../utils/inputGuardrail.js'
import { outputGuardrail } from '../utils/outputGuardrail.js'
import { parseResponse, extractMetadata } from '../utils/responseParser.js'

/**
 * Convert messages to Google's expected format
 * @param {Array} messages - Array of message objects {role, content}
 * @param {string} systemPrompt - System prompt to prepend
 * @returns {Array} - Formatted contents for API
 */
const formatMessages = (messages, systemPrompt) => {
    const contents = []

    // Add system message at the beginning if provided
    if (systemPrompt) {
        contents.push({
            role: 'system',
            parts: [{ text: systemPrompt }]
        })
    }

    // Convert all messages to Google's format
    for (const msg of messages) {
        contents.push({
            role: msg.role === 'system' ? 'user' : msg.role,
            parts: [{ text: msg.content }]
        })
    }

    return contents
}

/**
 * Main generateContent function
 * Generates AI content with full guardrail protection
 * @param {Array} messages - Array of message objects [{role: 'user'|'model', content: string}]
 * @returns {Promise<object>} - Structured response {success, content?, error?, isGuardrail?}
 */
export const generateContent = async (messages) => {
    try {
        // Step 1: Input Guardrail - Validate and filter input
        const inputCheck = inputGuardrail(messages)
        if (!inputCheck.passed) {
            return {
                success: false,
                error: inputCheck.error,
                isGuardrail: inputCheck.isGuardrail || false
            }
        }

        // Step 2: Get system prompt
        const systemPrompt = getSystemPrompt()

        // Step 3: Format messages for Google API
        const formattedContents = formatMessages(messages, systemPrompt)

        // Step 4: Make API call
        const response = await axios.post(
            apiConfig.FULL_API_URL,
            {
                contents: formattedContents,
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 2048,
                    topP: 0.95,
                    topK: 40
                }
            },
            apiConfig.REQUEST_CONFIG
        )

        // Step 5: Parse and validate API response
        const parsedResult = parseResponse(response)
        if (!parsedResult.success) {
            return {
                success: false,
                error: parsedResult.error,
                isGuardrail: false
            }
        }

        // Step 6: Output Guardrail - Validate generated content
        const outputCheck = outputGuardrail(parsedResult.content)
        if (!outputCheck.isValid) {
            return {
                success: false,
                error: outputCheck.error,
                isGuardrail: outputCheck.isGuardrail || true
            }
        }

        // Step 7: Return successful response
        const metadata = extractMetadata(response)
        return {
            success: true,
            content: parsedResult.content,
            metadata
        }

    } catch (error) {
        // Handle different error types
        let errorMessage = 'An unexpected error occurred'
        let isApiError = false

        if (error.response) {
            // API returned an error response
            isApiError = true
            const status = error.response.status
            const data = error.response.data

            if (status === 400) {
                errorMessage = 'Bad request: Invalid input or parameters'
            } else if (status === 401) {
                errorMessage = 'Authentication failed: Invalid API key'
            } else if (status === 403) {
                errorMessage = 'Access forbidden: API key lacks permissions'
            } else if (status === 429) {
                errorMessage = 'Rate limit exceeded: Please try again later'
            } else if (status >= 500) {
                errorMessage = 'Server error: Please try again later'
            } else if (data?.error?.message) {
                errorMessage = data.error.message
            }
        } else if (error.request) {
            // Network error or timeout
            errorMessage = 'Network error: Unable to reach the API. Please check your connection.'
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout: The API took too long to respond'
        } else if (error.message) {
            errorMessage = error.message
        }

        console.error('AI Service Error:', {
            message: errorMessage,
            isApiError,
            originalError: error.message
        })

        return {
            success: false,
            error: errorMessage,
            isGuardrail: false
        }
    }
}

/**
 * Generate content with custom options
 * @param {Array} messages - Array of message objects
 * @param {object} options - Custom options (temperature, maxTokens, etc.)
 * @returns {Promise<object>} - Structured response
 */
export const generateContentWithOptions = async (messages, options = {}) => {
    try {
        // Input guardrail
        const inputCheck = inputGuardrail(messages)
        if (!inputCheck.passed) {
            return {
                success: false,
                error: inputCheck.error,
                isGuardrail: inputCheck.isGuardrail || false
            }
        }

        const systemPrompt = getSystemPrompt()
        const formattedContents = formatMessages(messages, systemPrompt)

        // Merge default config with custom options
        const generationConfig = {
            temperature: options.temperature ?? 0.9,
            maxOutputTokens: options.maxTokens ?? 2048,
            topP: options.topP ?? 0.95,
            topK: options.topK ?? 40,
            ...options
        }

        const response = await axios.post(
            apiConfig.FULL_API_URL,
            {
                contents: formattedContents,
                generationConfig
            },
            apiConfig.REQUEST_CONFIG
        )

        const parsedResult = parseResponse(response)
        if (!parsedResult.success) {
            return {
                success: false,
                error: parsedResult.error,
                isGuardrail: false
            }
        }

        const outputCheck = outputGuardrail(parsedResult.content)
        if (!outputCheck.isValid) {
            return {
                success: false,
                error: outputCheck.error,
                isGuardrail: outputCheck.isGuardrail || true
            }
        }

        return {
            success: true,
            content: parsedResult.content
        }

    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            isGuardrail: false
        }
    }
}

export default {
    generateContent,
    generateContentWithOptions
}