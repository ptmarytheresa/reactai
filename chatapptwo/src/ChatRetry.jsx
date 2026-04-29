// generate ChatRetry component that retries the last message if there is an error
// based on the generateContent function in googleApi.js, if there is an error, it should display the error message and retry the last message when the user clicks a retry button.
// "Add retry logic with exponential backoff for a failed API call in React, max 3 retries"
// make use of MyError component to display the error message and retry button, and use the generateContent function to retry the last message when the user clicks the retry button.
import React, { useState } from 'react'
import MyError from './MyError'
import { generateContent } from './googleApi'
const ChatRetry = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [error, setError] = useState(null)
    const handleSend = async () => {
        if (input.trim() === '') return
        const newMessages = [...messages, { role: 'user', content: input }]
        setMessages(newMessages)
        setInput('')
        try {
            const response = await generateContent(newMessages)

            setMessages([...newMessages, { role: 'assistant', content: response }])
            setError(null)
        }
        catch (error) {
            setError(error.message || 'Error generating response')
        }
    }
    const handleRetry = async () => {
        setError(null)
        await handleSend()
    }
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Chat with Gemini-3-Flash-Preview</h1>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (

                    <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                        <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: msg.role === 'user' ? '#007bff' : '#f1f1f1', color: msg.role === 'user' ? '#fff' : '#000' }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px', display: 'flex' }}>
                <input  
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
                    placeholder="Type your message..."
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {    
                            handleSend()
                        }
                    }}
                />  
                <button onClick={handleSend} style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff' }}>
                    Send
                </button>
            </div>
            <MyError error={error} onRetry={handleRetry} /> 
        </div>
    )
}
export default ChatRetry
