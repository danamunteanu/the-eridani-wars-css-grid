import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { warningReset, wrongAnswerWarning, completeAllLevelsWarning } from '../const/levels.js'
import { setAnswers, resetAnswers } from '../actions/answers'
import { setLevel } from '../actions/level'
import { setSolved, resetSolved } from '../actions/solved'
import LevelCounter from '../components/LevelCounter.jsx'
import Intructions from '../components/Instructions.jsx'
import CodeEditor from '../components/CodeEditor.jsx'
import DemoArea from '../components/DemoArea.jsx'
import Guardian from '../components/Guardian.jsx'
import { airLevels } from './../const/levels.js'

class GameScreen extends Component {
  constructor (props) {
    super(props)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.loadLevel = this.loadLevel.bind(this)
    this.showHideLevelsPanel = this.showHideLevelsPanel.bind(this)
    this.reset = this.reset.bind(this)
    this.saveAnswer = this.saveAnswer.bind(this)
    this.goToLevel = this.goToLevel.bind(this)
    this.applyHaloStyle = this.applyHaloStyle.bind(this)
    this.isKeyValuePair = this.isKeyValuePair.bind(this)
    this.nextLevel = this.nextLevel.bind(this)
    this.onHandleChangeCodeArea = this.onHandleChangeCodeArea.bind(this)
    this.state = {
      user: localStorage.user || '',
      level: parseInt(localStorage.level, 10) || 0,
      answers: {},
      docs: {},
      solved: localStorage.solved || [],
      showTooltip: false,
      codeArea: '',
      textareaHeight: '22px',
      characterHaloClass: [],
      isVisibleCodeEditor: true
    }
  }

  componentDidMount () {
    const currentLevel = parseInt(this.props.level, 10) || 0
    if (!localStorage.user) {
      const userValue = '' + (new Date()).getTime() + Math.random().toString(36).slice(1)
      localStorage.setItem('user', userValue)
    }
    const levelData = this.props.levels[currentLevel]
    this.saveAnswer()
    this.loadLevel(levelData,currentLevel)
  }

  prev () {
    this.saveAnswer()
    let currentLevel = this.props.level
    currentLevel --
    this.props.setLevel(currentLevel)
    const levelData = this.props.levels[currentLevel]
    this.loadLevel(levelData,currentLevel)
  }

  next () {
    this.saveAnswer()
    let currentLevel = this.props.level
    currentLevel ++
    this.props.setLevel(currentLevel)
    const levelData = this.props.levels[currentLevel]
    this.loadLevel(levelData,currentLevel)
  }

  goToLevel (level) {
    this.saveAnswer()
    const currentLevel = level
    this.props.setLevel(currentLevel)
    const levelData = this.props.levels[currentLevel]
    this.loadLevel(levelData,currentLevel)
  }

  loadLevel (levelData, currentLevel) {
    const { instructions, before, after, board } = levelData
    const { answers } = this.props
    const levelName = levelData.name
    const colors = {
      'c': 'plati',
      'w': 'human'
    }
    const levelStyle = levelData.style
    const height = Object.keys(levelStyle).length * 20 + 2 + 'px'
    const currentAnswer = answers[levelName] || ''
    this.setState({
      instructions,
      before,
      after,
      codeArea: currentAnswer,
      textareaHeight: height
    })
    if (levelData.name === 'win') {
      this.setState({
        isVisibleCodeEditor: false
      })
    } else {
      this.setState({
        isVisibleCodeEditor: true
      })
    }

    let characterHaloClassArr = []
    let color = ''
    for (let i = 0; i < board.length; i++) {
      color = colors[board.charAt(i)]
      if (airLevels.includes(currentLevel)) {
        color = color + '__air';
      }
      else {
        color =  color + '__soil';
      }
      characterHaloClassArr = [...characterHaloClassArr, color]
    }

    this.setState({
      characterHaloClass : characterHaloClassArr
    }, () => {
      this.applyInitialClassesAndStyles(levelData)
      this.applyHaloStyle(currentAnswer)
    })
  }

  applyInitialClassesAndStyles (levelData) {
    const initialClasses = levelData.classes
    const initialAndResetClasses = initialClasses ? {'#overlay, #halos, #characters': '', ...initialClasses} : {'#overlay, #characters, #halos, #halos > *, #characters > *': ''}
    let defaultClassNames
    Object.keys(initialAndResetClasses).forEach(function (initialOrResetClass) {
      const initialOrResetClassSelectors = initialOrResetClass.split(', ')
      initialOrResetClassSelectors.forEach(initialOrResetClassSelector => {
        const elementsByClassMatches = document.querySelectorAll(initialOrResetClassSelector)
        elementsByClassMatches.forEach(match => {
          const matchClassNames = match.className.split(' ')
          if (initialOrResetClassSelector === '#characters' ||initialOrResetClassSelector === '#overlay' || initialOrResetClassSelector === '#halos') {
            defaultClassNames = []
          }
          else {
            defaultClassNames = matchClassNames.slice(0,2)
          }
          defaultClassNames.push(initialAndResetClasses[initialOrResetClass])
          match.className = defaultClassNames.filter(defaultClassName => defaultClassName !== '').join(' ')
        })
      })
    })

    const initialSelector = levelData.selector
    const initialStyle = levelData.style
    if (initialStyle) {
      const initialElementsBySelectorsForStyle = document.querySelectorAll('#characters, #characters > *')
      initialElementsBySelectorsForStyle.forEach(element => {
        element.style.cssText = ''
      })

      const elementsBySelectorsForStyleMatches = document.querySelectorAll('#characters ' + (initialSelector || ''))
      elementsBySelectorsForStyleMatches.forEach(match => {
        Object.keys(initialStyle).forEach(function (key) {
          match.style.cssText += key + ': ' + initialStyle[key] + '; '
        })
      })
    }
  }

  saveAnswer () {
    const currentLevel = this.props.levels[this.props.level]
    const currentLevelName = currentLevel.name
    const { codeArea } = this.state
    const answers = {
      ...this.props.answers,
      [currentLevelName]: codeArea || ''
    }
    this.props.setAnswers(answers)
  }

  checkIfAllAnswersAreOk () {
    if (this.props.solved && this.props.solved.length >= this.props.levels.length - 1) {
      return true
    }
    return false
  }

  win () {
    this.saveAnswer()
    this.loadLevel(this.props.levelWin, this.props.level)
  }

  nextLevel () {
    const currentLevel = this.props.level
    const characterDOMs = ReactDOM.findDOMNode(this).getElementsByClassName('character')
    const haloDOMs = ReactDOM.findDOMNode(this).getElementsByClassName('halo')
    for (let i=0; i<characterDOMs.length;i++) {
      const characterDOM = characterDOMs[i]
      const haloDOM = haloDOMs[i]
      const characterPosition = characterDOM.getBoundingClientRect()
      const haloPosition = haloDOM.getBoundingClientRect()
      if (!(Math.round(characterPosition.top) === Math.round(haloPosition.top) && Math.round(characterPosition.left) === Math.round(haloPosition.left) && Math.round(characterPosition.bottom) === Math.round(haloPosition.bottom) && Math.round(characterPosition.right) === Math.round(haloPosition.right))) {
        alert(wrongAnswerWarning)
        return
      }
    }
    const solvedUpdated = this.props.solved.slice()
    if (solvedUpdated.indexOf(currentLevel) === -1) {
      solvedUpdated.push(currentLevel)
      this.props.setSolved(solvedUpdated)
    }
    if (currentLevel === this.props.levels.length - 1 && this.checkIfAllAnswersAreOk()) {
      this.win()
    } else if (currentLevel === this.props.levels.length - 1) {
      alert(completeAllLevelsWarning)
    } else {
      this.next()
    }
  }

  showHideLevelsPanel (show) {
    if (show) {
      this.setState({
        showTooltip: show
      })
    } else {
      const isVisibleTooltip = !this.state.showTooltip
      this.setState({
        showTooltip: isVisibleTooltip
      })
    }
  }

  reset () {
    const r = window.confirm(warningReset)
    if (r) {
      this.props.resetAnswers()
      this.props.resetSolved()
      this.showHideLevelsPanel(false)
      this.setState({
        level: 0,
        solved: [],
        answers: {
          answers : {}
        },
        codeArea: ''
      }, () => {
        this.goToLevel(0);
      })
    }
  }

  isKeyValuePair (str) {
    const regex = new RegExp(/\w+:\s?-?\s?\w+(?=,?\s?)/g)
    if (regex.test(str)) {
      return true
    }
    return false
  }

  applyHaloStyle (value) {
    const valueSplittedByRows = value.split('\n')
    let style = ''
    for (let i=0; i<valueSplittedByRows.length;i++) {
      if (this.isKeyValuePair(valueSplittedByRows[i])) {
        const keyAndValue = valueSplittedByRows[i].split(';')[0].split(':')
        style += keyAndValue[0] + ': ' + keyAndValue[1] + '; '
      }
    }

    const currentLevel = this.props.level
    const levelData = this.props.levels[currentLevel]
    const initialSelector = levelData.selector
    const initialElementsBySelectorsForHaloStyle = document.querySelectorAll('#halos, #halos > *')
    initialElementsBySelectorsForHaloStyle.forEach(element => {
      element.style.cssText = ''
    })

    if (style) {
      const elementsBySelectorsForHaloStyleMatches = document.querySelectorAll('#halos ' + (initialSelector || ''))
      elementsBySelectorsForHaloStyleMatches.forEach(match => {
        match.style.cssText += style
      })
    }
  }

  onHandleChangeCodeArea (value) {
    this.setState({
      codeArea: value
    })
  }

  render () {
    const { levels, solved, docs } = this.props
    const levelsNo = levels.length
    const currentLevel = parseInt(this.props.level, 10)
    const { instructions, before, after, showTooltip, characterHaloClass, textareaHeight, isVisibleCodeEditor } = this.state


    return (
      <div className='container full-width'>
        <section id='sidebar' className={!isVisibleCodeEditor && 'full-width-imp'}>
          <div className='level-intructions-container'>
            {isVisibleCodeEditor &&
            <LevelCounter
              currentLevel={currentLevel}
              showTooltip={showTooltip}
              levels={levels}
              prev={this.prev}
              next={this.next}
              goToLevel={this.goToLevel}
              showHideLevelsPanel={this.showHideLevelsPanel}
              reset={this.reset}
              solved={solved}
            /> }
            {!isVisibleCodeEditor &&
            <button id='back-to-the-game' onClick={() => this.loadLevel(levels[levelsNo-1],levelsNo-1)}>Back to the game</button>}
            <h1 className='title'>THE ERIDANI WARS</h1>
            <div className='flex image-instructions-container'>

                {isVisibleCodeEditor && <Guardian level={currentLevel}/>}
              <Intructions
                instructions={instructions}
                docs={docs}
              />
             
            </div>
          </div>
          {isVisibleCodeEditor &&
          <CodeEditor
            before={before}
            after={after}
            codeValue={this.state.codeArea}
            applyHaloStyle={this.applyHaloStyle}
            nextLevel={this.nextLevel}
            onHandleChangeCodeArea={this.onHandleChangeCodeArea}
            textareaHeight={textareaHeight}
          />}
        </section>
        <section id='view'>
            {isVisibleCodeEditor &&
          <DemoArea
            characterHaloClass={characterHaloClass}
            level={currentLevel}
          />}
        </section>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  answers: state.answers.answers,
  level: state.level.level,
  solved: state.solved.solved
})

const mapDispatchToProps = dispatch => (
  {
    setAnswers: (postData) => dispatch(setAnswers(postData)),
    setLevel : (postData) => dispatch(setLevel(postData)),
    setSolved: (postData) => dispatch(setSolved(postData)),
    resetAnswers: () => dispatch(resetAnswers()),
    resetSolved: () => dispatch(resetSolved())
  }
)

export default connect(mapStateToProps, mapDispatchToProps)((GameScreen))

GameScreen.propTypes = {
  answers: PropTypes.object,
  docs: PropTypes.object,
  level: PropTypes.number,
  levelWin: PropTypes.object,
  levels: PropTypes.array,
  resetAnswers: PropTypes.func,
  resetSolved: PropTypes.func,
  setAnswers: PropTypes.func,
  setLevel: PropTypes.func,
  setSolved: PropTypes.func,
  solved: PropTypes.array
}
