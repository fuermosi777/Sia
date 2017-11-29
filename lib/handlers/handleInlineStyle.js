'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleInlineStyle;

var _utils = require('../utils');

var _regex = require('../regex');

function handleInlineStyle(editorState, character) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      text = _getCurrent.text,
      selection = _getCurrent.selection;

  var position = selection.getAnchorOffset();
  var line = [text.slice(0, position), character, text.slice(position)].join('');

  var newEditorState = editorState;

  // bold
  var styleMap = { BOLD: _regex.BOLD, ITALIC: _regex.ITALIC, CODE: _regex.CODE, STRIKETHROUGH: _regex.STRIKETHROUGH };
  Object.keys(styleMap).some(function (k) {
    styleMap[k].some(function (re) {
      var matchArr = void 0;
      do {
        matchArr = re.exec(line);
        if (matchArr) {
          newEditorState = (0, _utils.changeCurrentInlineStyle)(newEditorState, matchArr, k, character);
        }
      } while (matchArr);
      return newEditorState !== editorState;
    });
    return newEditorState !== editorState;
  });

  return newEditorState;
};