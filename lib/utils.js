'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleMap = undefined;
exports.checkCharacterForState = checkCharacterForState;
exports.getCurrent = getCurrent;
exports.isList = isList;
exports.hasInlineStyle = hasInlineStyle;
exports.checkReturnForState = checkReturnForState;
exports.forgetUndo = forgetUndo;
exports.changeCurrentBlockType = changeCurrentBlockType;
exports.changeCurrentInlineStyle = changeCurrentInlineStyle;
exports.removeCurrentInlineStyles = removeCurrentInlineStyles;
exports.findWithRegex = findWithRegex;
exports.replaceText = replaceText;

var _handleBlockType = require('./handlers/handleBlockType');

var _handleBlockType2 = _interopRequireDefault(_handleBlockType);

var _handleExitBlock = require('./handlers/handleExitBlock');

var _handleExitBlock2 = _interopRequireDefault(_handleExitBlock);

var _handleInsertEmptyBlock = require('./handlers/handleInsertEmptyBlock');

var _handleInsertEmptyBlock2 = _interopRequireDefault(_handleInsertEmptyBlock);

var _handleInsertText = require('./handlers/handleInsertText');

var _handleInsertText2 = _interopRequireDefault(_handleInsertText);

var _handleNewCodeBlock = require('./handlers/handleNewCodeBlock');

var _handleNewCodeBlock2 = _interopRequireDefault(_handleNewCodeBlock);

var _handleInlineStyle = require('./handlers/handleInlineStyle');

var _handleInlineStyle2 = _interopRequireDefault(_handleInlineStyle);

var _handleSplitBlock = require('./handlers/handleSplitBlock');

var _handleSplitBlock2 = _interopRequireDefault(_handleSplitBlock);

var _handleImage = require('./handlers/handleImage');

var _handleImage2 = _interopRequireDefault(_handleImage);

var _handleLink = require('./handlers/handleLink');

var _handleLink2 = _interopRequireDefault(_handleLink);

var _draftJs = require('draft-js');

var _regex = require('./regex');

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkCharacterForState(editorState, character) {
  var _getCurrent = getCurrent(editorState),
      type = _getCurrent.type;

  // If in code block, don't add any markdown


  if (isCodeBlock(type)) {
    return editorState;
  }

  var newEditorState = (0, _handleBlockType2.default)(editorState, character);

  if (editorState === newEditorState) {
    newEditorState = (0, _handleImage2.default)(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = (0, _handleLink2.default)(editorState, character);
  }
  if (editorState === newEditorState) {
    newEditorState = (0, _handleInlineStyle2.default)(editorState, character);
  }
  return newEditorState;
}

function getCurrent(editorState) {
  var content = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var block = content.getBlockForKey(key);
  var type = block ? block.getType() : null;
  var text = block ? block.getText() : null;

  return {
    content: content, selection: selection, key: key, block: block, type: type, text: text
  };
}

/**
 * Check if current block type is list
 * @param {*} type
 * @return {boolean}
 */
function isList(type) {
  return type === 'unordered-list-item' || type === 'ordered-list-item';
}

function isHeader(type) {
  return (/^header-/.test(type)
  );
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

function hasInlineStyle(editorState) {
  return editorState.getCurrentInlineStyle().size > 0;
}

function checkReturnForState(editorState, event) {
  var newEditorState = editorState;

  var _getCurrent2 = getCurrent(editorState),
      type = _getCurrent2.type,
      text = _getCurrent2.text,
      selection = _getCurrent2.selection;

  var isLast = selection.getEndOffset() === text.length;

  // For empty list item return, exit the list
  if (isList(type) && text === '') {
    newEditorState = (0, _handleExitBlock2.default)(editorState);
  }

  // For headers or blockquote, start a new line
  // No matter if it's last or not
  if (isHeader(type) || isBlockquote(type)) {
    newEditorState = (0, _handleInsertEmptyBlock2.default)(newEditorState);
  }

  // For ```, start a new code block
  if (newEditorState === editorState && inUnstyled(type) && _regex.CODE_BLOCK_START.test(text)) {
    newEditorState = (0, _handleNewCodeBlock2.default)(editorState);
  }

  // For ```, end code block
  if (newEditorState === editorState && isCodeBlock(type)) {
    if (_regex.CODE_BLOCK_END.test(text)) {
      // remove last ```
      newEditorState = changeCurrentBlockType(newEditorState, type, text.replace(/\n```\s*$/, ''));
      // start a new line
      newEditorState = (0, _handleInsertEmptyBlock2.default)(newEditorState);
    } else {
      newEditorState = (0, _handleInsertText2.default)(newEditorState, '\n');
    }
  }

  if (type === 'unstyled' && hasInlineStyle(newEditorState)) {
    newEditorState = (0, _handleSplitBlock2.default)(newEditorState);
    newEditorState = removeCurrentInlineStyles(newEditorState);

    // Remove inline in undoStack
    newEditorState = forgetUndo(newEditorState);
  }

  return newEditorState;
}

function forgetUndo(editorState) {
  var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var keepEarliest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var undoStack = editorState.getUndoStack();
  var i = 0;
  var latestState = void 0;
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
  return _draftJs.EditorState.set(editorState, { undoStack: undoStack });
}

function changeCurrentBlockType(editorState, type, text) {
  var blockMetadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var currentContent = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var blockMap = currentContent.getBlockMap();
  var block = blockMap.get(key);
  var data = block.getData().merge(blockMetadata);
  var newBlock = block.merge({ type: type, data: data, text: text || '' });
  var newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: 0
  });
  var newContentState = currentContent.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: newSelection
  });
  return _draftJs.EditorState.push(editorState, newContentState, 'change-block-type');
};

function changeCurrentInlineStyle(editorState, matchArr, style, character) {
  // Since JS doesn't have zero-width negative lookbehind,
  // need to check match array manually
  // So the matchArr would be 
  // [/* real match */, /* the match I want */, /* should captured group */]
  var isRegexZeroWidth = matchArr[0] === matchArr[1];
  var index = isRegexZeroWidth ? matchArr.index : matchArr.index + 1;

  var currentContent = editorState.getCurrentContent();
  var selection = editorState.getSelection();
  var key = selection.getStartKey();
  var blockMap = currentContent.getBlockMap();
  var block = blockMap.get(key);
  var currentInlineStyle = block.getInlineStyleAt(index).merge();

  var newStyle = void 0;
  if (currentInlineStyle.has('CODE')) {
    return editorState;
  } else {
    newStyle = currentInlineStyle.merge([style]);
  }

  var focusOffset = index + matchArr[1].length;
  var wordSelection = _draftJs.SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset: focusOffset
  });

  var newContentState = _draftJs.Modifier.replaceText(currentContent, wordSelection, matchArr[2], newStyle);

  var newEditorState = editorState;

  newEditorState = _draftJs.EditorState.push(newEditorState, newContentState, 'change-inline-style');

  newEditorState = _draftJs.EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());

  // Remove styles
  return _draftJs.EditorState.setInlineStyleOverride(newEditorState, new _immutable.OrderedSet());
}

function removeCurrentInlineStyles(editorState) {
  var _getCurrent3 = getCurrent(editorState),
      text = _getCurrent3.text,
      content = _getCurrent3.content,
      selection = _getCurrent3.selection,
      key = _getCurrent3.key;

  var newContentState = content;
  var styles = ['BOLD', 'ITALIC', 'CODE', 'UNDERLINE', 'STRIKETHROUGH'];

  var entireBlockSelection = selection.merge({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    focusOffset: text.length
  });

  if (entireBlockSelection.isCollapsed()) {
    return _draftJs.EditorState.setInlineStyleOverride(editorState, new _immutable.OrderedSet());
  }

  newContentState = styles.reduce(function (contentState, style) {
    return _draftJs.Modifier.removeInlineStyle(contentState, entireBlockSelection, style);
  }, newContentState);

  var newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'change-inline-style');

  // Move focus to block start
  var afterRemoved = _draftJs.EditorState.acceptSelection(newEditorState, new _draftJs.SelectionState({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    focusOffset: 0,
    isBackward: false
  }));

  return _draftJs.EditorState.forceSelection(afterRemoved, afterRemoved.getSelection());
}

function findWithRegex(regex, contentBlock, callback) {
  var text = contentBlock.getText();
  var matchArr = void 0,
      start = void 0;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

function replaceText(editorState, text) {
  var contentState = _draftJs.Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), text);
  return _draftJs.EditorState.push(editorState, contentState, 'insert-characters');
}

var styleMap = exports.styleMap = {
  HEADER_MARKER: {
    color: 'lightgray'
  },
  INLINE_MARKER: {
    color: 'red'
  }
};