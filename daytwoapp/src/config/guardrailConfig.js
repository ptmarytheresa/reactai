// Guardrail Configuration
// Defines blocked keywords, patterns, and content categories for moderation

// Blocked keywords (case-insensitive)
export const BLOCKED_KEYWORDS = [
    // Harmful content
    'bomb', 'weapon', 'gun', 'knife', 'attack', 'kill', 'murder', 'suicide',
    'harm', 'abuse', 'torture', 'assault', 'violence', 'threat',
    
    // Illegal content
    'drug', 'hack', 'fraud', 'scam', 'pirate', 'illegal', 'theft',
    'counterfeit', 'smuggle', 'bribe', 'extortion',
    
    // Explicit/Adult content
    'porn', 'sex', 'nude', 'naked', 'explicit', 'adult', 'xxx',
    'sexual', 'erotic', 'nsfw', '18+',
    
    // Hate speech
    'hate', 'racist', 'sexist', 'homophobic', 'discriminate',
    'nazi', 'extremist', 'supremacy',
    
    // Sensitive/PII
    'password', 'credit card', 'ssn', 'social security',
    'private key', 'api key', 'secret token',
    
    // Self-harm
    'self harm', 'cutting', 'anorexia', 'bulimia', 'suicidal',
    
    // Misinformation
    'fake news', 'conspiracy', 'hoax',
    
    // Malware
    'virus', 'malware', 'ransomware', 'trojan', 'phishing',
    'exploit', 'vulnerability', 'backdoor'
]

// Blocked patterns (regex)
export const BLOCKED_PATTERNS = [
    // URLs with suspicious patterns
    /https?:\/\/[^\s]*\.onion/i,
    /https?:\/\/[^\s]*darkweb/i,
    
    // Email patterns for spam
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
    
    // IP addresses
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    
    // Credit card patterns
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
    
    // API key patterns
    /api[_-]?key['"]?\s*[:=]\s*['"]?[a-zA-Z0-9_-]{20,}/i,
    
    // Password patterns
    /password['"]?\s*[:=]\s*['"]?[^\s'"]{4,}/i,
    
    // Base64 encoded strings (potential secrets)
    /[A-Za-z0-9+/=]{40,}/
]

// Content categories to block
export const BLOCKED_CATEGORIES = [
    'harmful_content',
    'illegal_content',
    'sexually_explicit',
    'hate_speech',
    'harassment',
    'self_harm',
    'dangerous_content',
    'medical_misinformation'
]

// Guardrail configuration object
export const guardrailConfig = {
    BLOCKED_KEYWORDS,
    BLOCKED_PATTERNS,
    BLOCKED_CATEGORIES,
    
    // Configuration options
    enableKeywordFiltering: true,
    enablePatternMatching: true,
    enableCategoryBlocking: true,
    
    // Sensitivity settings
    caseInsensitive: true,
    partialMatch: true,
    
    // Error messages
    errorMessages: {
        keyword: 'Input contains blocked keywords that violate our content policy.',
        pattern: 'Input contains suspicious patterns that are not allowed.',
        category: 'Input falls into a blocked content category.',
        general: 'Your request was blocked by our content moderation system.'
    }
}

export default guardrailConfig