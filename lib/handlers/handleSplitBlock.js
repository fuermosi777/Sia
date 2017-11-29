'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleSplitBlock;

var _draftJs = require('draft-js');

var _utils = require('../utils');

function handleSplitBlock(editorState) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      content = _getCurrent.content,
      selection = _getCurrent.selection;

  var newContentState = _draftJs.Modifier.splitBlock(content, selection);

  return _draftJs.EditorState.push(editorState, newContentState, 'split-block');
};