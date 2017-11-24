import { LINK } from '../regex';
import { getCurrent } from '../utils';
import { EditorState, RichUtils, SelectionState, Modifier } from 'draft-js';

function insertLink(editorState, matchArr) {
  const { content, selection, key } = getCurrent(editorState);
  const [matchText, text, href, title] = matchArr;
  const { index } = matchArr;
  const focusOffset = index + matchText.length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });
  const nextContent = content.createEntity('LINK', 'MUTABLE', {
    href,
    title,
  });
  const entityKey = nextContent.getLastCreatedEntityKey();
  let newContentState = Modifier.replaceText(
    nextContent,
    wordSelection,
    text,
    null,
    entityKey
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    ' '
  );
  const newWordSelection = wordSelection.merge({
    focusOffset: index + text.length,
  });
  let newEditorState = EditorState.push(
    editorState,
    newContentState,
    'insert-link'
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

export default function handleLink(editorState, character) {
  const { key, text } = getCurrent(editorState);

  const line = `${text}${character}`;
  let newEditorState = editorState;
  let matchArr;
  do {
    matchArr = LINK.exec(line);
    if (matchArr) {
      newEditorState = insertLink(newEditorState, matchArr);
    }
  } while (matchArr);

  return newEditorState;
}