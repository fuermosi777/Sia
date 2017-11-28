import { 
  changeCurrentBlockType,
  getCurrent,
  forgetUndo
} from '../utils';
import handleInsertEmptyBlock from './handleInsertEmptyBlock';
import { CODE_BLOCK_START } from '../regex';
import { EditorState } from 'draft-js';

export default function handleNewCodeBlock(editorState) {
  const { content, selection, key, type, text, block } = getCurrent(editorState);

  const matchData = CODE_BLOCK_START.exec(text);
  const endOffset = selection.getEndOffset();

  let newEditorState = editorState;
  
  // We .trim the text here to make sure pressing enter after '``` ' works even if the cursor is before the space
  const isLast = endOffset === text.length || endOffset === text.trim().length;
  
  if (matchData && isLast) {
    const data = {};
    const language = matchData[1];
    if (language) {
      data.language = language;
    }
    newEditorState = changeCurrentBlockType(editorState, 'code-block', '', data);
  }

  return newEditorState;
};
