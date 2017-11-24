function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'IMG'
    );
  }, callback);
};

export default function imageStrategy(contentBlock, callback, contentState) {
  findImageEntities(contentBlock, callback, contentState);
};
