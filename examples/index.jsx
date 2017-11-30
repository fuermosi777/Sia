import React from 'react';
import ReactDOM from 'react-dom';
import Sia from '../src';

const text =
`# 123123

_123123_

**12312321** _123123_

> sdfasdf

\`\`\`
var let t = 3;
\`\`\``;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Sia text={text}/>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);