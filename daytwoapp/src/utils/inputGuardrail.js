// Input Guardrail Utility
// Validates and filters user input before sending to AI API

import { guardrailConfig } from '../config/guardrailConfig.js'

/**
 * Check if text contains any blocked keywords
 * @param {string} text - Text to check
 * @returns {object} - { isBlocked: boolean, matchedKeywords: string[] }
 */
export const checkKeywords = (text) => {
    if (!text || typeof text !== 'string') {
        return { isBlocked: false, matchedKeywords: [] }
    }

    const lowerText = text.toLowerCase()
    const matchedKeywords = []

    for (const keyword of guardrailConfig.BLOCKED_KEYWORDS) {
        if (guardrailConfig.caseInsensitive) {
            if (lowerText.includes(keyword.toLowerCase())) {
                matchedKeywords.push(keyword)
            }
        } else {
            if (text.includes(keyword)) {
                matchedKeywords.push(keyword)
            }
        }
    }

    return {
        isBlocked: matchedKeywords.length > 0,
        matchedKeywords
    }
}

/**
 * Check if text matches any blocked patterns
 * @param {string} text - Text to check
 * @returns {object} - { isBlocked: boolean, matchedPatterns: string[] }
 */
export const checkPatterns = (text) => {
    if (!text || typeof text !== 'string') {
        return { isBlocked: false, matchedPatterns: [] }
    }

    const matchedPatterns = []

    for (const pattern of guardrailConfig.BLOCKED_PATTERNS) {
        if (pattern.test(text)) {
            matchedPatterns.push(pattern.toString())
        }
        // Reset regex lastIndex for global patterns
        if (pattern.global) {
            pattern.lastIndex = 0
        }
    }

    return {
        isBlocked: matchedPatterns.length > 0,
        matchedPatterns
    }
}

/**
 * Validate input messages structure
 * @param {Array} messages - Array of message objects
 * @returns {object} - { isValid: boolean, error?: string }
 */
export const validateMessages = (messages) => {
    // Check if messages is an array
    if (!Array.isArray(messages)) {
        return {
            isValid: false,
            error: 'Messages must be an array'
        }
    }

    // Check if array is empty
    if (messages.length === 0) {
        return {
            isValid: false,
            error: 'Messages array cannot be empty'
        }
    }

    // Validate each message
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i]

        // Check required fields
        if (!msg.role || typeof msg.role !== 'string') {
            return {
                isValid: false,
                error: `Message at index ${i} must have a valid 'role' field`
            }
        }

        if (!msg.content || typeof msg.content !== 'string') {
            return {
                isValid: false,
                error: `Message at index ${i} must have a valid 'content' field`
            }
        }

        // Validate role values
        const validRoles = ['user', 'model', 'system']
        if (!validRoles.includes(msg.role.toLowerCase())) {
            return {
                isValid: false,
                error: `Message at index ${i} has invalid role '${msg.role}'. Must be one of: ${validRoles.join(', ')}`
            }
        }

        // Check content length
        if (msg.content.length > 10000) {
            return {
                isValid: false,
                error: `Message at index ${i} exceeds maximum length of 10000 characters`
            }
        }
    }

    return { isValid: true }
}

/**
 * Main input guardrail function
 * @param {Array} messages - Array of message objects
 * @returns {object} - { passed: boolean, error?: string, isGuardrail?: boolean }
 */
export const inputGuardrail = (messages) => {
    // First validate message structure
    const validation = validateMessages(messages)
    if (!validation.isValid) {
        return {
            passed: false,
            error: validation.error,
            isGuardrail: false
        }
    }

    // Check each message content for blocked keywords
    if (guardrailConfig.enableKeywordFiltering) {
        for (let i = 0; i < messages.length; i++) {
            const keywordCheck = checkKeywords(messages[i].content)
            if (keywordCheck.isBlocked) {
                return {
                    passed: false,
                    error: `${guardrailConfig.errorMessages.keyword} Blocked keyword(s): ${keywordCheck.matchedKeywords.join(', ')}`,
                    isGuardrail: true
                }
            }
        }
    }

    // Check each message content for blocked patterns
    if (guardrailConfig.enablePatternMatching) {
        for (let i = 0; i < messages.length; i++) {
            const patternCheck = checkPatterns(messages[i].content)
            if (patternCheck.isBlocked) {
                return {
                    passed: false,
                    error: guardrailConfig.errorMessages.pattern,
                    isGuardrail: true
                }
            }
        }
    }

    return { passed: true }
}

export default inputGuardrail