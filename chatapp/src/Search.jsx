// generate a code to get the search query from user
// and provide result in json format
// use gemini api to get thesearch result
// use "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
 // use axios
 import axios from 'axios'
import { useState } from 'react'
// import './Search.css'
function ChatBot() {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState('')
    const handleSearch = async () => {
        if (query) {
            try {
                const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
                    model: 'gemini-2.5-flash',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: query }
                    ]   
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer AIzaSyDQZ1iSGL6XfUPYI4CNShT-cty9Oi2S-_8`
                    }
                })
                setResult(response.data.choices[0].message.content)
            }

            catch (error) {
                console.error('Error fetching search results:', error)
                setResult('An error occurred while fetching search results.')
            }
        }
        else {
            setResult('Please enter a search query.')
        }
    }
    return (
        <div className="search-container">
            <h1 className="search-title">Search</h1>
            <input
                type="text"
                placeholder="Enter your search query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
            {result && <div className="search-result">{result}</div>}
        </div>
    )
}   
export default ChatBot

