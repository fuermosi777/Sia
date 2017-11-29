'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleLoadText;

var _utils = require('../utils');

var _handleInsertEmptyBlock = require('./handleInsertEmptyBlock');

var _handleInsertEmptyBlock2 = _interopRequireDefault(_handleInsertEmptyBlock);

var _handleInsertText = require('./handleInsertText');

var _handleInsertText2 = _interopRequireDefault(_handleInsertText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SENSITIVE_CHARS = [' ', '*', '_', '`'];

function handleLoadText(editorState, text) {
  var isLoadFromStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var newText = text;

  // Add a line break manually for text ending with "`"
  if (newText[newText.length - 1] === '`') {
    newText += String.fromCharCode(10);
  }

  var newEditorState = editorState;
  var buffer = [];
  var startUndoStackSize = newEditorState.getUndoStack().size;

  for (var i = 0; i < newText.length; i++) {
    var char = newText[i];

    if (SENSITIVE_CHARS.indexOf(char) >= 0) {
      newEditorState = (0, _utils.replaceText)(newEditorState, buffer.join('') + char);
      newEditorState = (0, _utils.checkCharacterForState)(newEditorState, '');
      buffer = [];
    } else if (char.charCodeAt(0) === 10) {
      // return
      newEditorState = (0, _utils.replaceText)(newEditorState, buffer.join(''));
      var tmpEditorState = (0, _utils.checkReturnForState)(newEditorState, {});
      if (newEditorState === tmpEditorState) {
        newEditorState = (0, _handleInsertEmptyBlock2.default)(tmpEditorState);
      } else {
        newEditorState = tmpEditorState;
      }
      buffer = [];
    } else if (i === newText.length - 1) {
      newEditorState = (0, _utils.replaceText)(newEditorState, buffer.join('') + char);
      buffer = [];
    } else {
      buffer.push(char);
    }
  }

  var endUndoStackSize = newEditorState.getUndoStack().size;

  var times = endUndoStackSize - startUndoStackSize;

  if (!isLoadFromStart) {
    // paste
    times -= 1;
  }
  newEditorState = (0, _utils.forgetUndo)(newEditorState, times);
  return newEditorState;
}