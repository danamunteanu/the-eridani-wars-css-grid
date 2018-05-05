import React from 'react'
import PropTypes from 'prop-types'

const Instructions = ({ instructions }) => {
    return (
        <div>
            <p id="instructions" dangerouslySetInnerHTML={{__html: instructions}}></p>
            <p id="docs"></p>
        </div>
    )
}

export default Instructions;

Instructions.propTypes = {
    instructions: PropTypes.string
};