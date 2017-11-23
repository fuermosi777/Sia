import { changeCurrentBlockType } from '../utils';
import { RichUtils } from "draft-js";

export default function handleBlockType(editorState, character) {
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
    return changeCurrentBlockType(
      editorState,
      'header-one',
      line.replace(/^#+\s/, "")
    );
  }

  return editorState;
}