import { createStore, combineReducers, applyMiddleware,compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import answersReducer from './reducers/answers'
import levelReducer from './reducers/level'
import solvedReducer from './reducers/solved'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['answers','level','solved']
}

const reducer = combineReducers({
  answers: answersReducer,
  level: levelReducer,
  solved: solvedReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f

const store = createStore(
  persistedReducer,
  compose(applyMiddleware(thunk),
  devTools)
)
const persistedStore = persistStore(store)

export default { store, persistedStore }