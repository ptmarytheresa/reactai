// generate ChatTwo component
//get response from genContent from googleApi and rendering it in a chat interface
// i want AI returns markdown — render it properly, not as raw text.
// get the outcome of the response and render it in a chat interface
//  with user messages on the right side and AI responses on the left.
// maintain a conversation history and display it in the chat interface.
// use useState to maintain the conversation history and display it in the chat interface.
// make the UI colorful and attractive using CSS, and ensure it's responsive for different screen sizes.    
import React, { useState } from 'react'
import { generateContent } from './googleApi'
// need markdown rendering library
import ReactMarkdown from 'react-markdown'
import Errorhandler from './Errorhandler'
import './chattwo.css' // create a css file for styling the chat interface
export default function ChatTwo() {
    const [conversation, setConversation] = useState([])
    const [inputMessage, setInputMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const handleGenerateContent = async () => {
        setLoading(true)
        setErrorMessage('')
        try {
            const userMessage = { role: 'user', content: inputMessage }
            const generatedContent = await generateContent([userMessage])
            const aiMessage = { role: 'ai', content: generatedContent }
            setConversation(prev => [...prev, userMessage, aiMessage])
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setErrorMessage('Resource not found (404)')
                        break   
                    case 401:
                        setErrorMessage('Unauthorized (401)')
                        break
                    case 403:
                        setErrorMessage('Forbidden (403)')
                        break
                    case 409:
                        setErrorMessage('Conflict (409)')
                        break
                    default:
                        setErrorMessage('An error occurred while generating content')
                }   
            } else {
                setErrorMessage('Network error or server is unreachable')
            }
        } finally {
            setLoading(false)
        }   
    }
    return (
        <div className="chat-two">
            <div className="conversation">
                {conversation.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Type your message here..." onChange={(e) => setInputMessage(e.target.value)} value={inputMessage} />
            <button onClick={handleGenerateContent} disabled={loading}>
                {loading ? 'Generating...' : 'Send'}
            </button>
            <Errorhandler errorMessage={errorMessage} clearError={() => setErrorMessage('')} />
        </div>
    )
}




