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
  getCurrent,
  replaceText,
  styleMap
} from './utils';
import handleInsertText from './handlers/handleInsertText';
import handleInsertEmptyBlock from './handlers/handleInsertEmptyBlock';

import createImageDecorator from './decorators/imageDecorator';
import createLinkDecorator from './decorators/linkDecorator';

class Sia extends React.Component {
  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([
      createImageDecorator(),
      createLinkDecorator()
    ]);

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
          onChange={this.handleChange.bind(this)}
          blockRendererFn={this.blockRendererFn.bind(this)}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
          handleBeforeInput={this.handleBeforeInput.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          handleReturn={this.handleReturn.bind(this)}
          customStyleMap={styleMap}
          onTab={this.handleTab.bind(this)}
          stripPastedStyles={true}
          handlePastedText={this.handlePastedText.bind(this)}
        />
      </div>
    );
  }
  handleChange(editorState) {
    const { content } = getCurrent(editorState);
    
    this.setState({editorState});
  }
  handleTab(ev) {
    const newEditorState = handleInsertText(this.state.editorState, '\t')
    this.handleChange(newEditorState);
    ev.preventDefault();
  }
  handleKeyCommand(command, editorState) {
    console.log('key', command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handlePastedText(text, html, editorState) {
    let newEditorState = editorState;
    let buffer = [];

    for (let i = 0; i < text.length; i++) {
      if ([' ', '*', '_', '`'].indexOf(text[i]) >= 0) {
        newEditorState = replaceText(
          newEditorState,
          buffer.join('') + text[i]
        );
        newEditorState = checkCharacterForState(newEditorState, '');
        buffer = [];
      } else if (text[i].charCodeAt(0) === 10) {
        // return
        newEditorState = replaceText(newEditorState, buffer.join(''));
        const tmpEditorState = checkReturnForState(newEditorState, {});
        if (newEditorState === tmpEditorState) {
          newEditorState = handleInsertEmptyBlock(tmpEditorState);
        } else {
          newEditorState = tmpEditorState;
        }
        buffer = [];
      // } else if (i === text.length - 1) {
      //   newEditorState = replaceText(
      //     newEditorState,
      //     buffer.join('') + text[i]
      //   );
      //   buffer = [];
      } else {
        buffer.push(text[i]);
      }
    }

    if (editorState !== newEditorState) {
      this.handleChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleBeforeInput(character, editorState) {
    // Start to handle stuff only when user types space
    // if (character !== ' ') {
    //   return "not-handled";
    // }

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