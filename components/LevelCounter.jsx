import React from 'react'
import PropTypes from 'prop-types'

const LevelCounter = ({ currentLevel, showTooltip, levels, prev, next, goToLevel, showHideLevelsPanel,reset }) => {
    const levelsNo = levels.length
    return (<div id="level-counter">
        <button className="arrow left" onClick={prev} disabled={currentLevel < 1}>◀</button>
        <span id="level-indicator" onClick={() => showHideLevelsPanel(false)}>
            <span id="labelLevel" className="translate">Level </span>
            <span className="current">{(currentLevel || 0) + 1}</span>
            <span id="labelOf" className="translate"> of </span>
            <span className="total">{levelsNo}</span>
            <span className="caret">▾</span>
        </span>
        <button className="arrow right" onClick={next} disabled={currentLevel + 1 >= levelsNo}>▶</button>
        {showTooltip && <div tabIndex="0" id="levelsWrapper" className="tooltip">
            <div id="levels">
                {levels.map((level,index) => <span key={index} onClick={() =>  goToLevel(index)} className={'level-marker ' + (currentLevel == index ? 'current ' : ' ')}>{index + 1}</span>)}
            </div>
            <div id="labelReset" className="translate" onClick={reset}> Reset</div>
        </div>}
    </div>)
}

export default LevelCounter;

LevelCounter.propTypes = {
    currentLevel: PropTypes.number,
    showTooltip: PropTypes.bool,
    levels: PropTypes.array,
    prev: PropTypes.func,
    next: PropTypes.func,
    goToLevel: PropTypes.func,
    showHideLevelsPanel: PropTypes.func,
    reset: PropTypes.func
};