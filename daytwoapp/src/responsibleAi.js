
// Responsible AI Content Generation Service
// Reusable generateContent function with clean architecture, guardrails, and structured responses

// Export the main generateContent function from the service layer
export { generateContent, generateContentWithOptions } from './services/aiService.js'

// Also export utilities for customization if needed
export { inputGuardrail } from './utils/inputGuardrail.js'
export { outputGuardrail } from './utils/outputGuardrail.js'
export { guardrailConfig } from './config/guardrailConfig.js'
export { getSystemPrompt } from './config/systemPrompt.js'

// Default export for convenience
import { generateContent } from './services/aiService.js'
export default generateContent 
