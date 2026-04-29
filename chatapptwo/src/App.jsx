import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import ChatUi from './ChatUi'
import ChatRender from './ChatRender'
import ChatErr from './ChatErr'
import ChatRetry from './ChatRetry'
import Responsible from './Responsible'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <ChatRetry /> */}

<Responsible />

    </>
  )
}

export default App
