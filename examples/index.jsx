import React from 'react';
import ReactDOM from 'react-dom';
import Sia from '../src';

const text =
`# 123123

*123*

**12312321** _123123_

> sdfasdf

*456*

\`\`\`
var let t = 3;
\`\`\`
`;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  editor = null;

  render() {
    return (
      <div>
        <button onClick={this.handleExportClick}>Export markdown text</button>
        <Sia text={text} ref={editor => this.editor = editor}/>
      </div>
    );
  }

  handleExportClick = () => {
    this.editor.getText();
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);