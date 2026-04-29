//Add error handling for Axios API calls in React, with specific messages for 401, 429, and network errors
// use generateContent function to get response from API and display it in a chat interface, with error handling for different types of errors
import React, { useState } from 'react'
import { generateContent } from './googleApi'
const ChatErr = () => {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const handleSend = async () => {
        if (input.trim() === '') return
        const newMessages = [...messages, { role: 'user', content: input }]
        setMessages(newMessages)
        setInput('')
        try {
            const response = await generateContent(newMessages)
            setMessages([...newMessages, { role: 'assistant', content: response }])
        }
        catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setMessages([...newMessages, { role: 'assistant', content: 'Unauthorized: Please check your API key.' }])
                } else if (error.response.status === 429) {
                    setMessages([...newMessages, { role: 'assistant', content: 'Too Many Requests: You have hit the rate limit. Please try again later.' }])
                }

                // need for 403, 409, 500 errors as well
                    else if (error.response.status === 403) {
                    setMessages([...newMessages, { role: 'assistant', content: 'Forbidden: You do not have permission to access this resource.' }])
                } else if (error.response.status === 409) {
                    setMessages([...newMessages, { role: 'assistant', content: 'Conflict: There was a conflict with your request. Please try again.' }])
                }
                    else if (error.response.status === 500) {
                    setMessages([...newMessages, { role: 'assistant', content: 'Internal Server Error: The server encountered an error. Please try again later.' }])
                } else {
                    setMessages([...newMessages, { role: 'assistant', content: `Error ${error.response.status}: ${error.response.data.error.message}` }])
                }
            } 
            else if (error.request) {
                setMessages([...newMessages, { role: 'assistant', content: 'Network Error: Please check your internet connection.' }])
            } else {
                setMessages([...newMessages, { role: 'assistant', content: 'Error generating response' }])
            }
        }
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
        </div>
    )
}
export default ChatErr
