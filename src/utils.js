import handleBlockType from './handlers/handleBlockType';
import handleExitBlock from './handlers/handleExitBlock';
import handleInsertEmptyBlock from './handlers/handleInsertEmptyBlock';
import handleInsertText from './handlers/handleInsertText';
import handleNewCodeBlock from './handlers/handleNewCodeBlock';
import handleInlineStyle from './handlers/handleInlineStyle';
import handleSplitBlock from './handlers/handleSplitBlock';
import handleImage from './handlers/handleImage';
import handleLink from './handlers/handleLink';
import {
  EditorState,
  SelectionState,
  Modifier
} from 'draft-js';
import { CODE_BLOCK_START, CODE_BLOCK_END } from './regex';

export function checkCharacterForState(editorState, character) {
  let newEditorState = handleBlockType(editorState, character);
  if (editorState === newEditorState) {
    newEditorState = handleImage(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = handleLink(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, character);
  }
  return newEditorState;
}

export function getCurrent(editorState) {
  const content = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const block = content.getBlockForKey(key);
  const type = block.getType();
  const text = block.getText();

  return {
    content, selection, key, block, type, text
  };
}

export function checkReturnForState(editorState, event) {
  let newEditorState = editorState;
  let { type, text, selection } = getCurrent(editorState);

  const isLast = selection.getEndOffset() === text.length;
  let isSplit = false;
  
  // For empty list item return, exit the list
  if ((type === 'unordered-list-item' || type === 'ordered-list-item') && text === '') {
    newEditorState = handleExitBlock(editorState);
  }

  // For headers or blockquote, start a new line
  if (/^header-/.test(type)) {
    if (isLast) {
      newEditorState = handleInsertEmptyBlock(newEditorState);
    } else {
      newEditorState = handleSplitBlock(newEditorState);
      isSplit = true;
      newEditorState = handleExitBlock(newEditorState);
    }
  }

  // For ```, start a new code block
  if (newEditorState === editorState &&
    type !== 'code-block' &&
    CODE_BLOCK_START.test(text)
  ) {
    newEditorState = handleNewCodeBlock(editorState);
  }

  // For ```, end code block
  if (newEditorState === editorState &&
    type === 'code-block'
  ) {
    if (CODE_BLOCK_END.test(text)) {
      // remove last ```
      newEditorState = changeCurrentBlockType(
        newEditorState,
        type,
        text.replace(/\n```\s*$/, '')
      );
      // start a new line
      newEditorState = handleInsertEmptyBlock(newEditorState);
    } else {
      newEditorState = handleInsertText(newEditorState, '\n');
    }
  }

  // When user type enter at the end of each line, remove all inline styles
  if (newEditorState.getCurrentInlineStyle().size > 0) {
    if (!isSplit) {
      newEditorState = handleSplitBlock(newEditorState);
    }
    newEditorState = removeCurrentInlineStyles(newEditorState);
  }

  return newEditorState;
}

export function changeCurrentBlockType(
  editorState,
  type,
  text,
  blockMetadata = {}
) {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const data = block.getData().merge(blockMetadata);
  const newBlock = block.merge({ type, data, text: text || '' });
  const newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: 0,
  });
  const newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: newSelection,
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};

export function changeCurrentInlineStyle(editorState, matchArr, style, character) {
  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const { index } = matchArr;
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const currentInlineStyle = block.getInlineStyleAt(index).merge();
  const newStyle = currentInlineStyle.merge([style]);
  const focusOffset = index + matchArr[0].length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });
  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    matchArr[1],
    newStyle
  );
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    character || ' '
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'change-inline-style'
  );
  return EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );
}

export function removeCurrentInlineStyles(editorState) {
  let { text, content, selection, key } = getCurrent(editorState);

  let newContentState = content;
  let styles = ['BOLD', 'ITALIC', 'CODE', 'UNDERLINE', 'STRIKETHROUGH'];

  let wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: 0,
    focusOffset: text.length
  });

  newContentState = styles.reduce((contentState, style) => {
    return Modifier.removeInlineStyle(
      contentState,
      wordSelection,
      style
    )
  }, newContentState);

  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    'change-inline-style'
  );

  // Move focus to block start
  let afterRemoved = EditorState.acceptSelection(
    newEditorState,
    new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
      isBackward: false
    })
  );

  return EditorState.forceSelection(
    afterRemoved,
    afterRemoved.getSelection()
  );
}

export const styleMap = {
  INLINE_MARKER: {
    color: 'red'
  }
};
