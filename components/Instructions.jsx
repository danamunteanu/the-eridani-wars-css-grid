import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

class Instructions extends Component {
    constructor (props) {
        super(props);
        this.instructionsText = null;
        this.setInstructionsTextRef = element => {
            this.instructionsText = element;
        };
        this.setTooltipRef = element => {
            this.tooltipRef = element;
        };
        this.loadDocs = this.loadDocs.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.handleLeaveHover = this.handleLeaveHover.bind(this);
        this.state={
            tooltipClassName: "",
            tooltipStyle: {},
            tooltipContent: ""
        }
    }


    componentDidMount() { 
        this.instructionsText.addEventListener('DOMSubtreeModified', () => {
          this.loadDocs();
    })};

    componentWillUnmount() { 
        this.instructionsText.removeEventListener('DOMSubtreeModified');
    }

    render() {
        const { instructions } = this.props;
        const { tooltipClassName, tooltipStyle, tooltipContent } = this.state;
        return (
            <div>
                <p id="instructions"  dangerouslySetInnerHTML={{__html: instructions}}
                ref={this.setInstructionsTextRef}></p>
                <div id="tooltip" className={tooltipClassName} style={tooltipStyle} dangerouslySetInnerHTML={{__html:tooltipContent}} ref={this.setTooltipRef}></div>
            </div>
        )
    }

    loadDocs() {
        const { docs } = this.props;
        const helpDOM = this.instructionsText.getElementsByClassName('help');
        for (let i=0;i<helpDOM.length;i++) {
            const textContent = helpDOM[i].textContent;
            const helpContent = docs[helpDOM[i].textContent]
            const helpPosition = helpDOM[i].getBoundingClientRect();
            helpDOM[i].addEventListener('mouseover', () => this.handleHover(helpContent,helpPosition));
            helpDOM[i].addEventListener('mouseleave', () => this.handleLeaveHover());
        }
       
    }

    handleHover(helpContent, helpPosition) {
        const tooltipStyle = {
            top: helpPosition.top + 10,
            left: helpPosition.left
        };
        this.setState({
            tooltipClassName : "tooltip",
            tooltipStyle: tooltipStyle,
            tooltipContent: helpContent
        })
    }

    handleLeaveHover() {
        this.setState({
            tooltipClassName: "",
            tooltipStyle: {},
            tooltipContent: ""
        })
    }

}

export default Instructions;

Instructions.propTypes = {
    instructions: PropTypes.string,
    docs: PropTypes.object
};