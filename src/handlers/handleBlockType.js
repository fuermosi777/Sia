import { changeCurrentBlockType, getCurrent } from '../utils';
import { RichUtils } from "draft-js";

const headerSymbols = [ '# ', '## ', '### ', '#### ', '##### ', '###### ' ];

const headerTypes = [
  'header-one',
  'header-two',
  'header-three',
  'header-four',
  'header-five',
  'header-six',
];

export default function handleBlockType(editorState, character) {
  const { text, type, selection } = getCurrent(editorState);

  const position = selection.getAnchorOffset();
  const line = [text.slice(0, position), character, text.slice(position)].join('');

  // Check headers, and only check when current is not header
  if (headerTypes.indexOf(type) === -1) {
    for (let i = 0; i < 6; i++) {
      if (line.indexOf(headerSymbols[i]) === 0) {
        return changeCurrentBlockType(
          editorState,
          headerTypes[i],
          line.replace(/^#+\s/, '')
        );
      }
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
