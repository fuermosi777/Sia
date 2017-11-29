'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imageStrategy;
function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMG';
  }, callback);
};

function imageStrategy(contentBlock, callback, contentState) {
  findImageEntities(contentBlock, callback, contentState);
};