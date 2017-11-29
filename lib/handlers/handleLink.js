'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = handleLink;

var _regex = require('../regex');

var _utils = require('../utils');

var _draftJs = require('draft-js');

function insertLink(editorState, matchArr) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      content = _getCurrent.content,
      selection = _getCurrent.selection,
      key = _getCurrent.key;

  var _matchArr = _slicedToArray(matchArr, 4),
      matchText = _matchArr[0],
      text = _matchArr[1],
      href = _matchArr[2],
      title = _matchArr[3];

  var index = matchArr.index;

  var focusOffset = index + matchText.length;
  var wordSelection = _draftJs.SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset: focusOffset
  });
  var nextContent = content.createEntity('LINK', 'MUTABLE', {
    href: href,
    title: title
  });
  var entityKey = nextContent.getLastCreatedEntityKey();
  var newContentState = _draftJs.Modifier.replaceText(nextContent, wordSelection, text, null, entityKey);
  newContentState = _draftJs.Modifier.insertText(newContentState, newContentState.getSelectionAfter(), ' ');
  var newWordSelection = wordSelection.merge({
    focusOffset: index + text.length
  });
  var newEditorState = _draftJs.EditorState.push(editorState, newContentState, 'insert-link');
  newEditorState = _draftJs.RichUtils.toggleLink(newEditorState, newWordSelection, entityKey);
  return _draftJs.EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter());
}

function handleLink(editorState, character) {
  var _getCurrent2 = (0, _utils.getCurrent)(editorState),
      key = _getCurrent2.key,
      text = _getCurrent2.text;

  var line = '' + text + character;
  var newEditorState = editorState;
  var matchArr = void 0;
  do {
    matchArr = _regex.LINK.exec(line);
    if (matchArr) {
      newEditorState = insertLink(newEditorState, matchArr);
    }
  } while (matchArr);

  return newEditorState;
}