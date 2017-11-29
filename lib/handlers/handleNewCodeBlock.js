'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleNewCodeBlock;

var _utils = require('../utils');

var _handleInsertEmptyBlock = require('./handleInsertEmptyBlock');

var _handleInsertEmptyBlock2 = _interopRequireDefault(_handleInsertEmptyBlock);

var _regex = require('../regex');

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleNewCodeBlock(editorState) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      content = _getCurrent.content,
      selection = _getCurrent.selection,
      key = _getCurrent.key,
      type = _getCurrent.type,
      text = _getCurrent.text,
      block = _getCurrent.block;

  var matchData = _regex.CODE_BLOCK_START.exec(text);
  var endOffset = selection.getEndOffset();

  var newEditorState = editorState;

  // We .trim the text here to make sure pressing enter after '``` ' works even if the cursor is before the space
  var isLast = endOffset === text.length || endOffset === text.trim().length;

  if (matchData && isLast) {
    var data = {};
    var language = matchData[1];
    if (language) {
      data.language = language;
    }
    newEditorState = (0, _utils.changeCurrentBlockType)(editorState, 'code-block', '', data);
  }

  return newEditorState;
};