// create a component named ChatFirst , which calls the generateContent function and pass the content as a prop to the component. The component should render the content in a div with a class name of chat-first. 
// The component should also have a button that when clicked, calls the generateContent function 
// if there are error , it should be displayed in the Errorhandler component
// handle error codes for 404,401,403,409, with proper error message 
// make the ui colourful and attractive and responsive using css
// make fallback for error handling and loading state , 
// dispkay the loading state when the content is being generated and hide it when the content is generated or when there is an error
// i need a textbox to get the input message from user and pass it as propmot to the generateContent function and display the response in the div with class name chat-first
import React, { useState } from 'react'
import { generateContent } from './googleApi'
import Errorhandler from './Errorhandler'
export default function ChatFirst() {

    const [content, setContent] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)   
    const [inputMessage, setInputMessage] = useState('')
    const handleGenerateContent = async () => {
        setLoading(true)
        setErrorMessage('')
        try {
            const generatedContent = await generateContent([
                { role: 'user', content: inputMessage }
            ])
            setContent(generatedContent)
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
        <div className="chat-first">
             {/* add textbox to input the message and pass it to the generateContent function */}
            <input type="text" placeholder="Type your message here..." onChange={(e) => setInputMessage(e.target.value)} value={inputMessage} />  

            <button onClick={handleGenerateContent} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Content'}
            </button>
            {content && <div className="generated-content">{content}</div>}
            <Errorhandler errorMessage={errorMessage} clearError={() => setErrorMessage('')} />
        </div>
    )
}