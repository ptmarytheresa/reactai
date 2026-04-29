// geneate a component which gets the error message from other
//components and display it in a user friendly way, with a retry button to retry the last message.
// this component will get error via props and display it in a user friendly way, with a retry button to retry the last message.
import React, { useState } from 'react'
const MyError = ({ error, onRetry }) => {
    if (!error) return null
    return (    
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', border: '1px solid #f5c6cb' }}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={onRetry} style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff' }}>
                Retry
            </button>
        </div>
    )
}
export default MyError

