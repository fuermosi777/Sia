import React from 'react';
import {Editor, EditorState, RichUtils, CompositeDecorator, Modifier, SelectionState, ContentState} from 'draft-js';

const changeCurrentBlockType = (
  editorState,
  type,
  text,
  blockMetadata = {}
) => {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const data = block.getData().merge(blockMetadata);
  const newBlock = block.merge({ type, data, text: text || "" });
  const newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: 0,
  });
  const newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: newSelection,
  });
  return EditorState.push(editorState, newContentState, "change-block-type");
};

class Sia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {editorState: EditorState.createWithContent(ContentState.createFromText(`123\n**123**`))};

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
  handleBeforeInput(character: string, editorState: EditorState) {
    // console.log('beforeInput', character);

    let newEditorState;
    
    const currentSelection = editorState.getSelection();
    const key = currentSelection.getStartKey();
    const text = editorState
      .getCurrentContent()
      .getBlockForKey(key)
      .getText();
  
    const position = currentSelection.getAnchorOffset();
    const line = [text.slice(0, position), character, text.slice(position)].join('');
    const blockType = RichUtils.getCurrentBlockType(editorState);

    if (line.indexOf(`# `) === 0) {
      newEditorState = changeCurrentBlockType(
        editorState,
        'header-one',
        line.replace(/^#+\s/, "")
      );

      this.setState({editorState: newEditorState});
      return 'handled';
    }
    

    console.log(text, line, blockType);

    return 'not-handled';
  }
  handleFocus() {
    // console.log('focus')
  }
  blockRendererFn(contentBlock) {
    // console.log(contentBlock.getType())

  }
}

export default Sia;