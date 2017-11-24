import { Modifier, SelectionState, EditorState } from 'draft-js';
import { getCurrent } from '../utils';

export default function handleSplitBlock(editorState) {
  let { content, selection } = getCurrent(editorState);

  let newContentState = Modifier.splitBlock(content, selection);

  return EditorState.push(
    editorState,
    newContentState,
    'split-block'
  );
};
