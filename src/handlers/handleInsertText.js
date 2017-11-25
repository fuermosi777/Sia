import { EditorState, Modifier } from "draft-js";
import { getCurrent } from '../utils';

export default function handleInsertText(editorState, text) {
  const { content, selection } = getCurrent(editorState);

  const newContentState = Modifier.insertText(
    content,
    selection,
    text,
    editorState.getCurrentInlineStyle()
  );
  return EditorState.push(editorState, newContentState, "insert-fragment");
};
