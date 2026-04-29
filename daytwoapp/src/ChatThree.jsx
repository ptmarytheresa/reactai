// ChatThree Component
// Uses responsible AI service with guardrails for safe content generation
// Renders markdown responses with conversation history

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Errorhandler from './Errorhandler'
import { generateContent } from './responsibleAi'
import './chatthree.css'

export default function ChatThree() {
    const [conversation, setConversation] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [guardrailTriggered, setGuardrailTriggered] = useState(false)

    const handleGenerateContent = async () => {
        if (!inputMessage.trim()) {
            setErrorMessage('Please enter a message')
            return
        }

        setLoading(true)
        setErrorMessage('')
        setGuardrailTriggered(false)

        try {
            const userMessage = { role: 'user', content: inputMessage }
            
            // Use the responsible AI service
            const response = await generateContent([userMessage])

            if (response.success) {
                const aiMessage = { role: 'ai', content: response.content }
                setConversation(prev => [...prev, userMessage, aiMessage])
                setInputMessage('')
            } else {
                // Handle guardrail or error response
                if (response.isGuardrail) {
                    setGuardrailTriggered(true)
                    setErrorMessage(`🛡️ Content blocked: ${response.error}`)
                } else {
                    setErrorMessage(response.error || 'Failed to generate content')
                }
            }
        } catch (error) {
            setErrorMessage(error.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleGenerateContent()
        }
    }

    const clearConversation = () => {
        setConversation([])
        setErrorMessage('')
        setGuardrailTriggered(false)
    }

    return (
        <div className="chat-three">
            <div className="chat-header">
                <h2>🤖 Responsible AI Chat</h2>
                <button className="clear-btn" onClick={clearConversation}>
                    Clear Chat
                </button>
            </div>

            <div className="conversation-container">
                {conversation.length === 0 ? (
                    <div className="empty-state">
                        <p>Start a conversation with the AI assistant.</p>
                        <p className="hint">The AI is equipped with content safety guardrails.</p>
                    </div>
                ) : (
                    <div className="conversation">
                        {conversation.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'user' ? '👤' : '🤖'}
                                </div>
                                <div className="message-content">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type your message here..."
                    onChange={(e) => setInputMessage(e.target.value)}
                    value={inputMessage}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button 
                    onClick={handleGenerateContent} 
                    disabled={loading || !inputMessage.trim()}
                    className={loading ? 'loading' : ''}
                >
                    {loading ? (
                        <span className="loading-text">Generating...</span>
                    ) : (
                        'Send ➤'
                    )}
                </button>
            </div>

            <Errorhandler 
                errorMessage={errorMessage} 
                clearError={() => {
                    setErrorMessage('')
                    setGuardrailTriggered(false)
                }} 
            />
            
            {guardrailTriggered && (
                <div className="guardrail-notice">
                    ⚠️ This response was blocked by our content safety system
                </div>
            )}
        </div>
    )
}