// create a compoinent named QuickChat  this will have personas while chatting 
// with the use and send system prompt to the api for better response, also include retry logic with backoff and error handling
// use the sendMessage function from newapicall.js to send the message to the api and get the response, also include a loading state and error state to show the user when the message is being sent and when there is an error
// also include a clear response button to clear the response from the screen, and also add some styling to the component
// generate the code with proper inlince css , which gives a pretty looking ui
//  keep buttons be like this "you are a kid" , "generate reponse in 3 bullet points" , "provide  a 5 line summary", "joke of the day"
// depending on the button clicked the system prompt will change and the response will be generated accordingly, also include a text input for custom system prompt and a button to send the custom system prompt as well
import React, { useState } from 'react'

import { sendMessage } from './newapicall'  
export const QuickChat = () => {
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [customPrompt, setCustomPrompt] = useState('')
    const [selectedPersona, setSelectedPersona] = useState('')

    const personas = [
        { label: 'You are a kid', value: 'kid' },
        { label: 'Generate response in 3 bullet points', value: 'bullet_points' },
        { label: 'Provide a 5 line summary', value: 'summary' },
        { label: 'Joke of the day', value: 'joke' }
    ]   

    const handlePersonaClick = async (persona) => {
        setSelectedPersona(persona.value)
        setLoading(true)
        setError('')
        try {
            const systemPrompt = getSystemPrompt(persona.value)
            const result = await sendMessage({ role: 'user', content: systemPrompt })
            if (result.success) {
                setResponse(result.data)
            } else {
                setError(result.error || 'Unknown error occurred')
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    const getSystemPrompt = (persona) => {
        switch (persona) {
            case 'kid':
                return 'You are a kid. Respond in a playful and simple manner.'
            case 'bullet_points':
                return 'Generate response in 3 bullet points. Keep it concise and informative.'
            case 'summary':
                return 'Provide a 5 line summary. Focus on the key points and be clear.'
            case 'joke':
                return 'Tell me a joke of the day. Make it light-hearted and funny.'
            default:
                return ''
        }   
    }

    const handleCustomPromptChange = (e) => {
        setCustomPrompt(e.target.value)
    }

    const handleCustomPromptSubmit = async () => {
        if (!customPrompt.trim()) return
        setSelectedPersona('')
        setLoading(true)
        setError('')    
        try {
            const result = await sendMessage({ role: 'user', content: customPrompt })
            if (result.success) {
                setResponse(result.data)
            } else {
                setError(result.error || 'Unknown error occurred')
            }
        } catch (err) {
            setError(err.message)
        }
        setLoading(false)
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333' }}>Quick Chat</h2>
            <div style={{ marginBottom: '10px' }}>
                {personas.map(persona => (
                    <button
                        key={persona.value}
                        onClick={() => handlePersonaClick(persona)}
                        style={{
                            marginRight: '10px',
                            padding: '10px 15px',
                            backgroundColor: selectedPersona === persona.value ? '#007BFF' : '#f0f0f0',
                            color: selectedPersona === persona.value ? '#fff' : '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {persona.label}
                    </button>
                ))}
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    value={customPrompt}
                    onChange={handleCustomPromptChange}
                    placeholder="Enter custom system prompt"
                    style={{
                        padding: '10px',
                        width: '300px',
                        marginRight: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                />
                <button

                    onClick={handleCustomPromptSubmit}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#28a745',
                        color: '#fff',

                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Send Custom Prompt
                </button>
            </div>
            {loading && <div style={{ color: '#007BFF' }}>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {response && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                    {response}  
                    <button
                        onClick={() => setResponse('')}
                        style={{
                            marginLeft: '10px',
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Response

                    </button>
                </div>
            )}
        </div>
    )
}   

 
