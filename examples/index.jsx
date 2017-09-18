import React from 'react';
import ReactDOM from 'react-dom';
import Sia from '../src';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <Sia/>;
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);