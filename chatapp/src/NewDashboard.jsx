// read newapicall.js use sendMessage function and
//design a UI , which takes user input based on system prompting and the parameters of sendMessage
// display the response based on the response structure returned by sendMessage function
// handle loading state and error state in the UI
// use clean code and modular approach, separate concerns into different functions if needed
// need css selectors for styling the ui sing dashboard.css file
// make use of useState hook and useEffect hook if needed for managing state and side effect
// ensure that response rendering is optimized and does not cause unnecessary re-renders
import React, { useState } from 'react'
import { sendMessage } from './newapicall'
import './dashboard.css'

const NewDashboard = () => {
    const [userInput, setUserInput] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        setUserInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const result = await sendMessage({ role: 'user', content: userInput })
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
        <div className="dashboard-container">
            <h1 className="dashboard-title">AI Assistant Dashboard</h1>
            <form className="dashboard-form" onSubmit={handleSubmit}>
                <input

                    type="text"
                    className="dashboard-input"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    disabled={loading}
                />
                <button type="submit" className="dashboard-button" disabled={loading || !userInput.trim()}>
                    {loading ? 'Loading...' : 'Send'}
                </button>

            </form>

{/* include a button to clear the response, and also add some styling */}
            {response && (
                <button className="dashboard-button" onClick={() => setResponse('')}>
                    Clear Response
                </button>
            )}


            

            {error && <div className="dashboard-error">{error}</div>}
            {response && <div className="dashboard-response">{response}</div>}
        </div>
    )
}   
export default NewDashboard



