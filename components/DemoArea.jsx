import React from 'react'
import PropTypes from 'prop-types'

const DemoArea = ({ plantTreatmentClass, plantStyle, treatmentStyle}) => {
    const noOfRepeats = 30;
    const plantTreatmentClassLength = plantTreatmentClass.length
    return (
        <div id="board">
            <div id="overlay">
                {Array.apply(null, { length: noOfRepeats }).map((elem, index) => (
                    <span className="plot" key={index}></span>
                ))}
            </div>
            <div id="plants">
                {Array.apply(null, { length: plantTreatmentClassLength }).map((elem, index) => (
                    <div className={'plant ' + plantTreatmentClass[index]} style={plantStyle} key={index}>
                        <div className="bg"></div>
                    </div>
                 ))}
            </div>
            <div id="garden">
                {Array.apply(null, { length: plantTreatmentClassLength }).map((elem, index) => (
                    <div className={'treatment ' + plantTreatmentClass[index]} style={treatmentStyle} key={index} >
                        <div className="bg"></div>
                    </div>
                ))}
            </div>
            <div id="soil">
                {Array.apply(null, { length: noOfRepeats }).map((elem, index) => (
                    <span className="plot" key={index}></span>
                ))}
            </div>
        </div>
    )
}

export default DemoArea;

DemoArea.propTypes = {
    plantTreatmentClass: PropTypes.array,
    plantStyle: PropTypes.object,
    treatmentStyle: PropTypes.object,
    carrotNo: PropTypes.number,
    weedNo: PropTypes.number
};
