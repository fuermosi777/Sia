import { 
  replaceText,
  checkCharacterForState,
  checkReturnForState,
  forgetUndo
} from '../utils';
import handleInsertEmptyBlock from './handleInsertEmptyBlock';


export default function handleLoadText(editorState, text) {
  let newEditorState = editorState;
  let buffer = [];
  const startUndoStackSize = newEditorState.getUndoStack().size;

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
    } else {
      buffer.push(text[i]);
    }
  }

  const endUndoStackSize = newEditorState.getUndoStack().size;
  newEditorState = forgetUndo(newEditorState, endUndoStackSize - startUndoStackSize);
  return newEditorState;
}
