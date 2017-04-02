import React from 'react'
import { Link, browserHistory } from 'react-router'

class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <Link to='/schools'>Schools</Link>
          <Link to='/courses'>Courses</Link>
        </header>
        {this.props.children}
      </div>
    );
  }
}

export default App;



      // <header>
      //   <Link to='/schools'>Schools</Link>
      //   <Link to='/courses'>Courses</Link>
      // </header>
      // {this.props.children}
      // </div>