// create a MyChat component that renders a chat interface
// which can call the generateContent method from googleApi.js to generate responses from the google api
import React, { useState } from 'react'
import { generateContent } from './googleApi'
export default function MyChat() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const handleSend = async () => {
        const newMessages = [...messages, { role: 'user', content: input }]
        setMessages(newMessages)
        setInput('')
        try {
            const response = await generateContent(newMessages)
            setMessages([...newMessages, { role: 'assistant', content: response }])
        }
        catch (error) {
            console.error('Error generating content:', error)

        }
    }   
    return (
        <div>
            <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid black', padding: '10px' }}>  
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.role === 'user' ? 'right' : 'left', margin: '10px' }}>
                        <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', backgroundColor: message.role === 'user' ? '#DCF8C6' : '#E6E6E6' }}>
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button onClick={handleSend} style={{ padding: '10px', marginLeft: '10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    Send
                </button>
            </div>
        </div>
    )
}   