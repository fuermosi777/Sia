import { EditorState, RichUtils, SelectionState, Modifier } from 'draft-js';
import { getCurrent } from '../utils';
import { IMAGE } from '../regex';

function insertImage(editorState, matchArr) {
  const { content, selection, key } = getCurrent(editorState);

  const [matchText, alt, src, title] = matchArr;
  const { index } = matchArr;
  const focusOffset = index + matchText.length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });
  const nextContent = content.createEntity('IMG', 'IMMUTABLE', {
    alt,
    src,
    title,
  });
  const entityKey = nextContent.getLastCreatedEntityKey();
  let newContentState = Modifier.replaceText(
    nextContent,
    wordSelection,
    '\u200B',
    null,
    entityKey
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    ' '
  );
  const newWordSelection = wordSelection.merge({
    focusOffset: index + 1,
  });
  let newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-image'
  );
  newEditorState = RichUtils.toggleLink(
    newEditorState,
    newWordSelection,
    entityKey
  );
  return EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );
}


export default function handleImage(editorState, character) {
  const { key, text } = getCurrent(editorState);

  const line = `${text}${character}`;
  let newEditorState = editorState;
  let matchArr;
  do {
    matchArr = IMAGE.exec(line);
    if (matchArr) {
      newEditorState = insertImage(newEditorState, matchArr);
    }
  } while (matchArr);
  return newEditorState;
};
