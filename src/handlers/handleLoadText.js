import { 
  replaceText,
  checkCharacterForState,
  checkReturnForState,
  forgetUndo
} from '../utils';
import handleInsertEmptyBlock from './handleInsertEmptyBlock';
import handleInsertText from './handleInsertText';

const SENSITIVE_CHARS = [' ', '*', '_', '`'];

export default function handleLoadText(editorState, text, isLoadFromStart = true) {
  let newText = text;

  // Add a line break manually for text ending with "`"
  if (newText[newText.length - 1] === '`') {
    newText += String.fromCharCode(10);
  }

  let newEditorState = editorState;
  let buffer = [];
  const startUndoStackSize = newEditorState.getUndoStack().size;

  for (let i = 0; i < newText.length; i++) {
    let char = newText[i];
    
    if (SENSITIVE_CHARS.indexOf(char) >= 0) {
      newEditorState = replaceText(
        newEditorState,
        buffer.join('') + char
      );
      newEditorState = checkCharacterForState(newEditorState, '');
      buffer = [];
    } else if (char.charCodeAt(0) === 10) {
      // return
      newEditorState = replaceText(newEditorState, buffer.join(''));
      const tmpEditorState = checkReturnForState(newEditorState, {});
      if (newEditorState === tmpEditorState) {
        newEditorState = handleInsertEmptyBlock(tmpEditorState);
      } else {
        newEditorState = tmpEditorState;
      }
      buffer = [];
    } else if (i === newText.length - 1) {
      newEditorState = replaceText(newEditorState, buffer.join('') + char);
      buffer = [];
    } else {
      buffer.push(char);
    }
  }

  const endUndoStackSize = newEditorState.getUndoStack().size;

  let times = endUndoStackSize - startUndoStackSize;

  if (!isLoadFromStart) { // paste
    times -= 1;
  }
  newEditorState = forgetUndo(newEditorState, times);
  return newEditorState;
}
