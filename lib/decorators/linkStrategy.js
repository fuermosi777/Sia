'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = linkStrategy;
function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
};

function linkStrategy(contentBlock, callback, contentState) {
  findLinkEntities(contentBlock, callback, contentState);
};