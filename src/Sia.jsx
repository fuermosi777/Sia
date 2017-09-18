import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';

class Sia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
  }
  render() {
    return (
      <div className="Sia">
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          handleKeyCommand={this.handleKeyCommand.bind(this)}/>
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