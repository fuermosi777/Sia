'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleBlockType;

var _utils = require('../utils');

var _draftJs = require('draft-js');

var headerSymbols = ['# ', '## ', '### ', '#### ', '##### ', '###### '];

var headerTypes = ['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'];

function handleBlockType(editorState, character) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      text = _getCurrent.text,
      type = _getCurrent.type,
      selection = _getCurrent.selection;

  var position = selection.getAnchorOffset();
  var line = [text.slice(0, position), character, text.slice(position)].join('');

  // Check headers, and only check when current is not header
  if (headerTypes.indexOf(type) === -1) {
    for (var i = 0; i < 6; i++) {
      if (line.indexOf(headerSymbols[i]) === 0) {
        return (0, _utils.changeCurrentBlockType)(editorState, headerTypes[i], line.replace(/^#+\s/, ''));
      }
    }
  }

  var matchArr = void 0;

  // Check list
  matchArr = line.match(/^[\*\-+] (.*)$/);
  if (matchArr) {
    return (0, _utils.changeCurrentBlockType)(editorState, 'unordered-list-item', matchArr[1]);
  }

  // Check ordered list
  matchArr = line.match(/^[\d]\. (.*)$/);
  if (matchArr) {
    return (0, _utils.changeCurrentBlockType)(editorState, 'ordered-list-item', matchArr[1]);
  }

  // Check blockquote
  matchArr = line.match(/^> (.*)$/);
  if (matchArr) {
    return (0, _utils.changeCurrentBlockType)(editorState, 'blockquote', matchArr[1]);
  }

  return editorState;
}