// Response Parser Utility
// Validates and parses Google Gemini API responses

/**
 * Validate API response structure
 * @param {object} response - Raw API response
 * @returns {object} - { isValid: boolean, error?: string, parsedContent?: string }
 */
export const validateResponse = (response) => {
    // Check if response exists
    if (!response) {
        return {
            isValid: false,
            error: 'No response received from API'
        }
    }

    // Check if response has expected structure
    if (!response.data) {
        return {
            isValid: false,
            error: 'Invalid response format: missing data field'
        }
    }

    const data = response.data

    // Check for error responses from Google
    if (data.error) {
        return {
            isValid: false,
            error: `API Error: ${data.error.message || 'Unknown error'}`
        }
    }

    // Check for candidates (response content)
    if (!data.candidates || !Array.isArray(data.candidates)) {
        return {
            isValid: false,
            error: 'Invalid response format: missing candidates array'
        }
    }

    if (data.candidates.length === 0) {
        return {
            isValid: false,
            error: 'API returned no candidates'
        }
    }

    // Check first candidate structure
    const candidate = data.candidates[0]

    if (!candidate.content) {
        return {
            isValid: false,
            error: 'Invalid candidate: missing content field'
        }
    }

    if (!candidate.content.parts || !Array.isArray(candidate.content.parts)) {
        return {
            isValid: false,
            error: 'Invalid candidate content: missing parts array'
        }
    }

    if (candidate.content.parts.length === 0) {
        return {
            isValid: false,
            error: 'Candidate content has no parts'
        }
    }

    return { isValid: true }
}

/**
 * Parse API response to extract content
 * @param {object} response - Raw API response
 * @returns {object} - { success: boolean, content?: string, error?: string }
 */
export const parseResponse = (response) => {
    // Validate response structure first
    const validation = validateResponse(response)
    if (!validation.isValid) {
        return {
            success: false,
            error: validation.error
        }
    }

    try {
        const content = response.data.candidates[0].content.parts[0].text

        if (!content || typeof content !== 'string') {
            return {
                success: false,
                error: 'Failed to extract content from response'
            }
        }

        return {
            success: true,
            content
        }
    } catch (error) {
        return {
            success: false,
            error: `Failed to parse response: ${error.message}`
        }
    }
}

/**
 * Extract metadata from response (optional)
 * @param {object} response - Raw API response
 * @returns {object} - Metadata object
 */
export const extractMetadata = (response) => {
    if (!response || !response.data) {
        return {}
    }

    const data = response.data
    const candidate = data.candidates?.[0]

    return {
        modelVersion: data.modelVersion || null,
        finishReason: candidate?.finishReason || null,
        safetyRatings: candidate?.safetyRatings || null,
        tokenCount: candidate?.tokenCount || null
    }
}

export default {
    validateResponse,
    parseResponse,
    extractMetadata
}