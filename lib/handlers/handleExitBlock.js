"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleExitBlock;

var _utils = require("../utils");

var _draftJs = require("draft-js");

function handleExitBlock(editorState) {
  var _getCurrent = (0, _utils.getCurrent)(editorState),
      type = _getCurrent.type;

  return _draftJs.RichUtils.toggleBlockType(editorState, type);
};