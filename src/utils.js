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
  Modifier,
  RichUtils
} from 'draft-js';
import { CODE_BLOCK_START, CODE_BLOCK_END } from './regex';
import { OrderedSet } from 'immutable';

export function checkCharacterForState(editorState, character) {
  let { type } = getCurrent(editorState);

  // If in code block, don't add any markdown
  if (isCodeBlock(type)) {
    return editorState;
  }

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
  const type = block ? block.getType() : null;
  const text = block ? block.getText() : null;

  return {
    content, selection, key, block, type, text
  };
}

/**
 * Check if current block type is list
 * @param {*} type
 * @return {boolean}
 */
export function isList(type) {
  return type === 'unordered-list-item' || type === 'ordered-list-item';
}

function isHeader(type) {
  return /^header-/.test(type);
}

function isCodeBlock(type) {
  return type === 'code-block';
}

function isBlockquote(type) {
  return type === 'blockquote';
}

function inUnstyled(type) {
  return type === 'unstyled';
}

export function hasInlineStyle(editorState) {
  return editorState.getCurrentInlineStyle().size > 0;
}

export function checkReturnForState(editorState, event) {
  let newEditorState = editorState;
  let { type, text, selection } = getCurrent(editorState);

  const isLast = selection.getEndOffset() === text.length;
  
  // For empty list item return, exit the list
  if (isList(type) && text === '') {
    newEditorState = handleExitBlock(editorState);
  }

  // For headers or blockquote, start a new line
  // No matter if it's last or not
  if (isHeader(type)) {
    newEditorState = handleInsertEmptyBlock(newEditorState);
  }

  // For ```, start a new code block
  if (newEditorState === editorState &&
    inUnstyled(type) &&
    CODE_BLOCK_START.test(text)
  ) {
    newEditorState = handleNewCodeBlock(editorState);
  }

  // For ```, end code block
  if (newEditorState === editorState &&
    isCodeBlock(type)
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

  if (type === 'unstyled' && hasInlineStyle(newEditorState)) {
      newEditorState = handleSplitBlock(newEditorState);
      newEditorState = removeCurrentInlineStyles(newEditorState);
      
      // Remove inline in undoStack
      newEditorState = forgetUndo(newEditorState);
  }

  return newEditorState;
}

export function forgetUndo(editorState, times = 1, keepEarliest = false) {
  let undoStack = editorState.getUndoStack();
  let i = 0;
  let latestState;
  if (keepEarliest) {
    latestState = undoStack.last();
  }
  while (i < times && undoStack.size > 0) {
    undoStack = undoStack.pop();
    i++;
  }
  if (keepEarliest) {
    undoStack = undoStack.push(latestState);
  }
  return EditorState.set(editorState, { undoStack });
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
  // Since JS doesn't have zero-width negative lookbehind,
  // need to check match array manually
  // So the matchArr would be 
  // [/* real match */, /* the match I want */, /* should captured group */]
  const isRegexZeroWidth = matchArr[0] === matchArr[1];
  const index = isRegexZeroWidth ? matchArr.index : matchArr.index + 1;

  const currentContent = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const blockMap = currentContent.getBlockMap();
  const block = blockMap.get(key);
  const currentInlineStyle = block.getInlineStyleAt(index).merge();

  let newStyle;
  if (currentInlineStyle.has('CODE')) {
    return editorState;
  } else {
    newStyle = currentInlineStyle.merge([style]);
  }

  const focusOffset = index + matchArr[1].length;
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  });
  
  let newContentState = Modifier.replaceText(
    currentContent,
    wordSelection,
    matchArr[2],
    newStyle
  );

  let newEditorState = editorState;

  newEditorState = EditorState.push(
    newEditorState,
    newContentState,
    'change-inline-style'
  );
  
  newEditorState = EditorState.forceSelection(
    newEditorState,
    newContentState.getSelectionAfter()
  );

  // Remove styles
  return EditorState.setInlineStyleOverride(
    newEditorState,
    new OrderedSet()
  );
}

export function removeCurrentInlineStyles(editorState) {
  let { text, content, selection, key } = getCurrent(editorState);

  let newContentState = content;
  let styles = ['BOLD', 'ITALIC', 'CODE', 'UNDERLINE', 'STRIKETHROUGH'];

  const entireBlockSelection = selection.merge({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    focusOffset: text.length
  });

  if (entireBlockSelection.isCollapsed()) {
    return EditorState.setInlineStyleOverride(
      editorState,
      new OrderedSet()
    );
  }

  newContentState = styles.reduce((contentState, style) => {
    return Modifier.removeInlineStyle(
      contentState,
      entireBlockSelection,
      style
    )
  }, newContentState);

  let newEditorState = EditorState.push(
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

export function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export function replaceText(editorState, text) {
  const contentState = Modifier.insertText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text
  );
  return EditorState.push(editorState, contentState, 'insert-characters');
}

export const styleMap = {
  HEADER_MARKER: {
    color: 'lightgray'
  },
  INLINE_MARKER: {
    color: 'red'
  }
};
