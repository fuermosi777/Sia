import handleBlockType from './handlers/handleBlockType';
import handleExitList from './handlers/handleExitList';
import handleInsertEmptyBlock from './handlers/handleInsertEmptyBlock';
import {
  EditorState
} from 'draft-js';

export function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  // if (editorState === newEditorState) {
  //   newEditorState = handleImage(editorState, character);
  // }
  // if (editorState === newEditorState) {
  //   newEditorState = handleLink(editorState, character);
  // }
  // if (editorState === newEditorState) {
  //   newEditorState = handleInlineStyle(editorState, character);
  // }
  return newEditorState;
}

export function getCurrent(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const block = content.getBlockForKey(key);
  const type = block.getType();
  const text = block.getText();

  return {
    content, selection, key, block, type, text
  };
}

export function checkReturnForState(editorState, event) {
  let newEditorState = editorState;
  let { type, text } = getCurrent(editorState);
  
  // For empty list item return, exit the list
  if ((type === 'unordered-list-item' || type === 'ordered-list-item') && text === '') {
    newEditorState = handleExitList(editorState);
  }

  // For headers, start a new block
  if (/^header-/.test(type)) {
    newEditorState = handleInsertEmptyBlock(editorState);
  }

  return newEditorState;
}

export function changeCurrentBlockType(
  editorState,
  type,
  text,
  blockMetadata = {}
) {
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
