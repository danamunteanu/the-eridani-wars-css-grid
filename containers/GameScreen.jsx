import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { warningReset, wrongAnswerWarning } from '../const/levels.js'
import { setAnswers, resetAnswers } from '../actions/answers'
import { setLevel } from '../actions/level'
import { setSolved, resetSolved } from '../actions/solved'
import { getStylesForProperty, getPropertyName } from 'css-to-react-native';
import LevelCounter from '../components/LevelCounter.jsx';
import Intructions from '../components/Instructions.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import DemoArea from '../components/DemoArea.jsx';

class GameScreen extends Component {
    constructor (props) {
        super(props)
        this.nextLevel = this.nextLevel.bind(this)
        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
        this.loadLevel = this.loadLevel.bind(this)
        this.showHideLevelsPanel = this.showHideLevelsPanel.bind(this)
        this.reset = this.reset.bind(this);
        this.saveAnswer = this.saveAnswer.bind(this);
        this.goToLevel = this.goToLevel.bind(this);
        this.onChangeTreatmentStyle = this.onChangeTreatmentStyle.bind(this);
        this.isKeyValuePair = this.isKeyValuePair.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.onHandleChangeTextarea = this.onHandleChangeTextarea.bind(this);
        this.state = {
            user: localStorage.user || '',
            level: parseInt(localStorage.level, 10) || 0,
            answers: {},
            docs: {},
            solved: localStorage.solved || [],
            isCorrectAnswer: false,
            changed: false,
            showTooltip: false,
            codeArea: '',
            textareaStyle: '22px',
            plantTreatmentClass: []
        };
    }

    componentDidMount() {
        const currentLevel = parseInt(this.props.level, 10) || 0

        if (!localStorage.user) {
            const userValue = '' + (new Date()).getTime() + Math.random().toString(36).slice(1);
            localStorage.setItem('user', userValue);
        }
         
        const levelData = this.props.levels[currentLevel];
        const levelsNo = this.props.levels.length;
        const docs = this.props.docs;
        this.saveAnswer()
        this.loadLevel(levelData)
    }

    prev()  {
        this.saveAnswer();
        let currentLevel = this.props.level;
        currentLevel --;
        this.props.setLevel(currentLevel)
        const levelData = this.props.levels[currentLevel];
        this.loadLevel(levelData)
        
    }

    next() {
        this.saveAnswer();
        let currentLevel = this.props.level;
        currentLevel ++;
        this.props.setLevel(currentLevel)
        const levelData = this.props.levels[currentLevel];
        this.loadLevel(levelData)
        
    }

    goToLevel(level) { 
        this.saveAnswer();
        let currentLevel = level;
        this.props.setLevel(currentLevel);
        const levelData = this.props.levels[currentLevel];
        this.loadLevel(levelData);

    }

    loadLevel (levelData) {
        const instructions = levelData.instructions;
        const before = levelData.before;
        const after = levelData.after;
        const levelName = levelData.name;
        const answers = this.props.answers;
        const currentAnswer = answers[levelName] ? answers[levelName]: '';
        this.setState({
            instructions: instructions,
            before: before,
            after: after,
            codeArea: currentAnswer
        })

        this.onChangeTreatmentStyle(currentAnswer);

        const colors = {
            'c': 'carrot',
            'w': 'weed'
        };
        const levelStyle = levelData.style;
        const textareaHeight= Object.keys(levelStyle).length * 20 + 2 + '';

        this.setState({
            textareaStyle: textareaHeight
        })

        const string = levelData.board;
        
        let plantTreatmentClassArr = [];

        for (let i = 0; i < string.length; i++) {
            const c = string.charAt(i);
            let color = colors[c];
            plantTreatmentClassArr = [...plantTreatmentClassArr, color];
        }

        this.setState({
            plantTreatmentClass : plantTreatmentClassArr
        }, () => {
            this.applyClassesAndStyles(levelData);
        })
    }

    applyClassesAndStyles(levelData) {
        const classes = levelData.classes;
        let plantClass = '';
        let attrs = [];
        const currentClasses = classes ? {'#overlay, #garden, #plants': '', ...classes} : {'#plants, #garden, #garden > *, #plants > *': ''}
        Object.keys(currentClasses).forEach(function(currentClass) {
            const classSelectors = currentClass.split(', ');
            classSelectors.forEach(classSelector => {
                const matches = document.querySelectorAll(classSelector);
                matches.forEach(match => {
                    const matchClassNameArray = match.className.split(' ').slice(0,2);
                    matchClassNameArray.push(currentClasses[currentClass]);
                    match.className = matchClassNameArray.join(' ');
                })
            })
        });
        
        const selector = levelData.selector;
        const levelStyle = levelData.style;
        if (levelStyle) {
            const all = document.querySelectorAll('#plants, #plants > *')

            all.forEach(elem => {
                elem.style.cssText = '';
            })
            
            const selectorMatches = document.querySelectorAll('#plants ' + (selector || ''));
            
            selectorMatches.forEach(match => {
                if (levelStyle) {
                    Object.keys(levelStyle).forEach(function(key) {
                        match.style.cssText += key + ': ' + levelStyle[key] + '; ';
                    });
                }
            })
        }
    }

    saveAnswer() {
        const level = this.props.levels[this.props.level]; 
        const codeArea = this.state.codeArea; 
        const levelName = level.name
        const answers = {
                ...this.props.answers,
                [levelName]: this.state.codeArea ? this.state.codeArea  : ''
            }
        this.props.setAnswers(answers)
      }

    nextLevel () {
        this.checkAnswer();
    }

    checkAnswer() {
        let correct = false;
        const currentLevel = this.props.level;
        const plantDOM = ReactDOM.findDOMNode(this).getElementsByClassName('plant')[0];
        const treatmentDOM = ReactDOM.findDOMNode(this).getElementsByClassName('treatment')[0];
        const plantPosition = plantDOM.getBoundingClientRect();
        const treatmentPosition = treatmentDOM.getBoundingClientRect();
        if (plantPosition.top === treatmentPosition.top && plantPosition.left === treatmentPosition.left 
        && plantPosition.bottom === treatmentPosition.bottom && plantPosition.right === treatmentPosition.right) {
            correct = true;
            let updated = this.props.solved.slice();
            if (updated.indexOf(currentLevel) === -1) {
                updated.push(currentLevel);
                this.props.setSolved(updated);
            }
            this.next();
        }
        if (correct === false) {
            alert(wrongAnswerWarning);
        }
      
    }

    showHideLevelsPanel(show) {
        if (show) {
            this.setState({
                showTooltip: show
            });
        }
        else {
            let isVisible = !this.state.showTooltip
            this.setState({
                showTooltip: isVisible
            });
        }
    }

    reset() {
      var r = confirm(warningReset);

      if (r) {
        this.goToLevel(0);
        this.props.resetAnswers();
        this.props.resetSolved();
        this.showHideLevelsPanel(false);
        this.setState({
            level: 0,
            solved: [],
            answers: {
                answers : {}
            },
            codeArea: ''
        });
      }
      
    }

    isKeyValuePair(str) {
        const regex = new RegExp(/\w+:\s?-?\s?\w+(?=,?\s?)/g);
        if (regex.test(str)) {
            return true;
        }
        return false;
    }

    onChangeTreatmentStyle(value) {
        const valueSplittedByRows = value.split('\n');
        let tempStyle = {}
        for (let i=0; i<valueSplittedByRows.length;i++) {
            if (this.isKeyValuePair(valueSplittedByRows[i])) {
                const arrayProp = valueSplittedByRows[i].split(';')[0].split(':');
                const style = getStylesForProperty(getPropertyName(arrayProp[0]), arrayProp[1]);
                tempStyle = {...tempStyle, ...style}
            }
        }
        this.setState({treatmentStyle: tempStyle})
    }

    onHandleChangeTextarea(value) {
        this.setState({
            codeArea: value
        })
    }

    render() {
        const { levels, solved, answers, docs } = this.props
        const levelsNo = levels.length
        const currentLevel = parseInt(this.props.level)
        const levelName = levels[currentLevel].name
        const instructions = this.state.instructions
        const before = this.state.before
        const after = this.state.after
        const showTooltip = this.state.showTooltip
        const plantTreatmentClass = this.state.plantTreatmentClass
        const plantStyle = this.state.plantStyle
        const treatmentStyle = this.state.treatmentStyle
        const textAreaValue = answers[levelName] ? answers[levelName]: '';
        const textareaHeight = this.state.textareaStyle;
        return (
            <div className="container full-width">
                <section id="sidebar">
                    <div className="level-intructions-container">
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
                        />
                        <h1>Grid Garden</h1>
                        <Intructions 
                            instructions={instructions}
                            docs={docs}
                        />
                    </div>
                    <CodeEditor 
                        before={before}
                        after={after}
                        codeValue={this.state.codeArea}
                        onChangeTreatmentStyle={this.onChangeTreatmentStyle}
                        nextLevel={this.nextLevel}
                        onHandleChangeTextarea={this.onHandleChangeTextarea}
                        textareaHeight={textareaHeight}
                    />
                </section>
                <section id="view">
                    <DemoArea
                        plantTreatmentClass={plantTreatmentClass}
                        plantStyle={plantStyle}
                        treatmentStyle={treatmentStyle}
                    />
                    
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
