import React from 'react'
import PropTypes from 'prop-types'
import Plati_defender_image from '../images/Plati_defender.png'
import Human_defender_image from '../images/Human_defender.png'
import { PlatiLevels, HumansLevels } from '../const/levels.js'

const Guardian = ({ level }) => {
  return (
    <div id='image-container' className='image-container'>
      { PlatiLevels.includes(level) && <img className='image' alt='Plati_defender' src={Plati_defender_image}/> }
      { HumansLevels.includes(level) && <img className='image' alt='Human_defender' src={Human_defender_image}/> }
    </div>
  )
}

export default Guardian

Guardian.propTypes = {
  level: PropTypes.number,
}
