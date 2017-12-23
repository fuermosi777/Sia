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
  convertFromRaw
} from 'draft-js';
import { 
  checkCharacterForState,
  checkReturnForState,
  getCurrent,
  replaceText,
  blockStyleFn
} from './utils';
import PropTypes from 'prop-types';
import handleInsertText from './handlers/handleInsertText';
import handleInsertEmptyBlock from './handlers/handleInsertEmptyBlock';
import handleLoadText from './handlers/handleLoadText';

import createImageDecorator from './decorators/imageDecorator';
import createLinkDecorator from './decorators/linkDecorator';

const styleMap = {
  BOLD_STAR: {
    fontWeight: 'bold'
  },
  BOLD_UNDERSCORE: {
    fontWeight: 'bold',
  },
  ITALIC_STAR: {
    fontStyle: 'italic'
  },
  ITALIC_UNDERSCORE: {
    fontStyle: 'italic'
  }
};

class Sia extends React.PureComponent {

  static propTypes = {
    raw: PropTypes.object, // Draft raw object
    text: PropTypes.string, // Markdown text
    isAutoReload: PropTypes.bool, // If text is updated, should we reload the editor?
    onImageEditing: PropTypes.func
  };

  static defaultPropTypes = {
    raw: null,
    text: '',
    isAutoReload: false,
  };

  editor = null;

  constructor(props) {
    super(props);

    const compositeDecorator = new CompositeDecorator([
      createImageDecorator(this.onImageEntityEditing),
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text && this.props.isAutoReload) {
      let newEditorState = handleLoadText(this.state.editorState, nextProps.text);

      if (newEditorState !== this.state.editorState) {
        this.handleChange(newEditorState);
      }
    }
  }

  componentDidMount() {
    if (this.props.text) {
      let newEditorState = handleLoadText(this.state.editorState, this.props.text);

      if (newEditorState !== this.state.editorState) {
        this.handleChange(newEditorState);
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
          onChange={this.handleChange}
          blockStyleFn={blockStyleFn}
          handleKeyCommand={this.handleKeyCommand}
          handleBeforeInput={this.handleBeforeInput}
          onFocus={this.handleFocus}
          handleReturn={this.handleReturn}
          customStyleMap={styleMap}
          onTab={this.handleTab}
          stripPastedStyles={true}
          handlePastedText={this.handlePastedText}
        />
      </div>
    );
  }
  handleChange = editorState => {
    this.setState({editorState});
  }
  handleTab = ev => {
    const newEditorState = handleInsertText(this.state.editorState, '\t')
    this.handleChange(newEditorState);
    ev.preventDefault();
  }
  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handlePastedText = (text, html, editorState) => {
    let newEditorState = handleLoadText(editorState, text, false);

    if (editorState !== newEditorState) {
      this.handleChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleBeforeInput = (character, editorState) => {
    const newEditorState = checkCharacterForState(editorState, character);

    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return 'handled';
    }

    return 'not-handled';
  }

  handleReturn = (e, editorState) => {
    let newEditorState = checkReturnForState(editorState, e);
    // let { content } = getCurrent(newEditorState);
    // console.log(convertToRaw(content));
    if (editorState !== newEditorState) {
      this.setState({editorState: newEditorState});
      return 'handled';
    }

    return 'not-handled';
  }

  handleFocus = () => {
  }

  focus = () => {
    this.editor.focus();
  }

  /**
   * Return markdown text of current state
   * @return {string}
   */
  getText = () => {
    let { content } = getCurrent(this.state.editorState);
    console.log(convertToRaw(content));
  }

  onImageEntityEditing = () => {
    if (this.props.onImageEditing) {
      this.props.onImageEditing(this.state.editorState);
    }
  }
}

export default Sia;