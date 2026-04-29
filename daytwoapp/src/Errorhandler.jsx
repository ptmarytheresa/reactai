// gemerate a component named Errorhandler that take a prop name errorMessage and display the error message in a div with a class name of error. If there is no error message, the div should not be rendered. The component should also have an onClick event that clears the error message when the user clicks on the div.
// if there are no error message, the div should not be rendered. The component should also have an onClick event that clears the error message when the user clicks on the div.
 
import React from 'react'
const Errorhandler = ({ errorMessage, clearError }) => {
    if (!errorMessage) return null
    return (
        //  render the error message using red color and a border 
        // use inline styles to set the color and border


        <div className="error" onClick={clearError} style={{ color: 'red', border: '1px solid red' }}>
            {errorMessage}
        </div>
    )
}
export default Errorhandler

 