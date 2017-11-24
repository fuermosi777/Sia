import { changeCurrentBlockType } from "../utils";
import handleInsertEmptyBlock from "./handleInsertEmptyBlock";
import { CODE_BLOCK_START } from "../regex";

export default function handleNewCodeBlock(editorState) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const matchData = CODE_BLOCK_START.exec(currentBlock.getText());
  const currentText = currentBlock.getText();
  const endOffset = selection.getEndOffset();
  // We .trim the text here to make sure pressing enter after "``` " works even if the cursor is before the space

  const isLast = endOffset === currentText.length || endOffset === currentText.trim().length;
  
  if (matchData && isLast) {
    const data = {};
    const language = matchData[1];
    if (language) {
      data.language = language;
    }
    return changeCurrentBlockType(editorState, "code-block", "", data);
  }
  const type = currentBlock.getType();

  if (type === 'code-block' && isLast) {
    return handleInsertEmptyBlock(editorState, "code-block", currentBlock.getData());
  }

  return editorState;
};
