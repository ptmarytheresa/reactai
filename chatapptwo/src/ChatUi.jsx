// generate a ChatUi component that uses the generateContent function to display a chat interface
import React, { useState } from 'react'
import { generateContent } from './googleApi'
const ChatUi = () => {
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
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: 'Error generating response' }])
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
export default ChatUi
