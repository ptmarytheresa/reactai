// Output Guardrail Utility
// Validates and filters AI API responses before returning to user

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
 * Check for potentially harmful code patterns
 * @param {string} text - Text to check
 * @returns {object} - { isBlocked: boolean, reason?: string }
 */
export const checkHarmfulCode = (text) => {
    if (!text || typeof text !== 'string') {
        return { isBlocked: false }
    }

    // Check for potentially harmful code patterns
    const harmfulPatterns = [
        { pattern: /eval\s*\(/i, reason: 'Contains eval() which can execute arbitrary code' },
        { pattern: /document\.cookie/i, reason: 'Attempts to access cookies' },
        { pattern: /localStorage|sessionStorage/i, reason: 'Attempts to access browser storage' },
        { pattern: /XMLHttpRequest|fetch\s*\(/i, reason: 'Contains network request code' },
        { pattern: /innerHTML\s*=/i, reason: 'Contains potentially unsafe HTML injection' },
        { pattern: /on\w+\s*=/i, reason: 'Contains event handler attributes' }
    ]

    for (const { pattern, reason } of harmfulPatterns) {
        if (pattern.test(text)) {
            return { isBlocked: true, reason }
        }
    }

    return { isBlocked: false }
}

/**
 * Validate output is safe to return
 * @param {string} content - AI generated content
 * @returns {object} - { isValid: boolean, error?: string, isGuardrail?: boolean }
 */
export const outputGuardrail = (content) => {
    // Check if content exists
    if (!content || typeof content !== 'string') {
        return {
            isValid: false,
            error: 'No content generated',
            isGuardrail: false
        }
    }

    // Check for empty content
    if (content.trim().length === 0) {
        return {
            isValid: false,
            error: 'Generated content is empty',
            isGuardrail: false
        }
    }

    // Check for blocked keywords
    if (guardrailConfig.enableKeywordFiltering) {
        const keywordCheck = checkKeywords(content)
        if (keywordCheck.isBlocked) {
            return {
                isValid: false,
                error: `${guardrailConfig.errorMessages.keyword} Blocked keyword(s): ${keywordCheck.matchedKeywords.join(', ')}`,
                isGuardrail: true
            }
        }
    }

    // Check for blocked patterns
    if (guardrailConfig.enablePatternMatching) {
        const patternCheck = checkPatterns(content)
        if (patternCheck.isBlocked) {
            return {
                isValid: false,
                error: guardrailConfig.errorMessages.pattern,
                isGuardrail: true
            }
        }
    }

    // Check for harmful code
    const harmfulCheck = checkHarmfulCode(content)
    if (harmfulCheck.isBlocked) {
        return {
            isValid: false,
            error: `Output blocked: ${harmfulCheck.reason}`,
            isGuardrail: true
        }
    }

    return { isValid: true }
}

export default outputGuardrail