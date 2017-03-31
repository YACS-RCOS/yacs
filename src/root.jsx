import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// import reducers from '<project-path>/reducers'
import CourseList from './components/course-list.jsx'
import SchoolList from './components/school-list.jsx'
import App from './components/app.jsx'


// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    // ...reducers,
    routing: routerReducer
  })
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="schools" component={SchoolList}/>
        <Route path="courses" component={CourseList}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)