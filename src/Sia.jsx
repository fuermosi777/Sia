import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  CompositeDecorator,
  Modifier,
  SelectionState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import { 
  checkCharacterForState,
  checkReturnForState,
  getCurrent,
  replaceText,
  styleMap
} from './utils';
import PropTypes from 'prop-types';
import handleInsertText from './handlers/handleInsertText';
import handleInsertEmptyBlock from './handlers/handleInsertEmptyBlock';
import handleLoadText from './handlers/handleLoadText';

import createImageDecorator from './decorators/imageDecorator';
import createLinkDecorator from './decorators/linkDecorator';

class Sia extends React.Component {

  static propTypes = {
    raw: PropTypes.object,
    text: PropTypes.string
  };

  static defaultPropTypes = {
    raw: null,
    text: ''
  };

  editor = null;

  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([
      createImageDecorator(),
      createLinkDecorator()
    ]);

    let editorState;

    if (props.raw) {
      editorState = EditorState.createWithContent(
        convertFromRaw(props.raw),
        compositeDecorator
      )
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
    }

    this.state = {editorState};
  }

  componentDidMount() {
    if (this.props.text) {
      let newEditorState = handleLoadText(this.state.editorState, this.props.text);

      if (newEditorState !== this.state.editorState) {
        this.handleChange.call(this, newEditorState);
      }
    } else {
      this.focus();
    }
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
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handlePastedText(text, html, editorState) {
    let newEditorState = handleLoadText(editorState, text, false);

    if (editorState !== newEditorState) {
      this.handleChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleBeforeInput(character, editorState) {
    const newEditorState = checkCharacterForState(editorState, character);

    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return 'handled';
    }

    return 'not-handled';
  }

  handleReturn(e, editorState) {
    let newEditorState = checkReturnForState(editorState, e);
    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return 'handled';
    }

    return 'not-handled';
  }

  handleFocus() {}

  blockRendererFn(contentBlock) {}

  focus = () => {
    this.editor.focus();
  }
}

export default Sia;