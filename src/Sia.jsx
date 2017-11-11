import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, Modifier, SelectionState, ContentState} from 'draft-js';

const BOLD_REGEX = /\*\*([\w]+)\*\*/g;
const HEADING_REGEX = /# (.+)$/g;

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
}

function boldStrategy(contentBlock, callback, contentState) {
  findWithRegex(BOLD_REGEX, contentBlock, callback);
}

function headingStrategy(contentBlock, callback, contentState) {
  findWithRegex(HEADING_REGEX, contentBlock, callback);
}

const boldSpan = props => {
  // const editor = props.parent.editor;

  const { editorState } = props.parent.state;

  // const { decoratedText } = props;
  // const { start, offsetKey } = props.children[0].props;
  // console.log(props.children[0].props, start, offsetKey);

  // const selectionState = SelectionState.createEmpty(offsetKey).merge({
  //   anchorOffset: start,
  //   focusOffset: start + decoratedText.length,
  // });

  // let newState = Modifier.replaceText(
  //   editorState.getCurrentContent(),
  //   selectionState,
  //   "my new text",
  //   null,
  //   entityKey,
  // );
  
  // props.parent.setState({state: EditorState.push(
  //   editorState, 
  //   ContentState.createFromText('123'), 
  //   'insert-characters'
  // )});
  console.log('bold', props);

  return <span className="Sia-bold">{props.children}</span>;
};

const headingSpan = props => {
  console.log('heading', props);
  return <span className="Sia-heading">{props.children}</span>;
}


class Sia extends React.Component {
  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([{
      strategy: boldStrategy,
      component: boldSpan,
      props: {parent: this}
    }, {
      strategy: headingStrategy,
      component: headingSpan,
      props: {parent: this}
    }]);

    this.state = {editorState: EditorState.createEmpty(compositeDecorator)};

  }
  render() {
    return (
      <div className="Sia">
        <Editor
          ref={editor => this.editor = editor}
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
        />
      </div>
    );
  }
  onChange(editorState) {
    const contentState = editorState.getCurrentContent();
    // console.log(contentState);
    this.setState({editorState});
  }
  handleKeyCommand(command, editorState) {
    // console.log(command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange.call(this, newState);
      return 'handled';
    }
    return 'not-handled';
  }
}

export default Sia;