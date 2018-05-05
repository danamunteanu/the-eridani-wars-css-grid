import React from 'react'
import PropTypes from 'prop-types'

const DemoArea = ({ plantTreatmentClass, plantStyle, treatmentStyle }) => {
    const noOfRepeats = 30;
    return (
        <div id="board">
            <div id="overlay">
                {Array.apply(null, { length: noOfRepeats }).map((e, i) => (
                    <span className="plot" key={i}></span>
                ))}
            </div>
            <div id="plants">
                <div className={'plant ' + plantTreatmentClass} style={plantStyle}>
                    <div className="bg"></div>
                </div>
            </div>
            <div id="garden">
                <div className={'treatment ' + plantTreatmentClass} style={treatmentStyle} >
                    <div className="bg"></div>
                </div>
            </div>
            <div id="soil">
                {Array.apply(null, { length: noOfRepeats }).map((e, i) => (
                    <span className="plot" key={i}></span>
                ))}
            </div>
        </div>
    )
}

export default DemoArea;

DemoArea.propTypes = {
    plantTreatmentClass: PropTypes.string,
    plantStyle: PropTypes.object,
    treatmentStyle: PropTypes.object
};
