import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  Modifier,
  SelectionState,
  ContentState
} from 'draft-js';
import { 
  checkCharacterForState,
  checkReturnForState,
  styleMap
} from './utils';
import createImageDecorator from './decorators/imageDecorator';
import createLinkDecorator from './decorators/linkDecorator';

class Sia extends React.Component {
  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([createImageDecorator(), createLinkDecorator()]);

    this.state = {editorState: EditorState.createWithContent(
      ContentState.createFromText(`123\n**123**`),
      compositeDecorator
    )};
  }
  render() {
    return (
      <div className="Sia">
        <Editor
          ref={editor => this.editor = editor}
          editorState={this.state.editorState}
          onChange={this.onChange.bind(this)}
          blockRendererFn={this.blockRendererFn.bind(this)}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
          handleBeforeInput={this.handleBeforeInput.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          handleReturn={this.handleReturn.bind(this)}
          customStyleMap={styleMap}
        />
      </div>
    );
  }
  onChange(editorState) {
    const contentState = editorState.getCurrentContent();
    // console.log('change', contentState);
    this.setState({editorState});
  }
  handleKeyCommand(command, editorState) {
    // console.log('key', command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange.call(this, newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleBeforeInput(character, editorState) {
    // Start to handle stuff only when user types space
    if (character !== ' ') {
      return "not-handled";
    }

    const newEditorState = checkCharacterForState(editorState, character);

    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return "handled";
    }

    return "not-handled";
  }

  handleReturn(e, editorState) {
    let newEditorState = checkReturnForState(editorState, e);
    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return "handled";
    }

    return "not-handled";
  }

  handleFocus() {
    // console.log('focus')
  }

  blockRendererFn(contentBlock) {
    // console.log(contentBlock.getType())

  }
}

export default Sia;