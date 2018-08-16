import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Instructions extends Component {
  constructor (props) {
    super(props)
    this.instructionsText = null
    this.loadDocs = this.loadDocs.bind(this)
    this.handleHover = this.handleHover.bind(this)
    this.handleLeaveHover = this.handleLeaveHover.bind(this)
    this.state={
      tooltipClassName: '',
      tooltipStyle: {},
      tooltipContent: ''
    }
    this.setInstructionsTextRef = element => {
      this.instructionsText = element
    }
    this.setTooltipRef = element => {
      this.tooltipRef = element
    }
  }

  componentDidMount () {
    this.instructionsText.addEventListener('DOMSubtreeModified', () => {
      this.loadDocs()
    })
  }

  componentWillUnmount () {
    this.instructionsText.removeEventListener('DOMSubtreeModified')
  }

  loadDocs () {
    const { docs } = this.props
    const helpDOM = this.instructionsText.getElementsByClassName('help')
    for (let i=0;i<helpDOM.length;i++) {
      const textContent = helpDOM[i].textContent
      const helpContent = docs[textContent]
      const helpPosition = helpDOM[i].getBoundingClientRect()
      helpDOM[i].addEventListener('mouseover', () => this.handleHover(helpContent,helpPosition))
      helpDOM[i].addEventListener('mouseleave', () => this.handleLeaveHover())
    }
  }

  handleHover (helpContent, helpPosition) {
    const tooltipStyle = {
      top: helpPosition.top + 10,
      left: helpPosition.left
    }
    this.setState({
      tooltipClassName : 'tooltip',
      tooltipStyle,
      tooltipContent: helpContent
    })
  }

  handleLeaveHover () {
    this.setState({
      tooltipClassName: '',
      tooltipStyle: {},
      tooltipContent: ''
    })
  }

  render () {
    const { instructions } = this.props
    const { tooltipClassName, tooltipStyle, tooltipContent } = this.state
    return (
      <div className="instructions-container">
        <div id='instructions' dangerouslySetInnerHTML={{__html: instructions}} ref={this.setInstructionsTextRef}></div>
        <div id='tooltip' className={tooltipClassName} style={tooltipStyle} dangerouslySetInnerHTML={{__html:tooltipContent}} ref={this.setTooltipRef}></div>
      </div>
    )
  }
}

export default Instructions

Instructions.propTypes = {
  docs: PropTypes.object,
  instructions: PropTypes.string
}