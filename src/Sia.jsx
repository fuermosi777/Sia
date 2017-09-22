import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, Modifier} from 'draft-js';

const BOLD_REGEX = /\*\*([\w]+)\*\*/g;

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length
    callback(start, end);
  }
}

function boldStrategy(contentBlock, callback, contentState) {
  findWithRegex(BOLD_REGEX, contentBlock, callback);
}

const boldSpan = props => {
  let editorState = props.parent.state.editorState;
  // let newState = Modifier.replaceText(
  //   editorState.getCurrentContent(),
  //   selectionState,
  //   "my new text",
  //   null,
  //   entityKey,
  // );

  return <span className="Sia-bold">{props.children}</span>;
};



class Sia extends React.Component {
  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([{
      strategy: boldStrategy,
      component: boldSpan,
      props: {parent: this}
    }]);

    this.state = {editorState: EditorState.createEmpty(compositeDecorator)};

  }
  render() {
    return (
      <div className="Sia">
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
        />
      </div>
    );
  }
  onChange(editorState) {
    const contentState = editorState.getCurrentContent();
    console.log(contentState);
    this.setState({editorState});
  }
  handleKeyCommand(command, editorState) {
    console.log(command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange.call(this, newState);
      return 'handled';
    }
    return 'not-handled';
  }
}

export default Sia;