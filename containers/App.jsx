import React, {Component} from 'react';
import GameScreen from './GameScreen.jsx'
import { levels, levelWin } from '../const/levels.js'
import {connect} from 'react-redux'

class App extends Component {
    render () {
        return <GameScreen levels={levels} levelWin={levelWin}/>
    }
}
export default connect(state => state)(App);