import handleBlockType from './handlers/handleBlockType';
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

export const changeCurrentBlockType = (
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
