import { 
  replaceText,
  checkCharacterForState,
  checkReturnForState,
  forgetUndo
} from '../utils';
import handleInsertEmptyBlock from './handleInsertEmptyBlock';
import handleInsertText from './handleInsertText';

export default function handleLoadText(editorState, text) {
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
    
    if (['*', '_', '`'].indexOf(char) >= 0) {
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
  newEditorState = forgetUndo(newEditorState, endUndoStackSize - startUndoStackSize);
  return newEditorState;
}
