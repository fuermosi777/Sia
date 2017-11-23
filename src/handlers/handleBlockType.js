import { changeCurrentBlockType } from '../utils';
import { RichUtils } from "draft-js";

const headerSymbols = [ '#', '##', '###', '####', '#####', '######' ];

const headerTypes = [
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
];

export default function handleBlockType(editorState, character) {
  const currentSelection = editorState.getSelection();
  const key = currentSelection.getStartKey();
  const currentBlock = editorState.getCurrentContent().getBlockForKey(key);
  const currentText = currentBlock.getText();
  const currentBlockType = currentBlock.getType();

  const position = currentSelection.getAnchorOffset();
  const line = [currentText.slice(0, position), character, currentText.slice(position)].join('');
  const blockType = RichUtils.getCurrentBlockType(editorState);

  // Check headers, and only check when current is not header
  if (headerTypes.indexOf(currentBlockType) === -1) {
    for (let i = 0; i < 6; i++)
    if (line.indexOf(headerSymbols[i]) === 0) {
      return changeCurrentBlockType(
        editorState,
        headerTypes[i],
        line.replace(/^#+\s/, '')
      );
    }
  }
  
  let matchArr;

  // Check list
  matchArr = line.match(/^[\*\-+] (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(
      editorState,
      'unordered-list-item',
      matchArr[1]
    );
  }

  // Check ordered list
  matchArr = line.match(/^[\d]\. (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(
      editorState,
      'ordered-list-item',
      matchArr[1]
    );
  }

  // Check blockquote
  matchArr = line.match(/^> (.*)$/);
  if (matchArr) {
    return changeCurrentBlockType(editorState, 'blockquote', matchArr[1]);
  }

  return editorState;
}
