import React from 'react';
import ReactDOM from 'react-dom';
require('./styles/style.scss');
// main app
import App from './containers/App.jsx';
import { Provider } from 'react-redux';
import store from './store';
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.render(<Provider store={store.store}><PersistGate loading={null} persistor={store.persistedStore}><App /></PersistGate></Provider>, document.getElementById('app'))