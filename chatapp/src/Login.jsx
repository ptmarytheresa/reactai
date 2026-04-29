// generate a login page with tailwind css and react
// if username and password is not empty then show 
// call ChatBox component for chat app, else show error message
import { useState } from 'react'
 import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
    const handleLogin = () => {
        if (username && password) {
            setError('')
            // show text box for chat app
            return <ChatBox/>
        }
        else {
            setError('Username and password cannot be empty')
        }
    }
    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
            />
             {error && <p className="error-message">{error}</p>}

            <button onClick={handleLogin} className="login-button">Login</button>
        </div>
    )
}

export default Login