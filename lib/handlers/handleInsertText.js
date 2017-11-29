'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleInsertText;

var _draftJs = require('draft-js');

var _utils = require('../utils');

function handleInsertText(editorState, text) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      content = _getCurrent.content,
      selection = _getCurrent.selection;

  var newContentState = _draftJs.Modifier.insertText(content, selection, text, editorState.getCurrentInlineStyle());
  return _draftJs.EditorState.push(editorState, newContentState, 'insert-fragment');
};