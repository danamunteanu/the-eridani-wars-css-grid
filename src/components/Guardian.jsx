import React from 'react'
import PropTypes from 'prop-types'
import Plati_defender_image from '../images/Plati_defender.png'
import Human_defender_image from '../images/Human_defender.png'

const Guardian = ({  }) => {
  return (
    <div id='image-container' className='image-container'>
      {/* <img className='image' src={Plati_defender_image}/> */}
      <img className='image' src={Human_defender_image}/>
    </div>
  )
}

export default Guardian

Guardian.propTypes = {
}
