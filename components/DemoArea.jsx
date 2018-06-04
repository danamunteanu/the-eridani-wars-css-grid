import React from 'react'
import PropTypes from 'prop-types'

const DemoArea = ({ plantTreatmentClass, plantStyle}) => {
  const noOfRepeatsPlot = 30, plantTreatmentClassNo = plantTreatmentClass.length
  return (
    <div id='board'>
      <div id='overlay'>
        {Array.apply(null, { length: noOfRepeatsPlot }).map((elem, index) => (
          <span className='plot' key={index}></span>
        ))}
      </div>
      <div id='plants'>
        {Array.apply(null, { length: plantTreatmentClassNo }).map((elem, index) => (
          <div className={`plant ${plantTreatmentClass[index]}`} style={plantStyle} key={index}>
            <div className='bg'></div>
          </div>
        ))}
      </div>
      <div id='garden'>
        {Array.apply(null, { length: plantTreatmentClassNo }).map((elem, index) => (
          <div className={`treatment ${plantTreatmentClass[index]}`} key={index} >
            <div className='bg'></div>
          </div>
        ))}
      </div>
      <div id='soil'>
        {Array.apply(null, { length: noOfRepeatsPlot }).map((elem, index) => (
          <span className='plot' key={index}></span>
        ))}
      </div>
    </div>
  )
}

export default DemoArea

DemoArea.propTypes = {
  plantStyle: PropTypes.object,
  plantTreatmentClass: PropTypes.array
}
