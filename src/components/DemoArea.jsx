import React from 'react'
import PropTypes from 'prop-types'
import { airLevels } from './../const/levels.js'

const DemoArea = ({ characterHaloClass, level }) => {
  const noOfRepeatsPlot = 30
  const characterHaloClassNo = characterHaloClass.length
  return (
    <div id='board'>
      <div id='overlay'>
        {Array.apply(null, { length: noOfRepeatsPlot }).map((elem, index) => (
          <span className={'plot plot--'  + (airLevels.includes(level) ? 'air' : 'soil')} key={index}></span>
        ))}
      </div>
      <div id='characters'>
        {Array.apply(null, { length: characterHaloClassNo }).map((elem, index) => (
          <div className={'character ' + characterHaloClass[index]} key={index}>
            <div className='bg'></div>
          </div>
        ))}
      </div>
      <div id='halos'>
        {Array.apply(null, { length: characterHaloClassNo }).map((elem, index) => (
          <div className={'halo '+ characterHaloClass[index]} key={index} >
            <div className='bg'></div>
          </div>
        ))}
      </div>
      <div id='soil'>
        {Array.apply(null, { length: noOfRepeatsPlot }).map((elem, index) => (
          <span className={'plot plot--'  + (airLevels.includes(level) ? 'air' : 'soil')} key={index}></span>
        ))}
      </div>
    </div>
  )
}

export default DemoArea

DemoArea.propTypes = {
  level: PropTypes.number,
  characterHaloClass: PropTypes.array
}
