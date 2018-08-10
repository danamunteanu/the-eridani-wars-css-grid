import React from 'react'
import PropTypes from 'prop-types'
import Plati_defender_image from '../images/Plati_defender.png'

const Guardian = ({  }) => {
  return (
    <div id='image-container'>
      <img className='image' src={Plati_defender_image}/>
    </div>
  )
}

export default Guardian

Guardian.propTypes = {
}
